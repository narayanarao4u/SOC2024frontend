import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchACs, createAC, updateAC, deleteAC } from '../redux/accountSlice';
import moment from 'moment'
import DisplayData from './common/DisplayData';

const ACData = () => {
  const dispatch = useDispatch();
  const acdata = useSelector(state => state.acdata.data);
  const status = useSelector(state => state.acdata.status);
  const error = useSelector(state => state.acdata.error);


  const baseURL = import.meta.env.VITE_APP_BASE_URL;
  const url = `${baseURL}/api/account`;

  const editPost = useSelector(state => state.acdata.selected);
  const [searchText, setSearchText] = useState('');

  const [data, setData] = useState([]);

  const frm = useRef(null);

  useEffect(() => {
    if (url && status === 'idle') {
      dispatch(fetchACs(url));
    }

  }, [url, status, dispatch]);

  useEffect(() => {
    if (acdata) {
      setData(acdata);
    }
  }, [acdata]);

  //how to filter the data 



  const handleSubmit = (e) => {
    e.preventDefault();
    let frm = new FormData(e.target);
    let frmdata = Object.fromEntries(frm);
    console.log('frmdata', frmdata);


    if (frmdata.id) {
      dispatch(updateAC({ url, id: frmdata.id, data: frmdata }));
      // setEditPost(null);
    } else {
      dispatch(createAC({ url, data: frmdata }));
      // setEditPost(null);
    }

    dispatch({ type: 'acdata/selectAC', payload: null });
    e.target.reset();

  };

  const handleEdit = (post) => {
    frm.current.reset();
    dispatch({ type: 'acdata/selectAC', payload: post });
  };

  const handleDelete = (id) => {
    dispatch(deletePost({ url, id }));
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    let filterData = acdata.filter(post => post['name'].includes(e.target.value));
    console.log(filterData);
    // setFilterData(filterData);

    dispatch({ type: 'posts/filterPosts', payload: filterData });

  }

  function filterFun(post, searchText = "") {
    return post.ACNO && post.ACNO.toLowerCase().includes(searchText.toLowerCase()) ||
      post.AC_Sub && post.AC_Sub.toLowerCase().includes(searchText.toLowerCase())
  }

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className='px-4'>
      <div>
        <label htmlFor="search">Search</label>
        <input type="text" value={searchText}
          placeholder="Enter name to search"
          onChange={(e) => handleSearch(e)} />
      </div>



      <div>
        <form onSubmit={handleSubmit} ref={frm}>
          <input type="hidden" name="id" defaultValue={editPost?.id} />

          <label htmlFor="Name">Name</label>
          <input type="text" name="name" id="name" defaultValue={editPost?.name} required />

          <label htmlFor="degn">Designation</label>
          <input type="text" name="desgn" id="desgn" defaultValue={editPost?.desgn} required />

          {/* <input type="date" name='DOB' placeholder="Enter DOB" 
            defaultValue={moment(editPost?.DOB).format('YYYY-MM-DD')} /> */}
          {/* <input type="text" name='desgn' placeholder="desgn" defaultValue={editPost?.desgn} /> */}
          <button type="submit"> {editPost ? 'Update' : 'Create'} </button>
          <button onClick={() => setEditPost(null)} type='reset' > Cancel</button>


        </form>
      </div>



      <h2>Account Details</h2>
      <DisplayData data={data}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        filterFun={filterFun}
        dispcols={['id', 'AC', 'No', 'DOC', 'MemID', 'Amount']}
        cols={['id', 'AC_Sub', 'ACNO', 'DOC', 'MEMID', 'Amt']}
      />

      {/* <pre>{JSON.stringify(data[1], null, 2)}</pre> */}


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


export default ACData;