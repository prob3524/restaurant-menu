import { categories } from './resources/js/theme-4/data/categories.js';
import { foods, specials } from './resources/js/theme-4/data/foods.js';
import { offers } from './resources/js/theme-4/data/offers.js';

// Setup Global Data
window.RESTAURANT_BASE_URL = '/';
window.RESTAURANT_DATA = {
    restaurant: {
        name: "Luxe Cafe",
        currency: "$",
        established_text: "EST. 2024",
        created_at: "2024",
        overview: "Experience the finest artisanal coffee and handcrafted food in the heart of the city.",
        photos: [
            "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&q=80&w=800"
        ]
    },
    categories,
    foods,
    specials,
    offers,
    reviews: [
        {
            id: 1,
            author_name: "Sarah J.",
            rating: 5,
            text: "Absolutely the best coffee in town. The atmosphere is magical!",
            relative_time_description: "2 Days ago"
        },
        {
            id: 2,
            author_name: "Michael C.",
            rating: 4.8,
            text: "Loved the pastries. Very premium feel.",
            relative_time_description: "1 Week ago"
        }
    ],
    settings: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com"
    }
};

console.log("Mock Data Loaded:", window.RESTAURANT_DATA);

// Dynamically import the main app entry to ensure global data is ready
import('./resources/js/theme-4/main.jsx');
