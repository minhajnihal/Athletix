import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="border-t-2 border-red-600 bg-black text-zinc-400">

      {/* Main Footer Content */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand Information */}
        <div>
          <div
            onClick={() => navigate("/")}
            className="flex cursor-pointer items-center gap-2 select-none"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 font-black text-white shadow-md shadow-red-600/30">
              A
            </span>
            <span className="text-2xl font-black text-white tracking-tight">
              ATHLETI<span className="text-red-600">X</span>
            </span>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-zinc-400">
            Engineered for relentless athletes and champions. AthletiX delivers tournament-grade gear, protective kits, and performance apparel across 16+ sports disciplines.
          </p>

          <div className="mt-6 flex items-center gap-4 text-xs font-bold text-zinc-300">
            <span className="hover:text-red-500 cursor-pointer transition">Facebook</span>
            <span className="hover:text-red-500 cursor-pointer transition">Instagram</span>
            <span className="hover:text-red-500 cursor-pointer transition">YouTube</span>
            <span className="hover:text-red-500 cursor-pointer transition">Twitter</span>
          </div>
        </div>

        {/* Shop Disciplines */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-white">
            Shop Collections
          </h4>

          <ul className="mt-4 space-y-2.5 text-xs">
            <li>
              <button
                onClick={() => navigate("/sports/all")}
                className="transition hover:text-red-400"
              >
                All Sports Equipment
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/sports/men")}
                className="transition hover:text-red-400"
              >
                Men's Athletic Gear
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/sports/women")}
                className="transition hover:text-red-400"
              >
                Women's Performance
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/sports/kids")}
                className="transition hover:text-red-400"
              >
                Youth & Kids Sports
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/category/cricket")}
                className="transition hover:text-red-400"
              >
                Cricket Tournament Kits
              </button>
            </li>
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-white">
            Customer Care
          </h4>

          <ul className="mt-4 space-y-2.5 text-xs">
            <li><a href="#" className="transition hover:text-red-400">Shipping Policy & Tracking</a></li>
            <li><a href="#" className="transition hover:text-red-400">Returns & Replacement (30 Days)</a></li>
            <li><a href="#" className="transition hover:text-red-400">Product Authenticity Check</a></li>
            <li><a href="#" className="transition hover:text-red-400">Size Guide & Equipment FAQ</a></li>
            <li><a href="#" className="transition hover:text-red-400">Terms & Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-white">
            Get in Touch
          </h4>

          <div className="mt-4 space-y-2.5 text-xs">
            <p className="flex items-center gap-2">
              <span className="text-red-500 font-bold">📍</span> Kerala, India
            </p>
            <p className="flex items-center gap-2">
              <span className="text-red-500 font-bold">📧</span> support@athletix.com
            </p>
            <p className="flex items-center gap-2">
              <span className="text-red-500 font-bold">📞</span> +91 98765 43210
            </p>
          </div>

          <div className="mt-6 border-t border-zinc-800 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Payment Methods Accepted
            </p>
            <p className="mt-1 text-xs text-zinc-300">
              UPI • Net Banking • Visa • Mastercard • Cash on Delivery
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-900 px-6 py-5 bg-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-zinc-500 sm:flex-row">
          <p>© {new Date().getFullYear()} AthletiX Inc. All rights reserved.</p>
          <p className="text-zinc-500">Built for champions & competitive athletes worldwide</p>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
