import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api"; // Giả sử bạn dùng apiFetch
// import './CreateService.css'; // (Tạo file CSS nếu cần)

const CreateService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ten_dich_vu: "",
    mo_ta: "",
    don_gia: "",
    thoi_gian_uoc_tinh: "30 phút", // Giá trị mặc định
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // API endpoint này là giả định, bạn cần thay thế
      const response = await apiFetch("/api/dich-vu/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          don_gia: parseFloat(formData.don_gia), // Đảm bảo đơn giá là số
        }),
      });

      if (response.ok) {
        alert("Tạo dịch vụ mới thành công!");
        // Chuyển hướng về trang quản lý dịch vụ hoặc brand detail
        navigate("/provider/brands"); // Hoặc navigate(-1) để quay lại
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Tạo dịch vụ thất bại.");
      }
    } catch (err) {
      console.error("Lỗi khi tạo dịch vụ:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Tạo Dịch Vụ Mới</h2>
      <p>Cung cấp thông tin chi tiết về dịch vụ bạn muốn cung cấp.</p>

      <form onSubmit={handleSubmit} className="service-form">
        {error && <div className="form-error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="ten_dich_vu">Tên Dịch Vụ:</label>
          <input
            type="text"
            id="ten_dich_vu"
            name="ten_dich_vu"
            value={formData.ten_dich_vu}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mo_ta">Mô Tả Dịch Vụ:</label>
          <textarea
            id="mo_ta"
            name="mo_ta"
            value={formData.mo_ta}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="don_gia">Đơn Giá (VNĐ):</label>
          <input
            type="number"
            id="don_gia"
            name="don_gia"
            value={formData.don_gia}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="thoi_gian_uoc_tinh">Thời Gian Ước Tính:</label>
          <select
            id="thoi_gian_uoc_tinh"
            name="thoi_gian_uoc_tinh"
            value={formData.thoi_gian_uoc_tinh}
            onChange={handleChange}
          >
            <option value="30 phút">30 phút</option>
            <option value="1 giờ">1 giờ</option>
            <option value="1 giờ 30 phút">1 giờ 30 phút</option>
            <option value="2 giờ">2 giờ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/* Bạn có thể thêm logic Upload hình ảnh ở đây */}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)} // Nút Hủy
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang Lưu..." : "Lưu Dịch Vụ"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateService;
