import React, { useEffect } from 'react';
import CardStack from './components/CardStack';
import products from './data/products';
import './App.css';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

const App = () => {
  useEffect(() => {
    const setupCapacitor = async () => {
      // Only run on native platforms (iOS/Android)
      if (Capacitor.isNativePlatform()) {
        try {
          // Set status bar style
          await StatusBar.setStyle({ style: Style.Light });
          
          // Hide splash screen if needed
          // This would require the SplashScreen plugin to be installed
          // import { SplashScreen } from '@capacitor/splash-screen';
          // await SplashScreen.hide();
        } catch (error) {
          console.error('Error setting up native features:', error);
        }
      }
    };
    
    setupCapacitor();
  }, []);
  return (
    <div className="App min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <header className="bg-white shadow-md p-4 sticky top-0 z-50 w-[100vw]">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-blue-600">Shop</span>Swipe
          </h1>
        </div>
      </header>

      <main className="container p-4 h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <CardStack products={products} />
        </div>
      </main>
    </div>
  );
};

export default App;