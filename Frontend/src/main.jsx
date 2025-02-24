import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "./context/AuthContext";

const Root = () => {
  const [theme, colorMode] = useMode(); 

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StrictMode>
          <BrowserRouter>
            <AuthContextProvider>
              <ToastContainer
                theme="dark"
                position="top-right"
                autoClose={3000}
                closeOnClick
                pauseOnHover={false}
              />
              <App />
            </AuthContextProvider>
          </BrowserRouter>
        </StrictMode>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

createRoot(document.getElementById("root")).render(<Root />);
