import React, { useState } from "react";

const Navbar = () => {
 

  return (
    <nav className="bg-neutral-900   shadow-md">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center bg-yellow-400  my-1 px-2 py-1 rounded-lg shadow-md">
            <span className="font-bold text-sm">NBG</span>
          </div>

 
        </div>
      </div>

  
    </nav>
  );
};

export default Navbar;
