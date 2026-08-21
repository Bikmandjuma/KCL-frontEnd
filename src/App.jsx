import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import useTrackVisit from './hooks/useTrackVisit'

import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Services from './pages/Services'
import MissionVision from './pages/MissionVision'
import Contact from './pages/Contact'
import BaristaApply from './pages/BaristaApply'
import About from './pages/About'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import Wishlist from './pages/Wishlist'
import MyOrders from './pages/MyOrders'
import NotFound from './pages/NotFound'

import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminDrinks from './pages/admin/Drinks'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'
import AdminSettings from './pages/admin/Settings'
import AdminBarista from './pages/admin/Barista'

import { RequireAuth, RequireStaff } from './components/ProtectedRoute'

function StorefrontLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  useTrackVisit()

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1d4ed8',
            color: '#ffffff',
            border: '1px solid #1e40af',
            borderRadius: '14px',
            padding: '12px 16px',
            fontWeight: 500,
          },
          success: { iconTheme: { primary: '#ffffff', secondary: '#1d4ed8' } },
          error: { style: { background: '#1d4ed8', border: '1px solid #1e40af' }, iconTheme: { primary: '#ffffff', secondary: '#1d4ed8' } },
        }}
      />

      <Routes>
        {/* Storefront */}
        <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
        <Route path="/shop" element={<StorefrontLayout><Shop /></StorefrontLayout>} />
        <Route path="/product/:hash" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
        <Route path="/services" element={<StorefrontLayout><Services /></StorefrontLayout>} />
        <Route path="/mission-vision" element={<StorefrontLayout><MissionVision /></StorefrontLayout>} />
        <Route path="/contact" element={<StorefrontLayout><Contact /></StorefrontLayout>} />
        <Route path="/barista/apply" element={<StorefrontLayout><BaristaApply /></StorefrontLayout>} />
        <Route path="/about" element={<StorefrontLayout><About /></StorefrontLayout>} />
        <Route path="/cart" element={<StorefrontLayout><Cart /></StorefrontLayout>} />
        <Route path="/checkout" element={<StorefrontLayout><RequireAuth><Checkout /></RequireAuth></StorefrontLayout>} />
        <Route path="/login" element={<StorefrontLayout><Login /></StorefrontLayout>} />
        <Route path="/register" element={<StorefrontLayout><Register /></StorefrontLayout>} />
        <Route path="/wishlist" element={<StorefrontLayout><RequireAuth><Wishlist /></RequireAuth></StorefrontLayout>} />
        <Route path="/my-orders" element={<StorefrontLayout><RequireAuth><MyOrders /></RequireAuth></StorefrontLayout>} />

        {/* Admin / Manager panel */}
        <Route path="/admin" element={<RequireStaff><AdminLayout /></RequireStaff>}>
          <Route index element={<RequireStaff permission="viewDashboard"><Dashboard /></RequireStaff>} />
          <Route path="products" element={<RequireStaff permission="manageProducts"><AdminProducts /></RequireStaff>} />
          <Route path="drinks" element={<RequireStaff permission="manageDrinks"><AdminDrinks /></RequireStaff>} />
          <Route path="orders" element={<RequireStaff permission="manageOrders"><AdminOrders /></RequireStaff>} />
          <Route path="users" element={<RequireStaff permission="manageUsers"><AdminUsers /></RequireStaff>} />
          <Route path="barista" element={<RequireStaff permission="manageBarista"><AdminBarista /></RequireStaff>} />
          <Route path="settings" element={<RequireStaff permission="manageSettings"><AdminSettings /></RequireStaff>} />
        </Route>

        <Route path="*" element={<StorefrontLayout><NotFound /></StorefrontLayout>} />
      </Routes>
    </>
  )
}
