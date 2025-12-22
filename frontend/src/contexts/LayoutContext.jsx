import { useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import VerticalNavbar from "../components/VerticalNavbar"; 
import MyProfile from "@/components/modals/MyProfile";

const Layout = ({ children }) => {
  const location = useLocation();
  const { authUser, showMyProfile } = useAuthStore();

  const path = location.pathname;
  const noNavbarPages = ["/login", "/signup", "/onBoarding"];
  const showNavbar = !noNavbarPages.includes(path) && authUser;

  return (
    <div className="flex min-h-[100vh] w-[100vw]">
      {showNavbar && <VerticalNavbar />}
      {showMyProfile && <MyProfile />}
      
      <div className={`${showNavbar ? "pl-[60px] md:pl-0 " : ""}  flex-1`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
