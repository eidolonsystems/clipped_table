import { Expect, Test } from 'alsatian';
import { Comparator } from '../source';

/** Tests the ArrayTableModel. */
export class ComparatorTestor {

  /** Tests that values of different types don't get compared. */
  @Test()
  public invalidInputs(): void {
    const comparator = new Comparator();
    Expect(() => comparator.compareValues(true, 'mooo')).toThrow();
    Expect(() => comparator.compareValues(
      new Date(), new Comparator())).toThrow();
  }

  /** Tests comparing booleans. */
  @Test()
  public compareBooleans(): void {
    const comparator = new Comparator();
    Expect(comparator.compareValues(true, true)).toEqual(0);
    Expect(comparator.compareValues(false, false)).toEqual(0);
    Expect(comparator.compareValues(false, true)).toBeLessThan(0);
    Expect(comparator.compareValues(true, false)).toBeGreaterThan(0);
    Expect(comparator.compareValues(null, false)).toBeLessThan(0);
  }

  /** Tests comparing numbers. */
  @Test()
  public compareNumbers(): void {
    const comparator = new Comparator();
    Expect(comparator.compareValues(-50000.989089, -50000.989089)).toEqual(0);
    Expect(comparator.compareValues(50000, 5.5)).toBeGreaterThan(0);
    Expect(comparator.compareValues(0.00003, 0.03)).toBeLessThan(0);
    Expect(comparator.compareValues(60, -1435)).toBeGreaterThan(0);
    Expect(comparator.compareValues(Infinity, 0)).toBeGreaterThan(0);
    Expect(comparator.compareValues(-Infinity, 0)).toBeLessThan(0);
    Expect(comparator.compareValues(Infinity, NaN)).toBeGreaterThan(0);
  }

  /* Tests comparing dates. */
  @Test()
  public compareDates(): void {
    const earlierDate = new Date(1992, 1, 12);
    const laterDate = new Date(2005, 10, 2);
    const comparator = new Comparator();
    Expect(comparator.compareValues(earlierDate, earlierDate)).toEqual(0);
    Expect(comparator.compareValues(earlierDate, laterDate)).toBeLessThan(0);
    Expect(comparator.compareValues(laterDate, earlierDate)).toBeGreaterThan(0);
    Expect(comparator.compareValues(laterDate, null)).toBeGreaterThan(0);
  }

  /** Tests comparing strings. */
  @Test()
  public compareStrings(): void {
    const comparator = new Comparator();
    Expect(comparator.compareValues('Spire', 'Spire')).toEqual(0);
    Expect(comparator.compareValues('Spire', 'spire')).toBeGreaterThan(0);
    Expect(comparator.compareValues('réservé', 'reserve')).toBeGreaterThan(0);
  }

  /** Tests comparing symbols. */
  @Test()
  public compareSymbols(): void {
    const comparator = new Comparator();
    const symbol1 = Symbol('spire');
    const symbol2 = Symbol('42');
    const symbol3 = Symbol('spire');
    Expect(comparator.compareValues(symbol1, symbol1)).toEqual(0);
    Expect(comparator.compareValues(symbol1, symbol2)).toBeGreaterThan(0);
    Expect(comparator.compareValues(symbol1, symbol3)).toEqual(0);
  }
}
