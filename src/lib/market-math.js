// Simulate periodic DCA over the existing 5-year price history.
// The chart is downsampled to ~60 monthly points; we treat each point as one
// buy interval. To preserve the "weekly" framing in the UI, we convert the
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
  // Final point uses current spot price to reflect today's value.
  const currentValue = cumulativeBtc * currentPrice;
  if (series.length > 0) {
    series[series.length - 1] = {
      ...series[series.length - 1],
      value: Math.round(currentValue),
    };
  }
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
