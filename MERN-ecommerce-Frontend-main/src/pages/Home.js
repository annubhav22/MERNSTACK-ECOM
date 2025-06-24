// src/pages/Home.js
import React from 'react';

import ProductList from '../features/product/components/ProductList';

const Home = () => {
  return (
    <div className="flex p-4 space-x-4">
     
      {/* Products */}
      <main className="flex-1">
        <ProductList />
      </main>
    </div>
  );
};

export default Home;
