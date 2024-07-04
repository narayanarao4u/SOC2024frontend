import React from 'react'
import { useSelector } from 'react-redux';

const Home = () => {
  const acdata = useSelector(state => state.acdata.data);
  const SelectedAC = useSelector(state => state.acdata.selected);
  return (
    <div>
      <div>Accounts : {acdata.length}</div>
      <div> SelectedAccounts :
        <pre>
          {JSON.stringify(SelectedAC, null, 2)}
        </pre>
      </div>
    </div>


  )
}

export default Home