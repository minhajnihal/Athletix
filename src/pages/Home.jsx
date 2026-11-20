import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import ProductCard from "../components/ProductCard";

const sportsCategories = [
  {
    name: "Cricket",
    category: "cricket",
    tag: "Team Sports",
    subtitle: "Bats, Balls & Safety Kits",
    image: "https://i.pinimg.com/736x/39/85/0a/39850a1c7b67adf9512dfdbdf7ae76cb.jpg",
    icon: "🏏",
  },
  {
    name: "Football",
    category: "football",
    tag: "Team Sports",
    subtitle: "Match Balls, Boots & Shin Guards",
    image: "https://i.pinimg.com/736x/a8/c3/38/a8c33859d466baaf1711a8c478f999e1.jpg",
    icon: "⚽",
  },
  {
    name: "Cycling",
    category: "cycling",
    tag: "Outdoor & Adventure",
    subtitle: "Bicycles, Helmets & Gloves",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
    icon: "🚴",
  },
  {
    name: "Fitness",
    category: "fitness",
    tag: "Fitness & Gym",
    subtitle: "Dumbbells, Mats & Gym Gear",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    icon: "🏋️",
  },
  {
    name: "Badminton",
    category: "badminton",
    tag: "Racket & Court",
    subtitle: "Rackets, Shuttlecocks & Nets",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
    icon: "🏸",
  },
  {
    name: "Basketball",
    category: "basketball",
    tag: "Team Sports",
    subtitle: "Hoops, Balls & Grip Shoes",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80",
    icon: "🏀",
  },
  {
    name: "Swimming",
    category: "swimming",
    tag: "Water Sports",
    subtitle: "Goggles, Caps & Swimwear",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80",
    icon: "🏊",
  },
  {
    name: "Tennis",
    category: "tennis",
    tag: "Racket & Court",
    subtitle: "Pro Rackets, Balls & Grips",
    image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
    icon: "🎾",
  },
  {
    name: "Running",
    category: "running",
    tag: "Fitness & Gym",
    subtitle: "Running Shoes, Trackers & Belts",
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80",
    icon: "🏃",
  },
  {
    name: "Hiking",
    category: "hiking",
    tag: "Outdoor & Adventure",
    subtitle: "Backpacks, Trek Poles & Boots",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
    icon: "🥾",
  },
  {
    name: "Yoga",
    category: "yoga",
    tag: "Fitness & Gym",
    subtitle: "Eco Mats, Blocks & Straps",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    icon: "🧘",
  },
  {
    name: "Camping",
    category: "camping",
    tag: "Outdoor & Adventure",
    subtitle: "Tents, Lanterns & Sleeping Bags",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
    icon: "⛺",
  },
  {
    name: "Volleyball",
    category: "volleyball",
    tag: "Team Sports",
    subtitle: "Indoor & Beach Volleyballs",
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
    icon: "🏐",
  },
  {
    name: "Boxing",
    category: "boxing",
    tag: "Combat Sports",
    subtitle: "Gloves, Wraps & Punch Bags",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
    icon: "🥊",
  },
  {
    name: "Table Tennis",
    category: "table-tennis",
    tag: "Racket & Court",
    subtitle: "Paddles, Balls & Retractable Nets",
    image: "https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=800&q=80",
    icon: "🏓",
  },
  {
    name: "Skating",
    category: "skating",
    tag: "Outdoor & Adventure",
    subtitle: "Skateboards, Roller Blades & Pads",
    image: "https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=800&q=80",
    icon: "🛹",
  },
];

const categoryTabs = [
  "All",
  "Team Sports",
  "Racket & Court",
  "Fitness & Gym",
  "Outdoor & Adventure",
];

