import { Expect, Test } from 'alsatian';
import { Comparator } from '../source';

/** Tests the ArrayTableModel. */
export class ComparatorTestor {

  /** Tests adding rows. */
  @Test()
  public compareBooleans(): void {
    const comparator = new Comparator();
    Expect(comparator.compareValues(true, true)).toEqual(0);
    Expect(comparator.compareValues(false, false)).toEqual(0);
    Expect(comparator.compareValues(false, true)).toEqual(-1);
    Expect(comparator.compareValues(true, false)).toEqual(1);
    Expect(comparator.compareValues(null, false)).toEqual(-1);
  }

  @Test()
  public compareNumbers(): void {
    const comparator = new Comparator();
    Expect(comparator.compareValues(-50000.989089, -50000.989089)).toEqual(0);
    Expect(comparator.compareValues(50000, 5.5)).toEqual(1);
    Expect(comparator.compareValues(0.03, 0.0000095)).toEqual(1);
    Expect(comparator.compareValues(60, -1435)).toEqual(1);
    Expect(comparator.compareValues(Infinity, 0)).toEqual(1);
    Expect(comparator.compareValues(-Infinity, 0)).toEqual(-1);
    Expect(comparator.compareValues(Infinity, NaN)).toEqual(1);
  }

  @Test()
  public compareDates(): void {
    const earlierDate = new Date(1992, 1, 12);
    const laterDate = new Date(2005, 10, 2);
    const comparator = new Comparator();
    Expect(comparator.compareValues(earlierDate, earlierDate)).toEqual(0);
    Expect(comparator.compareValues(earlierDate, laterDate)).toEqual(-1);
    Expect(comparator.compareValues(laterDate, earlierDate)).toEqual(1);
    Expect(comparator.compareValues(laterDate, null)).toEqual(1);
  }

  @Test()
  public compareStrings(): void {
    const comparator = new Comparator();
    Expect(comparator.compareValues('Spire', 'Spire')).toEqual(0);
    Expect(comparator.compareValues('Spire', 'spire')).toEqual(1);
    Expect(comparator.compareValues('réservé', 'reserve')).toEqual(1);
  }

  @Test()
  public compareSymbols(): void {
    const comparator = new Comparator();
    const symbol1 = Symbol('spire');
    const symbol2 = Symbol('42');
    const symbol3 = Symbol('spire');
    Expect(comparator.compareValues(symbol1, symbol1)).toEqual(0);
    Expect(comparator.compareValues(symbol1, symbol2)).toEqual(1);
    Expect(comparator.compareValues(symbol1, symbol3)).toEqual(0);
  }
}
