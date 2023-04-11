import chalk from 'chalk';

export function newlines(count: number = 1) {
  for (let i = 0; i < count; i++)
    console.log('');
}

export function inform(message: string, chalkFn = chalk.white, noPrefix = false) {
  console.log(
    (noPrefix ? '' : (chalkFn.underline('[📼 Videobrew]') + ' ')) +
    chalkFn(message)
  );
}

export function debug(message: string) {
  if (!process.env.DEBUG)
    return;

  inform(message, chalk.gray);
}

export function panic(message: string) {
  console.log(chalk.red(message));
  process.exit(1);
}
