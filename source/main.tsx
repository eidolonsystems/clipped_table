import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ArrayTableModel } from './array_table_model';
import { TableView } from './table_view';
import { ColumnResizer, TableInterface } from './column_resizer';

const model = new ArrayTableModel();
for(let row = 0; row < 500; ++row) {
  const r = [];
  for(let column = 0; column < 5; ++column) {
    r.push(Math.floor(Math.random() * 1000000));
  }
  model.addRow(r);
}

const header = ['one', 'two', 'three', 'four', 'five'];

const someStyle = {
  table: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '20px',
    borderCollapse: 'collapse',
    boxSizing: 'border-box',
    border: '2px solid #4b23a0'
  },
  td: {
    border: '1px dashed #4b23a0',
    color: '#4b23a0',
    padding: '10px'
  }
};

//const table = new TableView({model: model, labels: header, style: someStyle, className: null});
//ReactDOM.render( table.render(), document.getElementById('main'));
let thing: TableView;
ReactDOM.render(
  <TableView model={model} labels={header} style={someStyle} ref={(view) => thing = view}/>,
  document.getElementById('main'));
