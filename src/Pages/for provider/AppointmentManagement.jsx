import React, { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../../utils/api";
import "./AppointmentManagement.css"; // Cần tạo file CSS này

const AppointmentManagement = () => {
  const [activeTab, setActiveTab] = useState("pending"); // 'pending' hoặc 'confirmed'
  const [pending, setPending] = useState([]);
  const [confirmed, setConfirmed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm tải dữ liệu cho cả hai tab
  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    try {
      // Tải song song cả hai danh sách
      const [pendingRes, confirmedRes] = await Promise.all([
        apiFetch("/api/lich-hen/pending-cho-ncc"), // API giả định
        apiFetch("/api/lich-hen/confirmed-cho-ncc"), // API giả định
      ]);

      const pendingData = await pendingRes.json();
      const confirmedData = await confirmedRes.json();

      if (!pendingRes.ok)
        throw new Error(pendingData.message || "Lỗi tải lịch chờ");
      if (!confirmedRes.ok)
        throw new Error(confirmedData.message || "Lỗi tải lịch đã xác nhận");

      setPending(Array.isArray(pendingData) ? pendingData : []);
      setConfirmed(Array.isArray(confirmedData) ? confirmedData : []);
    } catch (err) {
      console.error("Lỗi tải lịch hẹn:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tải dữ liệu khi component được render lần đầu
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Hàm xử lý khi nhấn nút Chấp Nhận (Yes)
  const handleConfirm = async (appointmentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn chấp nhận lịch hẹn này?"))
      return;

    try {
      const response = await apiFetch(
        `/api/lich-hen/confirm/${appointmentId}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) throw new Error("Xác nhận thất bại");

      alert("Đã xác nhận lịch hẹn!");
      fetchAppointments(); // Tải lại cả hai danh sách
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  // Hàm xử lý khi nhấn nút Từ Chối (No)
  const handleReject = async (appointmentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn từ chối lịch hẹn này?")) return;

    // (Nâng cao: nên có một prompt hỏi lý do từ chối)
    const ly_do = prompt("Nhập lý do từ chối (bỏ trống nếu không cần):", "");

    try {
      const response = await apiFetch(`/api/lich-hen/reject/${appointmentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ly_do: ly_do || "Nhà cung cấp bận." }),
      });
      if (!response.ok) throw new Error("Từ chối thất bại");

      alert("Đã từ chối lịch hẹn.");
      fetchAppointments(); // Tải lại cả hai danh sách
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  // ----- RENDER -----

  if (isLoading) {
    return (
      <div className="status-container">
        <p>Đang tải lịch hẹn...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="appointment-management-page">
      <h2>Quản Lý Lịch Hẹn</h2>

      {/* 1. Khu vực Tabs */}
      <div className="tab-nav">
        <button
          className={`tab-link ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Đang Chờ ({pending.length})
        </button>
        <button
          className={`tab-link ${activeTab === "confirmed" ? "active" : ""}`}
          onClick={() => setActiveTab("confirmed")}
        >
          Đã Xác Nhận ({confirmed.length})
        </button>
      </div>

      {/* 2. Nội dung Tabs */}
      <div className="tab-content">
        {/* NỘI DUNG TAB ĐANG CHỜ (HIỂN THỊ NÚT YES/NO) */}
        {activeTab === "pending" && (
          <div className="appointment-list">
            {pending.length === 0 ? (
              <p className="empty-list">Không có lịch hẹn nào đang chờ.</p>
            ) : (
              pending.map((app) => (
                <div className="appointment-card pending" key={app.id}>
                  <div className="card-main-info">
                    <span className="appointment-time">
                      {new Date(app.thoi_gian_hen).toLocaleString("vi-VN")}
                    </span>
                    <h4>{app.khach_hang_ten}</h4>
                    <p>Dịch vụ: {app.dich_vu_ten}</p>
                    {app.ghi_chu && (
                      <p className="note">Ghi chú: {app.ghi_chu}</p>
                    )}
                  </div>
                  <div className="card-actions-pending">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleConfirm(app.id)}
                    >
                      <i className="fas fa-check"></i> Chấp Nhận
                    </button>
                    <button
                      className="btn btn-danger-outline btn-sm"
                      onClick={() => handleReject(app.id)}
                    >
                      <i className="fas fa-times"></i> Từ Chối
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* NỘI DUNG TAB ĐÃ XÁC NHẬN */}
        {activeTab === "confirmed" && (
          <div className="appointment-list">
            {confirmed.length === 0 ? (
              <p className="empty-list">Chưa có lịch hẹn nào được xác nhận.</p>
            ) : (
              confirmed.map((app) => (
                <div className="appointment-card confirmed" key={app.id}>
                  <div className="card-main-info">
                    <span className="appointment-time">
                      {new Date(app.thoi_gian_hen).toLocaleString("vi-VN")}
                    </span>
                    <h4>{app.khach_hang_ten}</h4>
                    <p>Dịch vụ: {app.dich_vu_ten}</p>
                  </div>
                  <div className="card-actions-confirmed">
                    <span className="status-label">Đã Xác Nhận</span>
                    {/* (Bạn có thể thêm nút Hủy Lịch ở đây nếu cần) */}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;