const valuePropositions = [
  {
    title: "Free Fast Delivery",
    description: "Free shipping across India on orders over ₹999",
    icon: (
      <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  {
    title: "100% Genuine Gear",
    description: "Certified equipment tested for high impact",
    icon: (
      <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "30-Day Easy Returns",
    description: "Hassle-free replacement or refund guarantee",
    icon: (
      <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: "Pro Athlete Grade",
    description: "Built for beginners to fierce competitive athletes",
    icon: (
      <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const audienceCollections = [
  {
    title: "Men's Arsenal",
    subtitle: "Engineered for maximum power, endurance & athletic performance.",
    audience: "men",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    badge: "For Men",
  },
  {
    title: "Women's Force",
    subtitle: "Dynamic sports apparel, lightweight gear & high-intensity training essentials.",
    audience: "women",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    badge: "For Women",
  },
  {
    title: "Young Champions",
    subtitle: "Safe, durable & high-quality sporting gear for future champions.",
    audience: "kids",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
    badge: "For Kids",
  },
];

function Home() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("All");

  const { data: products = [], isLoading: productsLoading } = useProduct();

  const filteredCategories =
    selectedTab === "All"
      ? sportsCategories
      : sportsCategories.filter((item) => item.tag === selectedTab);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero Section - Aggressive Red & Black */}
      <section className="relative overflow-hidden bg-black text-white">
        {/* Background Image with Aggressive Crimson Overlay */}
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1920&q=80"
            alt="Sports Action Background"
            className="h-full w-full object-cover filter grayscale contrast-125"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-zinc-950/95 to-red-950/80 z-0" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-600/15 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-red-400 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
              Fierce Sports Gear 2026
            </span>

            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl text-white uppercase">
              Power Your Passion. <br />
              <span className="text-red-500">Play Without Limits.</span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg font-medium">
              Equip yourself with tournament-grade sports gear, high-impact apparel, and fitness equipment forged for relentless athletes. From cricket pitches to intense gym sessions, dominate every game.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/sports/all")}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-8 py-3.5 text-base font-black uppercase tracking-wider text-white shadow-xl shadow-red-600/35 transition hover:bg-white hover:text-black"
              >
                <span>Explore All Gear</span>
                <span>→</span>
              </button>

              <button
                onClick={() => {
                  const element = document.getElementById("categories-section");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="rounded-xl border-2 border-zinc-700 bg-zinc-900/60 px-8 py-3.5 text-base font-black uppercase tracking-wider text-zinc-200 backdrop-blur-sm transition hover:border-red-600 hover:bg-black hover:text-white"
              >
                View Categories
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-zinc-800 pt-8">
              <div>
                <p className="text-2xl font-black text-white sm:text-3xl">16+</p>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 sm:text-sm">Sports Covered</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white sm:text-3xl">250+</p>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 sm:text-sm">Verified Products</p>
              </div>
              <div>
                <p className="text-2xl font-black text-red-500 sm:text-3xl">100%</p>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 sm:text-sm">Genuine Gear</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions / Trust Strip */}
      <section className="border-y border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valuePropositions.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 transition hover:border-red-500/50 hover:bg-zinc-900"
              >
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-black shadow-sm ring-1 ring-zinc-800">
                  {item.icon}
                </span>
                <div>
                  <h4 className="font-extrabold text-white text-sm">
                    {item.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-zinc-400 font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Categories Section */}
      <section id="categories-section" className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-500">
              Complete Sports Catalog
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Shop by Sport Category
            </h2>
            <p className="mt-2 text-sm text-zinc-400 font-medium">
              Select your sport to find tournament-ready equipment, protective kits, and apparel.
            </p>
          </div>

          <button
            onClick={() => navigate("/sports/all")}
            className="inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-wider text-red-500 hover:text-white"
          >
            <span>Browse All Gear ({products.length})</span>
            <span>→</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-2">
          {categoryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`rounded-full px-5 py-2 text-xs font-black tracking-wider uppercase transition ${
                selectedTab === tab
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30 ring-1 ring-red-500"
                  : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-red-600 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Categories Grid with Rich Images */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredCategories.map((sport) => (
            <div
              key={sport.category}
              onClick={() => navigate(`/category/${sport.category}`)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 shadow-xl border border-zinc-800 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-red-600"
            >
              {/* Image Container with Zoom effect */}
              <div className="relative h-48 w-full overflow-hidden bg-black">
                <img
                  src={sport.image}
                  alt={sport.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110 filter contrast-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80";
                  }}
                />

                {/* Aggressive gradient overlay on top of image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                {/* Category Icon Badge */}
                <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black/90 text-xl shadow-md border border-zinc-700 backdrop-blur-sm">
                  {sport.icon}
                </span>

                {/* Category Tag */}
                <span className="absolute top-3 right-3 rounded-full bg-red-600/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-sm">
                  {sport.tag}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 bg-zinc-900">
                <h3 className="text-lg font-black text-white group-hover:text-red-500 transition">
                  {sport.name}
                </h3>

                <p className="mt-1 text-xs text-zinc-400 font-medium">
                  {sport.subtitle}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3 text-xs font-black uppercase tracking-wider text-red-500 group-hover:text-white">
                  <span>Explore Gear</span>
                  <span className="transition duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audience Collections Banner (Men, Women, Kids) */}
      <section className="bg-zinc-950 py-16 border-y border-zinc-800">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <span className="text-xs font-black uppercase tracking-widest text-red-500">
              Aggressive Performance
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Shop by Collection
            </h2>
            <p className="mt-2 text-sm text-zinc-400 font-medium">
              Curated gear and attire tailored for men, women, and young athletes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {audienceCollections.map((col) => (
              <div
                key={col.audience}
                onClick={() => navigate(`/sports/${col.audience}`)}
                className="group relative h-96 cursor-pointer overflow-hidden rounded-2xl shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl border border-zinc-800 hover:border-red-600"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-110 filter contrast-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <span className="w-fit rounded-full bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-wider shadow-sm">
                    {col.badge}
                  </span>

                  <h3 className="mt-3 text-2xl font-black uppercase tracking-tight">
                    {col.title}
                  </h3>

                  <p className="mt-2 text-xs text-zinc-300 font-medium">
                    {col.subtitle}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/sports/${col.audience}`);
                    }}
                    className="mt-5 w-fit rounded-xl bg-white px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-lg transition hover:bg-red-600 hover:text-white"
                  >
                    Shop Collection →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending / Featured Products Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-red-500">
              Battle-Tested Equipment
            </span>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-tight text-white">
              Trending Pro Gear
            </h2>
            <p className="mt-1 text-sm text-zinc-400 font-medium">
              Bestselling equipment chosen by competitive athletes and sports champions.
            </p>
          </div>

          <button
            onClick={() => navigate("/sports/all")}
            className="rounded-xl border-2 border-red-600 px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-600 hover:text-white"
          >
            View Full Store →
          </button>
        </div>

        {productsLoading ? (
          <div className="mt-8 flex h-60 items-center justify-center">
            <div className="flex items-center gap-3 text-zinc-400">
              <svg className="h-5 w-5 animate-spin text-red-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span className="text-sm font-bold">Loading trending gear...</span>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Clearance / Season Sale Banner - Aggressive Fire Red */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-red-900 to-black p-8 text-white shadow-2xl shadow-red-950/50 border border-red-600/50 sm:p-14">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block rounded-full bg-black/60 border border-red-400/30 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-yellow-300 backdrop-blur-sm">
              ★ High-Intensity Season Deal
            </span>

            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight sm:text-4xl text-white">
              Upgrade Your Training Gear & Save Up to 30%
            </h2>

            <p className="mt-3 text-sm text-zinc-200 sm:text-base font-medium">
              Tournament-ready cricket willow bats, pro football kits, carbon tennis rackets, and cast iron weights. Built for victory.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate("/sports/all")}
                className="rounded-xl bg-black px-7 py-3 font-black uppercase tracking-wider text-white shadow-xl transition hover:bg-white hover:text-black"
              >
                Claim Deal Now
              </button>

              <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-4 py-2.5 text-xs font-bold backdrop-blur-sm">
                <span className="text-zinc-300">Use Code:</span>
                <span className="font-mono text-sm font-black text-yellow-400">
                  ATHLETIX30
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
