"use client";

import { useState } from "react";

interface FiltersProps {
  filters: {
    batch: string;
    status: string;
    industry: string;
    search: string;
    other: string;
  };
  setFilters: (filters: any) => void;
  companies: any[];
}

export default function Filters({
  filters,
  setFilters,
  companies,
}: FiltersProps) {
  // Get unique values for dropdowns
  const uniqueBatches = [
    ...new Set(companies.map((c) => c.batch).filter(Boolean)),
  ].sort((a, b) => {
    // Sort newest to oldest (e.g., Winter 2024, Summer 2023, Winter 2023, etc.)
    const getBatchOrder = (batch: string) => {
      if (batch === "Unspecified") return -1; // Put unspecified at the end
      const [season, year] = batch.split(" ");
      const yearNum = parseInt(year);
      if (isNaN(yearNum)) return -1; // Handle invalid years
      const seasonOrder =
        season === "Winter"
          ? 0
          : season === "Summer"
          ? 1
          : season === "Fall"
          ? 2
          : season === "Spring"
          ? 3
          : 4;
      return yearNum * 10 + seasonOrder;
    };
    return getBatchOrder(b) - getBatchOrder(a); // Descending order (newest first)
  });
  const uniqueStatuses = [
    ...new Set(companies.map((c) => c.status).filter(Boolean)),
  ].sort();
  const uniqueIndustries = [
    ...new Set(companies.flatMap((c) => c.tags || [])),
  ].sort();

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      batch: "",
      status: "",
      industry: "",
      search: "",
      other: "",
    });
  };

  const hasActiveFilters =
    filters.batch ||
    filters.status ||
    filters.industry ||
    filters.search ||
    filters.other;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Company or description"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yc-orange focus:border-transparent"
          />
        </div>

        {/* Batch Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Batch
          </label>
          <div className="relative">
            <select
              value={filters.batch}
              onChange={(e) => handleFilterChange("batch", e.target.value)}
              className="w-full px-3 pr-8 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yc-orange focus:border-transparent appearance-none"
            >
              <option value="">All batches</option>
              {uniqueBatches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 pr-8 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yc-orange focus:border-transparent appearance-none"
            >
              <option value="">All statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Industry Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <div className="relative">
            <select
              value={filters.industry}
              onChange={(e) => handleFilterChange("industry", e.target.value)}
              className="w-full px-3 pr-8 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yc-orange focus:border-transparent appearance-none"
            >
              <option value="">All industries</option>
              {uniqueIndustries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Other Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Other
          </label>
          <div className="relative">
            <select
              value={filters.other}
              onChange={(e) => handleFilterChange("other", e.target.value)}
              className="w-full px-3 pr-8 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yc-orange focus:border-transparent appearance-none"
            >
              <option value="">All</option>
              <option value="top_company">Top Companies</option>
              <option value="is_hiring">Is Hiring</option>
              <option value="nonprofit">Nonprofit</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
