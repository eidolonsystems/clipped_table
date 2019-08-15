import { Expect, Test } from 'alsatian';
import { ArrayTableModel, RowSelector, TableModel } from '../source';

class MouseEvent {
  constructor(n: number) {
    this._button = n;
  }

  public get button() {
    return this._button;
  }

  private _button: number;
}

class KeyboardEvent {
  constructor(keyCode: number) {
    this._keyCode = keyCode;
  }

  public get keyCode() {
    return this._keyCode;
  }

  private _keyCode: number;
}

/** Tests the RowSelector. */
export class RowSelectorTester {

  @Test()
  public testMouseMove(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    const selector = new RowSelector(model);
    selector.onMouseEnter(0);
    selector.onMouseEnter(1);
    selector.onMouseEnter(2);
    selector.onMouseEnter(5);
    Expect(selector.isSelected(0)).toEqual(true);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(false);
    Expect(selector.isSelected(3)).toEqual(false);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(false);
  }

  @Test()
  public testDownArrow(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    const selector = new RowSelector(model);
    const event: any = new KeyboardEvent(40);
    selector.onKeyDown(event);
    selector.onKeyDown(event);
    selector.onKeyDown(event);
    selector.onKeyDown(event);
    selector.onKeyDown(event);
    selector.onKeyDown(event);
    selector.onKeyDown(event);
    selector.onKeyDown(event);
    selector.onKeyDown(event);
    selector.onKeyUp(event);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(false);
    Expect(selector.isSelected(3)).toEqual(false);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(true);
  }

  @Test()
  public testUpArrow(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    const selector = new RowSelector(model);
    const event: any = new KeyboardEvent(38);
    selector.onKeyDown(event);
    selector.onKeyDown(event);
    selector.onKeyDown(event);
    selector.onKeyUp(event);
    Expect(selector.isSelected(0)).toEqual(true);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(false);
    Expect(selector.isSelected(3)).toEqual(false);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(false);
  }

  @Test()
  public testMixedArrows(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    const selector = new RowSelector(model);
    const upArrow: any = new KeyboardEvent(38);
    const downArrow: any = new KeyboardEvent(40);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyUp(downArrow);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(false);
    Expect(selector.isSelected(3)).toEqual(false);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(true);
    Expect(selector.isSelected(6)).toEqual(false);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyUp(upArrow);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(false);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(false);
    Expect(selector.isSelected(6)).toEqual(false);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyUp(upArrow);
    Expect(selector.isSelected(0)).toEqual(true);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(false);
    Expect(selector.isSelected(3)).toEqual(false);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(false);
    Expect(selector.isSelected(6)).toEqual(false);
  }

  @Test()
  public testMouseDownNoMove(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    const selector = new RowSelector(model);
    const event: any = new MouseEvent(0);
    selector.onMouseDown(event, 2);
    selector.onMouseUp(event);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(true);
    Expect(selector.isSelected(3)).toEqual(false);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(false);
    Expect(selector.isSelected(6)).toEqual(false);
  }

  @Test()
  public testMouseDownAndMove(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    const selector = new RowSelector(model);
    const event: any = new MouseEvent(0);
    selector.onMouseDown(event, 2);
    selector.onMouseEnter(3);
    selector.onMouseEnter(5);
    selector.onMouseUp(event);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(true);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(true);
    Expect(selector.isSelected(5)).toEqual(true);
    Expect(selector.isSelected(6)).toEqual(false);
  }
}
