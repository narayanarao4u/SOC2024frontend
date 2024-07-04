import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, createPost, updatePost, deletePost } from '../redux/memdataSlice';
import moment from 'moment'

const MemberData = () => {
  const dispatch = useDispatch();
  const memdata = useSelector(state => state.memdata.data);
  const status = useSelector(state => state.memdata.status);
  const error = useSelector(state => state.memdata.error);

  const url = `http://localhost:3005/api/member`;
  // const [editPost, setEditPost] = useState(null);
  const editPost = useSelector(state => state.memdata.selected);
  const [searchText, setSearchText] = useState('');

  const [data, setData] = useState([]);

  const frm = useRef(null);

  useEffect(() => {
    if (url && status === 'idle') {
      dispatch(fetchPosts(url));
    }
  }, [url, status, dispatch]);

  useEffect(() => {
    if (memdata) {
      setData(memdata);
    }
  }, [memdata]);

  //how to filter the data 



  const handleSubmit = (e) => {
    e.preventDefault();
    let frm = new FormData(e.target);
    let frmdata = Object.fromEntries(frm);
    console.log('frmdata', frmdata);

    if (frmdata.id) {
      dispatch(updatePost({ url, id: frmdata.id, data: frmdata }));
      // setEditPost(null);
    } else {
      dispatch(createPost({ url, data: frmdata }));
      // setEditPost(null);
    }

    dispatch({ type: 'memdata/selectPost', payload: null });
    e.target.reset();

  };

  const handleEdit = (post) => {
    frm.current.reset();
    dispatch({ type: 'memdata/selectPost', payload: post });
  };

  const handleDelete = (id) => {
    dispatch(deletePost({ url, id }));
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    let filterData = memdata.filter(post => post['name'].includes(e.target.value));
    console.log(filterData);
    // setFilterData(filterData);

    dispatch({ type: 'posts/filterPosts', payload: filterData });

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
          <label> {editPost?.id} </label>
          <CustomInput disp="Designation" name="desgn" defval={editPost?.desgn} />
          <CustomInput disp="Employe Name" name="desgn" defval={editPost?.name} />
          <input type="date" name='DOB' placeholder="Enter DOB" 
            defaultValue={moment(editPost?.DOB).format('YYYY-MM-DD')} />
          {/* <input type="text" name='desgn' placeholder="desgn" defaultValue={editPost?.desgn} /> */}
          <button type="submit"> {editPost ? 'Update' : 'Create'} </button>
          <button onClick={() => setEditPost(null)} type='reset' > Cancel</button>


        </form>
      </div>



      <h2>Posts</h2>
      {data.map(x => (
        <div key={x.id} className='grid grid-cols-5 gap-2'>
          <div>{x.name}</div>
          <div>{x.desgn}</div>
          <div>{moment(x.DOB).format('DD-MM-YYYY')}</div>  
          <button onClick={() => handleEdit(x)}>Edit</button>
          <button onClick={() => handleDelete(x.id)}>Delete</button>
        </div>
      ))}
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