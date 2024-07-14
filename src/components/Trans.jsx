import React, { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchTrans, createTrans, updateTrans, deleteTrans } from '../redux/transSlice'

import { ToastContainer, toast } from 'react-toastify';

import styled from 'styled-components'
import moment from 'moment'
import _ from 'lodash';
import { fetchACs } from '../redux/accountSlice'
import FetchClient from '../utilities/FetchClient'
import { FaEdit, FaMoneyBill, FaPenAlt, FaSave, FaSearch } from 'react-icons/fa'

import EMPComponent from './bin/EMPComponent'
import AC_Combo from './bin/AC_Combo'
import { dtFields } from '../services/common';

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
  "Remarks": null,
  "CB_side": "R"
}
function Trans() {
  // const params = new URLSearchParams(window.location.search)
  const params = useParams()
  // const id = params.get('id')
  const dispatch = useDispatch()
  const trans = useSelector(state => state.trans)
  const transDesc = useSelector(state => state.transDesc.transdesc)
  const baseURL = import.meta.env.VITE_APP_BASE_URL;

  const [actionid, setActionid] = useState(params.id)

  const [cr, setCr] = useState(newTrans)
  const [pr, setPr] = useState({})

  const [memID, setMemID] = useState(0)
  const [ACID, setACID] = useState(0)
  const [AC, setAC] = useState()
  const [ACTrans, setACTrans] = useState()
  const [transSummary, setTransSummary] = useState({
    Cash_R: 0, Cash_P: 0, Chq_R: 0, Chq_P: 0, Adj_R: 0, Adj_P: 0, receipts: 0, payments: 0
  })

  useEffect(() => {
    console.log('trans Loaded');
    // dispatch(fetchTrans(`${baseURL}/api/trans/${params.transby}/${params.id}`))
    return () => {

      console.log('trans Unloaded');
    }
  }, [])



  useEffect(() => {

    try {

      let Cash_R = _.sumBy(trans.data, i => {
        if (i.CB_side === 'R') return i.Cash_amt
      })

      let Cash_P = _.sumBy(trans.data, i => {
        if (i.CB_side === 'P') return i.Cash_amt
      })


      let Chq_R = _.sumBy(trans.data, i => {
        if (i.CB_side === 'R') return i.Chq_amt
      })

      let Chq_P = _.sumBy(trans.data, i => {
        if (i.CB_side === 'P') return i.Chq_amt
      })

      let Adj_R = _.sumBy(trans.data, i => {
        if (i.CB_side === 'R') return i.Adj_amt
      })

      let Adj_P = _.sumBy(trans.data, i => {
        if (i.CB_side === 'P') return i.Adj_amt
      })

      let receipts = Cash_R + Chq_R + Adj_R
      let payments = Cash_P + Chq_P + Adj_P

      setTransSummary({ Cash_R, Cash_P, Chq_R, Chq_P, Adj_R, Adj_P, receipts, payments })


    } catch (error) {
      console.log(error);
    }

  }, [trans])




  useEffect(() => {
    getByACID(cr.ACID)
  }, [cr.ACID])


  useEffect(() => {
    setCr({ ...cr, Total_amt: cr.Cash_amt + cr.Adj_amt + cr.Chq_amt })
  }, [cr.Cash_amt, cr.Adj_amt, cr.Chq_amt])


  const getByACID = async (id) => {
    if (!id) return 0
    const acRes = await FetchClient.get(`${baseURL}/api/account/${id}`)

    if (acRes && acRes.length > 0) {
      setACID(acRes[0].id)
      setAC(acRes[0])

      const acTransRes = await FetchClient.get(`${baseURL}/api/trans/ACID/${id}`)
      setACTrans(acTransRes)

      if (acTransRes && acTransRes.length > 0) {
        setPr(acTransRes[0])
      }

    }

  }

  const handleTransChange = (e) => {

    if (e.target.name === 'Trans_des_ID') {

      let t = transDesc.find(item => item.id === +e.target.value)
      setCr({ ...cr, [e.target.name]: +e.target.value, CB_side: t.CB_side })
    }
    else if (e.target.name.includes('dt')) {
      setCr({ ...cr, [e.target.name]: e.target.value })
    }
    else {
      setCr({ ...cr, [e.target.name]: +e.target.value })
    }

  }



  const handleSave = (e) => {
    // e.stopPropagation();
    // e.nativeEvent.stopImmediatePropagation();
    e.preventDefault()
    if (cr.Trans_des_ID < 0) {
      toast.error('Select Transcation ');
      return;
    }


    let c = { ...cr }


    /*   let p = trans.find(item => item.ACID === c.ACID)
      if (p === undefined) p = { ...p }
      else p = { ...pr } */

    let p = trans.data.find(item => item.ACID === c.ACID) || { ...pr }
    setPr(p);



    let t = transDesc.find(item => item.id === c.Trans_des_ID)

    //#region  Row Calculation

    c.ActionID = actionid


    c.Days = moment(c.Trans_dt).diff(moment(p.Trans_dt), 'days')
    // c.INT_D = Math.min(c.Total_amt, c.INT_C);
    if (t.Post_type[2] === "C") {
      const principal = p.PRN_B;
      const rate = p.rate / 100;
      const timeInYears = c.Days / 365;
      const compoundingFrequency = 4; // Assuming interest is compounded Quterly

      c.INT_C = principal * Math.pow((1 + rate / compoundingFrequency), compoundingFrequency * timeInYears);
      c.INT_C = Math.round(c.INT_C * 100) / 100;

    } else {
      c.INT_C = Math.round(((p.PRN_B * p.rate * c.Days) / 36500), 2)
    }


    c.INT_D = c.Total_amt > (c.INT_C + p.INT_B) ? (c.INT_C + p.INT_B) : c.Total_amt;


    switch (t.Post_type.slice(0, 2)) {
      case "PC":
        c.PRN_C = (c.Total_amt - c.INT_D) > 0 ? c.Total_amt - c.INT_D : 0
        c.PRN = c.PRN_C
        c.PRN_D = 0
        // c.PRN_B = p.PRN_B + c.PRN_C - c.PRN_D;
        break;
      case "PD":
        c.PRN_D = (c.Total_amt - c.INT_D) > 0 ? c.Total_amt - c.INT_D : 0
        c.PRN = c.PRN_D
        c.PRN_C = 0
        // c.PRN_B = p.PRN_B + c.PRN_C - c.PRN_D;
        break;
      case "ID":
        c.PRN_D = 0
        c.PRN_C = 0
        // c.PRN_B = p.PRN_B + c.PRN_C - c.PRN_D;
        c.INT_D = c.Total_amt
        c.INT = c.INT_D

        break;
      case "IC":
        c.PRN_D = 0
        c.PRN_C = 0
        // c.PRN_B = p.PRN_B + c.PRN_C - c.PRN_D;
        c.INT_C = c.Total_amt
        c.INT = c.INT_C

        break;

      default:
        break;
    }
    c.INT = c.INT_D
    c.PRN_B = p.PRN_B + c.PRN_C - c.PRN_D;
    c.INT_B = p.INT_B + c.INT_C - c.INT_D;

    //#endregion




    setCr(c)
    // cr2.Trans_dt = moment(cr2.Trans_dt).format("YYYY-MM-DD HH:mm:ss")
    // cr2.CB_dt = moment(cr2.CB_dt).format("YYYY-MM-DD HH:mm:ss")

    Object.keys(c).forEach((key) => {
      if (dtFields.includes(key)) {
        // cr2[key] = new Date((cr2[key]));
        c[key] = moment(c[key]).format("YYYY-MM-DD HH:mm:ss");

      }

    })
    dispatch({ type: 'trans/addTrans', payload: c })
    setCr(newTrans);
    setACID(0)
    console.log('handleSave cliked end');

  }

  return (
    <TranContext.Provider value={{ cr, setCr, setACID, trans, transDesc, transSummary }}>
      <section className='text-xs'>


        <h3>Add Transcation</h3>
        <div>

          <div className='flex justify-between'>
            <div className='test-box'>
              AC Sub : {AC?.AC_Sub}
              <AC_Combo ACID={ACID} tabindex={1} setACID={setACID} displayColumn={'ACNO'} />
              ACNO :  {AC?.ACNO}
              Member : {AC?.mem_tb?.name}
              ||| TransID : {cr?.Trans_des_ID}
            </div>
            <div className='test-box'>

              <input type="text" placeholder='Search Batch No' value={actionid}
                onChange={(e) => setActionid(e.target.value)} />
              <button onClick={() => {
                dispatch(fetchTrans(`${baseURL}/api/trans/ActionID/${actionid}`))
              }} className='btn'>Search</button>
            </div>

          </div>

          <form action="" onSubmit={handleSave}>
            <TransStyle>
              <>
                <label>ACID</label>
                <label>Transaction</label>
                <label>Trans Date</label>
                <label>CB Date</label>
                <label>Instrument No</label>
                <label>Cash Amt</label>
                <label>cheque Amt</label>
                <label>Adjust Amt</label>
                <label>Total Amt</label>
                <div>Actions</div>

              </>

              <>
                <input type="number" name="ACID" id="ACID" value={cr?.ACID}
                  className='text-center'
                  onChange={handleTransChange}
                  onBlur={(e) => getByACID(+e.target.value)}
                  tabIndex={1}
                  min={1}
                />


                <select name="Trans_des_ID" value={cr?.Trans_des_ID}
                  onChange={handleTransChange} tabIndex={2} required min={1}>
                  <option value={-1} disabled >Select</option>
                  {AC && transDesc.filter(a => a.AC_Sub === AC.AC_Sub).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.Trans_desc}
                    </option>
                  ))}

                </select>


                <input type="date" name="Trans_dt" id="Trans_dt"
                  value={moment(cr?.Trans_dt).format('YYYY-MM-DD')} required
                  onChange={handleTransChange} tabIndex={3} />

                <input type="date" name="CB_dt" id="CB_dt" value={moment(cr?.CB_dt).format('YYYY-MM-DD')} required
                  onChange={handleTransChange} tabIndex={4} />

                <input type="text" name="I_NO" id="I_NO" value={cr?.I_NO} required
                  onChange={handleTransChange} tabIndex={5} />

                <input type="number" name="Cash_amt" id="Cash_amt" value={cr?.Cash_amt} required
                  onChange={handleTransChange} tabIndex={6} />

                <input type="number" name="Chq_amt" id="Chq_amt" value={cr?.Chq_amt} required
                  onChange={handleTransChange} tabIndex={7} />




                <input type="number" name="Adj_amt" id="Adj_amt" value={cr?.Adj_amt} required
                  onChange={handleTransChange} tabIndex={8} />


                <input type="number" name="Total_amt" id="Total_amt" value={cr?.Total_amt} required
                  onChange={handleTransChange} tabIndex={9} readOnly />
              </>
              <div>
                <button type='submit' className='btn' tabIndex={10}>
                  <FaPenAlt size={20} />
                </button>



              </div>

            </TransStyle>

            {(transSummary.Chq_P > 0) && (
              <div>

                <label htmlFor="AddCheq">Chq No</label>
                <input type="text" name="AddCheq" id="AddCheq" value={transSummary?.ChqNo}
                  onChange={e => setTransSummary({ ...transSummary, ChqNo: e.target.value })}
                  tabIndex={11} />

                <label htmlFor="AddCheq">Chq Amt</label>

                <input type="text" name="AddCheq" id="AddCheq" value={transSummary?.Chq_P}
                  onChange={e => setTransSummary({ ...transSummary, Chq_P: e.target.value })}
                  tabIndex={11} />
              </div>
            )
            }


          </form>

          {/* <AC_Combo ACID={ACID} tabindex="2" setACID={setACID} displayColumn={'AC_Sub'} /> */}
          <br />
          {/*  */}


        </div>

        <DispTranscations data={trans.data} showBtn={true} />
        <pre>
          cr_CB_side:{cr?.CB_side} |||| cr_id:{cr?.id}
          <br />
          {JSON.stringify(transSummary, null, 2)}
          <br />

        </pre>
      </section>
      {ACTrans && <DispACTranscations data={ACTrans} />}


      <ToastContainer />




    </TranContext.Provider>);

}

