import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchTrans } from '../redux/transSlice'
import styled from 'styled-components'
import moment from 'moment'
import { fetchACs } from '../redux/accountSlice'
import FetchClient from '../utilities/FetchClient'
import { FaSearch } from 'react-icons/fa'

function Trans() {
  // const params = new URLSearchParams(window.location.search)
  const params = useParams()
  // const id = params.get('id')
  const dispatch = useDispatch()
  const trans = useSelector(state => state.trans)
  const transDesc = useSelector(state => state.transDesc.transdesc)
  const baseURL = import.meta.env.VITE_APP_BASE_URL;

  const [cr, setCr] = useState({
    ACID: 0,
    AC_Sub: '',
    ACNO: '',
    AC: {
      id: 0,
      name: '',
      ACNO: '',
      MEMID: 0,
      balance: 0
    }
  })

  useEffect(() => {
    console.log('fired');
    dispatch(fetchTrans(`${baseURL}/api/trans/${params.transby}/${params.id}`))
  }, [dispatch])


  const handleACIDBurl = async (e) => {
    const res = await FetchClient.get(`${baseURL}/api/account/${e.target.value}`)
    setCr({ ...cr, AC_Sub: res[0].AC_Sub, ACNO: res[0].ACNO, AC: res[0] })

    console.log(res[0]);
  }

  return (<>

    <h3>Add Transcation</h3>
    <div>
      <label htmlFor='ACID'>ACID</label>
      <input type="text" name="ACID" id="ACID" value={cr?.ACID}
        className='w-11 text-center'
        onChange={(e) => setCr({ ...cr, ACID: e.target.value })}
        onBlur={handleACIDBurl}
      />

      <label htmlFor='AC_SUB'>AC Sub</label>
      <input type="text" name="AC_SUB" id="AC_SUB" value={cr?.AC_Sub}
        onChange={(e) => setCr({ ...cr, AC_Sub: e.target.value })}
      />

      <label htmlFor='ACNO'>ACNO</label>
      <input type="text" name="ACNO" id="ACNO" value={cr?.ACNO}
        className='w-24 text-center'
        onChange={(e) => setCr({ ...cr, AC_Sub: e.target.value })}
      />

      <button> <FaSearch /> </button>


    </div>

    <DispTranscations trans={trans} transDesc={transDesc} />

    <pre className="border border-red-600 overflow-auto">
      {JSON.stringify(params, null, 2)}
      <section className="flex">
        <div>cr : {cr && JSON.stringify(cr, null, 2)}</div>
        <div>data : {trans && JSON.stringify(trans.data[0], null, 2)}</div>
        <div>transDesc : {transDesc && JSON.stringify(transDesc[0], null, 2)}</div>

      </section>
    </pre>
  </>);

}


function DispTranscations({ trans, transDesc }) {
  const transID = (id) => {
    try {

      if (transDesc && transDesc.length > 0) {
        let tr = transDesc.find(item => item.id === id)
        if (tr.id) return tr.Trans_desc
      }
    } catch (error) {
      console.log("error");
      console.log(transDesc && transDesc.length)
    }


    return id
  }



  const DispTrans = styled.section`
border-radius: 10px;
padding: 20px;
margin-bottom: 20px;
box-shadow:5px 5px 10px gray;

table {
  border-collapse: collapse;
  width: 100%;
}
th {
  font-weight: bold;
  background-color: gray;
  padding: 2px 5px;
  color: white;
  position: sticky;
  top: 0;
}
td {  
  padding: 2px 5px;
  border: 1px solid gray;
}
`;

  return (
    <div>




      <DispTrans >
        <h3>Transaction</h3>
        <table>
          <thead>
            <tr >
              <th className='w-1'>id</th>
              <th className='w-1'> ACID</th>
              <th>Trans_des_ID</th>
              <th>Date</th>
              <th>Amt</th>
              <th>PRN</th>
              <th>INT</th>
              <th>PRN_B</th>
              <th>INT_B</th>
              <th>RATE</th>
              <th>Days</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trans.data.map(item => (
              <tr key={item.id} className='transBody'>
                <td>{item.id}</td>
                <td>{item.ACID}</td>
                <td>{transID(item.Trans_des_ID)}</td>
                <td>{moment(item.Trans_dt).format('DD-MM-YYYY')}</td>
                <td>{item.Total_amt}</td>
                <td>{item.PRN}</td>
                <td>{item.INT}</td>
                <td>{item.PRN_B}</td>
                <td>{item.INT_B}</td>
                <td>{item.rate}</td>
                <td>{item.Days}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </DispTrans>
    </div>)



}
export default Trans