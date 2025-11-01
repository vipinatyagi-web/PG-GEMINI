import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center py-6 border-t border-white/10 text-brand-gray">
      <p>© {new Date().getFullYear()} Pavitra Gyaan — Indian Hinglish • AI + Google API</p>
      <p className="text-sm mt-1">Made with ❤️ for modern believers.</p>
    </footer>
  );
};

export default Footer;
