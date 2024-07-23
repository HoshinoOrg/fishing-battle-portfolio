import React from "react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-sky-500 p-5 text-center border-b border-gray-300">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
    </header>
  );
};

export default Header;
