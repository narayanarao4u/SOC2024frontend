import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, createPost, updatePost, deletePost } from '../redux/memdataSlice';


import moment from 'moment'

import Portal1 from '../utilities/Portal1';

import { dtFields   } from '../services/common.js';
import DisplayData from './common/DisplayData.jsx';

const MemberData = () => {
  const dispatch = useDispatch();
  const memdata = useSelector(state => state.memdata.members);
  const status = useSelector(state => state.memdata.status);
  const error = useSelector(state => state.memdata.error);
  const [data, setData] = useState([]);

  const baseURL = import.meta.env.VITE_APP_BASE_URL;
  const url = `${baseURL}/api/member`;
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
        dispcols={['GNO', 'Name', 'Designation', 'DOB', 'DOA']}
        cols =   {['gno', 'name', 'desgn', 'DOB', 'DOA']}
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


export default MemberData;