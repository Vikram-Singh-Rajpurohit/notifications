import { cloneDeep } from 'lodash'
const isFunction = (arg) => arg && typeof arg === 'function'

export const blackListKeys = ({ obj, keys = [] }): any => {
  let resultObj = obj
  if (isFunction(obj.toObject)) {
    resultObj = obj.toObject()
  }
  resultObj = cloneDeep(resultObj)
  keys.forEach((key) => delete resultObj[key])
  return resultObj
}
