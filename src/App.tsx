import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import Layout from "./Layout.js";
import ErrorBoundary from "./components/ErrorBoundary";
import { COLORS } from "./theme/colors";
import theme from "./theme/theme";

function App() {
  const isLoading = useSelector((state: any) => state.loading.isLoading);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <>
          {isLoading && (
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1000,
              }}
            >
              <CircularProgress style={{ color: COLORS.ACCENT }} />
            </div>
          )}
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
