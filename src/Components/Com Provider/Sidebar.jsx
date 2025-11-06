import React from "react";
import { NavLink, useNavigate }  from "react-router-dom";
import "./Sidebar.css"; 

const Sidebar = ({ isActive, sidebarRef }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); 
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      alert("Đã đăng xuất thành công!");
      navigate("/login");
    }
  };

  return (
    <nav
      className={`sidebar ${isActive ? "active" : ""}`}
      id="sidebar"
      ref={sidebarRef}
    >
      <ul className="sidebar-menu">
        <li className="menu-item">
          <NavLink to="/provider/brands" className="menu-link">
            <i className="fas fa-tags menu-icon"></i>
            <span>Quản lý danh sách thương hiệu</span>
          </NavLink>
        </li>

        <li className="menu-item">
          <NavLink to="/provider/appointments" className="menu-link">
            <i className="fas fa-calendar-alt menu-icon"></i>
            <span>Quản lý lịch hẹn</span>
          </NavLink>
        </li>

        <li className="menu-item">
          <NavLink to="/provider/profile" className="menu-link">
            <i className="fas fa-id-card menu-icon"></i>
            <span>Quản lý hồ sơ thương hiệu</span>
          </NavLink>
        </li>

        <li className="menu-item">
          <NavLink to="/provider/revenue" className="menu-link">
            <i className="fas fa-chart-line menu-icon"></i>
            <span>Quản lý doanh thu</span>
          </NavLink>
        </li>

        <li className="menu-item">
          <NavLink to="/provider/settings" className="menu-link">
            <i className="fas fa-cog menu-icon"></i>
            <span>Cài đặt</span>
          </NavLink>
        </li>
        <li className="logout-item">
          <button type="button" className="logout-link" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt menu-icon"></i>
            <span>Đăng xuất</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;