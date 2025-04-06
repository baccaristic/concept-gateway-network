
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import {User} from "@/types";

interface LayoutProps {
  children: ReactNode;
  user?: User;
  hideFooter?: boolean;
}

const Layout = ({ children, user, hideFooter = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} />
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
