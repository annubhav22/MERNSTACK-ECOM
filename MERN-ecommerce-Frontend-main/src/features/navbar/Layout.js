import React from 'react';
import NavBar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <NavBar>
      <Outlet />
    </NavBar>
  );
};

export default Layout;
