function dateDiff(d1, d2) {
  const millis = d2 - d1;
  const seconds = millis / 1000;
  return Math.round(seconds);
}

module.exports = { dateDiff };
