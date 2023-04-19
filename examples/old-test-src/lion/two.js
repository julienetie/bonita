const two = () => {
  console.log('two')
}

const threeB = () => {
  console.log('threeB')
}

const twoA = () => {
  console.log('twoA')
  threeB()
}

const twoB = () => {
  console.log('twoB')
}

export {
  twoA,
  twoB,
  two
}
