
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Headers";
import Footer from "../components/Footer";

const MainLayout = () => {
  const location = useLocation();
  const noFooterPages = ["/products","/favorites", "/cart"]; 
  const hideFooter = noFooterPages.includes(location.pathname);

  return (
    <>
      <Header />
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
};


export default MainLayout;
