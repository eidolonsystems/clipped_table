import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ArrayTableModel } from './array_table_model';
import { TableView } from './table_view';

const model = new ArrayTableModel();
for(let row = 0; row < 100; ++row) {
  const r = [];
  for(let column = 0; column < 3; ++column) {
    r.push(Math.floor(Math.random() * 1000000));
  }
  model.addRow(r);
}

const header = ['one', 'two', 'three'];

const someStyle = {
  table: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '20px',
    borderCollapse: 'collapse',
    boxSizing: 'border-box',
    border: '1px solid #4b23a0'
  },
  th: {
    border: '1px dashed #4b23a0',
    color: '#4b23a0'
  },
  td: {
    border: '1px dashed #4b23a0',
    color: '#4b23a0'
  }
};

ReactDOM.render(
  <TableView model={model} labels={header} style={someStyle}/>,
  document.getElementById('main'));
