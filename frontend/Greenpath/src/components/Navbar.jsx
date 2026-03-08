import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {

  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const isHome = location.pathname === "/";

 //    READ USER
 
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored).user || JSON.parse(stored) : null);
    } catch {
      setUser(null);
    }
  }, [location]);

  /* ======================
     SCROLL EFFECT
  ====================== */
  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  /* ======================
     NAV ITEMS
  ====================== */

  const commonNav = [
    { name: "Home", path: "/" },
    { name: "Crops Info", path: "/crops-info" },
    { name: "AI Price Check", path: "/ai-price-check" },
    { name: "Fertilizers", path: "/fertilizers" },
  ];

  const loggedInNav = [
    { name: "SubmitCrop", path: "/cropform" },
    { name: "MyCrops", path: "/mycrops" },
    { name: "My Orders", path: "/my-orders" },
  ];

  const navItems = user ? [...commonNav, ...loggedInNav] : commonNav;

  /* ======================
     LOGOUT
  ====================== */

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  /* ======================
     STYLE LOGIC (APPLE STYLE)
  ====================== */

  const navbarStyle =
    isHome && !scrolled
      ? "bg-transparent backdrop-blur-md"
      : "bg-white shadow-md";

  const textColor =
    isHome && !scrolled
      ? "text-white drop-shadow-md"
      : "text-green-700";

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${navbarStyle}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-10 py-4 flex justify-between items-center">

        {/* LOGO LEFT ALIGNED */}
        <div className={`text-3xl font-bold ${textColor}`}>
          GreenPath 🌱
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center space-x-6">

          {navItems.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className={`no-underline font-medium transition ${
                isHome && !scrolled
                  ? "text-white hover:text-green-200"
                  : "text-gray-700 hover:text-green-700"
              }`}
            >
              {name}
            </Link>
          ))}

          {!user ? (
            <>
            <Link
              to="/login"
              className={`no-underline font-medium transition ${
                isHome && !scrolled
                  ? "text-white hover:text-green-200"
                  : "text-gray-700 hover:text-green-700"
              }`}
            >
                Login
              </Link>
             <Link
              to="/signup"
              className={`no-underline font-medium transition ${
                isHome && !scrolled
                  ? "text-white hover:text-green-200"
                  : "text-gray-700 hover:text-green-700"
              }`}
            >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* MOBILE MENU */}
        <div className="md:hidden">
          <button onClick={() => setNavOpen(!navOpen)} className={textColor}>
            {navOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      </div>

     {/* Mobile dropdown */}
{navOpen && (
  <div className="md:hidden backdrop-blur-lg bg-white/90 shadow-md px-4 pb-6 pt-4 space-y-4">

    {navItems.map(({ name, path }) => (
      <Link
        key={name}
        to={path}
        onClick={() => setNavOpen(false)}
        className="block text-gray-800 hover:text-green-600 transition duration-300"
      >
        {name}
      </Link>
    ))}

    {/* LOGIN / LOGOUT SECTION */}
    {!user ? (
      <div className="flex flex-col gap-3 pt-4 border-t">
        <Link
          to="/login"
          onClick={() => setNavOpen(false)}
          className="text-center border border-green-600 text-green-700 py-2 rounded hover:bg-green-50"
        >
          Login
        </Link>

        <Link
          to="/signup"
          onClick={() => setNavOpen(false)}
          className="text-center bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Sign Up
        </Link>
      </div>
    ) : (
      <button
        onClick={logout}
        className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>
    )}

  </div>
)}

    </motion.nav>
  );
};

export default Navbar;

