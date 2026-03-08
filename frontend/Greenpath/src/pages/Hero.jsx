import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('/farmers-hero.jpg')`,
      }}
    >
      {/* Softer overlay so navbar visible */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">

        {/* Heading */}
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight tracking-tight"
        >
          Empowering Farmers.Connecting Markets.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg md:text-xl max-w-xl text-gray-200"
        >
          GreenPath helps farmers reach the right buyers with smart AI insights
          and seamless marketplace tools.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/cropform"
            className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-full shadow-md text-white font-semibold transition"
          >
            Submit Crops
          </Link>

          <Link
            to="/crops-info"
            className="px-8 py-3 bg-white/90 hover:bg-white text-green-700 rounded-full shadow-md font-semibold transition"
          >
            Know More
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
