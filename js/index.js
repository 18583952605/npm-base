import string from './string.js'
import array from './array.js'
import object from './object.js'
import other from './other.js'

export const index = {
  ...array,
  ...object,
  ...other,
  ...string,
}
