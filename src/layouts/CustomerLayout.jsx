import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/customer/Header/Header';
import Footer from '../components/customer/Footer/Footer';

const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;