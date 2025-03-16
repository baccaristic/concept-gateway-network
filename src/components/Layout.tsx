
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  hideFooter?: boolean;
}

const Layout = ({ children, user, hideFooter = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
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
