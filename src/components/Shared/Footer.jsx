import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import NavItem from "./NavItem";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-pink-50 via-white to-rose-100 border-t mt-20">
      {/* Glow background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-10 left-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-rose-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-14">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-pink-500">Cake Heaven 🎂</h2>
            <p className="text-gray-600 text-sm">
              Freshly baked cakes made with love. Perfect for every celebration.
            </p>

            {/* Social */}
            <div className="flex gap-3 pt-2 text-gray-600">
              <FaFacebookF className="w-5 h-5 hover:text-pink-500 cursor-pointer transition" />
              <FaInstagram className="w-5 h-5 hover:text-pink-500 cursor-pointer transition" />
              <FaTwitter className="w-5 h-5 hover:text-pink-500 cursor-pointer transition" />
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <div className="flex flex-col space-y-2 text-sm text-gray-600 w-12">
              <NavItem href="/">Home</NavItem>
              <NavItem href="/cakes">Cakes</NavItem>
              <NavItem href="/about">About</NavItem>
              <NavItem href="/contact">Contact</NavItem>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-pink-500 cursor-pointer">
                Birthday Cakes
              </li>
              <li className="hover:text-pink-500 cursor-pointer">
                Wedding Cakes
              </li>
              <li className="hover:text-pink-500 cursor-pointer">
                Custom Orders
              </li>
              <li className="hover:text-pink-500 cursor-pointer">
                Fast Delivery
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h3 className="font-semibold">Stay Updated</h3>
            <p className="text-sm text-gray-600">
              Get special offers & sweet deals 🍓
            </p>

            <div className="flex gap-2">
              <Input placeholder="Your email" />
              <Button className="bg-pink-500 hover:bg-pink-600">Join</Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-3">
          <p>© {new Date().getFullYear()} Cake Heaven. All rights reserved.</p>

          <div className="flex gap-4">
            <span className="hover:text-pink-500 cursor-pointer">Privacy</span>
            <span className="hover:text-pink-500 cursor-pointer">Terms</span>
            <span className="hover:text-pink-500 cursor-pointer">Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
