
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X, Bell, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

const Header = ({ user }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { profile, signOut } = useAuth();

  // Use profile from auth context if available, otherwise fallback to passed user prop
  const currentUser = profile || user;

  // Navigation links based on user role
  const getNavLinks = () => {
    if (!currentUser) {
      return [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
      ];
    }

    const links = [{ name: 'Dashboard', path: '/dashboard' }];

    switch (currentUser.role) {
      case 'idea-holder':
        links.push({ name: 'My Ideas', path: '/my-ideas' });
        break;
      case 'expert':
        links.push({ name: 'Ideas to Estimate', path: '/expert-dashboard' });
        break;
      case 'admin':
        links.push(
          { name: 'Admin Dashboard', path: '/admin-dashboard' },
          { name: 'Ideas Management', path: '/ideas-management' },
          { name: 'Users', path: '/users' }
        );
        break;
      case 'investor':
        links.push({ name: 'Explore Ideas', path: '/explore' });
        break;
    }

    return links;
  };

  const navLinks = getNavLinks();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-semibold bg-clip-text text-primary">IdeaVest</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`hover-transition text-sm font-medium ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.avatar || currentUser.avatarUrl} alt={currentUser.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {currentUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/profile" className="w-full">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/settings" className="w-full">Settings</Link>
                    </DropdownMenuItem>
                    {currentUser.role === 'admin' && (
                      <DropdownMenuItem>
                        <Link to="/admin-dashboard" className="w-full">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="container mx-auto px-4 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 px-3 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
