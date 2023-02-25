export function shell(commands: string[]) {
  return commands.map((command) => `"${command}"`).join(' ');
}
