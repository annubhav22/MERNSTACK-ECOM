import React, { useState, Fragment, useEffect } from 'react';
import axios from 'axios';
import CategoryFilter from './CategoryFilter';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchBrandsAsync,
  fetchCategoriesAsync,
  fetchProductsByFiltersAsync,
  selectAllProducts,
  selectBrands,
  selectCategories,
  selectProductListStatus,
  selectTotalItems,
} from '../productSlice';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from '@heroicons/react/20/solid';
import { ITEMS_PER_PAGE } from '../../../app/constants';
import Pagination from '../../common/Pagination';
import { Grid } from 'react-loader-spinner';
import FilterSidebar from './FilterSidebar'
import FilterCheckboxList from './FilterCheckboxList'
import CategoriesAndBrandsList from './CategoriesAndBrandsList'
import productData from '../../../data.json';
import { selectProductDetail } from '../../product/productSlice';

const sortOptions = [
  { name: 'Best Rating', sort: 'rating', order: 'desc', current: false },
  { name: 'Price: Low to High', sort: 'discountPrice', order: 'asc', current: false },
  { name: 'Price: High to Low', sort: 'discountPrice', order: 'desc', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductList() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
const brands = useSelector(selectBrands); 
const categories = useSelector(selectCategories);
  const totalItems = useSelector(selectTotalItems);
  const status = useSelector(selectProductListStatus);
    const [filter, setFilters] = useState({ category: [], brand: [] });
  const [sort, setSort] = useState({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
   const [setCategories] = useState([]);
  
  const fallbackImg = '/placeholder.png';

  console.log('Categories:', categories);
  console.log('Brands:', brands);
  

const categoryFilterOptions = Array.isArray(categories)
  ? categories.map((cat) => ({
      value: cat.value || cat.name || cat._id,
      label: cat.label || cat.name || cat.value,
    }))
  : [];

const brandFilterOptions = Array.isArray(brands)
  ? brands.map((brand) => ({
      value: brand.value || brand.name || brand._id,
      label: brand.label || brand.name || brand.value,
    }))
  : [];





 const filters = [
  {
    id: 'category',
    name: 'Category',
    options: categoryFilterOptions.map((option) => ({
      label: option.label,
      value: option.value,
      checked: selectedCategories.includes(option.value),
    })),
  },
  {
    id: 'brand',
    name: 'Brand',
    options: brandFilterOptions.map((option) => ({
      label: option.label,
      value: option.value,
      checked: selectedBrands.includes(option.value),
    })),
  },
];


 const handleFilter = (e, section, option) => {
    const checked = e.target.checked;
    const newValue = option.value;

    if (section.id === 'category') {
      setSelectedCategories((prev) =>
        checked ? [...prev, newValue] : prev.filter((val) => val !== newValue)
      );
    } else if (section.id === 'brand') {
      setSelectedBrands((prev) =>
        checked ? [...prev, newValue] : prev.filter((val) => val !== newValue)
      );
    }
  };

  const handleSort = (_, option) => {
    const newSort = { _sort: option.sort, _order: option.order };
    setSort(newSort);
  };

  const handlePage = (newPage) => {
    setPage(newPage);
  };

useEffect(() => {
  dispatch(fetchBrandsAsync());
  dispatch(fetchCategoriesAsync());
}, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [sort, selectedCategories, selectedBrands]);

  useEffect(() => {
    const filter = { category: selectedCategories, brand: selectedBrands };
    const pagination = { _page: page, _limit: 9 };
    dispatch(fetchProductsByFiltersAsync({ filter, sort, pagination }));
  }, [dispatch, selectedCategories, selectedBrands, sort, page]);
  
  useEffect(() => {
    axios.get('http://localhost:8080/categories') // 🔁 Update port if needed
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Category fetch failed:', err));
  }, []);


  return (

    <div className="bg-white">
      <div>
        <MobileFilter
          handleFilter={handleFilter}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          filters={[
            {
              id: 'category',
              name: 'Category',
              options: categoryFilterOptions.map(opt => ({ ...opt, checked: selectedCategories.includes(opt.value) }))
            },
            {
              id: 'brand',
              name: 'Brands',
              options: brandFilterOptions.map(opt => ({ ...opt, checked: selectedBrands.includes(opt.value) }))
            },
          ]}
        />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              All Products
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <p
                              onClick={(e) => handleSort(e, option)}
                              className={classNames(
                                option.current
                                  ? 'font-medium text-gray-900'
                                  : 'text-gray-500',
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm'
                              )}
                            >
                              {option.name}
                            </p>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              <DesktopFilter
                handleFilter={handleFilter}
                filters={filters}
              ></DesktopFilter>
              {/* Product grid */}
              <div className="lg:col-span-3">
                <ProductGrid products={products} status={status}></ProductGrid>
              </div>
              {/* Product grid end */}
            </div>
          </section>

          {/* section of product and filters ends */}
          <Pagination
            page={page}
            setPage={setPage}
            handlePage={handlePage}
            totalItems={totalItems}
          ></Pagination>
        </main>
      </div>
    </div>
  );
}

function MobileFilter({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  handleFilter,
  filters,
}) {
  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={setMobileFiltersOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-6">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  onChange={(e) =>
                                    handleFilter(e, section, option)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className="ml-3 min-w-0 flex-1 text-gray-500"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function DesktopFilter({ handleFilter, filters }) {
  return (
    <form className="hidden lg:block">
      
      {filters.map((section) => (
        <Disclosure
          as="div"
          key={section.id}
          className="border-b border-gray-200 py-6"
        >
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">
                    {section.name}
                  </span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-4">
                  {section.options.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`filter-${section.id}-${optionIdx}`}
                        name={`${section.id}[]`}
                        defaultValue={option.value}
                        type="checkbox"
                        defaultChecked={option.checked}
                        onChange={(e) => handleFilter(e, section, option)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`filter-${section.id}-${optionIdx}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </form>
  );
}

function ProductGrid({ products, status }) {
  const fallbackImg = '/placeholder.png';

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {status === 'loading' ? (
            <Grid
              height="80"
              width="80"
              color="rgb(79, 70, 229)"
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          ) : null}

          {products.map((product) => {
            const validImage =
              product.thumbnail?.trim() ||
              product.images?.[0] ||
              fallbackImg;

            return (
              <Link to={`/product-detail/${product.id}`} key={product.id}>
                <div className="group relative border-solid border-2 p-2 border-gray-200">
                  <div className="min-h-60 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-60">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                    />

                  </div>

                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <span className="block truncate">{product.title}</span>
                      </h3>

                      {/* Star Rating */}
                      {typeof product.rating === 'number' && (
                        <div className="flex items-center mt-1">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              className={classNames(
                                Math.round(product.rating) > rating
                                  ? 'text-gray-900'
                                  : 'text-gray-200',
                                'h-5 w-5 flex-shrink-0'
                              )}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      )}

                      <p className="sr-only">{product.rating} out of 5 stars</p>
                    </div>

                    {/* Prices */}
                    <div className="text-right">
                      <p className="text-sm line-through text-gray-400">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                      </p>
                      <p className="text-xs text-green-600">
                        Save {product.discountPercentage.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  {/* Stock & Delete status */}
                  {product.deleted && (
                    <p className="text-sm text-red-500 mt-1">product deleted</p>
                  )}
                  {product.stock <= 0 && (
                    <p className="text-sm text-red-500 mt-1" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}  