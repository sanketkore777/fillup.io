import React from "react";
import NavigationBar from "../components/Navbar";
const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="mainclass flex flex-col ">
      <NavigationBar />
      <div className="mainclass w-full ">
        {/* bg-[#e6ebed] */}
        {children}
      </div>
    </main>
  );
};

export default HomeLayout;
