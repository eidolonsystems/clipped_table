import { Expect, Test } from 'alsatian';
import { ColumnResizer, TableInterface, Rectangle, TableModel } from '../source';

class MockTableInterface implements TableInterface {
  constructor() {
    this._columnCount = 3;
    this._activeWidth = 20;
    this._columnRects = [] as Rectangle[];
    this._columnRects[0] =
      {
        x: 0,
        y: 0,
        width: 200,
        height: 100,
        top: 1,
        left: 0,
        bottom: 100,
        right: 200
      } as Rectangle;
      this._columnRects[1] = {
        x: 200,
        y: 0,
        width: 300,
        height: 100,
        top: 1,
        left: 200,
        bottom: 100,
        right: 500
      } as Rectangle;
      this._columnRects[2] ={
        x: 500,
        y: 0,
        width: 200,
        height: 100,
        top: 0,
        left: 500,
        bottom: 100,
        right: 700
      } as Rectangle;
      this.onResize = this.onResize.bind(this);
      this.getColumnRect = this.getColumnRect.bind(this);
  }

  public get columnCount() {
    return this._columnCount;
  }

  public get activeWidth() {
    return this._activeWidth;
  }

  public getColumnRect(index: number): Rectangle {
    return this._columnRects[index];
  }

  public onResize(columnIndex: number, width: number) {
    if(columnIndex >= this._columnCount) {
      throw RangeError();
    }
    this.getColumnRect(columnIndex).width = width;
    this.getColumnRect(columnIndex).right =
      this.getColumnRect(columnIndex).left + 
      this.getColumnRect(columnIndex).width;
    if(columnIndex < this._columnCount - 1) {
      for(let i = columnIndex + 1; i < this.columnCount; ++i) {
        this.getColumnRect(i).x = this.getColumnRect(i-1).right;
        this.getColumnRect(i).left = this.getColumnRect(i).x;  
        this.getColumnRect(i).right = 
          this.getColumnRect(i).left + 
          this.getColumnRect(i).width;
      }
    }
  }

  public showCursor() {
    return;
  }

  public hideCursor() {
    return;
  }

  private _columnCount: number;
  private _activeWidth: number;
  private _columnRects: Rectangle[];
}

class MouseEvent {
  constructor(cx: number, cy: number) {
    this._clientX = cx;
    this._clientY = cy;
  }

  public get clientX() {
    return this._clientX;
  }

  public get clientY() {
    return this._clientY;
  }

  private _clientX: number;
  private _clientY: number;
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
    let event: any = new MouseEvent(185, 50);
    resizer.onMouseMove(event);
    resizer.onMouseDown(event);
    event = new MouseEvent(205, 50);
    resizer.onMouseMove(event);
    event = new MouseEvent(205, 50);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(205);
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
    let event: any = new MouseEvent(185, 50);
    resizer.onMouseMove(event);
    resizer.onMouseDown(event);
    event = new MouseEvent(165, 50);
    resizer.onMouseMove(event);
    event = new MouseEvent(165, 50);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(165);
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
    let event: any = new MouseEvent(190, 50);
    resizer.onMouseDown(event);
    event = new MouseEvent(190, 70);
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
    let event: any = new MouseEvent(185, 50);
    resizer.onMouseMove(event);
    resizer.onMouseDown(event);
    event = new MouseEvent(165, 50);
    resizer.onMouseMove(event);
    Expect(table.getColumnRect(0).width).toEqual(165);
    event = new MouseEvent(200, 50);
    resizer.onMouseMove(event);
    event = new MouseEvent(200, 50);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(200);
    Expect(table.getColumnRect(1).width).toEqual(300);
    Expect(table.getColumnRect(2).width).toEqual(200);
  }

  /** Tests a mousedown followed by a mousemove that decreases the column
   *  width and then repeated.
   */
  @Test()
  public testTwoClicksOneGrow(): void {
    const table = new MockTableInterface();
    const resizer = new ColumnResizer(table);
    let event: any = new MouseEvent(190, 50);
    resizer.onMouseMove(event);
    resizer.onMouseDown(event);
    event = new MouseEvent(210, 50);
    resizer.onMouseMove(event);
    event = new MouseEvent(210, 50);
    resizer.onMouseUp(event);
    event = new MouseEvent(210, 60);
    resizer.onMouseDown(event);
    event = new MouseEvent(225, 60);
    resizer.onMouseMove(event);
    event = new MouseEvent(225, 60);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(210);
    Expect(table.getColumnRect(1).width).toEqual(300);
    Expect(table.getColumnRect(2).width).toEqual(200);
  }

  /** Tests a mousedown followed by a mousemove that increases the column width,
   *  and then repeated.
   */
  @Test()
  public testTwoClicksOneShrink(): void {
    const table = new MockTableInterface();
    const resizer = new ColumnResizer(table);
    let event: any = new MouseEvent(190, 50);
    resizer.onMouseMove(event);
    resizer.onMouseDown(event);
    event = new MouseEvent(170, 50);
    resizer.onMouseMove(event);
    event = new MouseEvent(170, 50);
    resizer.onMouseUp(event);
    event = new MouseEvent(170, 60);
    resizer.onMouseDown(event);
    event = new MouseEvent(150, 60);
    resizer.onMouseMove(event);
    event = new MouseEvent(150, 60);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(170);
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
    let event: any = new MouseEvent(800, 300);
    resizer.onMouseMove(event);
    resizer.onMouseDown(event);
    event = new MouseEvent(190, 50);
    resizer.onMouseMove(event);
    event = new MouseEvent(190, 50);
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
    let event: any = new MouseEvent(800, 300);
    resizer.onMouseMove(event);
    event = new MouseEvent(190, 50);
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
    let event: any = new MouseEvent(490, 20);
    resizer.onMouseMove(event);
    resizer.onMouseDown(event);
    event = new MouseEvent(480, 50);
    resizer.onMouseMove(event);
    event = new MouseEvent(480, 50);
    resizer.onMouseUp(event);
    event = new MouseEvent(680, 20);
    resizer.onMouseMove(event);
    resizer.onMouseDown(event);
    event = new MouseEvent(710, 50);
    resizer.onMouseMove(event);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(200);
    Expect(table.getColumnRect(1).width).toEqual(280);
    Expect(table.getColumnRect(2).width).toEqual(230);
  }

  /** Tests what happens when a mousedown happens in the resize region
   *  and moved to the left by over 100 pixels.
   */
  @Test()
  public testBigResize(): void {
    const table = new MockTableInterface();
    const resizer = new ColumnResizer(table);
    let event: any = new MouseEvent(185, 50);
    resizer.onMouseMove(event);
    resizer.onMouseDown(event);
    event = new MouseEvent(585, 50);
    resizer.onMouseMove(event);
    event = new MouseEvent(585, 50);
    resizer.onMouseUp(event);
    Expect(table.getColumnRect(0).width).toEqual(585);
    Expect(table.getColumnRect(1).width).toEqual(300);
    Expect(table.getColumnRect(2).width).toEqual(200);
  }
}
