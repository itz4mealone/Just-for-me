import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Heart, Music, Camera, Book, Mail, LogOut, CheckSquare } from 'lucide-react';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Message from './pages/Message';
import Connect from './pages/Connect';
import Tasks from './pages/Tasks';
import Login from './pages/Login';
import AuthGuard from './components/AuthGuard';
import { signOut } from './lib/auth';

function App() {
  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <Router>
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
                      <Link to="/" className="flex items-center space-x-2">
                        <Heart className="h-6 w-6 text-rose-500" />
                        <span className="font-playfair text-xl">Our Story</span>
                      </Link>
                      <div className="flex items-center space-x-8">
                        <NavLink to="/about">About Us</NavLink>
                        <NavLink to="/gallery">Gallery</NavLink>
                        <NavLink to="/message">Message</NavLink>
                        <NavLink to="/connect">Connect</NavLink>
                        <NavLink to="/tasks">
                          <CheckSquare className="h-5 w-5" />
                        </NavLink>
                        <button
                          onClick={handleSignOut}
                          className="text-gray-700 hover:text-rose-500 transition-colors duration-200"
                        >
                          <LogOut className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
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
                  </Routes>
                </main>
              </div>
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-gray-700 hover:text-rose-500 transition-colors duration-200 font-medium"
    >
      {children}
    </Link>
  );
}

export default App;