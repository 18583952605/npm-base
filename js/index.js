import string from './string.js'
import array from './array.js'
import object from './object.js'
import other from './other.js'
import hooks from './hooks.js'

export default {
  ...string,
  ...array,
  ...object,
  ...other,
  ...hooks,
}
