import * as Kola from 'kola-signals';
import * as React from 'react';
import { TableModel } from './table_model';
import { ColumnResizer, Rectangle, TableInterface } from './column_resizer';

interface Properties {

  /** The model to display. */
  model: TableModel;

  /**  The label for the columns of the table.*/
  labels?: string[]

  /** Specifies the CSS class. */
  className?: string;

  /** The CSS style to apply. */
  style?: any;

  /** The width of active area measured from the right edge. */
  activeWidth?: number;
}

/** Renders a TableModel to HTML. */
export class TableView extends React.Component<Properties> implements 
    TableInterface {
  public static readonly defaultProps = {
    header: [] as string[],
    style: {},
    activeWidth: 20
  };

  constructor(props: Properties) {
    super(props);
    this.headerRefs = [];
    for(let i = 0; i < this.props.labels.length; ++i) {
      this.headerRefs[i] = null;
    }
    this.props.model.connect(() => {this.forceUpdate();});
  }

  public componentDidMount() {
    this.columnResizer = new ColumnResizer(this);
    document.addEventListener('pointerdown',
      this.columnResizer.onMouseDown.bind(this.columnResizer));
    document.addEventListener('pointerup',
      this.columnResizer.onMouseUp.bind(this.columnResizer));
    document.addEventListener('pointermove',
      this.columnResizer.onMouseMove.bind(this.columnResizer));
  }


  public componentWillUnmount() {
    document.removeEventListener('pointerdown', this.columnResizer.onMouseDown);
    document.removeEventListener('pointerup', this.columnResizer.onMouseUp);
    document.removeEventListener('pointermove', this.columnResizer.onMouseMove);
  }

  public render(): JSX.Element {
    const header = [];
    for(let i = 0; i < this.props.labels.length; ++i) {
      header.push(
        <th style={this.props.style.th}
            className={this.props.className}
            ref={(label) => this.headerRefs[i] = label}
            key={this.props.labels[i]}>
          {this.props.labels[i]}
        </th>);
    }
    const tableRows = [];
    for(let i = 0; i < this.props.model.rowCount; ++i) {
      const row = [];
      for(let j = 0; j < this.props.model.columnCount; ++j) {
        row.push(
          <td style={this.props.style.td}
              className={this.props.className}
              key={(i * this.props.model.columnCount) + j}>
            {this.props.model.get(i, j)}
          </td>);
      }
      tableRows.push(
        <tr style={this.props.style.tr}
            className={this.props.className}
            key={i}>
          {row}
        </tr>);
    }
    return(
      <div style={{overflowX: 'scroll'}}>
        <table style={this.props.style.table}
            className={this.props.className}>
          <thead style={this.props.style.thead}
              className={this.props.className}>
            <tr style={this.props.style.tr}
                ref={(row) => this.headerRowRef = row}
                className={this.props.className}>
              {header}
            </tr>
          </thead>
          <tbody style={this.props.style.tbody}
              className={this.props.className}>
            {tableRows}
          </tbody>
        </table>
      </div>);
  }

  public get columnCount(): number {
    return this.props.model.columnCount;
  }

  public get activeWidth(): number {
    return this.props.activeWidth;
  }

  public getColumnRect(index: number): Rectangle {
    const rectangle = this.headerRefs[index].getBoundingClientRect();
    return ({  
      top: rectangle.top,
      left: rectangle.left,
      bottom: rectangle.bottom,
      right: rectangle.right
    } as Rectangle);
  }

  public onResize(columnIndex: number, width: number) {
    this.headerRefs[columnIndex].style.width = `${width}px`;
    this.headerRefs[columnIndex].style.minWidth = `${width}px`;
    this.headerRefs[columnIndex].style.maxWidth = `${width}px`;
  }

  public showResizeCursor() {
    this.headerRowRef.style.cursor = 'col-resize';
  }

  public restoreCursor() {
    this.headerRowRef.style.cursor = 'auto';
  } 


  

  private headerRefs: HTMLHeadElement[];
  private headerRowRef: HTMLTableRowElement;
  private columnResizer: ColumnResizer;
}
