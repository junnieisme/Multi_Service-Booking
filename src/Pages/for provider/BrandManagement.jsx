import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import "./BrandManagement.css";

const BrandManagement = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // HÀM TẢI DỮ LIỆU THƯƠNG HIỆU
  const fetchBrands = async () => {
    try {
      setIsLoading(true);

      const response = await apiFetch("/api/thuong-hieu/get-data-by-ncc", {
        method: "GET",
      });
      // Sửa lỗi: đảm bảo data là một mảng hoặc object hợp lệ
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        // Cần đảm bảo rằng data.brands là một mảng
        const brandList = Array.isArray(data.brands) ? data.brands : [];
        setBrands(brandList);
        console.log("Dữ liệu thương hiệu nhận được:", data);
      } else {
        // Xử lý lỗi nếu API trả về trạng thái lỗi (ví dụ: 404, 500)
        throw new Error(data.message || `Lỗi HTTP: ${response.status}`);
      }
    } catch (err) {
      console.error("Lỗi khi tải thương hiệu:", err);
      setError(
        err.message || "Không thể tải danh sách thương hiệu. Vui lòng thử lại."
      );
      setBrands([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleEnterDeleteMode = () => {
    setIsDeleteMode(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteMode(false);
    setSelectedBrands([]);
  };

  const handleSelectBrand = (brandId) => {
    setSelectedBrands((prevSelected) => {
      if (prevSelected.includes(brandId)) {
        return prevSelected.filter((id) => id !== brandId);
      } else {
        return [...prevSelected, brandId];
      }
    });
  };

  // Xử lý khi xác nhận Xóa
  const handleConfirmDelete = async () => {
    if (selectedBrands.length === 0) {
      alert("Vui lòng chọn ít nhất một thương hiệu để xóa.");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedBrands.length} thương hiệu đã chọn?`
      )
    ) {
      try {
        const response = await apiFetch("/api/thuong-hieu/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: selectedBrands }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
        }

        alert("Xóa thành công!");
        handleCancelDelete();
        fetchBrands(); // Tải lại danh sách
      } catch (err) {
        console.error("Lỗi khi xóa thương hiệu:", err);
        alert(`Đã xảy ra lỗi khi xóa: ${err.message || "Vui lòng thử lại."}`);
      }
    }
  };

  const handleCreateBrand = () => {
    navigate("/provider/brands/create");
  };

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

  // >>>>>> PHẦN KIỂM TRA MỚI <<<<<<
  if (brands.length === 0 && !isDeleteMode) {
    return (
      <div className="status-container">
        <i className="fas fa-box-open"></i>
        <p>Chưa có thương hiệu nào được tạo.</p>
        <button className="btn btn-primary mt-3" onClick={handleCreateBrand}>
          <i className="fas fa-plus-circle"></i>
          Tạo thương hiệu đầu tiên
        </button>
      </div>
    );
  }
  // >>>>>> KẾT THÚC PHẦN KIỂM TRA MỚI <<<<<<

  // ----- RENDER DANH SÁCH (CÓ DỮ LIỆU) -----

  return (
    <div
      className={`brand-management-container ${
        isDeleteMode ? "delete-mode" : ""
      }`}
    >
      {/* Header: Hiển thị nút tùy theo chế độ */}

      <div className="brand-list-header">
        {!isDeleteMode ? (
          // Chế độ xem bình thường

          <>
            <h2>Danh sách thương hiệu ({brands.length})</h2>

            <div className="header-actions">
              {" "}
              {/* Bọc các nút lại */}
              {brands.length > 0 && ( // Chỉ hiển thị nút xóa khi có ít nhất 1 thương hiệu
                <button
                  className="btn btn-danger-outline"
                  onClick={handleEnterDeleteMode}
                >
                  {" "}
                  <i className="fas fa-trash"></i>
                  Xóa thương hiệu
                </button>
              )}
              <button className="btn btn-primary" onClick={handleCreateBrand}>
                <i className="fas fa-plus-circle"></i>
                Tạo thương hiệu mới
              </button>
            </div>
          </>
        ) : (
          // Chế độ xóa

          <>
            <h2>Chọn thương hiệu để xóa ({selectedBrands.length} đã chọn)</h2>

            <div className="delete-actions">
              <button
                className="btn btn-secondary"
                onClick={handleCancelDelete}
              >
                Hủy
              </button>

              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                <i className="fas fa-trash"></i>
                Xác nhận Xóa
              </button>
            </div>
          </>
        )}
      </div>

      {/* Layout danh sách */}

      <div className="brand-list-layout">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className={`brand-card ${
              selectedBrands.includes(brand.id) ? "selected" : ""
            }`}
            // Cho phép chọn khi bấm vào thẻ (ở chế độ xóa)

            onClick={() => isDeleteMode && handleSelectBrand(brand.id)}
          >
            {/* Checkbox (Chỉ hiển thị ở chế độ xóa) */}

            <div className="delete-checkbox">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.id)}
                // Thêm onChange rỗng để React không báo lỗi

                // Logic đã được xử lý ở onClick của .brand-card

                onChange={() => {}}
                style={{ cursor: isDeleteMode ? "pointer" : "default" }}
              />
            </div>

            {/* Hình ảnh */}

            <div
              className="brand-card-image"
              style={{
                backgroundImage: `url(${
                  brand.hinh_anh ||
                  "https://via.placeholder.com/400x250.png?text=No+Image"
                })`,
              }}
            ></div>

            {/* Nội dung */}

            <div className="brand-card-content">
              <h3 className="brand-card-title">{brand.ten_thuong_hieu}</h3>

              <p className="brand-card-description">{brand.mo_ta_ngan}</p>

              <div className="brand-card-location">
                <i className="fas fa-map-marker-alt"></i>

                <span>
                  {brand.dia_chi_cu_the}, {brand.tinh_thanh}
                </span>
              </div>
            </div>

            {/* Nút bấm */}

            <div className="brand-card-actions">
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  e.stopPropagation();

                  navigate(`/provider/brands/edit/${brand.id}`);
                }}
              >
                Quản lý
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandManagement;
