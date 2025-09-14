import { Bounce, ToastContainer } from "react-toastify";
import "./App.css";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <AppRoutes />
    </>
  );
}

export default App;
