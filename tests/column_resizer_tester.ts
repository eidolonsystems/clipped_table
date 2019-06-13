import { Expect, Test } from 'alsatian';
import { ColumnResizer, TableInterface, Rectangle } from '../source';

class MockTableInterface implements TableInterface {
  constructor() {
    this._columnCount = 3;
    this._activeWidth = 20;
    this._columnRects = [
      {
        x: 1,
        y: 1,
        width: 200,
        height: 100,
        top: 1,
        left: 0,
        bottom: 100,
        right: 200
      },
      {
        x: 201,
        y: 1,
        width: 300,
        height: 100,
        top: 1,
        left: 201,
        bottom: 100,
        right: 500
      },
      {
        x: 501,
        y: 1,
        width: 200,
        height: 100,
        top: 1,
        left: 501,
        bottom: 100,
        right: 700
      }];
  }

  public get columnCount() {
    return this._columnCount;
  }

  public get activeWidth() {
    return this._activeWidth;
  }

  public getColumnRect(index: number) {
    return this._columnRects[index];
  }

  public onResize(columnIndex: number, width: number) {
    if(columnIndex >= this._columnCount) {
      throw RangeError();
    }
    this._columnRects[columnIndex].width = width;
    this._columnRects[columnIndex].right =
      this._columnRects[columnIndex].left + this._columnRects[columnIndex].width;
    for(let i = columnIndex + 1; i < this.columnCount; ++i) {
      this._columnRects[i].x = this._columnRects[i].right + 1;
      this._columnRects[i].left = this._columnRects[i].x;  
      this._columnRects[i].right = 
        this._columnRects[i].left +  this._columnRects[i].width;
    }
  }

  private _columnCount: number;
  private _activeWidth: number;
  private _columnRects: Rectangle[];
}

class MouseEvent {
  constructor(cx: number, cy: number, mx: number) {
    this._clientX = cx;
    this._clientY = cy;
    this._movementX = mx;
  }

  public get clientX() {
    return this._clientX;
  }

  public get clientY() {
    return this._clientY;
  }

  public get movementX() {
    return this._movementX;
  }

  private _clientX: number;
  private _clientY: number;
  private _movementX: number;
}

/** Tests the ColumnResizer. */
export class ColumnResizeTester {

  /** Tests what happens when a mousedown happens in the resize region
   *  and moved in a positive direction.
   */
  @Test()
  public testPerfectCaseIncrease(): void {
    const table = new MockTableInterface();
    const resizer = new ColumnResizer(table);
    let event: any = new MouseEvent(185, 50, 0);
    resizer.onMouseDown(event);
    event = new MouseEvent(205, 50, 20);
    resizer.onMouseMove(event);
    event = new MouseEvent(205, 50, 0);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(220);
    Expect(table.getColumnRect(1).width).toEqual(300);
    Expect(table.getColumnRect(2).width).toEqual(200);
  }

  /** Tests what happens when a mousedown happens in the resize region
   *  and moved in a negative direction.
   */
  @Test()
  public testPerfectCaseDecrease(): void {
    const table = new MockTableInterface();
    const resizer = new ColumnResizer(table);
    let event: any = new MouseEvent(185, 50, 0);
    resizer.onMouseDown(event);
    event = new MouseEvent(165, 50, -20);
    resizer.onMouseMove(event);
    event = new MouseEvent(165, 50, 0);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(180);
    Expect(table.getColumnRect(1).width).toEqual(300);
    Expect(table.getColumnRect(2).width).toEqual(200);
  }

  /** Tests what happens when a mousedown happens in the resize region
   *  and does not move.
   */
  @Test()
  public testPerfectCaseNoMove(): void {
    const table = new MockTableInterface();
    const resizer = new ColumnResizer(table);
    let event: any = new MouseEvent(190, 50, 0);
    resizer.onMouseDown(event);
    event = new MouseEvent(190, 70, 0);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(200);
    Expect(table.getColumnRect(1).width).toEqual(300);
    Expect(table.getColumnRect(2).width).toEqual(200);
  }

  /** Tests what happens when a mousedown happens in the resize region and
   *  the cursor is moved away and then moved back to where it started.
   */
  @Test()
  public testMovedBackInPlace(): void {
    const table = new MockTableInterface();
    const resizer = new ColumnResizer(table);
    let event: any = new MouseEvent(185, 50, 0);
    resizer.onMouseDown(event);
    event = new MouseEvent(165, 50, -20);
    resizer.onMouseMove(event);
    Expect(table.getColumnRect(0)).toEqual(180);
    event = new MouseEvent(185, 50, 20);
    resizer.onMouseMove(event);
    event = new MouseEvent(185, 50, 0);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(200);
    Expect(table.getColumnRect(1).width).toEqual(300);
    Expect(table.getColumnRect(2).width).toEqual(200);
  }

