import { useEffect, useState } from "react";
import styled from 'styled-components';
import ReactPaginate from "react-paginate"; // for pagination
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons"; // for customizing icons
import { dtFields } from "../../services/common";
import moment from 'moment'
import { useSelector } from "react-redux";
import { FaEdit, FaTrashAlt } from "react-icons/fa";



const DisplayData = ({ data, handleDelete, handleEdit, cols, dispcols, filterFun, showActionBtn = true }) => {
  const [pageCount, setPageCount] = useState();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [dispData, setData] = useState([]);

  const members = useSelector(state => state.memdata.members);

  useEffect(() => {
    if (data) {
      setData(data);
    }

    let filterData = data.filter((p) => filterFun(p, searchText))
    let pgcount = 0

    if (filterData.length > 0) {
      pgcount = Math.ceil(filterData.length / itemsPerPage)
      filterData = filterData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    }
    else {
      pgcount = Math.ceil(data.length / itemsPerPage)
      // setPageCount(Math.ceil(data.length / itemsPerPage));
    }

    setPageCount(pgcount);
    setData(filterData);

  }, [data, searchText, page, itemsPerPage]);


  return (
    <>

      <div>
        <label htmlFor="search">Search</label>
        <input type="text" value={searchText}
          placeholder="Enter name to search"
          onChange={(e) => setSearchText(e.target.value)} />
        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value)} >
          <option value="10" >10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        {dispData.length}---{pageCount}---{data.length}
      </div>
      <DispdataStyle>
        {dispcols.map((x, index) => (<div key={index} className='head'>{x}</div>))}
        {showActionBtn && <div className='head'>Action</div>}

      </DispdataStyle>


      {dispData.map(x => (
        <DispdataStyle key={x.id} onClick={(() => (showActionBtn == false) && handleEdit(x))} >

          {cols.map((f, index) => {
            if (f === 'MEMID') {

              let mem = members.find(m => m.id === x[f])

              return <div key={index}>{mem?.name}</div>
            }

            return (<div key={index}>
              {dtFields.includes(f) ? moment(x[f]).format('DD-MM-YYYY') : x[f]}
            </div>)

          })}


          {showActionBtn &&
            <div>

              <button onClick={() => handleEdit(x)} className="bg-blue-500 mx-2 text-white">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(x.id)} className="bg-red-500 text-white">
                <FaTrashAlt />
              </button>
            </div>
          }

        </DispdataStyle>
      ))}



      <ReactPaginate
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        activeClassName={"active"}
        pageRangeDisplayed={3}
        onPageChange={(event) => setPage(event.selected)}
        pageCount={pageCount}
        breakLabel="..."
        previousLabel={
          <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
            <AiFillLeftCircle />
          </IconContext.Provider>
        }
        nextLabel={
          <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
            <AiFillRightCircle />
          </IconContext.Provider>
        }
      />

      {/* <pre>{JSON.stringify(data[1], null, 2)}</pre> */}

    </>
  )
}

const DispdataStyle = styled.div`
  display: flex;
  gap: 2px;
  position: relative;
  margin-bottom: 5px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;  
  }

  div {
    flex: 1;    
    
  }

  .head {
    font-weight: bold;
    background-color: gray;
    padding: 2px 5px;
    color: white;
    position: sticky;
    top: 0; 
  }
`;

export default DisplayData;