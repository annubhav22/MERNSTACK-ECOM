// src/app/hooks.js
// Simple wrappers around React-Redux hooks for consistent usage and future extensibility
import { useDispatch, useSelector } from 'react-redux';

/**
 * Use throughout the app instead of plain `useDispatch` to get a properly typed dispatch.
 */
export const useAppDispatch = () => useDispatch();

/**
 * Use throughout the app instead of plain `useSelector` to get properly typed state selections.
 */
export const useAppSelector = useSelector;
