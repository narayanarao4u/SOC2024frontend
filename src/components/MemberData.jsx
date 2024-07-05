import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, createPost, updatePost, deletePost } from '../redux/memdataSlice';

import ReactPaginate from "react-paginate"; // for pagination
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons"; // for customizing icons

import moment from 'moment'
import styled from 'styled-components';
import Portal1 from '../utilities/Portal1';

import { dtFields   } from '../services/common.js';

const MemberData = () => {
  const dispatch = useDispatch();
  const memdata = useSelector(state => state.memdata.data);
  const status = useSelector(state => state.memdata.status);
  const error = useSelector(state => state.memdata.error);
  const [data, setData] = useState([]);

  const url = `http://localhost:3005/api/member`;
  // const [editPost, setEditPost] = useState(null);
  const editPost = useSelector(state => state.memdata.selected);
 

 

  const [isOpen, setIsopen] = useState(false)
  const onClose = () => setIsopen(false)




  const frm = useRef(null);

  useEffect(() => {
    if (url && status === 'idle') {
      dispatch(fetchPosts(url));
    }
  
    setData(memdata);
  }, [url, status, dispatch]);



  //how to filter the data 



  const handleSubmit = (e) => {
    e.preventDefault();
    let frm = new FormData(e.target);
    let frmdata = Object.fromEntries(frm);

    Object.keys(frmdata).forEach((key ) => {
     
      if( dtFields.includes(key) ) frmdata[key] =new Date((frmdata[key]));
    })
    

    if (frmdata.id) {
      dispatch(updatePost({ url, id: frmdata.id, data: frmdata }));
      // setEditPost(null);
    } else {
      dispatch(createPost({ url, data: frmdata }));
      // setEditPost(null);
    }

    dispatch({ type: 'memdata/selectPost', payload: null });
    e.target.reset();
    setIsopen(false);

  };

  const handleEdit = (post) => {
    setIsopen(true)
    // frm.current.reset();
    dispatch({ type: 'memdata/selectPost', payload: post });
  };

  const handleDelete = (id) => {
    dispatch(deletePost({ url, id }));
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className='px-4'>
      <h2>Member Data</h2>
 


      <Portal1 isOpen={isOpen} onClose={onClose} >
        <form onSubmit={handleSubmit} ref={frm} className='grid grid-cols-2 gap-1'>
          <label> ID </label>
          <input type="text" name="id" defaultValue={editPost?.id} readOnly />
          <CustomInput disp="Employe Name" name="name" defval={editPost?.name} />
          <CustomInput disp="Designation" name="desgn" defval={editPost?.desgn} />

          <CustomInput disp="DOB" type="date" name="DOB" defval={moment(editPost?.DOB).format('YYYY-MM-DD')} />
          <CustomInput disp="DOA" type="date" name="DOA" defval={moment(editPost?.DOA).format('YYYY-MM-DD')} />
          <button type="submit" className='bg-green-400'>
            {editPost?.id ? 'Update' : 'Create'}
          </button>
          <button onClick={() => setEditPost(null)}
            type='reset'
            className='bg-red-400' > Cancel</button>
        </form>

      </Portal1>



      <DisplayData data={memdata} 
        handleDelete={handleDelete} 
        handleEdit={handleEdit} 
        dispcols={['Name', 'Designation', 'DOB', 'DOA']}
        cols = {['name', 'desgn', 'DOB', 'DOA']}
        />


      ;
    </div>
  );
};

export function CustomInput({ disp, name, type = "text", defval = null }) {
  return (
    <>
      <label htmlFor={name}>{disp} :</label>
      <input type={type} name={name} id={name} defaultValue={defval} />
    </>
  );
}

const DisplayData = ({  data, handleDelete, handleEdit, cols ,dispcols }) => {
  const [pageCount, setPageCount] = useState();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [dispData, setData] = useState([]);



  useEffect(() => {
    if (data) {
      setData(data);
    }
    let filterData = data.filter(post => {
      return post.name && post.name.toLowerCase().includes(searchText.toLowerCase())
    });


    if (filterData) {
      setPageCount(Math.ceil(filterData.length / itemsPerPage));
    }
    else {
      setPageCount(Math.ceil(data.length / itemsPerPage));
    }

    filterData = filterData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    setData(filterData);

  }, [data, searchText, page, itemsPerPage]);
   

  return (
    <>

      <div>
        <label htmlFor="search">Search</label>
        <input type="text" value={searchText}
          placeholder="Enter name to search"
          onChange={(e) => setSearchText(e.target.value)} />
        {dispData.length}---{pageCount}
      </div>
      <DispdataStyle>
        {dispcols.map((x, index) => (<div key={index} className='head'>{x}</div>))}
      </DispdataStyle>


      {dispData.map(x => (
        <DispdataStyle key={x.id} >

           {cols.map((f, index) => (
                <div key={index}>{ dtFields.includes(f) ? moment(x[f]).format('DD-MM-YYYY') : x[f]}</div>
                
                ))}
          <div>
           
            <button onClick={() => handleEdit(x)}>Edit</button>
            <button onClick={() => handleDelete(x.id)}>Delete</button>
          </div>

        </DispdataStyle>
      ))}



      <ReactPaginate
        containerClassName={"pagination"}
        pageClassName={"page-item"}
        activeClassName={"active"}
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

export default MemberData;