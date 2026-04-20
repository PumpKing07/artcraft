import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { CatalogPage } from "./pages/CatalogPage.jsx";
import { ShopPage } from "./pages/ShopPage.jsx";
import { CartPage } from "./pages/CartPage.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { BlogPage } from "./pages/BlogPage.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { SchedulePage } from "./pages/SchedulePage.jsx";
import { CourseDetailPage } from "./pages/CourseDetailPage.jsx";
import { ProductDetailPage } from "./pages/ProductDetailPage.jsx";
import { CheckoutPage } from "./pages/CheckoutPage.jsx";
import { AccountPage } from "./pages/AccountPage.jsx";
import { ContactsPage } from "./pages/ContactsPage.jsx";
import { CourseRegisterPage } from "./pages/CourseRegisterPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:id" element={<CourseDetailPage />} />
        <Route path="/catalog/:id/register" element={<CourseRegisterPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

