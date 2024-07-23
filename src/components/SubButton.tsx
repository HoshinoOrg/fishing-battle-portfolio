import React from "react";
interface MainButtonProps {
  text: string;
  onClick: () => void;
}

const MainButton: React.FC<MainButtonProps> = ({ text, onClick }) => {
  return (
    <>
      <button
        className="border border-sky-300 mt-4 rounded w-full py-4 text-sky-500 font-semibold"
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};

export default MainButton;
