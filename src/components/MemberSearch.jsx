import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/memdataSlice';


import DisplayData from './common/DisplayData.jsx';

const MemberSearch = ({ handleEdit, handleDelete }) => {
  const dispatch = useDispatch();
  const memdata = useSelector(state => state.memdata.members);
  const status = useSelector(state => state.memdata.status);
  const error = useSelector(state => state.memdata.error);


  const baseURL = import.meta.env.VITE_APP_BASE_URL;
  const url = `${baseURL}/api/member`;

  const frm = useRef(null);

  useEffect(() => {
    if (url && status === 'idle') {
      dispatch(fetchPosts(url));
    }


  }, [url, status, dispatch]);



  //how to filter the data 






  function filterFun(post, searchText = "") {
    let result = post.name && post.name.toLowerCase().includes(searchText.toLowerCase())
    return result
  }

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className='px-4'>
      <h2>Member Data</h2>


      <DisplayData data={memdata}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        filterFun={filterFun}
        dispcols={['GNO', 'Name', 'Designation', 'DOB', 'DOA']}
        cols={['gno', 'name', 'desgn', 'DOB', 'DOA']}
      />


      ;
    </div>
  );
};



export default MemberSearch;