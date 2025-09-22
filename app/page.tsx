"use client";

import { useState, useEffect } from "react";
import CompanyTable from "@/components/CompanyTable";
import ExportButtons from "@/components/ExportButtons";
import Filters from "@/components/Filters";
import Pagination from "@/components/Pagination";
import { exportToCsv, exportToSql } from "@/lib/export";

export default function Home() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    batch: "",
    status: "",
    industry: "",
    search: "",
    other: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/fetch-yc-all");
        const data = await res.json();
        setCompanies(data);
        setFilteredCompanies(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    let filtered = companies;

    if (filters.batch) {
      filtered = filtered.filter((c) => c.batch === filters.batch);
    }
    if (filters.status) {
      filtered = filtered.filter((c) => c.status === filters.status);
    }
    if (filters.industry) {
      filtered = filtered.filter(
        (c) =>
          c.tags &&
          c.tags.some((tag: string) =>
            tag.toLowerCase().includes(filters.industry.toLowerCase())
          )
      );
    }
    if (filters.search) {
      filtered = filtered.filter(
        (c) =>
          (c.company_name || c.name)
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          (c.short_description || c.one_liner)
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }
    if (filters.other) {
      if (filters.other === "top_company") {
        filtered = filtered.filter((c) => c.top_company);
      } else if (filters.other === "is_hiring") {
        filtered = filtered.filter((c) => c.is_hiring);
      } else if (filters.other === "nonprofit") {
        filtered = filtered.filter((c) => c.nonprofit);
      }
    }

    // Sort by batch from newest to oldest
    filtered.sort((a, b) => {
      const getBatchOrder = (batch: string) => {
        if (!batch || batch === "Unspecified") return -1;
        const [season, year] = batch.split(" ");
        const yearNum = parseInt(year);
        if (isNaN(yearNum)) return -1;
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
      return getBatchOrder(b.batch) - getBatchOrder(a.batch);
    });

    setFilteredCompanies(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [companies, filters]);

  return (
    <main className="min-h-screen bg-yc-bg p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-black">
                YC Directory Data
              </h1>
              <p className="text-gray-600 text-base lg:text-lg">
                Browse, filter, and export Y Combinator company data
              </p>
            </div>
            <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <ExportButtons
                onExport={(format) => {
                  if (format === "csv") exportToCsv(filteredCompanies);
                  if (format === "sql") exportToSql(filteredCompanies);
                }}
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 bg-white border-2 border-yc-orange hover:bg-yc-orange hover:scale-105 text-yc-orange hover:text-white px-3 py-1.5 rounded font-medium transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                  />
                </svg>
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 space-y-4">
          {showFilters && (
            <Filters
              filters={filters}
              setFilters={setFilters}
              companies={companies}
            />
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">Loading companies...</div>
          </div>
        ) : (
          <>
            <CompanyTable
              data={filteredCompanies.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )}
              totalCount={companies.length}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredCompanies.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              totalItems={filteredCompanies.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>
    </main>
  );
}
