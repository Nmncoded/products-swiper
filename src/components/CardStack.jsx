import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const CardStack = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  
  // Show 3 cards at a time in the stack
  const visibleCount = 3;

  useEffect(() => {
    // Update the visible stack when current index changes
    updateDisplayedProducts();
  }, [currentIndex, products]);

  const updateDisplayedProducts = () => {
    const cards = [];
    
    // Add cards to the stack
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % products.length;
      
      // If we're at the end and not looping, don't add more cards
      if (!isLooping && index < currentIndex) {
        break;
      }
      
      if (products[index]) {
        cards.push(products[index]);
      }
    }
    
    setDisplayedProducts(cards);
  };

  const handleSwipe = (action, productId) => {
    // Set last action for animation feedback
    setLastAction(action);
    
    // Reset action after animation completes
    setTimeout(() => setLastAction(null), 1500);
    
    console.log(`${action} Product ID: ${productId}`);
    
    // Move to the next card
    const nextIndex = (currentIndex + 1) % products.length;
    
    // If we've gone through all cards and not looping, show end message
    if (nextIndex === 0 && !isLooping) {
      setCurrentIndex(products.length);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const handleSwipeLeft = (productId) => {
    handleSwipe('Passed', productId);
  };

  const handleSwipeRight = (productId) => {
    handleSwipe('Liked', productId);
  };

  const handleSwipeUp = (productId) => {
    handleSwipe('Added to cart', productId);
  };

  // If we've gone through all products and not looping
  if (currentIndex >= products.length && !isLooping) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">You've seen all products!</h2>
        <button 
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          onClick={() => setCurrentIndex(0)}
        >
          Start Again
        </button>
        <div className="mt-6">
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={isLooping} 
              onChange={() => setIsLooping(!isLooping)}
              className="mr-2 h-5 w-5 accent-blue-500"
            />
            <span className="text-gray-700">Loop through products automatically</span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Action feedback indicators */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-center py-4 pointer-events-none">
        {lastAction === 'Liked' && (
          <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-xl animate-fadeOut shadow-lg">
            ♥ LIKED!
          </div>
        )}
        {lastAction === 'Passed' && (
          <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold text-xl animate-fadeOut shadow-lg">
            ✕ PASSED
          </div>
        )}
        {lastAction === 'Added to cart' && (
          <div className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-xl animate-fadeOut shadow-lg">
            🛒 ADDED TO CART
          </div>
        )}
      </div>
      
      {displayedProducts.length > 0 ? (
        <div className="relative w-full max-w-sm h-[500px]">
          {/* Render cards in reverse order so the first one is on top */}
          {displayedProducts.map((product, index) => {
            const isTop = index === 0;
            // Add staggered styles for cards below the top one
            const cardStyle = !isTop ? {
              transform: `scale(${0.92 - index * 0.04}) translateY(-${index * 12}px)`,
              zIndex: displayedProducts.length - index,
              opacity: 1 - index * 0.15,
              pointerEvents: 'none', // Only allow interaction with the top card
              filter: `brightness(${1 - index * 0.1})`,
            } : { zIndex: displayedProducts.length };
            
            return (
              <div 
                key={`${product.id}-${index}`}
                className="absolute top-0 left-0 w-full h-full transition-all duration-300"
                style={cardStyle}
              >
                {isTop ? (
                  <ProductCard 
                    product={product} 
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    onSwipeUp={handleSwipeUp}
                    isActive={true}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200">
                    <div className="h-72 bg-gray-100">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="font-bold text-xl mb-2 capitalize text-gray-800">{product.name}</h2>
                      <p className="text-gray-600">{product.brand}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">No more products</h2>
        </div>
      )}
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center p-4 mt-6">
        <div className="flex space-x-6">
          <button 
            className="text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-r from-red-400 to-red-600 hover:shadow-xl transform transition-all duration-300 hover:scale-110"
            onClick={() => displayedProducts[0] && handleSwipeLeft(displayedProducts[0].id)}
            aria-label="Pass"
          >
            <span className="text-2xl">✕</span>
          </button>
          <button 
            className="text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-r from-blue-400 to-blue-600 hover:shadow-xl transform transition-all duration-300 hover:scale-110"
            onClick={() => displayedProducts[0] && handleSwipeUp(displayedProducts[0].id)}
            aria-label="Add to cart"
          >
            <span className="text-2xl">🛒</span>
          </button>
          <button 
            className="text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-r from-green-400 to-green-600 hover:shadow-xl transform transition-all duration-300 hover:scale-110"
            onClick={() => displayedProducts[0] && handleSwipeRight(displayedProducts[0].id)}
            aria-label="Like"
          >
            <span className="text-2xl">♥</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardStack;