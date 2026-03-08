import { motion } from "framer-motion";
import { useEffect } from "react";

const contentData = [
  {
    title: "Natural Farming",
    description:
      "Promoting eco-friendly practices to improve soil health and sustainability. Inspired by traditional methods.",
    icon: "🌿",
    image:
       "https://plus.unsplash.com/premium_photo-1731356517948-ee7b9122a1fc?q=80&w=1633&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Quality Products",
    description:
      "We ensure farmers get the best price and consumers get premium produce. No middlemen, just fresh supply.",
    icon: "✅",
    image:
      "https://images.unsplash.com/photo-1621956838481-f8f616950454?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function ContentSections() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="bg-white py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-center text-green-900 mb-12"
        >
          Empowering Agriculture, One Step at a Time
        </motion.h2>

        <div className="grid gap-10 md:grid-cols-2">
          {contentData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 hover:-translate-y-1"

            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  {item.icon} {item.title}
                </h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8"
        >
          <img
            src="https://plus.unsplash.com/premium_photo-1661420226112-311050ce30da?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Farmer"
            className="w-64 h-72 object-cover rounded-xl shadow-lg"
          />
          <div>
            <h4 className="text-2xl font-bold text-green-900 mb-2">
              Cultivating Growth Through Unity
            </h4>
            <p className="text-gray-700 max-w-md">
              We partner with passionate farmers to revolutionize agricultural
              practices and connect directly to the market.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
