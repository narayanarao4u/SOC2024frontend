import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components'
import { fetchTransDescs } from '../redux/transdeescSlice';

const Home = () => {
  const dispatch = useDispatch();
  const acdata = useSelector(state => state.acdata);
  // const SelectedAC = useSelector(state => state.acdata.selected);

  const members = useSelector(state => state.memdata);

  const transDesc = useSelector(state => state.transDesc);

  const baseURL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    dispatch(fetchTransDescs(`${baseURL}/api/transdesc`));
  }, [])

  return (
    <Card>
      <section>
        <pre>
          {JSON.stringify(members, null, 2)}
        </pre>

      </section>

      <section>
        {/* <div>Accounts : {acdata.data.length}</div>
        <div> SelectedAccounts : {acdata.SelectedAC?.id} </div> */}

        <pre>
          {JSON.stringify(members, null, 2)}
        </pre>
      </section>

      <section>
        {/* <div>Accounts : {transDesc.transdesc ? transDesc.transdesc.length : 0}</div> */}
        <div>transDesc : {transDesc.transdesc.length}</div>
        <div>status : {transDesc.status}</div>
        <div>error : {transDesc.error}</div>
        {/* {JSON.stringify(transDesc, null, 2)} */}
      </section>

    </Card>


  )
}

const Card = styled.div`
display: flex;
 gap:10px;
 font-size:1.5em;
 color:white;

section {  
background-color: #3d3c3c;
border-radius: 10px;
padding: 20px;
margin-bottom: 20px;
box-shadow:5px 5px 10px gray;

  div{ 
    margin: 10px 0;
  }
}
`


export default Home
