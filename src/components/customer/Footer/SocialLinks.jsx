import React from 'react';

const SocialLinks = () => {
  return (
    <div className="flex justify-center space-x-4">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <img src="/assets/images/facebook.svg" alt="Facebook" className="w-6 h-6" />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <img src="/assets/images/instagram.svg" alt="Instagram" className="w-6 h-6" />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <img src="/assets/images/twitter.svg" alt="Twitter" className="w-6 h-6" />
      </a>
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
        <img src="/assets/images/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
      </a>
    </div>
  );
};

export default SocialLinks;