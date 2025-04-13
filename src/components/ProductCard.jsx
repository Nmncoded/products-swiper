import React, { useState, useRef, useEffect } from 'react';

const ProductCard = ({ product, onSwipeLeft, onSwipeRight, onSwipeUp, isActive }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [swipeStarted, setSwipeStarted] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const cardRef = useRef(null);
  
  // Reset card position when the product changes
  useEffect(() => {
    resetCard();
    // Add a small delay to prevent animation on initial render
    setTimeout(() => setSwipeStarted(false), 50);
  }, [product?.id]);

  // Calculate rotation based on drag position
  const rotation = offsetX * 0.08; // Smoother rotation intensity
  
  // Calculate dynamic shadow based on movement
  const shadowIntensity = Math.min(Math.abs(offsetX) / 100, 0.4);
  const shadowDirection = offsetX > 0 ? '8px' : '-8px';
  const dynamicShadow = isDragging 
    ? `0 ${shadowDirection} 20px rgba(0,0,0,${shadowIntensity}), 0 4px 8px rgba(0,0,0,0.1)` 
    : '0 4px 8px rgba(0,0,0,0.1)';

  // Calculate opacity for like/dislike/add to cart indicators
  const likeOpacity = offsetX > 50 ? Math.min((offsetX - 50) / 150, 1) : 0;
  const dislikeOpacity = offsetX < -50 ? Math.min(Math.abs(offsetX + 50) / 150, 1) : 0;
  const addToCartOpacity = offsetY < -50 ? Math.min(Math.abs(offsetY + 50) / 150, 1) : 0;

  const handleTouchStart = (e) => {
    if (!isActive) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setSwipeStarted(true);
    setSwipeDirection(null);
  };

  const handleMouseDown = (e) => {
    if (!isActive) return;
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setSwipeStarted(true);
    setSwipeDirection(null);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    const newOffsetX = currentX - startX;
    const newOffsetY = currentY - startY;
    
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
    
    // Determine the primary swipe direction
    const absX = Math.abs(newOffsetX);
    const absY = Math.abs(newOffsetY);
    
    if (absX > 20 || absY > 20) {
      if (absX > absY) {
        setSwipeDirection(newOffsetX > 0 ? 'right' : 'left');
      } else {
        setSwipeDirection(newOffsetY > 0 ? 'down' : 'up');
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    
    const newOffsetX = currentX - startX;
    const newOffsetY = currentY - startY;
    
    setOffsetX(newOffsetX);
    setOffsetY(newOffsetY);
    
    // Determine the primary swipe direction
    const absX = Math.abs(newOffsetX);
    const absY = Math.abs(newOffsetY);
    
    if (absX > 20 || absY > 20) {
      if (absX > absY) {
        setSwipeDirection(newOffsetX > 0 ? 'right' : 'left');
      } else {
        setSwipeDirection(newOffsetY > 0 ? 'down' : 'up');
      }
    }
    
    e.preventDefault();
  };

  const resetCard = () => {
    setIsDragging(false);
    setOffsetX(0);
    setOffsetY(0);
    setSwipeDirection(null);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    // Threshold for completing a swipe action
    const swipeThreshold = 120;

    // Right swipe (like)
    if (offsetX > swipeThreshold && Math.abs(offsetX) > Math.abs(offsetY)) {
      completeSwipe('right');
    } 
    // Left swipe (dislike)
    else if (offsetX < -swipeThreshold && Math.abs(offsetX) > Math.abs(offsetY)) {
      completeSwipe('left');
    }
    // Upward swipe (add to cart)
    else if (offsetY < -swipeThreshold && Math.abs(offsetY) > Math.abs(offsetX)) {
      completeSwipe('up');
    }
    // Reset if below threshold
    else {
      setIsDragging(false);
      // Add spring-back animation class
      if (cardRef.current) {
        cardRef.current.classList.add('animate-spring-back');
        setTimeout(() => {
          resetCard();
          if (cardRef.current) {
            cardRef.current.classList.remove('animate-spring-back');
          }
        }, 300);
      } else {
        resetCard();
      }
    }
  };

  const completeSwipe = (direction) => {
    // Set final position based on direction
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    if (direction === 'right') {
      setOffsetX(screenWidth * 1.5);
      setTimeout(() => {
        onSwipeRight(product.id);
        resetCard();
      }, 300);
    } else if (direction === 'left') {
      setOffsetX(-screenWidth * 1.5);
      setTimeout(() => {
        onSwipeLeft(product.id);
        resetCard();
      }, 300);
    } else if (direction === 'up') {
      setOffsetY(-screenHeight * 1.5);
      setTimeout(() => {
        onSwipeUp(product.id);
        resetCard();
      }, 300);
    }
  };

  // Formatting price from cents to dollars with 2 decimal places
  const formatPrice = (priceInCents) => {
    return `₹${(priceInCents / 100).toFixed(2)}`;
  };

  // Format discount percentage
  const formatDiscount = (discount) => {
    return discount > 0 ? `${discount}% OFF` : '';
  };

  // Get border color based on swipe direction
  const getBorderColor = () => {
    if (!isDragging) return 'border-transparent';
    
    switch(swipeDirection) {
      case 'right':
        return 'border-green-500';
      case 'left':
        return 'border-red-500';
      case 'up':
        return 'border-blue-500';
      default:
        return 'border-transparent';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`absolute w-full max-w-sm rounded-xl overflow-hidden bg-white transition-all duration-300 border-2 ${getBorderColor()} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${swipeStarted ? '' : 'animate-card-entrance'}`}
      style={{
        transform: `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotation}deg)`,
        boxShadow: dynamicShadow,
        zIndex: 10,
        transition: isDragging ? 'none' : 'all 0.3s ease'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleDragEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={isDragging ? handleDragEnd : undefined}
    >
      {/* Like indicator */}
      <div 
        className="absolute top-8 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-bold text-xl transform rotate-12 z-20 shadow-md"
        style={{ 
          opacity: likeOpacity,
          transition: 'opacity 0.2s ease',
          transform: `rotate(12deg) scale(${1 + likeOpacity * 0.2})`
        }}
      >
        LIKE
      </div>

      {/* Dislike indicator */}
      <div 
        className="absolute top-8 left-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-bold text-xl transform -rotate-12 z-20 shadow-md"
        style={{ 
          opacity: dislikeOpacity,
          transition: 'opacity 0.2s ease',
          transform: `rotate(-12deg) scale(${1 + dislikeOpacity * 0.2})`
        }}
      >
        PASS
      </div>

      {/* Add to cart indicator */}
      <div 
        className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xl z-20 shadow-md"
        style={{ 
          opacity: addToCartOpacity,
          transition: 'opacity 0.2s ease',
          transform: `translateY(${addToCartOpacity * -10}px) scale(${1 + addToCartOpacity * 0.2})`
        }}
      >
        ADD TO CART
      </div>

      {/* Product image */}
      <div className="relative h-72 bg-gray-100 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-3 py-1.5 rounded-bl-lg shadow-md">
            {formatDiscount(product.discountPercentage)}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-5">
        <h2 className="font-bold text-xl mb-1 capitalize text-gray-800">{product.name}</h2>
        <p className="text-gray-600 mb-3 font-medium">{product.brand}</p>
        
        <div className="flex items-center">
          <span className="font-bold text-lg text-gray-900">{formatPrice(product.price)}</span>
          
          {product.originalPrice > product.price && (
            <span className="ml-2 text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;