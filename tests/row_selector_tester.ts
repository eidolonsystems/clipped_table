import { Expect, Test } from 'alsatian';
import { ArrayTableModel, RowSelectionTableModel,
  TableModel } from '../source';

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
  constructor(code: string) {
    this._code = code;
  }

  public get code() {
    return this._code;
  }

  public preventDefault() {
    return;
  }

  private _code: string;
}

/** Tests the RowSelectionTableModel. */
export class RowSelectionTableModelTester {

  /* Tests what happens when the mouse moves with nothing being pressed. */
  @Test()
  public testMouseMove(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    const selector = new RowSelectionTableModel(model);
    selector.onMouseEnter(0);
    selector.onMouseEnter(1);
    selector.onMouseEnter(2);
    selector.onMouseEnter(5);
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(false);
    Expect(selector.get(3, 0)).toEqual(false);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(false);
  }

  /* Tests what happens when only the down arrow is pressed. */
  @Test()
  public testDownArrow(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    const selector = new RowSelectionTableModel(model);
    const downArrow: any = new KeyboardEvent('ArrowDown');
    selector.onKeyDown(downArrow);
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
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(false);
    Expect(selector.get(3, 0)).toEqual(false);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(true);
  }

  /** Tests what happens when only the up arrow is pressed. */
  @Test()
  public testUpArrow(): void {
    const model = new ArrayTableModel();
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    const selector = new RowSelectionTableModel(model);
    const upArrow: any = new KeyboardEvent('ArrowUp');
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyUp(upArrow);
    Expect(selector.get(0, 0)).toEqual(true);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(false);
    Expect(selector.get(3, 0)).toEqual(false);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(false);
  }

