'use client';

import { useState } from 'react';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SearchFilter {
  key: string;
  label: string;
  value: string;
}

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFilterChange?: (filters: SearchFilter[]) => void;
  availableFilters?: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
  className?: string;
}

export function SearchBar({
  placeholder = '検索...',
  onSearch,
  onFilterChange,
  availableFilters = [],
  className = '',
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleFilterAdd = (filterKey: string, value: string, label: string) => {
    const newFilter: SearchFilter = {
      key: filterKey,
      label: label,
      value: value,
    };

    // Remove existing filter with same key
    const updatedFilters = activeFilters.filter(f => f.key !== filterKey);
    updatedFilters.push(newFilter);

    setActiveFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleFilterRemove = (filterKey: string) => {
    const updatedFilters = activeFilters.filter(f => f.key !== filterKey);
    setActiveFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
    onFilterChange?.([]);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 transform items-center space-x-1">
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearSearch}
              className="h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {availableFilters.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="h-6 w-6"
            >
              <SlidersHorizontal className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      {showFilters && availableFilters.length > 0 && (
        <div className="flex flex-wrap gap-3 rounded-lg bg-gray-50 p-3">
          {availableFilters.map(filterConfig => (
            <div key={filterConfig.key} className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                {filterConfig.label}:
              </span>
              <Select
                onValueChange={value => {
                  const selectedOption = filterConfig.options.find(
                    opt => opt.value === value
                  );
                  if (selectedOption) {
                    handleFilterAdd(
                      filterConfig.key,
                      value,
                      selectedOption.label
                    );
                  }
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="選択" />
                </SelectTrigger>
                <SelectContent>
                  {filterConfig.options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">フィルター:</span>
          {activeFilters.map(filter => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="flex items-center space-x-1 px-2 py-1"
            >
              <span className="text-xs">{filter.label}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFilterRemove(filter.key)}
                className="h-3 w-3 p-0 hover:bg-transparent"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
          {activeFilters.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAllFilters}
              className="h-6 px-2 text-xs"
            >
              すべてクリア
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
