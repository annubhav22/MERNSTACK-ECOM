import React from 'react';

const CategoryFilter = ({ categories = [], selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-wrap gap-2 p-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategoryChange(category.value)}
          className={`px-4 py-1 border rounded-full ${
            selectedCategory === category.value ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
