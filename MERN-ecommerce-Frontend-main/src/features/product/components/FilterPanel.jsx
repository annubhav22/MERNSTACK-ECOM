import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCategories, selectBrands } from '../productSlice';
import { fetchProductsByFiltersAsync } from '../productSlice';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const FilterPanel = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories); // [{ label, value, checked }]
  const brands = useSelector(selectBrands);         // [{ label, value, checked }]

  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);

  const handleCategoryClick = (category) => {
    dispatch(
      fetchProductsByFiltersAsync({
        filter: { category: [category.value] },
        sort: {},
        pagination: { page: 1, limit: 10 },
        admin: false,
      })
    );
  };

  const handleBrandClick = (brand) => {
    dispatch(
      fetchProductsByFiltersAsync({
        filter: { brand: [brand.value] },
        sort: {},
        pagination: { page: 1, limit: 10 },
        admin: false,
      })
    );
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm w-64 bg-white">
      <h2 className="font-bold text-lg mb-4">Filters</h2>

      {/* Category Section */}
      <div className="mb-4">
        <button
          className="flex items-center justify-between w-full font-semibold text-base"
          onClick={() => setIsCategoryOpen((prev) => !prev)}
        >
          Category
          {isCategoryOpen ? (
            <ChevronDownIcon className="w-4 h-4" />
          ) : (
            <ChevronRightIcon className="w-4 h-4" />
          )}
        </button>
        {isCategoryOpen && (
          <ul className="mt-2 space-y-1 pl-2 max-h-64 overflow-auto border-t pt-2">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <li
                  key={category.value}
                  className={`cursor-pointer hover:underline ${
                    category.checked ? 'font-bold' : ''
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.label}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No categories available</li>
            )}
          </ul>
        )}
      </div>

      {/* Brand Section */}
      <div className="mb-4">
        <button
          className="flex items-center justify-between w-full font-semibold text-base"
          onClick={() => setIsBrandOpen((prev) => !prev)}
        >
          Brand
          {isBrandOpen ? (
            <ChevronDownIcon className="w-4 h-4" />
          ) : (
            <ChevronRightIcon className="w-4 h-4" />
          )}
        </button>
        {isBrandOpen && (
          <ul className="mt-2 space-y-1 pl-2 max-h-64 overflow-auto border-t pt-2">
            {brands && brands.length > 0 ? (
              brands.map((brand) => (
                <li
                  key={brand.value}
                  className={`cursor-pointer hover:underline ${
                    brand.checked ? 'font-bold' : ''
                  }`}
                  onClick={() => handleBrandClick(brand)}
                >
                  {brand.label}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No brands available</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;

