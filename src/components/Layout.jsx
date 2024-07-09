import React, { lazy, Suspense, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet, Route, Routes } from 'react-router-dom';
import Home from './Home';
import MemberData from './MemberData';
import ACData from './ACData';
import Trans from './Trans';
import { useDispatch } from 'react-redux';
import { fetchTransDescs } from '../redux/transDescSlice';

// const MemberData = lazy(() => import('./MemberData'));
// const ACData = lazy(() => import('./ACData'));

function Layout() {
  const dispatch = useDispatch()
  const baseURL = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    dispatch(fetchTransDescs(`${baseURL}/api/transdesc`));
  }, [dispatch])

  return (
    <>
      <Routes>
        <Route element={<RouterLayout />} >
          <Route index path="/" element={<Home />} />
          <Route path="/members" element={<MemberData />} />
          <Route path="/accounts" element={<ACData />} />
          <Route path="/trans" element={<Trans />} />
          <Route path="/trans/:transby/:id" element={<Trans />} />

          {/* <Route path="/accounts" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ACData />
              </Suspense>} /> */}
        </Route>
      </Routes>

    </>
  )
}
const RouterLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-200">

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
