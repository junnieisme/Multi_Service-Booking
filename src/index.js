import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css"; // File CSS global đã cập nhật ở trên
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* BrowserRouter nên được đặt ở đây */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
