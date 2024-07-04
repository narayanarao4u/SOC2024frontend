import React, { createContext, useEffect, useRef, useState } from 'react';
import CustomSelect from './CustomSelect';
import MemDataService from '../../services/MemDataService'




const ItemsComponent = ({ PID, tabindex, setPID }) => {

  const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState();
  const tableColumns = ['UID', 'ItemName', 'Balance', 'Sprice']
  const displayColumn = 'ItemName'
  const selectColumn = 'PID'

  const [selectedRow, setselectedRow] = useState('');
  const ds = new MemDataService()

  const inputRef = useRef(null);

  const getMemdata = async () => {
    const res = await ds.getStockBalance()
    setInitialData(res.data);
    // setFilteredData(res);
    if (PID) {
      // console.log('PID', res.data);
      let filter = res.data.filter(item => item.PID === PID);
      setFilteredData(filter);
      // console.log('PID', filter);
      setselectedRow(filter[0]);
    } else {
      console.log('no PID');
      setFilteredData(res);
    }
  }


  useEffect(() => {
    getMemdata()

  }, [])

  useEffect(() => {
    if (PID && initialData.length > 0) {
      let filter = initialData.filter(item => item.PID === PID);
      setFilteredData(filter);
      setselectedRow(filter[0]);

    }

  }, [PID])


  const onFilter = (value) => {
    console.log(value);
    const filtered = initialData.filter(item =>
      item.UID.toString().toLowerCase().includes(value.toLowerCase()) ||
      item.ItemName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <>  <br />
      <span>from selected row: {selectedRow && selectedRow[selectColumn]}</span> <br />
      <span>filtered : {filteredData && filteredData.length}</span> <br />
      <span>PID :{PID}</span>
      <br />

      {filteredData &&
        <CustomSelect selectColumn={selectColumn} data={filteredData} tableColumns={tableColumns} displayColumn={displayColumn} onFilter={onFilter} selectedRow={selectedRow}
          tabindex={tabindex} setselectedRow={setselectedRow} setID={setPID}
        />}

    </ >

  );
};


export default ItemsComponent;
