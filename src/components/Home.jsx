import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components'
import { fetchTransDescs } from '../redux/transDescSlice';
import { fetchPosts } from '../redux/memdataSlice';
import { fetchACs } from '../redux/accountSlice';

const Home = () => {
  const dispatch = useDispatch();
  const acdata = useSelector(state => state.acdata);
  // const SelectedAC = useSelector(state => state.acdata.selected);

  const members = useSelector(state => state.memdata);

  const transDesc = useSelector(state => state.transDesc);



  const baseURL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    dispatch(fetchTransDescs(`${baseURL}/api/transdesc`));
    dispatch(fetchPosts(`${baseURL}/api/member`));
    dispatch(fetchACs(`${baseURL}/api/account`));
  }, [])

  return (
    <Card>

      {
        members && (
          <section>
            <h3>Members</h3>
            <div>Total Members : {members.members && members?.members.length}</div>
            <div>Selected Member : {members.selected?.name}</div>
          </section>
        )
      }

      {members && (
        <section>
          <h3>Accounts</h3>
          <div>Total Accounts : {acdata.data && acdata?.data.length}</div>
          <div>Selected Member : {acdata.selected?.mem_tb.name}</div>
        </section>
      )}


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
