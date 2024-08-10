import { useState, useEffect, useMemo, useContext } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import routes from "routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import { setupAxiosInterceptors } from "./services/interceptor";
import ProtectedRoute from "examples/ProtectedRoute";
import Login from "auth/login";
import { AuthContext } from "context";
import { Helmet } from "react-helmet";

const suppressErrors = () => {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (/defaultProps/.test(args[0])) {
      return;
    }
    if (/A props object containing a "key" prop is being spread into JSX/.test(args[0])) {
      return;
    }
    originalConsoleError(...args);
  };
};

suppressErrors();

export default function App() {
  const authContext = useContext(AuthContext);
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    setIsDemo(process.env.REACT_APP_IS_DEMO === "true");
  }, []);

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });
    setRtlCache(cacheRtl);
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const navigate = useNavigate();
  setupAxiosInterceptors(() => {
    authContext.logout();
    navigate("/auth/login");
  });

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route && route.type !== "auth" && (route.name !== "Usuarios" || (authContext.isAdmin && route.name === "Usuarios"))) {
        return (
          <Route
            exact
            path={route.route}
            element={
              <ProtectedRoute isAuthenticated={authContext.isAuthenticated} isAdmin={authContext.isAdmin}>
                {route.component}
              </ProtectedRoute>
            }
            key={route.key}
          />
        );
      }
      return null;
    });

  return (
    <>
      {isDemo && (
        <Helmet>
          <meta name="keywords" content="Konecta" />
          <meta name="description" content="Konecta" />
          <meta itemProp="name" content="Konecta" />
          <meta itemProp="description" content="Konecta" />
        </Helmet>
      )}
      {direction === "rtl" ? (
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
            <CssBaseline />
            {layout === "dashboard" && (
              <>
                <Sidenav
                  color={sidenavColor}
                  brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                  brandName="Konecta"
                  routes={routes}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                />
                <Configurator />
              </>
            )}
            {layout === "vr" && <Configurator />}
            <Routes>
              <Route path="login" element={<Navigate to="/auth/login" />} />
              <Route path="register" element={<Navigate to="/auth/register" />} />
              <Route path="forgot-password" element={<Navigate to="/auth/forgot-password" />} />
              {getRoutes(routes)}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </ThemeProvider>
        </CacheProvider>
      ) : (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                brandName="Konecta"
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              <Configurator />
            </>
          )}
          {layout === "vr" && <Configurator />}
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </ThemeProvider>
      )}
    </>
  );
}
