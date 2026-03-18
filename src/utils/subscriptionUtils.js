/**
 * Convert price to monthly equivalent for total calculation.
 * Yearly price / 12, monthly stays as is.
 */
export function monthlyEquivalent(sub) {
  const price = parseFloat(sub.price) || 0;
  return sub.billingCycle === 'yearly' ? price / 12 : price;
}

export function totalMonthlyCost(subscriptions) {
  return subscriptions.reduce((sum, sub) => sum + monthlyEquivalent(sub), 0);
}

/**
 * Group subscriptions by category with monthly cost per category.
 * Returns array of { category, amount, count } sorted by amount descending.
 * Uncategorized/empty goes under "Other".
 */
export function spendingByCategory(subscriptions) {
  const byCategory = {};
  for (const sub of subscriptions) {
    const cat = (sub.category || '').trim() || 'Other';
    if (!byCategory[cat]) byCategory[cat] = { amount: 0, count: 0 };
    byCategory[cat].amount += monthlyEquivalent(sub);
    byCategory[cat].count += 1;
  }
  return Object.entries(byCategory)
    .map(([category, { amount, count }]) => ({ category, amount, count }))
    .sort((a, b) => b.amount - a.amount);
}

export function sortByNextBillingDate(subscriptions) {
  return [...subscriptions].sort(
    (a, b) => new Date(a.nextBillingDate) - new Date(b.nextBillingDate)
  );
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