  /** Tests what happens when both up and down arrows are pressed. */
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
    const selector = new RowSelectionTableModel(model);
    const upArrow: any = new KeyboardEvent('ArrowUp');
    const downArrow: any = new KeyboardEvent('ArrowDown');
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyUp(downArrow);
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(false);
    Expect(selector.get(3, 0)).toEqual(false);
    Expect(selector.get(4, 0)).toEqual(true);
    Expect(selector.get(5, 0)).toEqual(false);
    Expect(selector.get(6, 0)).toEqual(false);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyUp(upArrow);
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(true);
    Expect(selector.get(3, 0)).toEqual(false);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(false);
    Expect(selector.get(6, 0)).toEqual(false);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyUp(upArrow);
    Expect(selector.get(0, 0)).toEqual(true);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(false);
    Expect(selector.get(3, 0)).toEqual(false);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(false);
    Expect(selector.get(6, 0)).toEqual(false);
  }

  /** Tests what happens when the mouse is pressed but not moved. */
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
    const selector = new RowSelectionTableModel(model);
    const leftClick: any = new MouseEvent(0);
    selector.onMouseDown(leftClick, 2);
    selector.onMouseUp(leftClick);
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(true);
    Expect(selector.get(3, 0)).toEqual(false);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(false);
    Expect(selector.get(6, 0)).toEqual(false);
  }

  /** Tests what happens when mouse is pressed and moved downards. */
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
    const selector = new RowSelectionTableModel(model);
    const leftClick: any = new MouseEvent(0);
    selector.onMouseDown(leftClick, 2);
    selector.onMouseEnter(3);
    selector.onMouseEnter(5);
    selector.onMouseUp(leftClick);
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(true);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(true);
    Expect(selector.get(5, 0)).toEqual(true);
    Expect(selector.get(6, 0)).toEqual(false);
  }

  /** Tests what happens when mouse is pressed and moved up.  */
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
    const selector = new RowSelectionTableModel(model);
    const leftClick: any = new MouseEvent(0);
    selector.onMouseDown(leftClick, 5);
    selector.onMouseEnter(1);
    selector.onMouseUp(leftClick);
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(true);
    Expect(selector.get(2, 0)).toEqual(true);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(true);
    Expect(selector.get(5, 0)).toEqual(true);
    Expect(selector.get(6, 0)).toEqual(false);
  }

  /** Tests shift being pressed and the mouse being pressed and moved down. */
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
    const selector = new RowSelectionTableModel(model);
    const leftClick: any = new MouseEvent(0);
    const shiftButton: any = new KeyboardEvent('ShiftLeft');
    selector.onKeyDown(shiftButton);
    selector.onMouseDown(leftClick, 0);
    selector.onMouseEnter(3);
    selector.onKeyUp(shiftButton);
    selector.onMouseEnter(5);
    selector.onMouseUp(leftClick);
    Expect(selector.get(0, 0)).toEqual(true);
    Expect(selector.get(1, 0)).toEqual(true);
    Expect(selector.get(2, 0)).toEqual(true);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(true);
    Expect(selector.get(5, 0)).toEqual(true);
    Expect(selector.get(6, 0)).toEqual(false);
    Expect(selector.get(7, 0)).toEqual(false);
    Expect(selector.get(8, 0)).toEqual(false);
  }

  /** Tests shift being pressed and the mouse being pressed and moved up. */
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
    const selector = new RowSelectionTableModel(model);
    const leftClick: any = new MouseEvent(0);
    const shiftButton: any = new KeyboardEvent('ShiftLeft');
    selector.onKeyDown(shiftButton);
    selector.onMouseDown(leftClick, 6);
    selector.onMouseEnter(5);
    selector.onMouseEnter(3);
    selector.onMouseUp(leftClick);
    selector.onKeyUp(shiftButton);
    Expect(selector.get(0, 0)).toEqual(true);
    Expect(selector.get(1, 0)).toEqual(true);
    Expect(selector.get(2, 0)).toEqual(true);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(false);
    Expect(selector.get(6, 0)).toEqual(false);
    Expect(selector.get(7, 0)).toEqual(false);
    Expect(selector.get(8, 0)).toEqual(false);
  }

  /** Tests shift being held down and arrows being pressed. */
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
    const selector = new RowSelectionTableModel(model);
    const shiftButton: any = new KeyboardEvent('ShiftLeft');
    const downArrow: any = new KeyboardEvent('ArrowDown');
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(shiftButton);
    selector.onKeyDown(downArrow);
    selector.onKeyUp(downArrow);
    selector.onKeyUp(shiftButton);
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(true);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(false);
    Expect(selector.get(6, 0)).toEqual(false);
    Expect(selector.get(7, 0)).toEqual(false);
    Expect(selector.get(8, 0)).toEqual(false);
  }

  /** Tests shift being held down and arrows being pressed,
   *  followed by a mouse event.
   */
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
    const selector = new RowSelectionTableModel(model);
    const shiftButton: any = new KeyboardEvent('ShiftLeft');
    const leftClick: any = new MouseEvent(0);
    const downArrow: any = new KeyboardEvent('ArrowDown');
    selector.onKeyDown(downArrow);
    selector.onKeyDown(shiftButton);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyUp(downArrow);
    selector.onMouseDown(leftClick, 8);
    selector.onMouseUp(leftClick);
    selector.onKeyUp(shiftButton);
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(true);
    Expect(selector.get(2, 0)).toEqual(true);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(true);
    Expect(selector.get(5, 0)).toEqual(true);
    Expect(selector.get(6, 0)).toEqual(true);
    Expect(selector.get(7, 0)).toEqual(true);
    Expect(selector.get(8, 0)).toEqual(true);
  }

  /**?????????????
   */
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
    const selector = new RowSelectionTableModel(model);
    const leftClick: any = new MouseEvent(0);
    const shiftButton: any = new KeyboardEvent('ShiftLeft');
    const downArrow: any = new KeyboardEvent('ArrowDown');
    selector.onKeyDown(downArrow);
    selector.onKeyDown(shiftButton);
    selector.onKeyUp(downArrow);
    selector.onKeyUp(shiftButton);
    selector.onMouseDown(leftClick, 3);
    selector.onMouseUp(leftClick);
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(false);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(false);
    Expect(selector.get(6, 0)).toEqual(false);
    Expect(selector.get(7, 0)).toEqual(false);
    Expect(selector.get(8, 0)).toEqual(false);
  }

  /** Tests what happens when ctrl is held down and arrows are being pressed. */
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
    const selector = new RowSelectionTableModel(model);
    const upArrow: any = new KeyboardEvent('ArrowUp');
    const downArrow: any = new KeyboardEvent('ArrowDown');
    const ctrlButton: any = new KeyboardEvent('ControlLeft');
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyUp(downArrow);
    selector.onKeyDown(ctrlButton);
    selector.onKeyDown(upArrow);
    selector.onKeyDown(upArrow);
    selector.onKeyUp(upArrow);
    selector.onKeyUp(ctrlButton);
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(false);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(false);
    Expect(selector.get(6, 0)).toEqual(false);
    Expect(selector.get(7, 0)).toEqual(false);
    Expect(selector.get(8, 0)).toEqual(false);
  }

  /** Tests what happens when ctrl is being pressed and mouse is pressed 
   *  and moved */
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
    const selector = new RowSelectionTableModel(model);
    const leftClick: any = new MouseEvent(0);
    const ctrlButton: any = new KeyboardEvent('ControlLeft');
    selector.onKeyDown(ctrlButton);
    selector.onMouseDown(leftClick, 2);
    selector.onMouseEnter(6);
    selector.onMouseUp(leftClick);
    selector.onKeyUp(ctrlButton);
    Expect(selector.get(0, 0)).toEqual(true);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(true);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(true);
    Expect(selector.get(5, 0)).toEqual(true);
    Expect(selector.get(6, 0)).toEqual(true);
    Expect(selector.get(7, 0)).toEqual(false);
    Expect(selector.get(8, 0)).toEqual(false);
  }

  /** Tests mouse and arrow events while ctrl is being held down. */
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
    const selector = new RowSelectionTableModel(model);
    const leftClick: any = new MouseEvent(0);
    const ctrlButton: any = new KeyboardEvent('ControlLeft');
    const downArrow: any = new KeyboardEvent('ArrowDown');
    selector.onMouseDown(leftClick, 2);
    selector.onKeyDown(ctrlButton);
    selector.onMouseEnter(4);
    selector.onMouseUp(leftClick);
    selector.onKeyDown(downArrow);
    selector.onKeyDown(downArrow);
    selector.onKeyUp(downArrow);
    selector.onKeyUp(ctrlButton);
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(true);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(true);
    Expect(selector.get(5, 0)).toEqual(false);
    Expect(selector.get(6, 0)).toEqual(false);
    Expect(selector.get(7, 0)).toEqual(false);
    Expect(selector.get(8, 0)).toEqual(false);
  }

  /** Tests holding down ctrl to both add and remove rows. */
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
    const selector = new RowSelectionTableModel(model);
    const leftClick: any = new MouseEvent(0);
    const ctrlButton: any = new KeyboardEvent('ControlLeft');
    selector.onKeyDown(ctrlButton);
    selector.onMouseDown(leftClick, 2);
    selector.onMouseEnter(6);
    selector.onMouseUp(leftClick);
    selector.onMouseDown(leftClick, 3);
    selector.onMouseEnter(4);
    selector.onMouseUp(leftClick);
    selector.onKeyUp(ctrlButton);
    Expect(selector.get(0, 0)).toEqual(true);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(true);
    Expect(selector.get(3, 0)).toEqual(false);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(true);
    Expect(selector.get(6, 0)).toEqual(true);
    Expect(selector.get(7, 0)).toEqual(false);
    Expect(selector.get(8, 0)).toEqual(false);
  }

  /** Tests adding rows while shift is held down and removing rows when ctrl is
   *  held down.
   */
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
    const selector = new RowSelectionTableModel(model);
    const leftClick: any = new MouseEvent(0);
    const ctrlButton: any = new KeyboardEvent('ControlLeft');
    const shiftButton: any = new KeyboardEvent('ShiftLeft');
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
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(true);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(true);
    Expect(selector.get(6, 0)).toEqual(false);
    Expect(selector.get(7, 0)).toEqual(true);
    Expect(selector.get(8, 0)).toEqual(false);
  }

  /** Tests adding rows with shift followed by ctrl being held and buttons
   *  being pressed.
   */
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
    const selector = new RowSelectionTableModel(model);
    const leftClick: any = new MouseEvent(0);
    const ctrlButton: any = new KeyboardEvent('ControlLeft');
    const downArrow: any = new KeyboardEvent('ArrowDown');
    const shiftButton: any = new KeyboardEvent('ShiftLeft');
    const upArrow: any = new KeyboardEvent('ArrowUp');
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
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(false);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(true);
    Expect(selector.get(5, 0)).toEqual(true);
    Expect(selector.get(6, 0)).toEqual(true);
    Expect(selector.get(7, 0)).toEqual(true);
  }

  /** Tests using adding rows using shift twice in a row. */
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
    const selector = new RowSelectionTableModel(model);
    const leftClick: any = new MouseEvent(0);
    const downArrow: any = new KeyboardEvent('ArrowDown');
    const shiftButton: any = new KeyboardEvent('ShiftLeft');
    const upArrow: any = new KeyboardEvent('ArrowUp');
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
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(false);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(true);
    Expect(selector.get(5, 0)).toEqual(true);
    Expect(selector.get(6, 0)).toEqual(false);
    Expect(selector.get(7, 0)).toEqual(false);
  }

  /** Tests adding rows to the empty model. */
  @Test()
  public testEmptyToNotEmpty(): void {
    const model = new ArrayTableModel();
    const selector = new RowSelectionTableModel(model);
    model.addRow([0]);
    model.addRow([1]);
    model.addRow([2]);
    model.addRow([3]);
    model.addRow([4]);
    model.addRow([5]);
    model.addRow([6]);
    model.addRow([7]);
    Expect(selector.get(0, 0)).toEqual(true);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(false);
    Expect(selector.get(3, 0)).toEqual(false);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(false);
    Expect(selector.get(6, 0)).toEqual(false);
    Expect(selector.get(7, 0)).toEqual(false);
  }

  /** Tests adding rows to the empty model then selecting rows. */
  @Test()
  public testEmptyToNotEmptyAndMouse(): void {
    const model = new ArrayTableModel();
    const selector = new RowSelectionTableModel(model);
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
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(false);
    Expect(selector.get(3, 0)).toEqual(false);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(false);
    Expect(selector.get(6, 0)).toEqual(true);
    Expect(selector.get(7, 0)).toEqual(false);
  }

  /** Tests moving rows. */
  @Test()
  public testingMovingRows(): void {
    const model = new ArrayTableModel();
    const selector = new RowSelectionTableModel(model);
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
    Expect(selector.get(0, 0)).toEqual(false);
    Expect(selector.get(1, 0)).toEqual(false);
    Expect(selector.get(2, 0)).toEqual(false);
    Expect(selector.get(3, 0)).toEqual(true);
    Expect(selector.get(4, 0)).toEqual(false);
    Expect(selector.get(5, 0)).toEqual(false);
    Expect(selector.get(6, 0)).toEqual(false);
    Expect(selector.get(7, 0)).toEqual(false);
  }
}
