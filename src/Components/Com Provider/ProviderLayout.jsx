import React, { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header"; // Import Header
import Sidebar from "./Sidebar"; // Import Sidebar
import "./ProviderLayout.css"; // CSS cho layout này

// Sơ đồ luồng component của layout
//
const ProviderLayout = () => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  // Xử lý click bên ngoài để đóng sidebar trên mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.innerWidth <= 992 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsSidebarActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Chạy 1 lần duy nhất

  return (
    <div className="container">
      <Header onToggle={toggleSidebar} toggleRef={toggleRef} />
      <Sidebar isActive={isSidebarActive} sidebarRef={sidebarRef} />
      <main>
        {/* Outlet là nơi các trang con (Page) sẽ được render */}
        <Outlet />
      </main>
    </div>
  );
};

export default ProviderLayout;
