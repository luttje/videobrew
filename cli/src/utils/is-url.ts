export function isVideoAppUrl(possibleUrl: string) { 
  return possibleUrl.startsWith('http://') || possibleUrl.startsWith('https://');
}