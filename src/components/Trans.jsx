import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchTrans, createTrans, updateTrans, deleteTrans } from '../redux/transSlice'
import styled from 'styled-components'
import moment from 'moment'
import { fetchACs } from '../redux/accountSlice'
import FetchClient from '../utilities/FetchClient'
import { FaEdit, FaSave, FaSearch } from 'react-icons/fa'

import EMPComponent from './bin/EMPComponent'
import AC_Combo from './bin/AC_Combo'

const TranContext = createContext()

const newTrans = {

  "ActionID": -1,
  "Trans_des_ID": -1,
  "Trans_dt": new Date(),
  "CB_dt": new Date(),
  "ACID": 0,
  "I_NO": "-",
  "Cash_amt": 0,
  "Chq_amt": 0,
  "Adj_amt": 0,
  "Total_amt": 0,
  "PRN": 0,
  "PRN_D": 0,
  "PRN_C": 0,
  "PRN_B": 0,
  "INT": 0,
  "INT_D": 0,
  "INT_C": 0,
  "INT_B": 0,
  "rate": 0,
  "Days": 0,
  "Status": "U",
  "T_Order": 1,
  "CreatedOn": new Date(),
  "CreatedBy": null,
  "ModifiedOn": new Date(),
  "ModifiedBy": null,
  "Remarks": null
}
function Trans() {
  // const params = new URLSearchParams(window.location.search)
  const params = useParams()
  // const id = params.get('id')
  const dispatch = useDispatch()
  const trans = useSelector(state => state.trans)
  const transDesc = useSelector(state => state.transDesc.transdesc)
  const baseURL = import.meta.env.VITE_APP_BASE_URL;

  const [cr, setCr] = useState(newTrans)
  const [pr, setPr] = useState({})

  const [memID, setMemID] = useState(0)
  const [ACID, setACID] = useState(0)
  const [AC, setAC] = useState()
  const [ACTrans, setACTrans] = useState()

  useEffect(() => {
    dispatch(fetchTrans(`${baseURL}/api/trans/${params.transby}/${params.id}`))
  }, [dispatch])


  useEffect(() => {
    getByACID(ACID)
  }, [ACID])


  useEffect(() => {
    setCr({ ...cr, Total_amt: cr.Cash_amt + cr.Adj_amt + cr.Chq_amt })
  }, [cr.Cash_amt, cr.Adj_amt, cr.Chq_amt])


  const getByACID = async (id) => {
    const acRes = await FetchClient.get(`${baseURL}/api/account/${id}`)
    const acTransRes = await FetchClient.get(`${baseURL}/api/trans/ACID/${id}`)
    setCr({ ...cr, ACID: acRes[0].id })
    setACTrans(acTransRes)
    setAC(acRes[0])
  }

  const handleSave = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault()
    let cr2 = { ...cr }
    cr2.ActionID = 490

    // const res = await FetchClient.post(`${baseURL}/api/trans`, cr2)
    //dispatch(createPost({ url, data: frmdata }));
    dispatch(createTrans({ url: `${baseURL}/api/trans`, data: cr2 }))
    setCr(newTrans);
    setACID(0)

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
          <TransStyle>
            <label>ACID</label>
            <label>ACNO</label>
            <label>Transaction</label>
            <label>Trans Date</label>
            <label>CB Date</label>
            <label>Instrument No</label>
            <label>Cash Amt</label>
            <label>cheque Amt</label>
            <label>Adjust Amt</label>
            <label>Total Amt</label>
            <div>Actions</div>



            <input type="text" name="ACID" id="ACID" value={ACID}
              className='text-center'
              onChange={(e) => setACID(+e.target.value)}
              onBlur={(e) => getByACID(+e.target.value)}
              tabIndex={0}
            />
            <div>
              <AC_Combo ACID={ACID} tabindex={1} setACID={setACID} displayColumn={'ACNO'} />
            </div>


            <select name="transID" value={cr?.Trans_des_ID} onChange={(e) => setCr({ ...cr, Trans_des_ID: +e.target.value })} tabIndex={2}>
              <option value={-1}></option>
              {AC && transDesc.filter(a => a.AC_Sub === AC.AC_Sub).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.Trans_desc}
                </option>
              ))}

            </select>
            <input type="date" name="Trans_dt" id="Trans_dt" value={moment(cr?.Trans_dt).format('YYYY-MM-DD')}
              onChange={(e) => setCr({ ...cr, Trans_dt: e.target.value })} tabIndex={3} />

            <input type="date" name="CB_dt" id="CB_dt" value={moment(cr?.CB_dt).format('YYYY-MM-DD')}
              onChange={(e) => setCr({ ...cr, CB_dt: e.target.value })} tabIndex={4} />

            <input type="text" name="I_NO" id="I_NO" value={cr?.I_NO}
              onChange={(e) => setCr({ ...cr, I_NO: e.target.value })} tabIndex={5} />

            <input type="number" name="Cash_amt" id="Cash_amt" value={cr?.Cash_amt}
              onChange={(e) => setCr({ ...cr, Cash_amt: +e.target.value })} tabIndex={6} />

            <input type="number" name="Chq_amt" id="Chq_amt" value={cr?.Chq_amt}
              onChange={(e) => setCr({ ...cr, Chq_amt: +e.target.value })} tabIndex={7} />

            <input type="number" name="Adj_amt" id="Adj_amt" value={cr?.Adj_amt}
              onChange={(e) => setCr({ ...cr, Adj_amt: +e.target.value })} tabIndex={8} />

            <input type="number" name="Total_amt" id="Total_amt" value={cr?.Total_amt}
              onChange={(e) => setCr({ ...cr, Total_amt: +e.target.value })} tabIndex={9} readOnly />
            <div>
              <button className='bg-green-600 text-gray-300-200'
                onClick={handleSave}
              >
                <FaSave size={20} /> </button>

            </div>

          </TransStyle>
        </form>

        {/* <AC_Combo ACID={ACID} tabindex="2" setACID={setACID} displayColumn={'AC_Sub'} /> */}
        <br />
        {/*  */}


      </div>

      <DispTranscations data={trans.data} showBtn={true} />
      {ACTrans && <DispTranscations data={ACTrans} />}



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


const TransStyle = styled.section`
  display: grid;
  grid-template-columns: 50px  100px 150px repeat(8, 100px) ;
`;
function DispTranscations({ data, showBtn = false }) {

  const { transDesc, cr, setCr, setACID } = useContext(TranContext)

  const transID = (id) => {
    try {

      if (transDesc && transDesc.length > 0) {
        let tr = transDesc.find(item => item.id === id)
        if (tr.id) return tr.Trans_desc
      }
    } catch (error) {
      // console.log("error");
      // console.log(transDesc && transDesc.length)
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

tr.selected {
  background-color: #ffe282;
  font-weight: bold;
  
}
`;

  return (
    <div>




      <DispTrans >
        <h3>Transaction</h3>
        <table>
          <thead>
            <tr >
              {/* <th className='w-1'>id</th> */}
              <th className='w-1'>BatchNo</th>
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
              {showBtn && <th>Actions</th>}
            </tr>
          </thead>
          <tbody >
            {data.map(item => (
              <tr key={item.id} className={cr && item.id === cr.id ? 'selected' : ''}>
                {/* <td>{item.id}</td> */}
                <td>{item.ActionID}</td>
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
                {showBtn &&
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
                }
              </tr>
            ))}
          </tbody>
        </table>
      </DispTrans>
    </div>)



}
export default Trans