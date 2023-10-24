
import React from "react";

const StartView = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to JakSec</h1>
      <div className="flex flex-col items-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl mb-4">
          Student
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
          Teacher
        </button>
      </div>
    </div>
  );
};

export default StartView;
