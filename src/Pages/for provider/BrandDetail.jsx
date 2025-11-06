import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import "./BrandDetail.css"; // Chúng ta sẽ cập nhật file CSS này

const BrandDetail = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();

  const [brand, setBrand] = useState(null);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ... (Giữ nguyên toàn bộ logic: useEffect, fetchData, handleCreateService, handleDeleteBrand) ...
  useEffect(() => {
    const fetchData = async () => {
      if (!brandId) return;
      setIsLoading(true);
      try {
        const brandPromise = apiFetch(`/api/thuong-hieu/${brandId}`);
        const servicesPromise = apiFetch(
          `/api/chi-tiet-thuong-hieu/get-by-brand/${brandId}`
        );
        const [brandData, servicesData] = await Promise.all([
          brandPromise,
          servicesPromise,
        ]);

        const brandResult = await brandData.json();
        const servicesResult = await servicesData.json();

        if (!brandData.ok)
          throw new Error(brandResult.message || "Lỗi tải thương hiệu");
        if (!servicesData.ok)
          throw new Error(servicesResult.message || "Lỗi tải dịch vụ");

        setBrand(brandResult);
        setServices(Array.isArray(servicesResult) ? servicesResult : []);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết thương hiệu:", err);
        setError("Không thể tải dữ liệu. Vui lòng quay lại.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [brandId]);

  const handleCreateService = () => {
    navigate(`/provider/brands/${brandId}/services/create`);
  };

  const handleDeleteBrand = async () => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn XÓA TOÀN BỘ thương hiệu "${brand?.ten_thuong_hieu}" không?`
      )
    ) {
      try {
        const response = await apiFetch("/api/thuong-hieu/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: [brandId] }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || "Xóa thất bại");
        }
        alert("Xóa thương hiệu thành công!");
        navigate("/provider/brands");
      } catch (err) {
        console.error("Lỗi khi xóa thương hiệu:", err);
        alert(`Xóa thất bại: ${err.message}. Vui lòng thử lại.`);
      }
    }
  };

  const handleEditService = (serviceId) => {
    navigate(`/provider/services/edit/${serviceId}`);
  };

  // ----- (Giữ nguyên phần Render Loading và Error) -----
  if (isLoading) {
    return (
      <div className="status-container">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Đang tải chi tiết thương hiệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>{error}</p>
      </div>
    );
  }

  // ----- RENDER TRANG CHÍNH (ĐÃ CẬP NHẬT) -----
  return (
    <div className="brand-detail-page">
      {/* Header vẫn giữ nguyên */}
      <div className="brand-detail-header">
        <h2>{brand?.ten_thuong_hieu || "Chi tiết thương hiệu"}</h2>
        <div className="header-actions">
          <button
            className="btn btn-danger-outline"
            onClick={handleDeleteBrand}
          >
            <i className="fas fa-trash"></i>
            Xóa thương hiệu
          </button>
          <button className="btn btn-primary" onClick={handleCreateService}>
            <i className="fas fa-plus-circle"></i>
            Tạo dịch vụ
          </button>
        </div>
      </div>

      {/* ===== THAY ĐỔI TỪ ĐÂY: Chuyển <table> thành layout Card ===== */}
      <div className="service-card-list">
        {services.length > 0 ? (
          services.map((service) => (
            <div className="service-card-horizontal" key={service.id}>
              {/* Hình ảnh (bên trái) */}
              <div className="service-card-image">
                <img
                  src={
                    service.hinh_anh_dai_dien || // Cần thay 'hinh_anh_dai_dien' bằng trường đúng
                    "https://via.placeholder.com/150.png?text=Service"
                  }
                  alt={service.ten_san_pham}
                />
              </div>

              {/* Nội dung (ở giữa) */}
              <div className="service-card-content">
                <h3>{service.ten_san_pham}</h3>
                <p>{service.ghi_chu || "Chưa có mô tả."}</p>
                <div className="service-card-price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(service.don_gia)}
                </div>
              </div>

              {/* Hành động (bên phải) - Chỉ có nút Sửa */}
              <div className="service-card-actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleEditService(service.id)}
                >
                  Sửa
                </button>
                {/* Nút Xóa đã bị loại bỏ */}
              </div>
            </div>
          ))
        ) : (
          // Trường hợp không có dịch vụ
          <div className="grid-empty">
            <p>Chưa có dịch vụ nào được tạo cho thương hiệu này.</p>
          </div>
        )}
      </div>
      {/* ===== KẾT THÚC THAY ĐỔI ===== */}
    </div>
  );
};

export default BrandDetail;
