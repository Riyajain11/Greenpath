import { Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-10 px-4 md:px-16 ">
      <div className="grid md:grid-cols-3 gap-10">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold">🌱 GreenPath</h2>
          <p className="mt-4 text-gray-200">
            Empowering farmers through direct market access and sustainable practices.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" aria-label="Instagram"><Instagram className="hover:text-green-300" /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin className="hover:text-green-300" /></a>
            <a href="#" aria-label="Facebook"><Facebook className="hover:text-green-300" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Crops Info</a></li>
            <li><a href="#" className="hover:text-white">Submit Crops</a></li>
            <li><a href="#" className="hover:text-white">Insurance</a></li>
            <li><a href="#" className="hover:text-white">Login / Signup</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" /> support@greenpath.in
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" /> +91 9876543210
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Andhra Pradesh, India
            </div>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center mt-10 text-gray-400 text-sm border-t border-green-700 pt-4">
        © {new Date().getFullYear()} GreenPath. All rights reserved.
      </div>
    </footer>
  );
}