//#region style Components
const TransStyle = styled.section`
  display: grid;
  grid-template-columns:  75px 150px repeat(8, 100px) ;
  border: 1px solid gray;

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
}

`;


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
  text-align: right;
}

tr.selected {
  background-color: #ffe282;
  font-weight: bold;
  
}
`;
//#endregion  style Components

function DispTranscations({ data, showBtn = false }) {

  const { transDesc, cr, setCr, setACID, transSummary } = useContext(TranContext)

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




  return (
    <div>
      <DispTrans >
        <h3>Transaction</h3>
        <table>
          <colgroup>
            <col span={4} />
            <col span={4} className='bg-green-300 ' />
            <col span={4} className='bg-red-300 text-right' />
          </colgroup>
          <thead>
            <tr >
              {/* <th className='w-1'>id</th> */}
              <th className='w-1'>BatchNo</th>
              <th className='w-1'> ACID</th>
              <th>Trans_des_ID</th>
              <th>Date</th>

              <th>Cash</th>
              <th>Chq</th>
              <th>Adj</th>
              <th>Amt</th>

              <th>Cash</th>
              <th>Chq</th>
              <th>Adj</th>
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
            {data && data.map((x, i) => (
              <tr key={i}
                className={`${(cr && x.id === cr.id ? 'selected' : '')} 
                      ${x.CB_side == 'R' ? 'text-green-800' : 'text-red-800'}`}>
                {/* <td>{item.id}</td> */}
                <td>{i}-{x.ActionID}</td>
                <td>{x.ACID}</td>
                <td style={{ textAlign: 'left' }}>{x.Trans_des_ID}-{transID(x.Trans_des_ID)}</td>
                <td className='text-nowrap'>{moment(x.Trans_dt).format('DD-MM-YYYY')}</td>

                <td>{x.CB_side == 'R' ? x.Cash_amt : 0}</td>
                <td>{x.CB_side == 'R' ? x.Chq_amt : 0}</td>
                <td>{x.CB_side == 'R' ? x.Adj_amt : 0}</td>
                <td>{x.CB_side == 'R' ? x.Total_amt : 0}</td>

                <td>{x.CB_side == 'P' ? x.Cash_amt : 0}</td>
                <td>{x.CB_side == 'P' ? x.Chq_amt : 0}</td>
                <td>{x.CB_side == 'P' ? x.Adj_amt : 0}</td>
                <td>{x.CB_side == 'P' ? x.Total_amt : 0}</td>

                <td>{x.PRN}</td>
                <td>{x.INT}</td>
                <td>{x.PRN_B}</td>
                <td>{x.INT_B}</td>
                <td>{x.rate}-{x.CB_side}  </td>
                <td>{x.Days}</td>
                {showBtn &&
                  <td>
                    <button className='bg-green-500 text-white px-2 py-1'
                      onClick={() => {
                        setACID(x.ACID)
                        setCr(x)
                      }}
                    >
                      <FaEdit />
                    </button>
                  </td>
                }
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>Total</td>
              <td>{transSummary.Cash_R}</td>
              <td>{transSummary.Chq_R}</td>
              <td>{transSummary.Adj_R}</td>
              <td>{transSummary.receipts}</td>

              <td>{transSummary.Cash_P}</td>
              <td>{transSummary.Chq_P}</td>
              <td>{transSummary.Adj_P}</td>
              <td>{transSummary.payments}</td>
            </tr>
          </tfoot>
        </table>
      </DispTrans>
    </div>)



}



function DispACTranscations({ data, showBtn = false }) {

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
            {data && data.map((item, i) => (
              <tr key={i}
                className={`${(cr && item.id === cr.id ? 'selected' : '')} 
                      ${item.CB_side == 'R' ? 'text-red-800' : 'text-green-800'}`}>
                {/* <td>{item.id}</td> */}
                <td>{i}-{item.ActionID}</td>
                <td>{item.ACID}</td>
                <td style={{ textAlign: 'left' }}>{transID(item.Trans_des_ID)}</td>
                <td className='text-nowrap'>{moment(item.Trans_dt).format('DD-MM-YYYY')}</td>
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