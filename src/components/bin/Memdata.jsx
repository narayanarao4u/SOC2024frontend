import React from 'react'
import Select from 'react-select';
import MemDataService from '../../services/MemDataService'
import EMPComponent from './EMPComponent';
import ItemsComponent from './ItemsComponent';


function Memdata() {
  const [memID, setMemID] = React.useState(439)
  const [PID, setPID] = React.useState(20)

  const [data, setData] = React.useState([])

  const ds = new MemDataService()
  const getMemdata = async () => {
    const res = await ds.get()
    let optiondata = res.map((item) => ({ value: `${item.Name}`, label: <MemLabel data={item} /> })) /*  `${item.Name}` */
    setData(optiondata)
  }


  React.useEffect(() => {
    getMemdata()
  }, [])



  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      const currentTabIndex = event.target.tabIndex;
      const nextInput = event.target.form.elements[currentTabIndex];

      if (nextInput) {
        nextInput.focus();
      } else {
        // Handle no next control available (e.g., submit the form)
        console.log('No next control available, submitting form...');
        event.target.form.submit();
      }
    }
  }

  return (
    <>
      <div>Memdata</div>

      <form onSubmit={(e) => { e.preventDefault() }}>
        <label htmlFor="">GNO</label>
        <input type="text" tabIndex="2" onKeyDown={handleKeyDown}
          value={memID}
          onChange={(e) => {
            setMemID(+e.target.value)
          }} />
        <EMPComponent tabindex={1} MEMID={memID} tabIndex="1" setMemID={setMemID} />

        <input type="text" tabIndex="3" onKeyDown={handleKeyDown} />
        <ItemsComponent tabindex={4} PID={PID} tabIndex="4" setPID={setPID} />

        <input type="text" tabIndex="5" onKeyDown={handleKeyDown} />
        <button type="submit" tabIndex="6">Submit</button>
      </form>



    </>

  )
}

function MemLabel({ data }) {

  return (
    <div className='grid grid-cols-2'>
      <div>{data.Name}</div>
      <div>{data.Genlno}</div>
    </div>

  )
}

export default Memdata