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
    return 0;
  }
}
