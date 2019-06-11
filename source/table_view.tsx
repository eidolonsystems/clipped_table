import * as React from 'react';
import { TableModel } from './table_model';
import {TableInterface, ColumnResizer } from './column_resizer';

interface Properties {

  /** The model to display. */
  model: TableModel;

  /**  The label for the columns of the table.*/
  labels?: string[]

  /** Specifies the CSS class. */
  className?: string;

  /** The CSS style to apply. */
  style?: any;
}

/** Renders a TableModel to HTML. */
export class TableView extends React.Component<Properties> implements 
    TableInterface{
  public static readonly defaultProps = {
    header: [] as string[],
    style: {},
  };

  constructor(props: Properties) {
    super(props);
    this._column_resizer = new ColumnResizer(this);
    addEventListener
    this._header_refs = [];
    for(let i = 0; i < this.props.labels.length; ++i) {
      this._header_refs[i] = null;
    }

  }

  public componentDidMount() {
    window.addEventListener('mousedown', this._column_resizer.onMouseDown);
    window.addEventListener('mouseup', this._column_resizer.onMouseUp);
    window.addEventListener('mousemove', this._column_resizer.onMouseMove);
  }

  public componentWillUnmount() {
    window.removeEventListener('mousedown', this._column_resizer.onMouseDown);
    window.removeEventListener('mouseup', this._column_resizer.onMouseUp);
    window.removeEventListener('mousemove', this._column_resizer.onMouseMove);
  }

  public render(): JSX.Element {
    console.log('RENDER!');
    const header = [];
    for(let i = 0; i < this.props.labels.length; ++i) {
      header.push(
        <th style={this.props.style.th}
            className={this.props.className}
            ref={(label) => this._header_refs[i] = label}
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
      <table style={this.props.style.table}
          className={this.props.className}>
        <thead style={this.props.style.thead}
            className={this.props.className}
            ref={(header) => {this._header = header;}}>
          <tr style={this.props.style.tr}
              className={this.props.className}>
            {header}
          </tr>
        </thead>
        <tbody style={this.props.style.tbody}
            className={this.props.className}>
          {tableRows}
        </tbody>
      </table>);
  }

  public get columnCount() {
    return this.props.model.columnCount;
  }

  public get activeWidth() {
    return 50;
  }

  public get corners() {
    const boundingClient = this._header.getBoundingClientRect();
    return {topLeft: {x:  boundingClient.left, y: boundingClient.top}, 
      bottomRight: {x: boundingClient.right,y: boundingClient.bottom}};
  }

  public getColumnWidth(index: number) {
    return this._header_refs[index].scrollWidth;
  }

  public onResize(columnIndex: number, difference: number) {
    console.log('RESIZE!');
    console.log('difference!', difference);
    if(difference === 0) {
      return;
    }
    console.log('width' + this.getColumnWidth(columnIndex));
    this._header_refs[columnIndex].style.width = 
      `${this.getColumnWidth(columnIndex) + difference}px`;
     console.log('width' + this.getColumnWidth(columnIndex));
  } 

  private _header_refs: HTMLHeadElement[];
  private _header: HTMLHeadElement;
  private _column_resizer: ColumnResizer;
}
