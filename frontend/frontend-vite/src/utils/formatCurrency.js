export default function formatCurrency(amount=0, currency="NGN") {
  return `${amount.toLocaleString()} ${currency}`;
}
