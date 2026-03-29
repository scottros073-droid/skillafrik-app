// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">SkillAfrik</h3>
          <p className="text-gray-400">Connecting businesses with top freelancers worldwide.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/">About Us</Link></li>
            <li><Link to="/">Careers</Link></li>
            <li><Link to="/">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/help" className="hover:text-white transition">Help Center</Link></li>
            <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
            <li><Link to="/support" className="hover:text-white transition">Contact Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/legal/terms" className="hover:text-white transition">Terms of Service</Link></li>
            <li><Link to="/legal/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="/legal/community-guidelines" className="hover:text-white transition">Community Guidelines</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-8">&copy; 2026 SkillAfrik. All rights reserved.</div>
    </footer>
  );
}
