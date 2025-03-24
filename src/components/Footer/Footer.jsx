import React from 'react';
import SocialLinks from './SocialLinks';
import ContactInfo from './ContactInfo';

const Footer = () => {
  return (
    <footer className="bg-blue-500 text-white py-6">
      <div className="container mx-auto text-center">
        <h2 className="text-lg font-semibold">Watch Store</h2>
        <p className="mt-2">Your one-stop shop for stylish watches.</p>
        <SocialLinks />
        <ContactInfo />
        <p className="mt-4">© {new Date().getFullYear()} Watch Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;