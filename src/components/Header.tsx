
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, LogOut, User, Settings, UserPlus, 
  BookOpen, Lightbulb, DollarSign, FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { User as UserType } from '@/types';
import NotificationBell from './NotificationBell';

interface HeaderProps {
  user?: UserType;
}

const Header = ({ user }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useAuth(); // Fix: Use signOut instead of logout
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    signOut();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRouteForUserRole = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return '/admin-dashboard';
      case 'expert':
        return '/expert-dashboard';
      case 'investor':
        return '/investor-dashboard';
      case 'idea-holder':
      default:
        return '/dashboard';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-primary flex items-center">
            <Lightbulb className="mr-2 h-6 w-6" />
            <span className="hidden sm:inline">Concept Gateway</span>
          </Link>

          {/* Desktop Navigation - Only show when not authenticated */}
          {!user && (
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-primary">Home</Link>
              <Link to="/" className="text-gray-600 hover:text-primary">How It Works</Link>
              <Link to="/" className="text-gray-600 hover:text-primary">About Us</Link>
              <Link to="/" className="text-gray-600 hover:text-primary">Contact</Link>
            </nav>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <NotificationBell />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{getInitials(user.name || 'User')}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate(getRouteForUserRole(user.role || ''))}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      {user.role?.toLowerCase() === 'idea-holder' && (
                        <DropdownMenuItem onClick={() => navigate('/submit-idea')}>
                          <Lightbulb className="mr-2 h-4 w-4" />
                          <span>Submit Idea</span>
                        </DropdownMenuItem>
                      )}
                      {user.role?.toLowerCase() === 'investor' && (
                        <DropdownMenuItem onClick={() => navigate('/investor-dashboard')}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          <span>Investments</span>
                        </DropdownMenuItem>
                      )}
                      {user.role?.toLowerCase() === 'expert' && (
                        <DropdownMenuItem onClick={() => navigate('/expert-dashboard')}>
                          <FileCheck className="mr-2 h-4 w-4" />
                          <span>Evaluations</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => navigate('/login')}>Log In</Button>
                <Button onClick={() => navigate('/register')}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              {/* Only show public navigation links when not authenticated */}
              {!user && (
                <>
                  <Link to="/" className="text-gray-600 hover:text-primary" onClick={toggleMenu}>Home</Link>
                  <Link to="/" className="text-gray-600 hover:text-primary" onClick={toggleMenu}>How It Works</Link>
                  <Link to="/" className="text-gray-600 hover:text-primary" onClick={toggleMenu}>About Us</Link>
                  <Link to="/" className="text-gray-600 hover:text-primary" onClick={toggleMenu}>Contact</Link>
                </>
              )}
              
              {user ? (
                <>
                  <div className={`${!user ? 'pt-2 border-t border-gray-200' : ''}`}>
                    <Link 
                      to={getRouteForUserRole(user.role || '')} 
                      className="flex items-center text-gray-600 hover:text-primary"
                      onClick={toggleMenu}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </div>
                  {user.role?.toLowerCase() === 'idea-holder' && (
                    <Link 
                      to="/submit-idea" 
                      className="flex items-center text-gray-600 hover:text-primary"
                      onClick={toggleMenu}
                    >
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Submit Idea
                    </Link>
                  )}
                  <button 
                    className="flex items-center text-red-600 hover:text-red-700"
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigate('/login');
                      toggleMenu();
                    }}
                  >
                    Log In
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/register');
                      toggleMenu();
                    }}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
