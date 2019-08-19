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
    Expect(selector.isSelected(0)).toEqual(false);
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
  public testMouseDownAndMoveDown(): void {
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

  @Test()
  public testMouseDownAndMoveUp(): void {
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
    selector.onMouseDown(event, 5);
    selector.onMouseEnter(1);
    selector.onMouseUp(event);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(true);
    Expect(selector.isSelected(2)).toEqual(true);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(true);
    Expect(selector.isSelected(5)).toEqual(true);
    Expect(selector.isSelected(6)).toEqual(false);
  }

  @Test()
  public testShiftAndMouseMoveDown(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    model.addRow([8]);
    const selector = new RowSelector(model);
    const mouseEvent: any = new MouseEvent(0);
    const shiftEvent: any = new KeyboardEvent(16);
    selector.onKeyDown(shiftEvent);
    selector.onMouseDown(mouseEvent, 0);
    selector.onMouseEnter(3);
    selector.onKeyUp(shiftEvent);
    selector.onMouseEnter(5);
    selector.onMouseUp(mouseEvent);
    Expect(selector.isSelected(0)).toEqual(true);
    Expect(selector.isSelected(1)).toEqual(true);
    Expect(selector.isSelected(2)).toEqual(true);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(true);
    Expect(selector.isSelected(5)).toEqual(true);
    Expect(selector.isSelected(6)).toEqual(false);
    Expect(selector.isSelected(7)).toEqual(false);
    Expect(selector.isSelected(8)).toEqual(false);
  }

  @Test()
  public testShiftAndMouseMoveUp(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    model.addRow([8]);
    const selector = new RowSelector(model);
    const mouseEvent: any = new MouseEvent(0);
    const shiftEvent: any = new KeyboardEvent(16);
    selector.onKeyDown(shiftEvent);
    selector.onMouseDown(mouseEvent, 6);
    selector.onMouseEnter(5);
    selector.onMouseEnter(3);
    selector.onMouseUp(mouseEvent);
    selector.onKeyUp(shiftEvent);
    Expect(selector.isSelected(0)).toEqual(true);
    Expect(selector.isSelected(1)).toEqual(true);
    Expect(selector.isSelected(2)).toEqual(true);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(false);
    Expect(selector.isSelected(6)).toEqual(false);
    Expect(selector.isSelected(7)).toEqual(false);
    Expect(selector.isSelected(8)).toEqual(false);
  }

  @Test()
  public testShiftAndArrows(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    model.addRow([8]);
    const selector = new RowSelector(model);
    const shiftEvent: any = new KeyboardEvent(16);
    const downEvent: any = new KeyboardEvent(40);
    selector.onKeyDown(downEvent);
    selector.onKeyDown(downEvent);
    selector.onKeyDown(shiftEvent);
    selector.onKeyDown(downEvent);
    selector.onKeyUp(downEvent);
    selector.onKeyUp(shiftEvent);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(true);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(false);
    Expect(selector.isSelected(6)).toEqual(false);
    Expect(selector.isSelected(7)).toEqual(false);
    Expect(selector.isSelected(8)).toEqual(false);
  }

  @Test()
  public testShiftAndArrowsAndMouse(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    model.addRow([8]);
    const selector = new RowSelector(model);
    const shiftEvent: any = new KeyboardEvent(16);
    const mouseEvent: any = new MouseEvent(0);
    const downEvent: any = new KeyboardEvent(40);
    selector.onKeyDown(downEvent);
    selector.onKeyDown(shiftEvent);
    selector.onKeyDown(downEvent);
    selector.onKeyDown(downEvent);
    selector.onKeyUp(downEvent);
    selector.onMouseDown(mouseEvent, 8);
    selector.onMouseUp(mouseEvent);
    selector.onKeyUp(shiftEvent);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(true);
    Expect(selector.isSelected(2)).toEqual(true);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(true);
    Expect(selector.isSelected(5)).toEqual(true);
    Expect(selector.isSelected(6)).toEqual(true);
    Expect(selector.isSelected(7)).toEqual(true);
    Expect(selector.isSelected(8)).toEqual(true);
  }

  @Test()
  public testShiftThenJustMouse(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    model.addRow([8]);
    const selector = new RowSelector(model);
    const mouseEvent: any = new MouseEvent(0);
    const shiftEvent: any = new KeyboardEvent(16);
    const downEvent: any = new KeyboardEvent(40);
    selector.onKeyDown(downEvent);
    selector.onKeyDown(shiftEvent);
    selector.onKeyUp(downEvent);
    selector.onKeyUp(shiftEvent);
    selector.onMouseDown(mouseEvent, 3);
    selector.onMouseUp(mouseEvent);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(false);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(false);
    Expect(selector.isSelected(6)).toEqual(false);
    Expect(selector.isSelected(7)).toEqual(false);
    Expect(selector.isSelected(8)).toEqual(false);
  }

  @Test()
    public testCtrlAndArrows(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    model.addRow([8]);
    const selector = new RowSelector(model);
    const upArrow: any = new KeyboardEvent(38);
    const downArrow: any = new KeyboardEvent(40);
    const ctrlEvent: any = new KeyboardEvent(17);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyUp(downArrow);
    selector.onKeyDown(ctrlEvent);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyUp(upArrow);
    selector.onKeyUp(ctrlEvent);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(true);
    Expect(selector.isSelected(2)).toEqual(true);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(false);
    Expect(selector.isSelected(6)).toEqual(false);
    Expect(selector.isSelected(7)).toEqual(false);
    Expect(selector.isSelected(8)).toEqual(false);
  }

  @Test()
  public testCtrlAndMouse(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    model.addRow([8]);
    const selector = new RowSelector(model);
    const mouseEvent: any = new MouseEvent(0);
    const ctrlEvent: any = new KeyboardEvent(17);
    selector.onKeyDown(ctrlEvent);
    selector.onMouseDown(mouseEvent, 1);
    selector.onMouseEnter(6);
    selector.onMouseUp(mouseEvent);
    selector.onKeyUp(ctrlEvent);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(true);
    Expect(selector.isSelected(2)).toEqual(true);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(true);
    Expect(selector.isSelected(5)).toEqual(true);
    Expect(selector.isSelected(6)).toEqual(true);
    Expect(selector.isSelected(7)).toEqual(false);
    Expect(selector.isSelected(8)).toEqual(false);
  }

  @Test()
  public testCtrlAndMouseAndDownArrow(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    model.addRow([8]);
    const selector = new RowSelector(model);
    const mouseEvent: any = new MouseEvent(0);
    const ctrlEvent: any = new KeyboardEvent(17);
    const downEvent: any = new KeyboardEvent(40);
    selector.onMouseDown(mouseEvent, 2);
    selector.onKeyDown(ctrlEvent);
    selector.onMouseEnter(4);
    selector.onMouseUp(mouseEvent);
    selector.onKeyDown(downEvent);
    selector.onKeyDown(downEvent);
    selector.onKeyUp(downEvent);
    selector.onKeyUp(ctrlEvent);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(true);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(true);
    Expect(selector.isSelected(5)).toEqual(true);
    Expect(selector.isSelected(6)).toEqual(true);
    Expect(selector.isSelected(7)).toEqual(false);
    Expect(selector.isSelected(8)).toEqual(false);
  }

  @Test()
  public testCtrlToAddAndRemove(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    model.addRow([8]);
    const selector = new RowSelector(model);
    const mouseEvent: any = new MouseEvent(0);
    const ctrlEvent: any = new KeyboardEvent(17);
    selector.onKeyDown(ctrlEvent);
    selector.onMouseDown(mouseEvent, 1);
    selector.onMouseEnter(6);
    selector.onMouseUp(mouseEvent);
    selector.onMouseDown(mouseEvent, 3);
    selector.onMouseEnter(4);
    selector.onMouseUp(mouseEvent);
    selector.onKeyUp(ctrlEvent);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(true);
    Expect(selector.isSelected(2)).toEqual(true);
    Expect(selector.isSelected(3)).toEqual(false);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(true);
    Expect(selector.isSelected(6)).toEqual(true);
    Expect(selector.isSelected(7)).toEqual(false);
    Expect(selector.isSelected(8)).toEqual(false);
  }

  @Test()
  public testShiftThenCtrlWithMouse(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    model.addRow([8]);
    const selector = new RowSelector(model);
    const mouseEvent: any = new MouseEvent(0);
    const ctrlEvent: any = new KeyboardEvent(17);
    const downEvent: any = new KeyboardEvent(40);
    const shiftEvent: any = new KeyboardEvent(16);
    const upEvent: any = new KeyboardEvent(38);
    selector.onMouseDown(mouseEvent, 7);
    selector.onKeyDown(shiftEvent);
    selector.onMouseEnter(2);
    selector.onMouseUp(mouseEvent);
    selector.onKeyUp(shiftEvent);
    selector.onKeyDown(ctrlEvent);
    selector.onMouseDown(mouseEvent, 4);
    selector.onMouseUp(mouseEvent);
    selector.onMouseDown(mouseEvent, 6);
    selector.onMouseUp(mouseEvent);
    selector.onKeyUp(ctrlEvent);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(true);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(true);
    Expect(selector.isSelected(6)).toEqual(false);
    Expect(selector.isSelected(7)).toEqual(true);
    Expect(selector.isSelected(8)).toEqual(false);
  }

  @Test()
  public testShiftThenCtrlWithArrows(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    const selector = new RowSelector(model);
    const mouseEvent: any = new MouseEvent(0);
    const ctrlEvent: any = new KeyboardEvent(17);
    const downEvent: any = new KeyboardEvent(40);
    const shiftEvent: any = new KeyboardEvent(16);
    const upEvent: any = new KeyboardEvent(38);
    selector.onMouseDown(mouseEvent, 7);
    selector.onMouseUp(mouseEvent);
    selector.onKeyDown(shiftEvent);
    selector.onKeyDown(upEvent);
    selector.onKeyDown(upEvent);
    selector.onKeyDown(upEvent);
    selector.onKeyDown(upEvent);
    selector.onKeyUp(upEvent);
    selector.onKeyUp(shiftEvent);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(false);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(true);
    Expect(selector.isSelected(5)).toEqual(true);
    Expect(selector.isSelected(6)).toEqual(true);
    Expect(selector.isSelected(7)).toEqual(true);
  }
}
