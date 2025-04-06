
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const HeaderThemeToggle = () => {
  const location = useLocation();
  const isLoginOrRegister = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  if (isLoginOrRegister) {
    return null;
  }

  return (
    <div className="ml-2">
      <ThemeToggle />
    </div>
  );
};

export default HeaderThemeToggle;
