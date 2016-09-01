'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.correctWhitespace = correctWhitespace;
function correctWhitespace(string) {
  var trimmedString = string.trim();
  var leadingWhitespace = string.match(/^ +/m);

  if (leadingWhitespace == null) {
    return trimmedString + '\n';
  }

  return trimmedString.replace(new RegExp('^' + leadingWhitespace[0], 'gm'), '') + '\n';
}