import './App.css';
import Home from './pages/Home.js';
import SignUp from './pages/SignUp/signup.js';
import Product from './pages/Product.js';
import LearnMoreProducts from './pages/LearnMoreProducts.js';
import AuthPage from './pages/AuthPage.js';

// Products Pages
import SupplyChainTracking from './pages/Products/SupplyChainTracking.js';
import FleetManagement from './pages/Products/FleetManagement.js';
import RouteAnalytics from './pages/Products/RouteAnalytics.js';
import EquipmentMonitoring from './pages/Products/EquipmentMonitoring.js';

// Solutions Pages
import Logistics from './pages/Solutions/Logistics.js';
import Transportation from './pages/Solutions/Transportation.js';
import Distribution from './pages/Solutions/Distribution.js';
import Enterprise from './pages/Solutions/Enterprise.js';

// Resources Pages
import Blog from './pages/Resources/Blog.js';
import Guides from './pages/Resources/Guides.js';
import Support from './pages/Resources/Support.js';
import Documentation from './pages/Resources/Documentation.js';

// Company Pages
import About from './pages/Company/About.js';
import Careers from './pages/Company/Careers.js';
import Contact from './pages/Company/Contact.js';
import News from './pages/Company/News.js';

// Account & Support pages
import Profile from './pages/Account/Profile.js';
import Orders from './pages/Account/Orders.js';
import Settings from './pages/Account/Settings.js';
import Password from './pages/Account/Password.js';
import Addresses from './pages/Account/Addresses.js';
import Payments from './pages/Account/Payments.js';
import Wishlist from './pages/Wishlist.js';
import TrackOrder from './pages/Support/TrackOrder.js';
import Returns from './pages/Support/Returns.js';
import Chat from './pages/Support/Chat.js';
import PackagingHelp from './pages/Support/PackagingHelp.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import Checkout from './pages/Checkout.js';
import CheckoutLayout from './pages/Checkout/CheckoutLayout.js';
import CheckoutCart from './pages/Checkout/CheckoutCart.js';
import CheckoutDetails from './pages/Checkout/CheckoutDetails.js';
import CheckoutPayment from './pages/Checkout/CheckoutPayment.js';
import CheckoutReview from './pages/Checkout/CheckoutReview.js';
import { CheckoutProvider } from './context/CheckoutContext';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ThemeProvider } from './context/ThemeContext';

// Portal Components
import EmployeeLogin from './pages/Auth/EmployeeLogin.js';
import CustomerLogin from './pages/Auth/CustomerLogin.js';
import ForgotPassword from './pages/Auth/ForgotPassword.js';
import NeedHelp from './pages/Auth/NeedHelp.js';
import EmployeePortalRouter from './pages/Portal/EmployeePortalRouter.js';
import AdminDashboard from './pages/Portal/Admin_Page/Admin.js';
import CustomerPage from './pages/Portal/CustomerPage.js';

// --- Main App Component ---
function App() {
  return (
    <AuthProvider>
        <StoreProvider>
          <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Home/>}/>
              
              {/* Updated Login Routes - Customer login as main entry point */}
              <Route path="/login" element={<CustomerLogin/>}/>
              <Route path="/login/customer" element={<CustomerLogin/>}/>
              <Route path="/login/admin" element={<EmployeeLogin/>}/>
              <Route path="/login/employee" element={<EmployeeLogin/>}/>
              
              {/* Auth Support Routes */}
              <Route path="/forgot-password" element={<ForgotPassword/>}/>
              <Route path="/need-help" element={<NeedHelp/>}/>
              
              <Route path="/signup" element={<SignUp/>}/>
              <Route path="/auth" element={<AuthPage/>}/>
              <Route path="/products" element={<Product/>}/>
              <Route path="/products/learn-more" element={<LearnMoreProducts/>}/>
              {/* Wishlist route available below as protected; remove duplicate here */}
              
              {/* Products Routes */}
              <Route path="/products/tracking" element={<SupplyChainTracking/>}/>
              <Route path="/products/management" element={<FleetManagement/>}/>
              <Route path="/products/analytics" element={<RouteAnalytics/>}/>
              <Route path="/products/monitoring" element={<EquipmentMonitoring/>}/>
              
              {/* Solutions Routes */}
              <Route path="/solutions/logistics" element={<Logistics/>}/>
              <Route path="/solutions/transportation" element={<Transportation/>}/>
              <Route path="/solutions/distribution" element={<Distribution/>}/>
              <Route path="/solutions/enterprise" element={<Enterprise/>}/>
              
              {/* Resources Routes */}
              <Route path="/resources/blog" element={<Blog/>}/>
              <Route path="/resources/guides" element={<Guides/>}/>
              <Route path="/resources/support" element={<Support/>}/>
              <Route path="/resources/docs" element={<Documentation/>}/>
              
              {/* Company Routes */}
              <Route path="/company/about" element={<About/>}/>
              <Route path="/company/careers" element={<Careers/>}/>
              <Route path="/company/contact" element={<Contact/>}/>
              <Route path="/company/news" element={<News/>}/>
              
              {/* Old single-page checkout for fallback */}
              <Route path="/checkout-old" element={<Checkout/>}/>
              {/* New multi-step checkout */}
              <Route path="/checkout" element={<CheckoutProvider><CheckoutLayout/></CheckoutProvider>}>
                <Route index element={<CheckoutCart/>} />
                <Route path="cart" element={<CheckoutCart/>} />
                <Route path="details" element={<CheckoutDetails/>} />
                <Route path="payment" element={<CheckoutPayment/>} />
                <Route path="review" element={<CheckoutReview/>} />
              </Route>

              {/* New Portal System */}
              <Route path="/employee/login" element={<EmployeeLogin/>}/>
              <Route path="/customer/login" element={<CustomerLogin/>}/>
              <Route path="/employee/*" element={<ProtectedRoute requiredPortal="employee"><EmployeePortalRouter/></ProtectedRoute>}/>
              <Route path="/admin/*" element={<ProtectedRoute requiredPortal="employee" requiredRole="admin"><AdminDashboard/></ProtectedRoute>}/>
              <Route path="/customer/*" element={<ProtectedRoute requiredPortal="customer"><CustomerPage/></ProtectedRoute>}/>

              {/* Account Routes */}
              <Route path="/account/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
              <Route path="/account/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>} />
              <Route path="/account/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>} />
              <Route path="/account/password" element={<ProtectedRoute><Password/></ProtectedRoute>} />
              <Route path="/account/addresses" element={<ProtectedRoute><Addresses/></ProtectedRoute>} />
              <Route path="/account/payments" element={<ProtectedRoute><Payments/></ProtectedRoute>} />
              
              {/* Wishlist Route */}
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist/></ProtectedRoute>} />

              {/* Support Routes */}
              <Route path="/support/track-order" element={<ProtectedRoute><TrackOrder/></ProtectedRoute>} />
              <Route path="/support/returns" element={<ProtectedRoute><Returns/></ProtectedRoute>} />
              <Route path="/support/chat" element={<ProtectedRoute><Chat/></ProtectedRoute>} />
              <Route path="/support/packaging-help" element={<ProtectedRoute><PackagingHelp/></ProtectedRoute>} />

            {/* Legacy admin routes - keep for backward compatibility */}
            <Route path="/admin/signin" element={<EmployeeLogin/>}/>
            <Route path="/customer/signin" element={<CustomerLogin/>}/>
          </Routes>
        </BrowserRouter>
        </ThemeProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

// --- CSS Styles ---

export default App;
