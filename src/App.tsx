import React, { useState } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate,
  Navigate
} from 'react-router-dom';
import { Heart, Menu, X, LogOut, CheckSquare, HomeIcon, UserCircle2, Image, MessageSquare, Phone, TowerControl as GameController } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Message from './pages/Message';
import Connect from './pages/Connect';
import Tasks from './pages/Tasks';
import Games from './pages/Games';
import Login from './pages/Login';
import AuthGuard from './components/AuthGuard';
import { signOut } from './lib/auth';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking a link (for mobile)
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <AuthGuard>
            <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
              <nav className="bg-white/80 backdrop-blur-sm fixed w-full z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                      <Heart className="h-6 w-6 text-rose-500" />
                      <span className="font-playfair text-xl">Our Story</span>
                    </Link>

                    {/* Hamburger Menu Button (visible on mobile) */}
                    <button
                      onClick={toggleMenu}
                      className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
                      aria-label="Menu"
                    >
                      {isMenuOpen ? (
                        <X className="h-6 w-6" />
                      ) : (
                        <Menu className="h-6 w-6" />
                      )}
                    </button>

                    {/* Desktop Navigation (hidden on mobile) */}
                    <div className="hidden md:flex items-center space-x-8">
                      <NavLink to="/" onClick={handleNavClick}>
                        <div className="flex items-center space-x-1">
                          <HomeIcon className="h-5 w-5" />
                          <span>Home</span>
                        </div>
                      </NavLink>
                      <NavLink to="/about" onClick={handleNavClick}>
                        <div className="flex items-center space-x-1">
                          <UserCircle2 className="h-5 w-5" />
                          <span>About Us</span>
                        </div>
                      </NavLink>
                      <NavLink to="/gallery" onClick={handleNavClick}>
                        <div className="flex items-center space-x-1">
                          <Image className="h-5 w-5" />
                          <span>Gallery</span>
                        </div>
                      </NavLink>
                      <NavLink to="/message" onClick={handleNavClick}>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-5 w-5" />
                          <span>Message</span>
                        </div>
                      </NavLink>
                      <NavLink to="/connect" onClick={handleNavClick}>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-5 w-5" />
                          <span>Connect</span>
                        </div>
                      </NavLink>
                      <NavLink to="/tasks" onClick={handleNavClick}>
                        <div className="flex items-center space-x-1">
                          <CheckSquare className="h-5 w-5" />
                          <span>Tasks</span>
                        </div>
                      </NavLink>
                      <NavLink to="/games" onClick={handleNavClick}>
                        <div className="flex items-center space-x-1">
                          <GameController className="h-5 w-5" />
                          <span>Games</span>
                        </div>
                      </NavLink>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-1 text-gray-700 hover:text-rose-500 transition-colors duration-200"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>

                  {/* Mobile Navigation (visible when menu is open) */}
                  {isMenuOpen && (
                    <div className="md:hidden">
                      <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
                        <MobileNavLink to="/" onClick={handleNavClick}>
                          <div className="flex items-center space-x-3">
                            <HomeIcon className="h-5 w-5" />
                            <span>Home</span>
                          </div>
                        </MobileNavLink>
                        <MobileNavLink to="/about" onClick={handleNavClick}>
                          <div className="flex items-center space-x-3">
                            <UserCircle2 className="h-5 w-5" />
                            <span>About Us</span>
                          </div>
                        </MobileNavLink>
                        <MobileNavLink to="/gallery" onClick={handleNavClick}>
                          <div className="flex items-center space-x-3">
                            <Image className="h-5 w-5" />
                            <span>Gallery</span>
                          </div>
                        </MobileNavLink>
                        <MobileNavLink to="/message" onClick={handleNavClick}>
                          <div className="flex items-center space-x-3">
                            <MessageSquare className="h-5 w-5" />
                            <span>Message</span>
                          </div>
                        </MobileNavLink>
                        <MobileNavLink to="/connect" onClick={handleNavClick}>
                          <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5" />
                            <span>Connect</span>
                          </div>
                        </MobileNavLink>
                        <MobileNavLink to="/tasks" onClick={handleNavClick}>
                          <div className="flex items-center space-x-3">
                            <CheckSquare className="h-5 w-5" />
                            <span>Tasks</span>
                          </div>
                        </MobileNavLink>
                        <MobileNavLink to="/games" onClick={handleNavClick}>
                          <div className="flex items-center space-x-3">
                            <GameController className="h-5 w-5" />
                            <span>Games</span>
                          </div>
                        </MobileNavLink>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:text-rose-500 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </nav>

              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/message" element={<Message />} />
                  <Route path="/connect" element={<Connect />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </AuthGuard>
        }
      />
    </Routes>
  );
}

// NavLink component for desktop navigation
function NavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="text-gray-700 hover:text-rose-500 transition-colors duration-200 font-medium"
    >
      {children}
    </Link>
  );
}

// MobileNavLink component for mobile navigation
function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2 text-gray-700 hover:text-rose-500 hover:bg-gray-50 transition-colors duration-200 font-medium rounded-lg"
    >
      {children}
    </Link>
  );
}

export default App;