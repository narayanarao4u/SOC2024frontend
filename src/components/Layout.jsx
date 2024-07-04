import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet, Route, Routes } from 'react-router-dom';
import Home from './Home';
import MemberData from './MemberData';
import  ACData from './ACData';

function Layout() {
  return (
    <>
      <Routes>
        <Route element={<RouterLayout />} >
          <Route index path="/" element={<Home />} />
          <Route path="/members" element={<MemberData />} />
          <Route path="/accounts" element={<ACData />} />
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
