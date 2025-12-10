/**
 * FlexSearch utility for fast, flexible full-text search
 * Works with all admin dashboard data types
 */

// Import FlexSearch - FlexSearch 0.8.x uses Index as named export
import { Index } from 'flexsearch';

/**
 * Create a new FlexSearch index with optimized settings
 * @param {Object} options - Index configuration options
 * @returns {Index} FlexSearch index instance
 */
export const createSearchIndex = (options = {}) => {
  return new Index({
    preset: 'performance', // Optimized for performance
    tokenize: 'forward', // Forward tokenization for better matching
    cache: 100, // Cache size for better performance
    ...options
  });
};

/**
 * Build search index from data array
 * @param {Array} data - Array of objects to index
 * @param {Array} searchFields - Fields to search in
 * @param {Function} getValue - Function to extract searchable text from item
 * @returns {Object} Object with index and data map
 */
export const buildSearchIndex = (data, searchFields = [], getValue = null) => {
  const index = createSearchIndex();
  const dataMap = new Map();

  data.forEach((item, idx) => {
    // Use custom getValue function if provided, otherwise build searchable text
    let searchableText = '';
    
    if (getValue) {
      searchableText = getValue(item);
    } else {
      // Build searchable text from specified fields using helper function
      searchableText = buildSearchableText(item, searchFields);
    }

    // Index the item
    index.add(idx, searchableText.trim());
    dataMap.set(idx, item);
  });

  return { index, dataMap };
};

/**
 * Search using FlexSearch index
 * @param {Object} searchContext - Object with index, dataMap, and original data
 * @param {string} searchTerm - Search query
 * @param {Object} filters - Additional filters to apply
 * @returns {Array} Filtered results
 */
export const searchWithFlexSearch = (searchContext, searchTerm = '', filters = {}) => {
  const { index, dataMap, data } = searchContext;
  let results = [];

  // If no search term, return all data (will be filtered by other filters)
  if (!searchTerm || searchTerm.trim() === '') {
    results = data;
  } else {
    // Perform FlexSearch
    const searchResults = index.search(searchTerm.toLowerCase(), {
      limit: 10000, // High limit to get all matches
      suggest: true // Enable suggestions
    });

    // Map search results back to original data
    results = searchResults.map(idx => dataMap.get(idx)).filter(Boolean);
  }

  // Apply additional filters
  if (Object.keys(filters).length > 0) {
    results = applyFilters(results, filters);
  }

  return results;
};

/**
 * Apply filters to data array
 * @param {Array} data - Data to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered data
 */
const applyFilters = (data, filters) => {
  let filtered = [...data];

  Object.keys(filters).forEach(key => {
    const filterValue = filters[key];
    if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
      filtered = filtered.filter(item => {
        const itemValue = getNestedValue(item, key);
        
        // Handle boolean filters (like published)
        if (typeof filterValue === 'boolean') {
          return itemValue === filterValue;
        }
        
        // Handle string boolean filters (like "true"/"false")
        if (filterValue === 'true' || filterValue === 'false') {
          const boolValue = filterValue === 'true';
          return itemValue === boolValue;
        }
        
        // Handle array filters
        if (Array.isArray(filterValue)) {
          return filterValue.includes(itemValue);
        }
        
        // Handle exact match
        return String(itemValue).toLowerCase() === String(filterValue).toLowerCase();
      });
    }
  });

  return filtered;
};

/**
 * Get nested value from object using dot notation
 * @param {Object} obj - Object to get value from
 * @param {string} path - Dot notation path (e.g., 'user.name')
 * @returns {any} Value at path
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path) return null;
  return path.split('.').reduce((current, prop) => {
    return current && current[prop] !== undefined ? current[prop] : null;
  }, obj);
};

/**
 * Enhanced filter function using FlexSearch
 * @param {Array} data - Array of data to filter
 * @param {string} searchTerm - Search term to filter by
 * @param {Array} searchFields - Array of field names to search in
 * @param {Object} filters - Object with filter criteria
 * @param {Object} searchIndexCache - Optional cached search index (for performance)
 * @returns {Array} Filtered data
 */
export const filterDataWithFlexSearch = (
  data, 
  searchTerm = '', 
  searchFields = [], 
  filters = {},
  searchIndexCache = null
) => {
  if (!data || data.length === 0) {
    return [];
  }

  // Build or reuse search index
  let searchContext;
  
  if (searchIndexCache && searchIndexCache.data === data && searchIndexCache.fields.join(',') === searchFields.join(',')) {
    // Reuse cached index if data and fields haven't changed
    searchContext = searchIndexCache.context;
  } else {
    // Build new index
    const { index, dataMap } = buildSearchIndex(data, searchFields);
    searchContext = { index, dataMap, data };
  }

  // Perform search
  return searchWithFlexSearch(searchContext, searchTerm, filters);
};

/**
 * Create a search index cache for better performance
 * @param {Array} data - Data to index
 * @param {Array} searchFields - Fields to search
 * @returns {Object} Cache object with index context
 */
export const createSearchIndexCache = (data, searchFields) => {
  const { index, dataMap } = buildSearchIndex(data, searchFields);
  return {
    data,
    fields: searchFields,
    context: { index, dataMap, data }
  };
};

/**
 * Strip HTML tags for search indexing
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export const stripHtmlForSearch = (html) => {
  if (!html) return '';
  if (!html.includes('<')) return html;
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Build searchable text from item with HTML stripping
 * @param {Object} item - Data item
 * @param {Array} searchFields - Fields to include
 * @returns {string} Searchable text
 */
export const buildSearchableText = (item, searchFields) => {
  return searchFields.map(field => {
    const value = getNestedValue(item, field);
    if (!value) return '';
    
    let text = '';
    
    // Handle arrays (like tech_stack)
    if (Array.isArray(value)) {
      text = value.join(' ');
    } else if (typeof value === 'object') {
      // Handle JSON strings that need parsing
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (Array.isArray(parsed)) {
          text = parsed.join(' ');
        } else {
          text = String(value);
        }
      } catch {
        text = String(value);
      }
    } else {
      text = String(value);
    }
    
    // Strip HTML if present
    if (text.includes('<')) {
      text = stripHtmlForSearch(text);
    }
    
    return text.toLowerCase();
  }).filter(Boolean).join(' ');
};

