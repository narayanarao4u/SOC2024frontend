import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchTrans } from '../redux/transSlice'
import styled from 'styled-components'
import moment from 'moment'
import { fetchACs } from '../redux/accountSlice'
import FetchClient from '../utilities/FetchClient'
import { FaEdit, FaSearch } from 'react-icons/fa'

import EMPComponent from './bin/EMPComponent'
import AC_Combo from './bin/AC_Combo'

const TranContext = createContext()
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
    Trans_des_ID: 0
  })

  const [memID, setMemID] = useState(0)
  const [ACID, setACID] = useState(0)
  const [AC, setAC] = useState()

  useEffect(() => {
    dispatch(fetchTrans(`${baseURL}/api/trans/${params.transby}/${params.id}`))
  }, [dispatch])


  useEffect(() => {
    getByACID(ACID)
  }, [ACID])


  const getByACID = async (id) => {
    const res = await FetchClient.get(`${baseURL}/api/account/${id}`)
    setCr({ ...cr, ACID: res[0].id })
    setAC(res[0])
  }

  return (
    <TranContext.Provider value={{ cr, setCr, setACID, trans, transDesc }}>

      <h3>Add Transcation</h3>
      <div>


        <label>AC Sub : {AC?.AC_Sub}</label>
        <label> : {AC?.ACNO}</label>
        <label> : {AC?.mem_tb?.name}</label>


        <br />
        <br />
        {/* <EMPComponent MEMID={memID} tabIndex="1" setMemID={setMemID} /> */}
        <br />
        <form action="">
          <label htmlFor='ACID'>ACID</label>
          <input type="text" name="ACID" id="ACID" value={ACID}
            className='w-11 text-center'
            onChange={(e) => setACID(e.target.value)}
            onBlur={(e) => getByACID(e.target.value)}
            tabIndex={0}
          />
          <AC_Combo ACID={ACID} tabindex={1} setACID={setACID} displayColumn={'ACNO'} />
          <select name="transID" value={cr?.Trans_des_ID} onChange={(e) => setCr({ ...cr, Trans_des_ID: e.target.value })} tabIndex={2}>

            {AC && transDesc.filter(a => a.AC_Sub === AC.AC_Sub).map((item) => (
              <option key={item.id} value={item.id}>
                {item.Trans_desc}
              </option>
            ))}

          </select>
        </form>

        {/* <AC_Combo ACID={ACID} tabindex="2" setACID={setACID} displayColumn={'AC_Sub'} /> */}
        <br />
        {/* <button> <FaSearch /> </button> */}


      </div>

      <DispTranscations />

      <pre className="border border-red-600 overflow-auto">
        {JSON.stringify(params, null, 2)}
        <section className="flex">
          <div>cr : {cr && JSON.stringify(cr, null, 2)}
            <br />
            AC : {AC && JSON.stringify(AC, null, 2)}
          </div>
          <div>data : {trans && JSON.stringify(trans.data[0], null, 2)}</div>
          <div>transDesc : {transDesc && JSON.stringify(transDesc[0], null, 2)}</div>

        </section>
      </pre>
    </TranContext.Provider>);

}


function DispTranscations() {

  const TranContext2 = useContext(TranContext)
  const { trans, transDesc, setCr, setACID } = TranContext2;

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
                <td>
                  <button className='bg-green-500 text-white px-2 py-1'
                    onClick={() => {
                      setACID(item.ACID)
                      setCr(item)
                    }}
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DispTrans>
    </div>)



}
export default Trans