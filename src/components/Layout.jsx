import React, { lazy, Suspense }  from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet, Route, Routes } from 'react-router-dom';
import Home from './Home';
// import MemberData from './MemberData';
// import  ACData from './ACData';

const MemberData = lazy(() => import('./MemberData'));
const ACData = lazy(() => import('./ACData'));

function Layout() {
  return (
    <>
      <Routes>
        <Route element={<RouterLayout />} >
          <Route index path="/" element={<Home />} />
          <Route path="/members" element={
              <Suspense fallback={<div>Loading...</div>}>
                <MemberData />
              </Suspense>} />
          <Route path="/accounts" element={
              <Suspense fallback={<div>Loading...</div>}>
                <ACData />
              </Suspense>} />
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
