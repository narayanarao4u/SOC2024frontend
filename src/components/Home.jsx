import React from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components'

const Home = () => {
  const acdata = useSelector(state => state.acdata.data);
  const SelectedAC = useSelector(state => state.acdata.selected);

  const memdata = useSelector(state => state.memdata.data);
  return (
    <Card>
      <section>
        <div> Members : {memdata.length} </div>
        <div> SelectedMember : {SelectedAC?.id} </div>
      </section>
      <section>
        <div>Accounts : {acdata.length}</div>
        <div> SelectedAccounts : {SelectedAC?.id} </div>
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