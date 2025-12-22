import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

function AuthRedirect() {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/chat", { replace: true });   // if logged in → chat
    } else {
      navigate("/onBoarding", { replace: true });       // if not logged in → onboarding
    }
  }, [authUser]);

  return null; // nothing to render, just redirects
}

export default AuthRedirect;