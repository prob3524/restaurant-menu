import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import SplashScreen from './components/SplashScreen/SplashScreen';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import FloatingButtons from './components/FloatingButtons';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import BestFoodPage from './pages/BestFoodPage';
import OffersPage from './pages/OffersPage';
import SpecialsPage from './pages/SpecialsPage';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Check if user has already seen splash in this session
    return !sessionStorage.getItem('hasSeenSplash');
  });

  const handleSplashFinish = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        {/* Splash Screen Overlay - Renders on top of App */}
        {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

        {/* Main App - Renders immediately behind splash */}
        <Router basename={window.RESTAURANT_BASE_URL || '/'}>
          <div className="flex flex-col min-h-screen" data-debug="app-loaded">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/best-sellers" element={<BestFoodPage />} />
                <Route path="/specials" element={<SpecialsPage />} />
                <Route path="/offers" element={<OffersPage />} />
              </Routes>
            </main>
            <Footer />
            <FloatingButtons />
          </div>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
