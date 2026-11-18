import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/navbar";
import AppRoutes from "./routes/AppRoutes";

function renderToastIcon({ type }) {
  if (type === "success") {
    return (
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 text-xs font-bold text-emerald-500">
        ✓
      </span>
    );
  }
  if (type === "error") {
    return (
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-red-500 text-xs font-bold text-red-500">
        ✕
      </span>
    );
  }
  if (type === "warning") {
    return (
      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-amber-500 text-xs font-bold text-amber-500">
        !
      </span>
    );
  }
  return (
    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-red-500 text-xs font-bold text-red-500">
      ℹ
    </span>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={2200}
        hideProgressBar={true}
        closeButton={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="dark"
        icon={renderToastIcon}
      />
    </BrowserRouter>
  );
}

export default App;
