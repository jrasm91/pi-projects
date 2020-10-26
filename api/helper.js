function dateDiff (d2, d1) {
  const millis = d2 - d1
  const seconds = millis / 1000
  return Math.round(seconds)
}

module.exports = { dateDiff }
