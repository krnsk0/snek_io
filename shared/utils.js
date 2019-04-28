module.exports.getUTF8Size = message => {
  const str = JSON.stringify(message);
  return str
    .split('')
    .map(function(ch) {
      return ch.charCodeAt(0);
    })
    .map(function(uchar) {
      return uchar < 128 ? 1 : 2;
    })
    .reduce(function(curr, next) {
      return curr + next;
    });
};
