import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, User, Coffee } from 'lucide-react';
import { useTheme } from '../../theme/ThemeProvider';
import { useRestaurantData } from '../../hooks/useRestaurantData';
import gsap from 'gsap';

const Header = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { restaurant } = useRestaurantData(); // Fetch restaurant data
    const headerRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        gsap.fromTo(headerRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
        );

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper to render logo or text
    const renderLogo = () => {
        if (restaurant?.logo && !logoError) {
            return (
                <img
                    src={restaurant.logo}
                    alt={restaurant.name}
                    className="h-24 w-auto object-contain"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        // Force using the text fallback by hiding image and showing sibling if structure allowed, 
                        // but since conditional return, we need state.
                        // Actually, easier to just use state since this component is simple.
                        setLogoError(true);
                    }}
                />
            );
        }
        return (
            <div className="flex items-center gap-2 group">
                <div className="p-2 bg-cafe-primary rounded-xl group-hover:rotate-12 transition-transform duration-300">
                    <Coffee className="text-white" size={24} />
                </div>
                <span className="text-2xl font-bold tracking-tight text-cafe-text dark:text-cafe-text-dark">
                    {restaurant?.name?.toUpperCase() || 'LUXE CAFE'}
                </span>
            </div>
        );
    }

    return (
        <header
            ref={headerRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'py-3 bg-white/80 dark:bg-cafe-dark/80 backdrop-blur-md shadow-lg shadow-black/5'
                : 'py-6 bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-center relative">
                {/* Left Side: Navigation Items */}
                {/* Left Side: Navigation Items */}
                <div className="flex-1 flex items-center">
                    <div className="hidden md:flex items-center gap-8 font-bold text-xs uppercase tracking-widest">
                        <Link to="/" className="hover:text-cafe-primary transition-colors">Home</Link>
                        <Link to="/best-sellers" className="hover:text-cafe-primary transition-colors">Best Sellers</Link>
                        {/* <Link to="/specials" className="hover:text-cafe-primary transition-colors">Chef's Special</Link> */}
                        {/* <Link to="/offers" className="px-4 py-2 bg-cafe-primary/10 text-cafe-primary rounded-full hover:bg-cafe-primary hover:text-white transition-all">Offers</Link> */}
                    </div>
                </div>

                {/* Logo Middle */}
                <Link to="/" className="flex items-center gap-2 group">
                    {renderLogo()}
                </Link>

                {/* Right Side: Theme Toggle & User */}
                <div className="flex-1 flex justify-end items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full bg-cafe-secondary/50 dark:bg-zinc-800 hover:scale-110 active:scale-95 transition-all duration-300 text-cafe-text dark:text-cafe-text-dark"
                        aria-label="Toggle Theme"
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    {/* <button className="p-2 rounded-full bg-cafe-primary/20 hover:bg-cafe-primary/30 transition-colors text-cafe-primary">
                        <User size={20} />
                    </button> */}
                </div>
            </div>
        </header>
    );
};

export default Header;
