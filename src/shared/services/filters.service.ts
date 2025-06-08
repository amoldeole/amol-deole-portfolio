import { Filter } from '../types/filter.types';
import filtersData from '../../assets/data/filters.json';

export const FiltersService = {
  getAllFilters: (): Filter[] => filtersData.filters,
  
  getFilterByValue: (value: string): Filter | undefined => 
    filtersData.filters.find(filter => filter.value === value),
    
  getActiveFilters: (activeValues: string[]): Filter[] => 
    filtersData.filters.filter(filter => activeValues.includes(filter.value)),
    
  getFiltersByCategory: (name: string): Filter[] =>
    filtersData.filters.filter(filter => filter.name === name)
};