import React, { createContext, useEffect, useRef, useState } from 'react';
import CustomSelect from './CustomSelect';
import MemDataService from '../../services/MemDataService'




const MyComponent = ({ MEMID, tabindex, setMemID }) => {

  const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState();
  const tableColumns = ['MEMID', 'Name', 'GNO']
  const displayColumn = 'Name'
  const selectColumn = 'MEMID'

  const [selectedRow, setselectedRow] = useState('');
  const ds = new MemDataService()

  const inputRef = useRef(null);

  const getMemdata = async () => {
    const res = await ds.get()
    setInitialData(res);
    // setFilteredData(res);
    if (MEMID) {
      let filter = res.filter(item => item.MEMID === MEMID);
      setFilteredData(filter);
      setselectedRow(filter[0]);
    } else {
      setFilteredData(res);
    }
  }


  useEffect(() => {
    getMemdata()

  }, [])

  useEffect(() => {
    if (MEMID && initialData.length > 0) {
      let filter = initialData.filter(item => item.MEMID === MEMID);
      setFilteredData(filter);
      setselectedRow(filter[0]);

    }

  }, [MEMID])


  const onFilter = (value) => {
    const filtered = initialData.filter(item =>
      item.GNO.toString().toLowerCase().includes(value.toLowerCase()) ||
      item.Name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <>  <br />
      <span>from selected row: {selectedRow && selectedRow[selectColumn]}</span> <br />
      <span>filtered : {filteredData && filteredData.length}</span> <br />
      <span>MEMID :{MEMID}</span>
      <br />
      {/*  selectedRow, setselectedRow, data: filteredData, tableColumns,
      displayColumn, selectColumn, tabindex, setID: setMemID, onFilter */}
      {filteredData &&
        <CustomSelect selectColumn={selectColumn} data={filteredData}
          tableColumns={tableColumns} displayColumn={displayColumn} onFilter={onFilter} selectedRow={selectedRow}
          tabindex={tabindex} setselectedRow={setselectedRow} setID={setMemID}
        />}

    </ >

  );
};


export default MyComponent;
