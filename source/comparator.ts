/** Class used to polymorphically compare two values in a TableModel. */
export class Comparator {

  /** Compares the order of two values.
   * @param left - The left side of the comparison.
   * @param right - The right side of the comparison.
   * @return A negative number iff left comes before right.
   *         A positive number iff left comes after right.
   *         0 iff left is equal to right.
   * @throws {TypeError} - The parameters can not be compared to one another.
   */
  public compareValues(left: any, right: any): number {
    if(left === right) {
      return 0;
    }
    if(left === undefined) {
      return -1;
    }
    if(right === undefined) {
      return 1;
    }
    if(left === null) {
      return -1;
    }
    if(right === null) {
      return 1;
    }
    if(typeof left !== typeof right) {
      throw TypeError('The parameters can not be compared to one another');
    }
    if(typeof left === 'object') {
      if(!(left instanceof Date) || !(right instanceof Date)) {
        throw TypeError('The parameters can not be compared to one another');
      }
    }
    switch (typeof left) {
      case 'boolean':
        if(left) {
          return 1;
        } else {
          return -1;
        }
        break;
      case 'number':
        if(isFinite(left) && isFinite(right)) {
          return left - right;
        } else {
          if(left === -Infinity || right === -Infinity) {
            if(right === -Infinity) {
              return 1;
            } else {
              return -1;
            }
          }
          if(left === Infinity || right === Infinity) {
            if(left === Infinity) {
              return 1;
            } else {
              return -1;
            }
          }
          if(isNaN(left) || isNaN(right)) {
            if(isNaN(right)) {
              return 1;
            } else {
              return -1;
            }
          }
        }
        break;
      case 'object':
        if (left.valueOf() > right.valueOf()) {
          return 1;
        } else {
          return -1;
        }
      case 'string':
        return left.localeCompare(right);
      case 'symbol':
        return left.toString().localeCompare(right.toString());
    }
  }
}
