import React from 'react';
import { SiTarget } from 'react-icons/si'; // Using a placeholder icon

type HeaderProps = {
  onLogoClick: () => void;
};

const Header = ({ onLogoClick }: HeaderProps) => {
  return (
    <header className="py-4 px-6 md:px-12 flex justify-between items-center bg-brand-bg/50 backdrop-blur-sm sticky top-0 z-50">
      <div 
        className="text-3xl font-bold tracking-wider text-white cursor-pointer flex items-center gap-2"
        onClick={onLogoClick}
      >
        <SiTarget className="text-brand-gold"/>
        Pavitra<span className="text-brand-gold">Gyaan</span>
      </div>
      <button className="px-6 py-2 border border-brand-gold rounded-full text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 font-semibold">
        Login
      </button>
    </header>
  );
};

export default Header;
