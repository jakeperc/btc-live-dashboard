// Simulate periodic DCA over the existing 5-year price history.
// The history has one close every four days (~455 points in five years); we
// treat each point as one buy interval. To preserve the "weekly" framing in the UI, we convert the
// chosen weekly amount into the equivalent dollars per interval.
// Returns { totalInvested, btcAccumulated, currentValue, roi, series }.
export const computeDcaOutcome = (longTermChart, weeklyAmount, currentPrice) => {
  if (!Array.isArray(longTermChart) || longTermChart.length === 0 || !currentPrice) {
    return { totalInvested: 0, btcAccumulated: 0, currentValue: 0, roi: 0, series: [] };
  }
  const fiveYearsAgo = Date.now() - 5 * 365.25 * 24 * 60 * 60 * 1000;
  const data = longTermChart.filter(p => p.t >= fiveYearsAgo);
  if (data.length === 0) return { totalInvested: 0, btcAccumulated: 0, currentValue: 0, roi: 0, series: [] };

  const intervals = data.length;
  const yearsCovered = 5;
  const totalWeeks = yearsCovered * 52;
  const weeksPerInterval = totalWeeks / intervals;
  const dollarsPerInterval = weeklyAmount * weeksPerInterval;

  let cumulativeInvested = 0;
  let cumulativeBtc = 0;
  const series = [];
  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    if (!point || typeof point.price !== "number" || point.price <= 0) continue;
    cumulativeInvested += dollarsPerInterval;
    cumulativeBtc += dollarsPerInterval / point.price;
    series.push({
      date: point.date,
      t: point.t,
      invested: Math.round(cumulativeInvested),
      value: Math.round(cumulativeBtc * point.price),
    });
  }
  // The series is historical closes only. It used to end on the live spot
  // price, which meant either rebuilding (and re-animating) the chart on every
  // price tick or letting its last point drift away from the "Value today"
  // figure; the live price now belongs to that figure alone.
  const currentValue = cumulativeBtc * currentPrice;
  const roi = cumulativeInvested > 0 ? (currentValue - cumulativeInvested) / cumulativeInvested : 0;
  return {
    totalInvested: cumulativeInvested,
    btcAccumulated: cumulativeBtc,
    currentValue,
    roi,
    series,
  };
};

// Find the largest peak-to-trough drawdown in the visible price history.
export const computeMaxDrawdown = (longTermChart) => {
  if (!Array.isArray(longTermChart) || longTermChart.length < 2) {
    return { drawdownPct: 0, peakDate: null, troughDate: null };
  }
  let peakPrice = longTermChart[0].price;
  let peakIdx = 0;
  let worst = { drawdownPct: 0, peakDate: longTermChart[0].date, troughDate: longTermChart[0].date };
  for (let i = 0; i < longTermChart.length; i++) {
    const p = longTermChart[i].price;
    if (p > peakPrice) {
      peakPrice = p;
      peakIdx = i;
    }
    const dd = (peakPrice - p) / peakPrice;
    if (dd > worst.drawdownPct) {
      worst = {
        drawdownPct: dd,
        peakDate: longTermChart[peakIdx].date,
        troughDate: longTermChart[i].date,
      };
    }
  }
  return { drawdownPct: worst.drawdownPct * 100, peakDate: worst.peakDate, troughDate: worst.troughDate };
};

// Consecutive up (+n) or down (−n) DAYS, from the 7-day hourly series. The
// series is hourly, so it is first reduced to one close per 24 h, counted back
// from the latest point — comparing neighbouring points directly counted
// hours and labelled them days.
const POINTS_PER_DAY = 24;
export const dailyStreak = (hourly) => {
  if (!Array.isArray(hourly) || hourly.length < POINTS_PER_DAY + 1) return null;
  const closes = [];
  for (let i = hourly.length - 1; i >= 0; i -= POINTS_PER_DAY) {
    const price = hourly[i]?.price;
    if (typeof price !== "number" || !Number.isFinite(price)) break;
    closes.push(price); // newest first
  }
  let dir = null, count = 0;
  for (let i = 0; i < closes.length - 1; i++) {
    const delta = closes[i] - closes[i + 1];
    const d = delta > 0 ? 1 : delta < 0 ? -1 : 0;
    if (d === 0) break;
    if (dir == null) { dir = d; count = 1; continue; }
    if (d === dir) count++; else break;
  }
  return dir != null ? dir * count : null;
};
