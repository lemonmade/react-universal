// @flow

export function correctWhitespace(string: string): string {
  const trimmedString = string.trim();
  const leadingWhitespace = string.match(/^ +/m);

  if (leadingWhitespace == null) {
    return `${trimmedString}\n`;
  }

  return `${trimmedString.replace(new RegExp(`^${leadingWhitespace[0]}`, 'gm'), '')}\n`;
}
