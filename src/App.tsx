import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { AdminPortal } from './pages/AdminPortal';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { FAQs } from './pages/FAQs';
import { MyAccount } from './pages/MyAccount';
import { Orders } from './pages/Orders';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { GemRainCanvas } from './components/GemRainCanvas';
import { MotionEnhancer } from './components/MotionEnhancer';
import { CartFlyEffect } from './components/CartFlyEffect';
import './App.css';

function AppContent() {
  const { activePage } = useStore();

  const renderPage = () => {
    switch (activePage) {
      case 'shop':
        return <Shop />;
      case 'product-details':
        return <ProductDetails />;
      case 'about':
        return <AboutUs />;
      case 'contact':
        return <ContactUs />;
      case 'faq':
        return <FAQs />;
      case 'tracking':
      case 'orders':
        return <Orders />;
      case 'account':
        return <MyAccount />;
      case 'admin':
        return <AdminPortal />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main style={{ flex: 1 }}>{renderPage()}</main>
      <Footer />
      
      {/* Shopping Overlay Drawers & Interactive Particle Canvases */}
      <CartDrawer />
      <CheckoutModal />
      <GemRainCanvas />
      <MotionEnhancer />
      <CartFlyEffect />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
