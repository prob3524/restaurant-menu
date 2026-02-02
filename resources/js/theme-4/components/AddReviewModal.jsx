import React, { useEffect, useRef, useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import gsap from 'gsap';
import { useRestaurantData } from '../hooks/useRestaurantData';

const AddReviewModal = ({ isOpen, onClose, onSubmit }) => {
    const modalRef = useRef(null);
    const overlayRef = useRef(null);
    const contentRef = useRef(null);
    const { foods } = useRestaurantData();

    // Form State
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewType, setReviewType] = useState('restaurant'); // 'restaurant' | 'food'
    const [selectedFoodId, setSelectedFoodId] = useState('');
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial Animation
    useEffect(() => {
        if (isOpen) {
            const tl = gsap.timeline();
            tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
                .fromTo(contentRef.current, { scale: 0.9, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' }, "-=0.2");
        }
    }, [isOpen]);

    const handleClose = () => {
        const tl = gsap.timeline({ onComplete: onClose });
        tl.to(contentRef.current, { scale: 0.9, opacity: 0, y: 20, duration: 0.3, ease: 'power2.in' })
            .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) return; // Validate rating

        setIsSubmitting(true);
        const newReview = {
            id: Date.now(),
            author_name: name || 'Anonymous Guest', // Default fallback
            rating: rating,
            text: text,
            relative_time_description: 'Just now',
            profile_photo_url: null,
            type: reviewType,
            foodId: selectedFoodId
        };

        // Simulate submit delay for UX
        setTimeout(() => {
            onSubmit(newReview);
            setIsSubmitting(false);
            handleClose();
            // Reset form
            setRating(0);
            setName('');
            setText('');
            setReviewType('restaurant');
        }, 800);
    };

    if (!isOpen) return null;

    return (
        <div ref={modalRef} className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div
                ref={overlayRef}
                onClick={handleClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></div>

            <div
                ref={contentRef}
                className="relative bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-cafe-secondary/5">
                    <h3 className="text-xl font-bold dark:text-cafe-text-dark">Write a Review</h3>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X size={20} className="text-zinc-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    {/* Review Type Toggle */}
                    <div className="flex gap-4 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl relative">
                        <button
                            type="button"
                            onClick={() => setReviewType('restaurant')}
                            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${reviewType === 'restaurant'
                                ? 'bg-white dark:bg-zinc-800 shadow-sm text-cafe-primary'
                                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                                }`}
                        >
                            Restaurant
                        </button>
                        <button
                            type="button"
                            onClick={() => setReviewType('food')}
                            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${reviewType === 'food'
                                ? 'bg-white dark:bg-zinc-800 shadow-sm text-cafe-primary'
                                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                                }`}
                        >
                            Specific Item
                        </button>
                    </div>

                    {/* Food Selector (Conditional) */}
                    {reviewType === 'food' && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 tracking-wider">Select Item</label>
                            <select
                                required
                                value={selectedFoodId}
                                onChange={(e) => setSelectedFoodId(e.target.value)}
                                className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 border-none rounded-xl focus:ring-2 focus:ring-cafe-primary/50 outline-none text-zinc-700 dark:text-zinc-200 transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Choose a dish...</option>
                                {foods?.map(food => (
                                    <option key={food.id} value={food.id}>{food.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-3 py-2">
                        <label className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Your Rating</label>
                        <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        size={32}
                                        fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                                        className={`transition-colors duration-200 ${(hoverRating || rating) >= star
                                            ? "text-yellow-400 drop-shadow-sm"
                                            : "text-zinc-300 dark:text-zinc-700"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name Field */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 tracking-wider">Your Name (Optional)</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl focus:ring-2 focus:ring-cafe-primary/50 outline-none text-zinc-700 dark:text-zinc-200 transition-all placeholder:text-zinc-400"
                        />
                    </div>

                    {/* Review Text */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 tracking-wider">Review</label>
                        <textarea
                            required
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Tell us about your experience..."
                            rows="4"
                            className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl focus:ring-2 focus:ring-cafe-primary/50 outline-none text-zinc-700 dark:text-zinc-200 transition-all placeholder:text-zinc-400 resize-none"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting || rating === 0
                            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                            : 'bg-cafe-primary text-white hover:bg-cafe-primary/90 hover:scale-[1.02] shadow-lg shadow-cafe-primary/25'
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Submit Review</span>
                                <Send size={16} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddReviewModal;
