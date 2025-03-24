import React from 'react';
import CheckoutForm from '../components/Cart/CheckoutForm';
import MainLayout from '../layouts/MainLayout';

const CheckoutPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <CheckoutForm />
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;