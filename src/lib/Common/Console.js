const colors = require('colors');

export function log() {
  for (const arg of arguments) {
    console.log(arg);
  }
}

export function error(err) {
  if (err !== null) {
    console.log(colors.red(err));
  }
}
