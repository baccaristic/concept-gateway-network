
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const HeaderThemeToggle = () => {
  return (
    <div className="ml-2">
      <ThemeToggle />
    </div>
  );
};

export default HeaderThemeToggle;
