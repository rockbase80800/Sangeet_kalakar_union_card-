const TAG_REGEX = /<[^>]*>/g;

export function sanitizePlainText(input: string, max = 300): string {
  return input.replace(TAG_REGEX, "").trim().slice(0, max);
}
