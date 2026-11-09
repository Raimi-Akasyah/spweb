const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER?.replace(/\D/g, "") ?? "";

export function waLink(message: string): string {
  const query = new URLSearchParams({ text: message });
  return `https://wa.me/${WA_NUMBER}?${query.toString()}`;
}

export function hasWhatsAppNumber(): boolean {
  return WA_NUMBER.length >= 8;
}
