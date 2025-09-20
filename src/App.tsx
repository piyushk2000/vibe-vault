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

export function PrivateRoute() {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // Redirect to error page for unauthorized access
    return (
      <Navigate
        to="/error"
        state={{
          errorCode: '401',
          errorMessage: 'Unauthorized Access',
          error: 'You need to be logged in to access this page',
        }}
        replace
      />
    );
  }
  
  return <Outlet />;
}

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
