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
    border: '5px solid #000000'    
  },
  th: {
    border: '2px solid #000000',
    color: '#4b23a0',
    margin: '20px'
  },
  td: {
    border: '2px solid #000000',
    padding: 10,
    color: '#4b23a0'
  }
};

function changeValues() {
  const rowsToChange = Math.floor(Math.random() * model.rowCount);
  console.log(rowsToChange);
  for(let i = 0; i < rowsToChange; ++i) {
    const someRow = Math.floor(Math.random() * model.rowCount);
    const someColumn = Math.floor(Math.random() * model.columnCount);
    model.set(someRow, someColumn, Math.floor(Math.random() * 10));
  }
  if(model.rowCount > 1 && rowsToChange % 2 === 0) {
    model.removeRow(0);
  } else {
    model.addRow([0, 1, 2, 3]);
  }
}

setInterval(changeValues.bind(this), 5000);

ReactDOM.render(
  <TableView model={model} labels={header} style={someStyle} activeWidth={30}/>,
  document.getElementById('main'));
