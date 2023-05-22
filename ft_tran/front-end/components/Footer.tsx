import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const yourName = 'Mohamed haddaoui';

  return (
    <footer className="bg-gray-800 bg-gradient-to-r from-blue-500 to-green-400 text-white p-4 mt-auto">
      <div className="container mx-auto flex justify-center">
        <p className="text-sm">
          &copy; {currentYear} {yourName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

