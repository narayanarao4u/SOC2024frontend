import React, { createContext, useEffect, useRef, useState } from 'react';
import CustomSelect from './CustomSelect';
import DataService from '../../services/DataService'




const AC_Combo = ({ ACID, tabindex, setACID, displayColumn }) => {

  const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState();
  const tableColumns = ['id', 'AC_Sub', 'ACNO',]
  // const displayColumn = 'ACNO'
  const selectColumn = 'id'

  const [selectedRow, setselectedRow] = useState('');
  const ds = new DataService()

  const inputRef = useRef(null);

  const getACdata = async () => {
    const res = await ds.getAccounts()

    setInitialData(res);

    if (ACID) {
      filterData(res)
    } else {
      console.log('no ACID');
      setFilteredData(res);
    }
  }


  useEffect(() => {
    getACdata()

  }, [])

  function filterData(inputdata) {

    let filter = inputdata.filter(item => item.id == ACID);
    setFilteredData(filter);
    setselectedRow(filter[0]);
  }

  useEffect(() => {
    if (ACID && initialData.length > 0) {

      filterData(initialData)



    }

  }, [ACID])


  const onFilter = (value) => {
    console.log(value);
    const filtered = initialData.filter(item =>
      item.ACNO.toString().toLowerCase().includes(value.toLowerCase()) ||
      item.AC_Sub.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <>

      {filteredData &&
        <CustomSelect selectColumn={selectColumn} data={filteredData} tableColumns={tableColumns}
          displayColumn={displayColumn} onFilter={onFilter} selectedRow={selectedRow}
          tabindex={tabindex} setselectedRow={setselectedRow} setID={setACID}
        />}

    </ >

  );
};


export default AC_Combo;
