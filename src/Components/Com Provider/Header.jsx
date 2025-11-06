import React from "react";
import "./Header.css"; // Đảm bảo bạn đã tạo file Header.css

const Header = ({ onToggle, toggleRef }) => {
  return (
    <header>
      <div className="logo">
        <button
          className="menu-toggle"
          id="menuToggle"
          onClick={onToggle} // Thêm sự kiện click
          ref={toggleRef} // Gán ref cho nút
        >
          <i className="fas fa-bars"></i>
        </button>
        <i className="fas fa-calendar-alt logo-icon"></i>
        <span>ServiceHub</span>
      </div>

      <div className="search-bar">
        <i className="fas fa-search search-icon"></i>
        <input type="text" placeholder="Tìm kiếm khách hàng, dịch vụ..." />
      </div>

      <div className="header-user">
        <div className="user-badge">
          <i className="fas fa-user-tie"></i>
          <span>Nhà cung cấp</span>
        </div>

        <div className="header-icons">
          <button className="icon-btn">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">5</span>
          </button>
          <div className="user-avatar">NV</div>{" "}
          {/* Thay 'NV' bằng dữ liệu người dùng sau này */}
        </div>
      </div>
    </header>
  );
};

export default Header;
