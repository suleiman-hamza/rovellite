if (typeof Object.groupBy === 'undefined') {
  Object.groupBy = function (iterable, callback) {
    return Array.from(iterable).reduce((acc, item) => {
      const key = callback(item)
      acc[key] = acc[key] || []
      acc[key].push(item)
      return acc
    }, {})
  }
}
