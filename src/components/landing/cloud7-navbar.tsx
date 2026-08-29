import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

interface Cloud7NavbarProps {
  onOpenAboutModal: () => void;
}

export function Cloud7Navbar({ onOpenAboutModal }: Cloud7NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const topOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 bg-[#f4f5f6] ${
        isScrolled ? "border-b border-[#d9dfe0] shadow-xs py-3.5" : "py-5"
      }`}
    >
      <div className="w-[88%] max-w-[75rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Pure Text Brand YONOPOD - No Icons, No Company Subtitle */}
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-display font-medium tracking-tight text-[#131a1b] hover:opacity-90 transition-opacity"
          >
            YONOPOD
          </Link>

          {/* Nav Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, "#features")}
              className="text-sm font-sans font-medium text-[#5e7277] hover:text-[#1c3fc4] transition-colors"
            >
              Features
            </a>
            <a
              href="#fitur-utama"
              onClick={(e) => scrollToSection(e, "#fitur-utama")}
              className="text-sm font-sans font-medium text-[#5e7277] hover:text-[#1c3fc4] transition-colors"
            >
              Solusi
            </a>
            <a
              href="#pricing"
              onClick={(e) => scrollToSection(e, "#pricing")}
              className="text-sm font-sans font-medium text-[#5e7277] hover:text-[#1c3fc4] transition-colors"
            >
              Pricing
            </a>
            <button
              type="button"
              onClick={onOpenAboutModal}
              className="text-sm font-sans font-medium text-[#5e7277] hover:text-[#1c3fc4] transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Auth Button Group */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              to="/login"
              className="text-sm font-sans font-semibold text-[#131a1b] hover:text-[#1c3fc4] transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-5 py-2 text-xs font-sans font-bold uppercase tracking-wider text-white bg-[#1c3fc4] rounded-[4px] hover:bg-[#1230a0] transition-all"
            >
              Try free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/login"
              className="text-xs font-semibold px-2.5 py-1 text-[#1c3fc4] bg-white rounded border border-[#d9dfe0]"
            >
              Sign in
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-[#131a1b] hover:text-[#1c3fc4] focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 bg-white rounded-lg border border-[#d9dfe0] shadow-md space-y-3">
            <div className="flex flex-col gap-2">
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, "#features")}
                className="text-sm font-medium text-[#131a1b] py-1"
              >
                Features
              </a>
              <a
                href="#fitur-utama"
                onClick={(e) => scrollToSection(e, "#fitur-utama")}
                className="text-sm font-medium text-[#131a1b] py-1"
              >
                Solusi
              </a>
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, "#pricing")}
                className="text-sm font-medium text-[#131a1b] py-1"
              >
                Pricing
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAboutModal();
                }}
                className="text-sm font-medium text-[#131a1b] py-1 text-left"
              >
                About
              </button>
            </div>
            <div className="pt-2 border-t border-[#d9dfe0]">
              <Link
                to="/register"
                className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white bg-[#1c3fc4] rounded-[4px] block hover:bg-[#1230a0] transition-colors"
              >
                Try free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
