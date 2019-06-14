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
    border: '20px solid #000000'
    
  },
  th: {
    border: '20px solid #000000',
    color: '#4b23a0',
    //backgroundColor: '#c1d9ff',
    margin: '20px'
  },
  td: {
    border: '20px solid #000000',
    color: '#4b23a0'
  }
};

ReactDOM.render(
  <TableView model={model} labels={header} style={someStyle} activeWidth={10}/>,
  document.getElementById('main'));
