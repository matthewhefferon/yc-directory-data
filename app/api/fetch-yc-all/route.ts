import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch real data from yc-oss public API
    const response = await fetch(
      "https://yc-oss.github.io/api/companies/all.json",
      { cache: "no-store" } // Disable Next.js caching for large datasets
    );
    const companies = await response.json();

    // Transform all companies to match our table structure
    const transformedCompanies = companies.map((company: any) => ({
      company_id: company.id,
      company_name: company.name,
      short_description: company.one_liner,
      long_description: company.long_description,
      batch: company.batch,
      status: company.status,
      tags: company.tags,
      location: company.all_locations?.split(",")[0]?.trim() || "N/A",
      country: company.all_locations?.split(",").pop()?.trim() || "N/A",
      year_founded: new Date(company.launched_at * 1000).getFullYear(),
      team_size: company.team_size,
      website: company.website,
      logo_url: company.small_logo_thumb_url,
      // Legacy fields for backward compatibility
      id: company.id,
      name: company.name,
      slug: company.slug,
      one_liner: company.one_liner,
      founded: new Date(company.launched_at * 1000).getFullYear().toString(),
      social_links: {
        twitter: `https://twitter.com/${company.slug}`,
        linkedin: `https://linkedin.com/company/${company.slug}`,
      },
      is_hiring: company.isHiring,
      top_company: company.top_company,
      nonprofit: company.nonprofit,
    }));

    return NextResponse.json(transformedCompanies);
  } catch (error) {
    console.error("Error fetching YC data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
