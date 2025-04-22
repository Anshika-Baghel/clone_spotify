import Navbar from "./Navbar";
import Player from "./Player";
import Sidebar from "./Sidebar";
import React,{ ReactNode } from "react";
interface LayoutProps{
    children: React.ReactNode;
}


const Layout :React.FC<LayoutProps>= ({children}) => {
  return (
    <div className="h-screen">
      <div className="h-[90%] flex">
        <Sidebar />
        <div className="w-[100%] m-2 px-6 pt-4 rounded bg-black text-white overflow-auto lg:w-[75%] lg:ml-0">
          <Navbar />
          {children}
        </div>
      </div>
      <Player/>

    </div>
  );
};

export default Layout;