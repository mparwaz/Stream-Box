import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, PlaySquare, LogOut, Menu, X as CloseIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

export type AppView = 'home' | 'tv' | 'movies' | 'latest' | 'search' | 'admin';

interface NavbarProps {
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  currentProfile: UserProfile | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, 
  onClearSearch, 
  currentView, 
  onViewChange, 
  currentProfile,
  onLogout 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      onSearch(val);
    } else {
      onClearSearch();
      setSearchQuery('');
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'tv', label: 'TV Shows' },
    { id: 'movies', label: 'Movies' },
    { id: 'latest', label: 'Latest' }, { id: 'admin', label: 'Admin' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled || isMobileMenuOpen ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="md:hidden flex items-center" ref={mobileMenuRef}>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-1 rounded-md focus:outline-none"
              >
                {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => { onClearSearch(); setSearchQuery(''); onViewChange('home'); setIsMobileMenuOpen(false); }}>
              <PlaySquare className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight hidden sm:block">StreamBox</span>
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => { onClearSearch(); setSearchQuery(''); onViewChange(link.id as AppView); }}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === link.id && !searchQuery
                        ? 'text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <div className="relative flex items-center">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.input
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 140, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-full pl-4 pr-8 py-1.5 focus:outline-none focus:border-zinc-500 mr-1 sm:mr-2 sm:w-[200px]"
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) setIsSearchOpen(false);
                    }}
                  />
                )}
              </AnimatePresence>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-300 hover:text-white p-1 rounded-full focus:outline-none"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
            
            <div className="relative hidden sm:block" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-300 hover:text-white relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-zinc-800">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {[
                        { title: 'New Arrival', desc: 'The Latest Blockbuster is now available.', time: '2 hours ago' },
                        { title: 'Trending', desc: 'Check out what everyone is watching.', time: '1 day ago' },
                        { title: 'Continue Watching', desc: 'Pick up where you left off.', time: '2 days ago' }
                      ].map((notif, i) => (
                        <div key={i} className="px-4 py-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800/50 last:border-0">
                          <p className="text-sm font-medium text-white">{notif.title}</p>
                          <p className="text-xs text-zinc-400 mt-1">{notif.desc}</p>
                          <p className="text-xs text-zinc-500 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={profileRef}>
              <div 
                className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center cursor-pointer overflow-hidden border border-zinc-700"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                {currentProfile ? (
                  <img src={currentProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-zinc-400" />
                )}
              </div>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-sm text-white">Signed in as</p>
                      <p className="text-sm font-medium text-zinc-300 truncate">{currentProfile?.name || 'Guest'}</p>
                    </div>
                    <button 
                      onClick={() => { setShowProfileMenu(false); onLogout(); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2 mt-1"
                    >
                      <LogOut className="h-4 w-4" />
                      Switch Profile
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-zinc-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => { 
                    onClearSearch(); 
                    setSearchQuery(''); 
                    onViewChange(link.id as AppView); 
                    setIsMobileMenuOpen(false); 
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    currentView === link.id && !searchQuery
                      ? 'bg-zinc-900 text-white'
                      : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="border-t border-zinc-800 mt-4 pt-4 pb-1">
                <div className="flex items-center px-3 mb-2">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                    {currentProfile ? (
                      <img src={currentProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-zinc-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{currentProfile?.name || 'Guest'}</div>
                    <div className="text-sm font-medium leading-none text-gray-400 mt-1">Manage Profile</div>
                  </div>
                </div>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onLogout(); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-zinc-800 flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Switch Profile
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
