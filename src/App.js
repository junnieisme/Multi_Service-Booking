import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

// Import các trang Login/Signup của bạn
import { LoginSignup } from "./Pages/Login";
import { Signup } from "./Pages/Signup";

// Import các component layout và trang của Provider
import ProviderLayout from "./Components/Com Provider/ProviderLayout";
import BrandManagement from "./Pages/for provider/BrandManagement";
import CreateBrand from "./Pages/for provider/CreateBrand"; 

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/provider" element={<ProviderLayout />}>
        <Route index element={<Navigate to="brands" replace />} />
        <Route path="brands" element={<BrandManagement />} />
        <Route path="brands/create" element={<CreateBrand />} />{" "}
      </Route>
    </Routes>
  );
}

export default App;
