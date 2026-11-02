
import Navbar from "../components/navbar";

function Home() {
  const products = [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 1999,
      image: "https://placehold.co/300x200?text=Headphones",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 2499,
      image: "https://placehold.co/300x200?text=Smart+Watch",
    },
    {
      id: 3,
      name: "Running Shoes",
      price: 1599,
      image: "https://placehold.co/300x200?text=Shoes",
    },
    {
      id: 4,
      name: "Backpack",
      price: 999,
      image: "https://placehold.co/300x200?text=Backpack",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Reusable Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-blue-600 px-6 py-16 text-center text-white">
        <h2 className="mb-3 text-4xl font-bold">
          Welcome to AthletiX
        </h2>

        <p className="text-lg">
          Discover amazing products at the best prices.
        </p>
      </section>

      {/* Products */}
      <section className="px-8 py-10">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">
          Our Products
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="text-lg font-semibold">
                  {product.name}
                </h3>

                <p className="my-3 text-xl font-bold text-blue-600">
                  ₹{product.price}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => window.location.href = "/login"}
                    className="flex-1 rounded-lg border border-blue-600 py-2 text-blue-600 hover:bg-blue-50"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={() => window.location.href = "/login"}
                    className="flex-1 rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}

export default Home;
