
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const HeaderThemeToggle = () => {
  return (
    <div className="flex items-center ml-4">
      <ThemeToggle />
    </div>
  );
};

export default HeaderThemeToggle;
