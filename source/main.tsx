import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ArrayTableModel } from './array_table_model';
import { TableView } from './table_view';

const model = new ArrayTableModel();
for(let row = 0; row < 1000; ++row) {
  const r = [];
  for(let column = 0; column < 4; ++column) {
    if(column === 3) {
      r.push(Math.floor(Math.random() * 10));
    } else {
      r.push(Math.floor(Math.random() * 100));
    }
  }
  model.addRow(r);
}

const header = ['one', 'two', 'three', 'four'];

const someStyle = {
  table: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '20px',
    borderCollapse: 'collapse',
    border: '5px solid #000000'    
  },
  th: {
    border: '2px solid #000000',
    color: '#4b23a0',
    padding: '10px'
  },
  td: {
    border: '2px solid #000000',
    padding: '5px',
    color: '#4b23a0'
  }
};

function changeValues() {
  const rowsToChange = Math.floor(Math.random() * model.rowCount);
  for(let i = 0; i < rowsToChange; ++i) {
    const someRow = Math.floor(Math.random() * model.rowCount);
    const someColumn = Math.floor(Math.random() * model.columnCount);
    model.set(someRow, someColumn, Math.floor(Math.random() * 10));
  }
}

//setInterval(changeValues, 5000);

ReactDOM.render(
  <TableView model={model} labels={header} style={someStyle} activeWidth={10}/>,
  document.getElementById('main'));
