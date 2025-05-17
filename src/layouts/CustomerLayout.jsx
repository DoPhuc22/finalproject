import React from 'react';
import Header from '../components/customer/Header/Header';
import Footer from '../components/customer/Footer/Footer';

const CustomerLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow mb-12">{children}</main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;