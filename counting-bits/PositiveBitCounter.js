function Count (input) {
  if (input < 0) { throw new RangeError(`An negative integer was given. input: ${input}`) }
  return [...input.toString(2)].reverse().reduce(
    (prev, cur, index) => {
      if (cur === '1') {
        prev[0]++
        prev.push(index)
      }
      return prev
    },
    [0]
  )
}

module.exports = { Count }
