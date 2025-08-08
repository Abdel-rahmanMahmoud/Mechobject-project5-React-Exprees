import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./auth/Register";
import Login from "./auth/Login";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import AboutPage from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import AdminDashboard from "./pages/AdminDashboard";
import Favorites from "./pages/Favorites";
import Cart from "./pages/cart";
import ProductDetails from "./pages/ProductsDetails";
import Payment from "./pages/Payment";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/product-details/:id" element={<ProductDetails />} />
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
}

export default App;