  /** Tests a mousedown followed by a mousemove that decreases the column
   *  width and then repeated.
   */
  @Test()
  public testTwoClicksTwoGrows(): void {
    const table = new MockTableInterface();
    const resizer = new ColumnResizer(table);
    let event: any = new MouseEvent(190, 50, 0);
    resizer.onMouseDown(event);
    event = new MouseEvent(210, 50, 20);
    resizer.onMouseMove(event);
    event = new MouseEvent(210, 50, 0);
    resizer.onMouseUp(event);
    event = new MouseEvent(210, 60, 0);
    resizer.onMouseDown(event);
    event = new MouseEvent(225, 60, 15);
    resizer.onMouseMove(event);
    event = new MouseEvent(225, 60, 0);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(235);
    Expect(table.getColumnRect(1).width).toEqual(300);
    Expect(table.getColumnRect(2).width).toEqual(200);
  }

  /** Tests a mousedown followed by a mousemove that increases the column width,
   *  and then repeated.
   */
  @Test()
  public testTwoClicksTwoShrinks(): void {
    const table = new MockTableInterface();
    const resizer = new ColumnResizer(table);
    let event: any = new MouseEvent(190, 50, 0);
    resizer.onMouseDown(event);
    event = new MouseEvent(170, 50, -20);
    resizer.onMouseMove(event);
    event = new MouseEvent(170, 50, 0);
    resizer.onMouseUp(event);
    event = new MouseEvent(170, 60, 0);
    resizer.onMouseDown(event);
    event = new MouseEvent(150, 60, -20);
    resizer.onMouseMove(event);
    event = new MouseEvent(150, 60, 0);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(160);
    Expect(table.getColumnRect(1).width).toEqual(300);
    Expect(table.getColumnRect(2).width).toEqual(200);
  }

  /** Tests what happens when a mousemove happens if a mousedown is called
   *  outside the resize region and moved into resize region.
   */
  @Test()
  public mouseClickedOutsideAndMoved(): void {
    const table = new MockTableInterface();
    const resizer = new ColumnResizer(table);
    let event: any = new MouseEvent(800, 300, 0);
    resizer.onMouseDown(event);
    event = new MouseEvent(190, 50, -610);
    resizer.onMouseMove(event);
    event = new MouseEvent(190, 50, 0);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(200);
    Expect(table.getColumnRect(1).width).toEqual(300);
    Expect(table.getColumnRect(2).width).toEqual(200);
  }

  /** Tests what happens when the mouse is moved without mousedown events. */
  @Test()
  public testMoveNoMouseDown(): void {
    const table = new MockTableInterface();
    const resizer = new ColumnResizer(table);
    let event: any = new MouseEvent(800, 300, 50);
    resizer.onMouseMove(event);
    event = new MouseEvent(190, 50, -30);
    resizer.onMouseMove(event);
    Expect(table.getColumnRect(0).width).toEqual(200);
    Expect(table.getColumnRect(1).width).toEqual(300);
    Expect(table.getColumnRect(2).width).toEqual(200);
  }

  /** Tests what happens when two different columns are resized */
  @Test()
  public testTwoResizes(): void {
    const table = new MockTableInterface();
    const resizer = new ColumnResizer(table);
    let event: any = new MouseEvent(492, 20, 0);
    resizer.onMouseDown(event);
    event = new MouseEvent(482, 50, -10);
    resizer.onMouseMove(event);
    event = new MouseEvent(482, 50, 0);
    resizer.onMouseUp(event);
    event = new MouseEvent(680, 20, 0);
    resizer.onMouseDown(event);
    event = new MouseEvent(710, 50, 30);
    resizer.onMouseMove(event);
    event = new MouseEvent(710, 50, 0);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(200);
    Expect(table.getColumnRect(1).width).toEqual(290);
    Expect(table.getColumnRect(2).width).toEqual(230);
  }

  /** Tests what happens when a mousedown happens in the resize region
   *  and moved to the left by over 100 pixels.
   */
  @Test()
  public testBigResize(): void {
    const table = new MockTableInterface();
    const resizer = new ColumnResizer(table);
    let event: any = new MouseEvent(185, 50, 0);
    resizer.onMouseDown(event);
    event = new MouseEvent(585, 50, 400);
    resizer.onMouseMove(event);
    event = new MouseEvent(585, 50, 0);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(600);
    Expect(table.getColumnRect(1).width).toEqual(300);
    Expect(table.getColumnRect(2).width).toEqual(200);
  }
}
