import React, { useEffect, useRef, useState } from 'react';
import ReviewsSection from '../components/ReviewsSection';
import CategoryCard from '../components/CategoryCard/CategoryCard';
import FoodCard from '../components/FoodCard/FoodCard';
import FoodModal from '../components/FoodModal/FoodModal';
import GalleryModal from '../components/GalleryModal/GalleryModal';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useRestaurantData } from '../hooks/useRestaurantData';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Home = () => {
    const { restaurant, categories, foods, specials, reviews: initialReviews, loading } = useRestaurantData();
    const currency = restaurant?.currency || '$';

    // State
    const [selectedFood, setSelectedFood] = useState(null);
    const [galleryIndex, setGalleryIndex] = useState(null);
    const [currentSpecialIndex, setCurrentSpecialIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Reviews State (Initialize from data + localStorage)
    const [currentReviews, setCurrentReviews] = useState([]);

    useEffect(() => {
        if (initialReviews) {
            const savedReviews = JSON.parse(localStorage.getItem('restaurant_reviews') || '[]');
            // Merge initial and saved, de-dupe by ID just in case
            const all = [...savedReviews, ...initialReviews].reduce((acc, current) => {
                const x = acc.find(item => item.id === current.id);
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);
            // Sort by newness (assuming id is timestamp for new ones, or just reverse order)
            setCurrentReviews(all.sort((a, b) => b.id - a.id));
        }
    }, [initialReviews]);

    const handleAddReview = (newReview) => {
        const updated = [newReview, ...currentReviews];
        setCurrentReviews(updated);

        // Persist new reviews to localStorage
        const existingSaved = JSON.parse(localStorage.getItem('restaurant_reviews') || '[]');
        localStorage.setItem('restaurant_reviews', JSON.stringify([newReview, ...existingSaved]));
    };

    // Derived state
    const bestSellers = foods ? foods.filter(f => f.bestSelling) : [];
    const currentSpecial = specials && specials.length > 0 ? specials[currentSpecialIndex] : null;

    const heroRef = useRef(null);
    const carouselRef = useRef(null);
    const sectionRefs = useRef([]);

    useEffect(() => {
        // Carousel auto-play logic
        let interval;
        if (!isHovered && specials && specials.length > 0) {
            interval = setInterval(() => {
                nextSpecial();
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isHovered, currentSpecialIndex, specials]);

    const animateSlide = (newIndex) => {
        if (!carouselRef.current) return;
        const direction = newIndex > currentSpecialIndex ? -20 : 20;

        gsap.to(carouselRef.current, {
            opacity: 0,
            x: direction,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
                setCurrentSpecialIndex(newIndex);
                gsap.fromTo(carouselRef.current,
                    { opacity: 0, x: -direction },
                    { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
                );
            }
        });
    };

    const nextSpecial = () => {
        const nextIndex = (currentSpecialIndex + 1) % specials.length;
        animateSlide(nextIndex);
    };

    const prevSpecial = () => {
        const prevIndex = (currentSpecialIndex - 1 + specials.length) % specials.length;
        animateSlide(prevIndex);
    };

    const goToSpecial = (index) => {
        if (index === currentSpecialIndex) return;
        animateSlide(index);
    };

    const scrollToCategories = () => {
        gsap.to(window, { duration: 1, scrollTo: "#categories-section", ease: "power2.inOut" });
    };

    const renderPlaceholder = () => (
        <div className="w-full h-full bg-cafe-secondary/20 flex items-center justify-center">
            <span className="text-cafe-text/40 font-bold">No Image Available</span>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cafe-primary"></div>
            </div>
        );
    }

    // Safety check for empty data
    const safeCategories = categories || [];

    // Derive unique groups from valid categories
    const safeFoodGroups = [...new Set(safeCategories.map(cat => cat.group))].filter(Boolean);

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-32">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <div className="hero-anim inline-flex items-center gap-2 px-4 py-2 bg-cafe-primary/10 text-cafe-primary rounded-full mb-10 font-bold text-sm">
                        <Sparkles size={16} />
                        <span>{restaurant?.established_text || `ESTABLISHED ${restaurant?.created_at || '2010'}`}</span>
                    </div>
                    <h1 className="hero-anim text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1] dark:text-cafe-text-dark">
                        {restaurant?.name || 'Luxe Cafe'} <br />
                        <span className="text-cafe-primary">Feel the Vibe.</span>
                    </h1>
                    <p className="hero-anim text-lg md:text-xl opacity-70 max-w-2xl mx-auto mb-10 leading-relaxed">
                        {restaurant?.overview || 'Experience the finest artisanal coffee and handcrafted food in the heart of the city.'}
                    </p>
                    <div className="hero-anim flex flex-col md:flex-row gap-4 justify-center">
                        <button
                            onClick={scrollToCategories}
                            className="px-10 py-5 bg-cafe-primary text-white font-bold rounded-2xl shadow-xl shadow-cafe-primary/20 hover:scale-105 active:scale-95 transition-transform"
                        >
                            View Menu
                        </button>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section
                id="categories-section"
                ref={el => sectionRefs.current[0] = el}
                className="container mx-auto px-6 py-20"
            >
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-bold mb-2 dark:text-cafe-text-dark tracking-tight">Explore Categories</h2>
                        <p className="opacity-60">Handpicked variety for every craving.</p>
                    </div>
                </div>

                <div className="space-y-16">
                    {safeFoodGroups.map((group, gIdx) => (
                        <div key={group} className="gsap-group-reveal">
                            <h3 className="text-2xl font-bold mb-8 text-cafe-text/40 dark:text-cafe-text-dark/40 tracking-[0.2em] uppercase">
                                {group}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {safeCategories.filter(cat => cat.group === group).map(cat => (
                                    <CategoryCard key={cat.id} category={cat} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Best Sellers Section */}
            <section
                ref={el => sectionRefs.current[1] = el}
                className="bg-cafe-secondary/30 dark:bg-zinc-900/50 py-24"
            >
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                        <div>
                            <h2 className="text-4xl font-bold mb-4 dark:text-cafe-text-dark tracking-tight">Best Sellers</h2>
                            <div className="flex flex-wrap gap-3">
                                <Link to="/best-sellers" className="px-5 py-2 bg-cafe-primary/10 text-cafe-primary rounded-full font-bold text-sm hover:bg-cafe-primary hover:text-white transition-all duration-300">
                                    Today's Special
                                </Link>
                                {/* <Link to="/offers" className="px-5 py-2 bg-cafe-accent/10 text-cafe-accent dark:text-cafe-accent rounded-full font-bold text-sm hover:bg-cafe-accent hover:text-white transition-all duration-300">
                                    Offers
                                </Link> */}
                            </div>
                        </div>
                        <Link to="/best-sellers" className="flex items-center gap-2 font-bold text-cafe-primary hover:gap-3 transition-all">
                            View All <ChevronRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {bestSellers.slice(0, 3).map(food => (
                            <FoodCard key={food.id} food={food} onClick={setSelectedFood} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <ReviewsSection reviews={currentReviews} onAddReview={handleAddReview} />

            {/* Chef's Special (Highlight Section / Slider) */}
            {/* {currentSpecial && (
                <section
                    id="specials-section"
                    ref={el => sectionRefs.current[2] = el}
                    className="container mx-auto px-6 py-32"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="relative group/slider">
                        <button
                            onClick={prevSpecial}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-cafe-primary hover:scale-110 active:scale-95 border border-white/10"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSpecial}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-cafe-primary hover:scale-110 active:scale-95 border border-white/10"
                        >
                            <ChevronRight size={24} />
                        </button>

                        <div
                            ref={carouselRef}
                            className="bg-cafe-dark rounded-[3rem] overflow-hidden flex flex-col lg:flex-row items-stretch shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_30px_60px_-15px_rgba(212,163,115,0.1)] min-h-[500px] border border-white/5"
                        >
                            <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[550px] overflow-hidden">
                                {currentSpecial.image && !imageError ? (
                                    <img
                                        src={currentSpecial.image}
                                        className="w-full h-full object-cover"
                                        alt={currentSpecial.name}
                                        onError={() => setImageError(true)}
                                    />
                                ) : renderPlaceholder()}
                                <div className="absolute top-8 left-8 p-6 bg-cafe-primary/90 backdrop-blur-md text-white rounded-3xl shadow-xl shadow-cafe-primary/20">
                                    <span className="text-[10px] font-black uppercase block mb-1 tracking-[0.2em]">{currentSpecial.tag}</span>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
                                        {currentSpecial.name.split(' ')[0]} <span className="text-black/30">Luxe</span>
                                    </h3>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center text-white relative">
                                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tighter">
                                    Chef’s Special: <br />
                                    <span className="text-cafe-primary">{currentSpecial.name}</span>
                                </h2>
                                <p className="text-lg opacity-60 mb-12 leading-relaxed font-medium">
                                    {currentSpecial.description}
                                </p>
                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Price</span>
                                        <span className="text-4xl font-black text-cafe-primary tracking-tighter">{currency}{currentSpecial.price.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedFood(currentSpecial)}
                                        className="px-8 py-4 bg-white/5 hover:bg-cafe-primary hover:text-white transition-all duration-300 rounded-2xl border border-white/10 font-bold uppercase text-xs tracking-[0.2em]"
                                    >
                                        Reveal Recipe
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                            {specials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goToSpecial(idx)}
                                    className={`h-2 rounded-full transition-all duration-500 ${idx === currentSpecialIndex
                                        ? 'w-10 bg-cafe-primary'
                                        : 'w-2 bg-cafe-primary/20 hover:bg-cafe-primary/40'
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )} */}

            {/* Gallery Section */}
            {restaurant?.photos && restaurant.photos.length > 0 && (
                <section className="bg-white dark:bg-black/20 py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4 dark:text-cafe-text-dark tracking-tight">Gallery</h2>
                            <p className="opacity-60">A glimpse into our ambiance and culinary delights.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {restaurant.photos.map((photo, index) => (
                                <div
                                    key={index}
                                    className="aspect-square rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-lg cursor-pointer"
                                    onClick={() => setGalleryIndex(index)}
                                >
                                    <img
                                        src={photo}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <FoodModal food={selectedFood} onClose={() => setSelectedFood(null)} />

            {galleryIndex !== null && (
                <GalleryModal
                    images={restaurant.photos}
                    initialIndex={galleryIndex}
                    onClose={() => setGalleryIndex(null)}
                />
            )}
        </div>
    );
};

export default Home;
