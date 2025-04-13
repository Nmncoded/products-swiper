import React from 'react';
import CardStack from './components/CardStack';
import products from './data/products';
import './App.css';

const App = () => {
  return (
    <div className="App min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      <header className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-center">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-blue-600">Shop</span>Swipe
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <CardStack products={products} />
        </div>
      </main>
    </div>
  );
};

export default App;