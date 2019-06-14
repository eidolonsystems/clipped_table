import { css, StyleSheet } from 'aphrodite/no-important';
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

  /** The CSS style to apply. */
  activeWidth?: any;
}


/** Renders a TableModel to HTML. */
export class TableView extends React.Component<Properties> implements 
    TableInterface{
  public static readonly defaultProps = {
    header: [] as string[],
    style: {},
    activeWidth: 20
  };

  constructor(props: Properties) {
    super(props);
    this._column_resizer = new ColumnResizer(this);
    addEventListener
    this._header_refs = [];
    for(let i = 0; i < this.props.labels.length; ++i) {
      this._header_refs[i] = null;
    }
    this.BEFORE = StyleSheet.create({
    header: {
      position: 'relative',
      //borderBox: 'border-box',
      '::before': {
          cursor: 'col-resize',
          //boxSizing: 'border-box',
          display: 'block',
          content: "''",
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          width: `${this.props.activeWidth*2}px`
        }
      }
  });
    this.AFTER = StyleSheet.create({
    header: {
      position: 'relative',
      //borderBox: 'border-box',
      '::after': {
          cursor: 'col-resize',
          display: 'block',
          content: "''",
          height: '100%',
          position: 'absolute',
          right: 0,
          top: 0,
          width: `${this.props.activeWidth*2}px`
        }
    }
  });
  this.onResize = this.onResize.bind(this);
  this.getColumnRect = this.getColumnRect.bind(this);
  }

  public componentDidMount() {
    document.addEventListener('pointerdown', this._column_resizer.onMouseDown);
    document.addEventListener('pointerup', this._column_resizer.onMouseUp);
    document.addEventListener('pointermove', this._column_resizer.onMouseMove);
  }

  public componentWillUnmount() {
    document.removeEventListener('pointerdown', this._column_resizer.onMouseDown);
    document.removeEventListener('pointerup', this._column_resizer.onMouseUp);
    document.removeEventListener('pointermove', this._column_resizer.onMouseMove);
  }

  public render(): JSX.Element {
    console.log('RENDER!');
    const header = [];
    for(let i = 0; i < this.props.labels.length; ++i) {
      const beforeStyle = (() => {
        if(i === 0) {
          return null;
        } else {
          return this.BEFORE.header;
        }
      })();
      header.push(
        <th style={this.props.style.th}
            className={`${css(beforeStyle, this.AFTER.header)} ${this.props.className}`}
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
      <div style={{overflowX: 'scroll'}}>
      <table style={this.props.style.table}
          className={this.props.className}>
        <thead style={this.props.style.thead}
            className={this.props.className}>
          <tr style={this.props.style.tr}
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

  public get columnCount() {
    return this.props.model.columnCount;
  }

  public get activeWidth() {
    return this.props.activeWidth;
  }

  public getColumnRect(index: number): Rectangle {
    return ({  
      x: this._header_refs[index].getBoundingClientRect().left,
      y: this._header_refs[index].getBoundingClientRect().top,
      width: this._header_refs[index].getBoundingClientRect().width,
      height: this._header_refs[index].getBoundingClientRect().height,
      top: this._header_refs[index].getBoundingClientRect().top,
      left: this._header_refs[index].getBoundingClientRect().left,
      bottom: this._header_refs[index].getBoundingClientRect().bottom,
      right: this._header_refs[index].getBoundingClientRect().right
    } as Rectangle);
  }

  public onResize(columnIndex: number, width: number) {
    this._header_refs[columnIndex].style.width = `${width}px`;
    this._header_refs[columnIndex].style.minWidth = `${width}px`;
    this._header_refs[columnIndex].style.maxWidth = `${width}px`;
  } 

  private _header_refs: HTMLHeadElement[];
  private _column_resizer: ColumnResizer;
  private BEFORE = StyleSheet.create({header:{}});
  private AFTER = StyleSheet.create({header:{}});
}
