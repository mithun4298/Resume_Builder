import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, FileText } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface NavigationProps {
  logo?: React.ReactNode;
  companyName?: string;
  navLinks?: NavLink[];
  showAuthButtons?: boolean;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  className?: string;
  transparent?: boolean;
}

const defaultNavLinks: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navigation({
  logo,
  companyName = "ResumeBuilder Pro",
  navLinks = defaultNavLinks,
  showAuthButtons = true,
  onLoginClick = () => (window.location.href = "/api/login"),
  onSignupClick = () => (window.location.href = "/api/login"),
  className = "",
  transparent = false
}: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const baseClasses = transparent 
    ? "bg-white/80 backdrop-blur-md" 
    : "bg-white shadow-sm";

  return (
    <nav className={`${baseClasses} fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            {logo || (
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-slate-900">{companyName}</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-slate-700 hover:text-blue-600 transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          {showAuthButtons && (
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onLoginClick}
                className="text-slate-700 hover:text-blue-600"
              >
                Sign In
              </Button>
              <Button
                onClick={onSignupClick}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-slate-700 hover:text-blue-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  {link.label}
                </a>
              ))}
              {showAuthButtons && (
                <>
                  <Button
                    variant="ghost"
                    onClick={onLoginClick}
                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={onSignupClick}
                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}