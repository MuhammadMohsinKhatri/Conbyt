/**
 * Export utility functions for CSV and Excel export
 */

import { filterDataWithFlexSearch, createSearchIndexCache } from './flexSearchUtils.js';

/**
 * Convert data array to CSV format
 * @param {Array} data - Array of objects to export
 * @param {Array} headers - Array of header objects with label and key
 * @returns {string} CSV string
 */
export const convertToCSV = (data, headers) => {
  if (!data || data.length === 0) {
    return '';
  }

  // Create header row
  const headerRow = headers.map(h => `"${h.label}"`).join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = getNestedValue(row, header.key);
      // Handle null/undefined values
      if (value === null || value === undefined) {
        return '""';
      }
      // Escape quotes and wrap in quotes
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
};

/**
 * Get nested value from object using dot notation
 * @param {Object} obj - Object to get value from
 * @param {string} path - Dot notation path (e.g., 'user.name')
 * @returns {any} Value at path
 */
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, prop) => {
    return current && current[prop] !== undefined ? current[prop] : null;
  }, obj);
};

/**
 * Download CSV file
 * @param {Array} data - Array of objects to export
 * @param {Array} headers - Array of header objects with label and key
 * @param {string} filename - Filename for the download
 */
export const downloadCSV = (data, headers, filename = 'export.csv') => {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Download Excel file (XLSX format)
 * Note: This creates a CSV file with .xlsx extension
 * For true Excel format, you would need a library like xlsx
 * @param {Array} data - Array of objects to export
 * @param {Array} headers - Array of header objects with label and key
 * @param {string} filename - Filename for the download
 */
export const downloadExcel = (data, headers, filename = 'export.xlsx') => {
  // For now, we'll create a CSV with .xlsx extension
  // Excel can open CSV files
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Filter data based on search term and filters using FlexSearch
 * @param {Array} data - Array of data to filter
 * @param {string} searchTerm - Search term to filter by
 * @param {Array} searchFields - Array of field names to search in
 * @param {Object} filters - Object with filter criteria
 * @param {Object} searchIndexCache - Optional cached search index (for performance)
 * @returns {Array} Filtered data
 */
export const filterData = (data, searchTerm = '', searchFields = [], filters = {}, searchIndexCache = null) => {
  // Use FlexSearch for fast, flexible full-text search
  return filterDataWithFlexSearch(data, searchTerm, searchFields, filters, searchIndexCache);
};

/**
 * Create a search index cache for better performance
 * Use this when you need to search the same data multiple times
 * @param {Array} data - Data to index
 * @param {Array} searchFields - Fields to search
 * @returns {Object} Cache object
 */
export const createSearchCache = (data, searchFields) => {
  return createSearchIndexCache(data, searchFields);
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString();
  } catch (e) {
    return String(date);
  }
};

