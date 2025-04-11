
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { User } from "@/types";

interface LayoutProps {
  children: ReactNode;
  user?: User;
  hideFooter?: boolean;
  minimal?: boolean; // Add minimal flag for payment redirects
}

const Layout = ({ children, user, hideFooter = false, minimal = false }: LayoutProps) => {
  if (minimal) {
    return (
      <div className="min-h-screen flex flex-col bg-background dark:bg-background text-foreground dark:text-foreground">
        <main className="flex-grow">
          <div className="page-transition">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-background text-foreground dark:text-foreground">
      <Header />
      <main className="flex-grow">
        <div className="page-transition">
          {children}
        </div>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
