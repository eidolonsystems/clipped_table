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
    const downArrow: any = new KeyboardEvent(40);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
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
    const upArrow: any = new KeyboardEvent(38);
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
    const leftClick: any = new MouseEvent(0);
    selector.onMouseDown(leftClick, 2);
    selector.onMouseUp(leftClick);
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
    const leftClick: any = new MouseEvent(0);
    selector.onMouseDown(leftClick, 2);
    selector.onMouseEnter(3);
    selector.onMouseEnter(5);
    selector.onMouseUp(leftClick);
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
    const leftClick: any = new MouseEvent(0);
    selector.onMouseDown(leftClick, 5);
    selector.onMouseEnter(1);
    selector.onMouseUp(leftClick);
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
    const leftClick: any = new MouseEvent(0);
    const shiftButton: any = new KeyboardEvent(16);
    selector.onKeyDown(shiftButton);
    selector.onMouseDown(leftClick, 0);
    selector.onMouseEnter(3);
    selector.onKeyUp(shiftButton);
    selector.onMouseEnter(5);
    selector.onMouseUp(leftClick);
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
    const leftClick: any = new MouseEvent(0);
    const shiftButton: any = new KeyboardEvent(16);
    selector.onKeyDown(shiftButton);
    selector.onMouseDown(leftClick, 6);
    selector.onMouseEnter(5);
    selector.onMouseEnter(3);
    selector.onMouseUp(leftClick);
    selector.onKeyUp(shiftButton);
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
    const shiftButton: any = new KeyboardEvent(16);
    const downArrow: any = new KeyboardEvent(40);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(shiftButton);
    selector.onKeyDown(downArrow);
    selector.onKeyUp(downArrow);
    selector.onKeyUp(shiftButton);
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
    const shiftButton: any = new KeyboardEvent(16);
    const leftClick: any = new MouseEvent(0);
    const downArrow: any = new KeyboardEvent(40);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(shiftButton);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyUp(downArrow);
    selector.onMouseDown(leftClick, 8);
    selector.onMouseUp(leftClick);
    selector.onKeyUp(shiftButton);
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
    const leftClick: any = new MouseEvent(0);
    const shiftButton: any = new KeyboardEvent(16);
    const downArrow: any = new KeyboardEvent(40);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(shiftButton);
    selector.onKeyUp(downArrow);
    selector.onKeyUp(shiftButton);
    selector.onMouseDown(leftClick, 3);
    selector.onMouseUp(leftClick);
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
    const ctrlButton: any = new KeyboardEvent(17);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyUp(downArrow);
    selector.onKeyDown(ctrlButton);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyUp(upArrow);
    selector.onKeyUp(ctrlButton);
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
    const leftClick: any = new MouseEvent(0);
    const ctrlButton: any = new KeyboardEvent(17);
    selector.onKeyDown(ctrlButton);
    selector.onMouseDown(leftClick, 2);
    selector.onMouseEnter(6);
    selector.onMouseUp(leftClick);
    selector.onKeyUp(ctrlButton);
    Expect(selector.isSelected(0)).toEqual(true);
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
    const leftClick: any = new MouseEvent(0);
    const ctrlButton: any = new KeyboardEvent(17);
    const downArrow: any = new KeyboardEvent(40);
    selector.onMouseDown(leftClick, 2);
    selector.onKeyDown(ctrlButton);
    selector.onMouseEnter(4);
    selector.onMouseUp(leftClick);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyUp(downArrow);
    selector.onKeyUp(ctrlButton);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(true);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(true);
    Expect(selector.isSelected(5)).toEqual(false);
    Expect(selector.isSelected(6)).toEqual(false);
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
    const leftClick: any = new MouseEvent(0);
    const ctrlButton: any = new KeyboardEvent(17);
    selector.onKeyDown(ctrlButton);
    selector.onMouseDown(leftClick, 2);
    selector.onMouseEnter(6);
    selector.onMouseUp(leftClick);
    selector.onMouseDown(leftClick, 3);
    selector.onMouseEnter(4);
    selector.onMouseUp(leftClick);
    selector.onKeyUp(ctrlButton);
    Expect(selector.isSelected(0)).toEqual(true);
    Expect(selector.isSelected(1)).toEqual(false);
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
    const leftClick: any = new MouseEvent(0);
    const ctrlButton: any = new KeyboardEvent(17);
    const shiftButton: any = new KeyboardEvent(16);
    selector.onMouseDown(leftClick, 7);
    selector.onKeyDown(shiftButton);
    selector.onMouseEnter(2);
    selector.onMouseUp(leftClick);
    selector.onKeyUp(shiftButton);
    selector.onKeyDown(ctrlButton);
    selector.onMouseDown(leftClick, 4);
    selector.onMouseUp(leftClick);
    selector.onMouseDown(leftClick, 6);
    selector.onMouseUp(leftClick);
    selector.onKeyUp(ctrlButton);
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
    const leftClick: any = new MouseEvent(0);
    const ctrlButton: any = new KeyboardEvent(17);
    const downArrow: any = new KeyboardEvent(40);
    const shiftButton: any = new KeyboardEvent(16);
    const upArrow: any = new KeyboardEvent(38);
    selector.onMouseDown(leftClick, 7);
    selector.onMouseUp(leftClick);
    selector.onKeyDown(shiftButton);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyUp(upArrow);
    selector.onKeyUp(shiftButton);
    selector.onKeyDown(ctrlButton);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyUp(downArrow);
    selector.onKeyUp(ctrlButton);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(false);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(true);
    Expect(selector.isSelected(5)).toEqual(true);
    Expect(selector.isSelected(6)).toEqual(true);
    Expect(selector.isSelected(7)).toEqual(true);
  }

  @Test()
  public testShiftThenShift(): void {
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
    const leftClick: any = new MouseEvent(0);
    const downArrow: any = new KeyboardEvent(40);
    const shiftButton: any = new KeyboardEvent(16);
    const upArrow: any = new KeyboardEvent(38);
    selector.onMouseDown(leftClick, 3);
    selector.onMouseUp(leftClick);
    selector.onKeyDown(shiftButton);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyUp(upArrow);
    selector.onKeyUp(shiftButton);
    selector.onKeyDown(shiftButton);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyUp(downArrow);
    selector.onKeyUp(shiftButton);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(false);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(true);
    Expect(selector.isSelected(5)).toEqual(true);
    Expect(selector.isSelected(6)).toEqual(false);
    Expect(selector.isSelected(7)).toEqual(false);
  }

  @Test()
  public testEmptyToNotEmpty(): void {
    const model = new ArrayTableModel();
    const selector = new RowSelector(model);
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    Expect(selector.isSelected(0)).toEqual(true);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(false);
    Expect(selector.isSelected(3)).toEqual(false);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(false);
    Expect(selector.isSelected(6)).toEqual(false);
    Expect(selector.isSelected(7)).toEqual(false);
  }

  @Test()
  public testEmptyToNotEmptyAndMouse(): void {
    const model = new ArrayTableModel();
    const selector = new RowSelector(model);
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    const leftClick: any = new MouseEvent(0);
    selector.onMouseDown(leftClick, 6);
    selector.onMouseUp(leftClick);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(false);
    Expect(selector.isSelected(3)).toEqual(false);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(false);
    Expect(selector.isSelected(6)).toEqual(true);
    Expect(selector.isSelected(7)).toEqual(false);
  }

  @Test()
  public testingMovingRows(): void {
    const model = new ArrayTableModel();
    const selector = new RowSelector(model);
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    const leftClick: any = new MouseEvent(0);
    selector.onMouseDown(leftClick, 6);
    selector.onMouseUp(leftClick);
    model.moveRow(6, 3);
    Expect(selector.isSelected(0)).toEqual(false);
    Expect(selector.isSelected(1)).toEqual(false);
    Expect(selector.isSelected(2)).toEqual(false);
    Expect(selector.isSelected(3)).toEqual(true);
    Expect(selector.isSelected(4)).toEqual(false);
    Expect(selector.isSelected(5)).toEqual(false);
    Expect(selector.isSelected(6)).toEqual(false);
    Expect(selector.isSelected(7)).toEqual(false);
  }
}
