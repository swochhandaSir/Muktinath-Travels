import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Home from "../pages/Home";
import About from "../pages/About";
import Bikes from "../pages/Bikes";
import Blog from "../pages/Blog";
import Contact from "../pages/Contact";
import Package from "../pages/Package";
import PackageDetails from "../pages/PackageDetails";
import Service from "../pages/Service";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import DashboardBikes from "../pages/DashboardBikes";
import DashboardCompanyDetails from "../pages/DashboardCompanyDetails";
import DashboardPackages from "../pages/DashboardPackages";
import DashboardBikeBookings from "../pages/DashboardBikeBookings";
import DashboardPackageBookings from "../pages/DashboardPackageBookings";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Navigate to="bikes" replace />} />
          <Route path="bikes" element={<DashboardBikes />} />
          <Route path="companyDetails" element={<DashboardCompanyDetails />} />
          <Route path="packages" element={<DashboardPackages />} />
          <Route path="bikeBookings" element={<DashboardBikeBookings />} />
          <Route path="packageBookings" element={<DashboardPackageBookings />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/bikes" element={<Bikes />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/package" element={<Package />} />
          <Route path="/package/:packageId" element={<PackageDetails />} />
          <Route path="/service" element={<Service />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
