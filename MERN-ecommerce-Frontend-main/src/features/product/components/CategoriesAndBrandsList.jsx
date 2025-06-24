import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchCategoriesAsync,
  fetchBrandsAsync,
  selectCategories,
  selectBrands,
} from '../productSlice';

function CategoriesAndBrandsList() {
  const dispatch = useAppDispatch();
  const Categories = useAppSelector(selectCategories);
  const Brands = useAppSelector(selectBrands);

  useEffect(() => {
    if (Categories.length === 0) {
      dispatch(fetchCategoriesAsync());
    }
    if (Brands.length === 0) {
      dispatch(fetchBrandsAsync());
    }
  }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Products</h2>

      <div className="mb-4 border-b pb-2">
        <h3 className="font-semibold flex justify-between">
          Category <span>+</span>
        </h3>
        <ul className="pl-4 mt-2 text-sm">
          {Categories.length === 0 ? (
            <li>Loading Categories...</li>
          ) : (
            Categories.map((category) => (
              <li key={category.id}>{category.name}</li>
            ))
          )}
        </ul>
      </div>

      <div className="mb-4 border-b pb-2">
        <h3 className="font-semibold flex justify-between">
          Brands <span>+</span>
        </h3>
        <ul className="pl-4 mt-2 text-sm">
          {Brands.length === 0 ? (
            <li>Loading Brands...</li>
          ) : (
            Brands.map((brand) => (
              <li key={brand.id}>{brand.name}</li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default CategoriesAndBrandsList;
