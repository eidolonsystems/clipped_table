/** Specifies the members needed on a table class to resize its columns. */
export interface TableInterface {

  /** Returns the number of columns. */
  columnCount: number;

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
  constructor(table: TableInterface, onResize: () => void) {}

  /** Handles moving the mouse over the table's header region.
   * @param event - The event describing the mouse move.
   */
  public onMouseMove(event: MouseEvent) {}

  /** Handles the mouse leaving the region.
   * @param event - The event describing the mouse leaving.
   */
  public onMouseLeave(event: MouseEvent) {}

  /** Handles pressing down a mouse button.
   * @param event - The event describing the button press.
   */
  public onMouseDown(event: MouseEvent) {}

  /** Handles releasing a mouse button.
   * @param event - The event describing the button release.
   */
  public onMouseUp(event: MouseEvent) {}
}
