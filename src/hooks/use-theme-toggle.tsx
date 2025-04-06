
import { useCallback } from "react";
import HeaderThemeToggle from "@/components/HeaderThemeToggle";

export function useThemeToggle() {
  const getThemeToggle = useCallback(() => {
    return <HeaderThemeToggle />;
  }, []);

  return { getThemeToggle };
}
