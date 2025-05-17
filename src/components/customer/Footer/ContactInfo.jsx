import React from 'react';

const ContactInfo = () => {
  return (
    <div className="bg-gray-800 text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <p className="mb-2">📞 Phone: (123) 456-7890</p>
      <p className="mb-2">📧 Email: support@watchstore.com</p>
      <p className="mb-2">🏢 Address: 123 Watch St, Time City, TC 12345</p>
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Follow Us</h3>
        <ul className="flex space-x-4">
          <li>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Facebook</a>
          </li>
          <li>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:underline">Instagram</a>
          </li>
          <li>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Twitter</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactInfo;