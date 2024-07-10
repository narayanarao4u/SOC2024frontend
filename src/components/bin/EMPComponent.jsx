import React, { createContext, useEffect, useRef, useState } from 'react';
import CustomSelect from './CustomSelect';
import DataService from '../../services/DataService'




const MyComponent = ({ MEMID, tabindex = 0, setMemID }) => {

  const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState();
  const tableColumns = ['id', 'name', 'gno', 'desgn']
  const displayColumn = 'name'
  const selectColumn = 'id'

  const [selectedRow, setselectedRow] = useState('');
  const baseURL = import.meta.env.VITE_APP_BASE_URL;
  const ds = new DataService(`${baseURL}/api/member`)

  const getMemdata = async () => {
    const res = await ds.get()
    setInitialData(res);
    // setFilteredData(res);
    if (MEMID) {
      let filter = res.filter(item => item.id === MEMID);
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
      let filter = initialData.filter(item => item.id === MEMID);
      setFilteredData(filter);
      setselectedRow(filter[0]);

    }

  }, [MEMID])


  const onFilter = (value) => {
    const filtered = initialData.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <>
      {filteredData &&
        <CustomSelect selectColumn={selectColumn} data={filteredData}
          tableColumns={tableColumns} displayColumn={displayColumn} onFilter={onFilter} selectedRow={selectedRow}
          tabindex={tabindex} setselectedRow={setselectedRow} setID={setMemID}
        />}

    </ >

  );
};


export default MyComponent;
