import React from "react";
interface MainButtonProps {
  text: string;
  onClick: () => void;
}

const MainButton: React.FC<MainButtonProps> = ({ text, onClick }) => {
  return (
    <>
      <button
        className="bg-sky-500 mt-8 w-full font-semibold text-white py-4 px-4 rounded"
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};

export default MainButton;
