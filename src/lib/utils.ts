export function isLateNightHours(): boolean {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const hours = istTime.getHours();
  return hours >= 22 || hours < 6; // 10 PM to 6 AM IST
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+/g, '')
    .replace(/-+$/g, '');
}
