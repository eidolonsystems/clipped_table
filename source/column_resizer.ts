/** Specifies the members needed on a table class to resize its columns. */
export interface TableInterface {

  /** Returns the number of columns. */
  columnCount: number;

  /** Returns the width of the mouse hover zone. */
  activeWidth: number;

  /** Returns the coordiinates of the top left corner 
   * and bottom right corner. 
   */
  corners: [[number, number],[number, number]];

  /** Returns the width of a column.
   * @param index - The index of the column.
   * @return The width in pixels of the column at the specified index.
   */
  getColumnWidth: (index: number) => number;
}

/** Provides the functionality needed to resize a table's columns. */
export class ColumnResizer {

  /** Constructs a ColumnResizer.
   * @param table - The interface to the table being resized.
   * @param onResize - Indicates a change to a column's width.
   */
  constructor(
      table: TableInterface, 
      onResize: (columnIndex: number, difference: number) => void) {
    this.s0();
    this.currentLabel = 0;
  }

  /** Handles moving the mouse over the table's header region.
   * @param event - The event describing the mouse move.
   */
  public onMouseMove(event: MouseEvent) {
    if(this.state === 0) {
      return this.s1(event);
    }
    if(this.state === 1) {
      return this.s1(event);
    }
    if(this.state === 2) {
      return this.s1(event);
    }
    if(this.state === 3) {
      return this.s4(event);
    }
  }

  /** Handles pressing down a mouse button.
   * @param event - The event describing the button press.
   */
  public onMouseDown(event: MouseEvent) {
    if(this.state === 2) {
      return this.s3(event);
    }
  }

  /** Handles releasing a mouse button.
   * @param event - The event describing the button release.
   */
  public onMouseUp(event: MouseEvent) {
    if(this.state === 3) {
      return this.s1(event);
    }
  }

  private s0() {
    this.state = 0;  
  }

  private s1(event: MouseEvent) {
    this.state = 1;
  }

  private s2(event: MouseEvent) {
    this.state = 2;
    //how to get and set the label?????
  }

  private s3(event: MouseEvent) {
    this.state = 4;
    const currentCoor = [event.clientX, event.clientY];
  }

  private s4(event: MouseEvent) {
    this.state = 4;
    const movement = event.movementX;
    this.resize(this.currentLabel, movement);
  }

  private table: TableInterface;
  private resize: (columnIndex: number, difference: number) => void;

  private state: number;
  private currentLabel: number;
  private startPoint: [number, number];

}
