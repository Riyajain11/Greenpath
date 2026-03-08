import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CropForm from "./pages/CropForm";
import MyCrops from "./pages/MyCrops";
import CropsInfo from "./pages/CropsInfo";
import CropDetails from "./pages/CropDetails"; 
import EditCrop from "./pages/EditCrop"; 
import AIPriceCheck from "./pages/AIPriceCheck";
import Fertilizers from "./pages/Fertilizers";
import MyOrders from "./pages/MyOrders";

const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" replace />;
};

const Layout = () => {
  const location = useLocation();

  // Hide navbar on CropForm and EditCrop
  const hideNavbarRoutes = ["/cropform", "/edit-crop"];

  const shouldHideNavbar = hideNavbarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavbar && <Navbar />}

      <main className="flex-grow ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/crops-info" element={<CropsInfo />} />
          <Route path="/ai-price-check" element={<AIPriceCheck />} />
          <Route path="/fertilizers" element={<Fertilizers />} />

          {/* Crop submission form */}
          <Route
            path="/cropform"
            element={
              <PrivateRoute>
                <CropForm />
              </PrivateRoute>
            }
          />

          {/* My submitted crops */}
          <Route
            path="/mycrops"
            element={
              <PrivateRoute>
                <MyCrops />
              </PrivateRoute>
            }
          />
       <Route
          path="/my-orders"
          element={
            <PrivateRoute>
              <MyOrders />
            </PrivateRoute>
          }
        />  
          {/* Single crop details page */}
          <Route
            path="/crop/:id"
            element={
              <PrivateRoute>
                <CropDetails />
              </PrivateRoute>
            }
          />

          {/* Edit crop form */}
          <Route
            path="/edit-crop/:id"
            element={
              <PrivateRoute>
                <EditCrop />
              </PrivateRoute>
            }
          />
        </Routes>
       
      </main>

      <Footer />
    </div>
  );
};

const App = () => (
  <Router>
    <Layout />
  </Router>
);

export default App;
