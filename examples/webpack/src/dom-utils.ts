/**
 * Preserve existing transform values, adding a new one or replacing an existing one
 */
export function modifyTransform(transform: string, name: string, value: number): string {
  const regex = new RegExp(`${name}\\(([^)]+)\\)`);
  const match = transform.match(regex);

  if (match) {
    return transform.replace(regex, `${name}(${value})`);
  } else {
    return `${transform} ${name}(${value})`;
  }
}
