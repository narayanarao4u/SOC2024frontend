import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchACs, createAC, updateAC, deleteAC } from '../redux/accountSlice';
import moment from 'moment'
import DisplayData from './common/DisplayData';
import _ from 'lodash';
import Select from "react-select";
import styled from 'styled-components';
import MemberSearch from './MemberSearch';
import Portal1 from '../utilities/Portal1';
import { ToastContainer, toast } from 'react-toastify';


const ACData = () => {
  const dispatch = useDispatch();
  const acdata = useSelector(state => state.acdata.data);
  const status = useSelector(state => state.acdata.status);
  const error = useSelector(state => state.acdata.error);

  const transDesc = useSelector(state => state.transDesc);
  const ACSUB = ['LT', 'THRIFT', 'SHARE', 'BANK', 'CASH']
  // const ACTYPE = _.uniqBy(transDesc.transdesc, 'AC_type')




  const baseURL = import.meta.env.VITE_APP_BASE_URL;
  const url = `${baseURL}/api/account`;

  const editPost = useSelector(state => state.acdata.selected);
  // const [editPost, setEditPost] = useState(null);


  const [isOpen, setIsopen] = useState(false)
  const onClose = () => setIsopen(false)

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

    delete frmdata.name
    delete frmdata.desgn
    delete frmdata.gno



    frmdata.DOC = new Date(frmdata.DOC)
    frmdata.Amt = +frmdata.Amt
    frmdata.MEMID = +frmdata.MEMID

    console.log(frmdata);

    if (frmdata.MEMID <= 0) {
      toast.error('Please Select Member')
      return
    }

    if (!ACSUB.includes(frmdata.AC_Sub)) {
      toast.error('Please Select AC_Sub')
      return
    }

    if (frmdata.id) {
      dispatch(updateAC({ url, id: frmdata.id, data: frmdata }));
      // setEditPost(null);
    } else {
      delete frmdata.id
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



  function filterFun(post, searchText = "") {
    const hasACNO = (_.get(post, 'ACNO', '') || '').toLowerCase().includes(searchText.toLowerCase());
    const hasACSub = (_.get(post, 'AC_Sub', '') || '').toLowerCase().includes(searchText.toLowerCase());
    const hasACtype = (_.get(post, 'AC_type', '') || '').toLowerCase().includes(searchText.toLowerCase());
    const hasMemTbName = (_.get(post, 'mem_tb.name', '') || '').toLowerCase().includes(searchText.toLowerCase());

    return hasACNO || hasACSub || hasMemTbName || hasACtype;

  }

  const rowSelect = (post) => {

    frm.current.MEMID.value = post.id;
    frm.current.name.value = post.name;
    frm.current.desgn.value = post.desgn;
    frm.current.gno.value = post.gno;

    setIsopen(false);
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div className='px-4'>

      <div>
        <form onSubmit={handleSubmit} ref={frm}>
          <input type="hidden" name="id" defaultValue={editPost?.id} />

          <ACEdit>
            <CustomInput disp="MEMID" name="MEMID" defval={editPost?.MEMID} readOnly={true}
              onClick={() => { setIsopen(true) }} type="number" required min={1} />
            <CustomInput disp="GNO" name="gno" defval={editPost?.mem_tb?.gno} readOnly={true} />
            <CustomInput disp="Name" name="name" defval={editPost?.mem_tb?.name} readOnly={true} />
            <CustomInput disp="Desgn" name="desgn" defval={editPost?.mem_tb?.desgn} readOnly={true} />


          </ACEdit>


          <ACEdit>
            <CustomInput disp="AC_Sub" name="AC_Sub" defval={editPost?.AC_Sub} list="ACSUB" />
            <datalist id="ACSUB" required>
              {ACSUB.map((p, i) => <option key={i} value={p} />)}


            </datalist>


            <CustomInput disp="ACNO" name="ACNO" defval={editPost?.ACNO} required />

            <CustomInput disp="Amount" name="Amt" defval={editPost?.Amt} type="number" required />
            <CustomInput disp="DOC" name="DOC" type="Date" defval={moment(editPost?.DOC).format('YYYY-MM-DD')} required />
          </ACEdit>

          <button type="submit" className='btn'> {editPost ? 'Update' : 'Create'} </button>
          <button onClick={(e) => {
            dispatch({ type: 'acdata/selectAC', payload: null });
            frm.current.reset();

          }} type='reset' className='m-1 btn bg-red-500'> Cancel</button>
          <span>({editPost?.id})</span>


        </form>
      </div>

      <h2>Account Details</h2>
      <DisplayData data={data}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        filterFun={filterFun}
        dispcols={['id', 'AC Type', 'AC', 'No', 'DOC', 'MemID', 'Amount']}
        cols={['id', 'AC_type', 'AC_Sub', 'ACNO', 'DOC', 'MEMID', 'Amt']}
      />

      {/* <pre>{JSON.stringify(data[1], null, 2)}</pre> */}
      <Portal1 isOpen={isOpen} onClose={onClose}>
        <MemberSearch showActionBtn={false} handleEdit={rowSelect} />
      </Portal1>
      <ToastContainer />
    </div>
  );
};

const ACEdit = styled.section`
  display: grid;
  grid-template-columns:   repeat(4, 1fr 2fr) ;
`;
function CustomInput(props) {
  const { disp, name, type = "text", defval = null, ...rest } = props;
  return (
    <>
      <label htmlFor={name}>{disp} :</label>
      <input type={type} name={name} id={name} defaultValue={defval} {...rest} />
    </>
  );
}


export default ACData;