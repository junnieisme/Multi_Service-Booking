import React, { useState } from "react";
import {
  Avatar,
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
// 1. Import thêm useNavigate
import { Link as RouterLink, useNavigate } from "react-router-dom";
import MaillockOutlinedIcon from "@mui/icons-material/MailLockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { apiFetch } from "../utils/api";

export const LoginSignup = () => {
  // 2. Khởi tạo navigate
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Reset form and errors when switching tabs
    setFormData({
      email: "",
      password: "",
      rememberMe: false,
    });
    setErrors({});
  };

  // State mới để quản lý lỗi
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "rememberMe" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Hàm xác thực
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chạy validation trước khi gọi API
    if (!validate()) {
      return;
    }

    try {
      const endpoint =
        activeTab === 0
          ? "/api/khach-hang/dang-nhap"
          : "/api/nha-cung-cap/dang-nhap";

      const response = await apiFetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setSnackbarMessage(data.message || "Đăng nhập thành công!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        if (data.key) {
          if (formData.rememberMe) {
            localStorage.setItem("key", data.key);
            localStorage.setItem("ten", data.ten);
          } else {
            sessionStorage.setItem("key", data.key);
            sessionStorage.setItem("ten", data.ten); 
          }
        }


        setTimeout(() => {
          if (activeTab === 0) {
            // Người dùng
            navigate("/user/homepage");
          } else {
            // Nhà cung cấp
            navigate("/provider/brands");
          }
        }, 1000); // Chờ 1 giây rồi chuyển trang
      } else {
        setSnackbarMessage(
          data.message || "Đăng nhập thất bại. Vui lòng kiểm tra thông tin."
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Lỗi kết nối. Vui lòng thử lại sau.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const textFieldStyles = {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "blueviolet",
      },
      "&:hover fieldset": {
        borderColor: "blueviolet",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "blueviolet",
    },
  };

  return (
    <>
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            marginTop: 8,
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              margin: 1,
              bgcolor: "blueviolet",
              textAlign: "center",
            }}
          >
            <MaillockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ textAlign: "center", mb: 2 }}
          >
            Đăng nhập
          </Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                color: "grey.600",
                whiteSpace: "nowrap",
                minWidth: "180px",
                fontSize: "1rem",
                "&.Mui-selected": {
                  color: "blueviolet",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "blueviolet",
              },
            }}
          >
            <Tab label="Người dùng" />
            <Tab label="Nhà cung cấp" />
          </Tabs>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={textFieldStyles}
              // Thêm props hiển thị lỗi
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={textFieldStyles}
              // Thêm props hiển thị lỗi
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  sx={{
                    color: "blueviolet",
                    "&.Mui-checked": {
                      color: "blueviolet",
                    },
                  }}
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
              }
              label="Ghi nhớ đăng nhập"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "blueviolet",
                "&:hover": {
                  bgcolor: "#7a28cc",
                },
              }}
            >
              Đăng nhập
            </Button>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <MuiLink
                  href="#"
                  variant="body2"
                  sx={{
                    color: "blueviolet",
                    textDecorationColor: "blueviolet",
                    "&:hover": {
                      color: "#7a28cc",
                      textDecorationColor: "#7a28cc",
                    },
                  }}
                >
                  Quên mật khẩu?
                </MuiLink>
              </Grid>
              <Grid item>
                <MuiLink
                  component={RouterLink}
                  to="/signup"
                  variant="body2"
                  sx={{
                    color: "blueviolet",
                    textDecorationColor: "blueviolet",
                    "&:hover": {
                      color: "#7a28cc",
                      textDecorationColor: "#7a28cc",
                    },
                  }}
                >
                  {"Chưa có tài khoản? Đăng ký"}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
