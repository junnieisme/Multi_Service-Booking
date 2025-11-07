import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateBrand.css";
import { apiFetch } from "../../utils/api";

const CreateBrand = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ten_thuong_hieu: "",
    id_dich_vu: "",
    tinh_thanh: "",
    dia_chi_cu_the: "",
    mo_ta_ngan: "",
    mo_ta_chi_tiet: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);

  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        if (!response.ok) {
          throw new Error("Lỗi khi tải danh sách tỉnh thành");
        }
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    const fetchServices = async () => {
      setIsLoadingServices(true);
      try {
        // >>> Giả định apiFetch trả về data đã được .json()
        const response = await apiFetch("/api/dich-vu/get-data"); 
        
        // Kiểm tra xem response có phải là mảng không
        if (response && Array.isArray(response.data)) {
           setServices(response.data);
        } else {
           console.error("API /api/dich-vu/get-data không trả về mảng:", response);
           setServices([]); // Đặt là mảng rỗng nếu data không đúng
        }

      } catch (error) {
        console.error("Lỗi từ apiFetch (dịch vụ):", error);
        setServices([]); // Đặt là mảng rỗng khi có lỗi
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchProvinces();
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    
    if (imageFile) {
      dataToSubmit.append("hinh_anh", imageFile);
    }
    for (const key in formData) {
      dataToSubmit.append(key, formData[key]);
    }


    try {
      const response = await apiFetch("/api/thuong-hieu/create", {
        method: "POST",
        body: dataToSubmit,

      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Lỗi HTTP: ${response.status}`
        );
      }

      // Nếu thành công
      alert("Tạo thương hiệu thành công!");
      navigate("/provider/brands"); 

    } catch (error) {

      console.error("Lỗi khi tạo thương hiệu:", error);
      alert(`Tạo thương hiệu thất bại: ${error.message || "Vui lòng thử lại."}`);
    }
  };

  return (
    <div className="create-brand-page">
      <div className="form-container">
        <h2>Tạo thương hiệu mới</h2>
        <p className="form-subtitle">
          Điền các thông tin cơ bản để thiết lập thương hiệu của bạn trên
          ServiceHub.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="ten_thuong_hieu">Tên thương hiệu (*)</label>
              <input
                type="text"
                id="ten_thuong_hieu"
                name="ten_thuong_hieu"
                value={formData.ten_thuong_hieu}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="id_dich_vu">Loại hình dịch vụ (*)</label>
              <select
                id="id_dich_vu"
                name="id_dich_vu"
                value={formData.id_dich_vu}
                onChange={handleChange}
                required
                disabled={isLoadingServices}
              >
                <option value="" disabled>
                  {isLoadingServices
                    ? "Đang tải dịch vụ..."
                    : "-- Chọn loại hình dịch vụ --"}
                </option>

                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.ten_dich_vu}{" "}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="tinh_thanh">Tỉnh/Thành phố (*)</label>
              <select
                id="tinh_thanh"
                name="tinh_thanh"
                value={formData.tinh_thanh}
                onChange={handleChange}
                required
                disabled={isLoadingProvinces}
              >
                <option value="" disabled>
                  {isLoadingProvinces
                    ? "Đang tải tỉnh thành..."
                    : "-- Chọn tỉnh/thành --"}
                </option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dia_chi_cu_the">Địa chỉ cụ thể (*)</label>
              <textarea
                id="dia_chi_cu_the"
                name="dia_chi_cu_the"
                rows="3"
                value={formData.dia_chi_cu_the}
                onChange={handleChange}
                placeholder="Ví dụ: 123 đường ABC, Phường X, Quận Y"
                required
              ></textarea>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="hinh_anh">Ảnh bìa thương hiệu</label>
              <div className="image-upload-wrapper">
                <input
                  type="file"
                  id="hinh_anh"
                  name="hinh_anh"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Xem trước"
                    className="image-preview"
                  />
                ) : (
                  <div className="image-upload-placeholder">
                    <i className="fas fa-camera"></i>
                    <p>Nhấn để tải ảnh lên</p>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="mo_ta_ngan">Mô tả ngắn</label>
              <textarea
                id="mo_ta_ngan"
                name="mo_ta_ngan"
                rows="3"
                value={formData.mo_ta_ngan}
                onChange={handleChange}
                placeholder="Một câu giới thiệu ngắn gọn về thương hiệu"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="mo_ta_chi_tiet">Mô tả chi tiết</label>
              <textarea
                id="mo_ta_chi_tiet"
                name="mo_ta_chi_tiet"
                rows="6"
                value={formData.mo_ta_chi_tiet}
                onChange={handleChange}
                placeholder="Giới thiệu chi tiết về không gian, dịch vụ, điểm mạnh..."
              ></textarea>
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)} 
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-plus-circle"></i>
              Tạo thương hiệu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBrand;
