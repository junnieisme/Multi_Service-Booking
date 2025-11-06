import React, { useState } from "react";
import {
  Avatar,
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Grid,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { apiFetch } from "../utils/api";

export const Signup = () => {


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    accountType: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleClickShowPassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Hàm xác thực (validation)
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống.";
    } else if (!/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống.";
    }

    if (!formData.accountType) {
      newErrors.accountType = "Vui lòng chọn loại tài khoản.";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setSnackbarMessage("Vui lòng kiểm tra lại thông tin đăng ký.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    try {
      let endpoint = "";
      let payload = {}; 

      const commonData = {
        ho_ten: formData.fullName.trim(),
        so_dien_thoai: formData.phone.replace(/\D/g, ""),
        dia_chi: formData.address.trim(),
        hinh_anh: "",
      };

      if (formData.accountType === "user") {
        endpoint = "/api/khach-hang/dang-ky";
        payload = {
          ...commonData,
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        };
      } else if (formData.accountType === "provider") {
        endpoint = "/api/nha-cung-cap/dang-ky";
        payload = {
          ...commonData,
          email: formData.email.trim().toLowerCase(),
          password: formData.password, 
        }; 
      }

      const response = await apiFetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setSnackbarMessage(data.message || "Đăng ký thành công!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage(
          data.message || "Đăng ký thất bại. Vui lòng thử lại."
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Lỗi handleSubmit Signup:", error);
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
    mb: 2,
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
            <PersonAddIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{ textAlign: "center", mb: 3 }}
          >
            Đăng ký
          </Typography>
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
              id="fullName"
              label="Họ và tên"
              name="fullName"
              autoComplete="name"
              autoFocus
              value={formData.fullName}
              onChange={handleChange}
              sx={textFieldStyles}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              sx={textFieldStyles}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Số điện thoại"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              sx={textFieldStyles}
              error={!!errors.phone}
              helperText={errors.phone}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="address"
              label="Địa chỉ"
              name="address"
              autoComplete="street-address"
              value={formData.address}
              onChange={handleChange}
              sx={textFieldStyles}
              error={!!errors.address}
              helperText={errors.address}
            />
            <FormControl
              component="fieldset"
              required
              sx={textFieldStyles}
              error={!!errors.accountType}
            >
              <FormLabel component="legend" sx={{ mb: 1 }}>
                Loại tài khoản
              </FormLabel>
              <RadioGroup
                row
                aria-label="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="user"
                  control={
                    <Radio
                      sx={{
                        color: "blueviolet",
                        "&.Mui-checked": { color: "blueviolet" },
                      }}
                    />
                  }
                  label="Người dùng"
                />
                <FormControlLabel
                  value="provider"
                  control={
                    <Radio
                      sx={{
                        color: "blueviolet",
                        "&.Mui-checked": { color: "blueviolet" },
                      }}
                    />
                  }
                  label="Nhà cung cấp"
                />
              </RadioGroup>
              {errors.accountType && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ ml: 1, mt: 0 }}
                >
                  {errors.accountType}
                </Typography>
              )}
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type={showPassword.password ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              sx={textFieldStyles}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword("password")}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword.password ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type={showPassword.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={textFieldStyles}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleClickShowPassword("confirmPassword")}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword.confirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              Đăng ký
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <MuiLink
                  component={RouterLink}
                  to="/login"
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
                  Đã có tài khoản? Đăng nhập
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
