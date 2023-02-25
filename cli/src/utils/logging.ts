import chalk from 'chalk';

const log = console.log;

export function inform(message: string, chalkFn = chalk.white, noPrefix = false) {
  log(
    (noPrefix ? '' : (chalkFn.underline('[📼 Videobrew]') + ' ')) +
    chalkFn(message)
  );
}

export function debug(message: string) {
  inform(message, chalk.gray);
}

export function panic(message: string) {
  log(chalk.red(message));
  process.exit(1);
}
