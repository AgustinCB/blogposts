export function sample (array) {
  return array[Math.floor(Math.random() * array.length)]
}

export function clone(oldArray) {
  // Inmutable objects
  if (typeof(oldArray) === 'string') return new String(oldArray)
  if (!(oldArray instanceof Array)) return oldArray
   
  // Mutable objects
  var newArray = []

  oldArray.forEach(function(value) {
    newArray.push(clone(value))
  })

  return newArray
}

export function Enum (obj) {
  const keysByValue = new Map()
  const EnumLookup = (value) => keysByValue.get(value)

  for (let key of Object.keys(obj)) {
    EnumLookup[key] = obj[key]
    keysByValue.set(EnumLookup[key], key)
  }

  return Object.freeze(EnumLookup)
}
