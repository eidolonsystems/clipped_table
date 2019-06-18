import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ArrayTableModel } from './array_table_model';
import { TableView } from './table_view';

const model = new ArrayTableModel();
for(let row = 0; row < 100; ++row) {
  const r = [];
  for(let column = 0; column < 4; ++column) {
    r.push(Math.floor(Math.random() * 1000000));
  }
  model.addRow(r);
}

const header = ['one', 'two', 'three', 'four'];

const someStyle = {
  table: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '20px',
    borderCollapse: 'collapse',
    border: '5px solid #000000',
    padding: 0
    
  },
  th: {
    border: '2px solid #000000',
    color: '#4b23a0',
    //backgroundColor: '#c1d9ff',
    padding: 0,
    margin: '20px'
  },
  td: {
    border: '2px solid #000000',
    padding: 0,
    color: '#4b23a0'
  }
};

ReactDOM.render(
  <TableView model={model} labels={header} style={someStyle} activeWidth={20}/>,
  document.getElementById('main'));
