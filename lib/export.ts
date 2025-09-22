import { Parser } from "json2csv";

export function exportToCsv(data: any[]) {
  // Flatten the data structure for CSV export
  const flattenedData = data.map((company) => ({
    company_id: company.company_id || company.id,
    company_name: company.company_name || company.name,
    short_description: company.short_description || company.one_liner,
    long_description: company.long_description,
    batch: company.batch,
    status: company.status,
    tags: company.tags ? company.tags.join(", ") : "",
    location: company.location,
    country: company.country,
    year_founded: company.year_founded || company.founded,
    team_size: company.team_size,
    website: company.website,
    logo_url: company.logo_url,
    slug: company.slug,
    is_hiring: company.is_hiring,
    top_company: company.top_company,
    nonprofit: company.nonprofit,
  }));

  const parser = new Parser();
  const csv = parser.parse(flattenedData);
  const blob = new Blob([csv], { type: "text/csv" });
  download(blob, "yc_companies.csv");
}

export function exportToSql(data: any[]) {
  const schema = `
-- YC Companies Database Schema
CREATE TABLE yc_companies (
  company_id INT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  short_description TEXT,
  long_description TEXT,
  batch VARCHAR(50),
  status VARCHAR(50),
  tags TEXT,
  location VARCHAR(255),
  country VARCHAR(100),
  year_founded INT,
  team_size INT,
  website VARCHAR(500),
  logo_url VARCHAR(500),
  slug VARCHAR(255),
  is_hiring BOOLEAN DEFAULT FALSE,
  top_company BOOLEAN DEFAULT FALSE,
  nonprofit BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_company_name ON yc_companies(company_name);
CREATE INDEX idx_batch ON yc_companies(batch);
CREATE INDEX idx_status ON yc_companies(status);
CREATE INDEX idx_year_founded ON yc_companies(year_founded);
CREATE INDEX idx_team_size ON yc_companies(team_size);
CREATE INDEX idx_top_company ON yc_companies(top_company);
CREATE INDEX idx_is_hiring ON yc_companies(is_hiring);

`;

  // Use batch INSERT for better performance
  const batchSize = 1000;
  const batches = [];

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const values = batch
      .map((c) => {
        const escape = (str: any) =>
          str ? str.toString().replace(/'/g, "''") : "";
        return `(${c.company_id || c.id}, '${escape(
          c.company_name || c.name
        )}', '${escape(c.short_description || c.one_liner)}', '${escape(
          c.long_description
        )}', '${escape(c.batch)}', '${escape(c.status)}', '${escape(
          c.tags ? c.tags.join(", ") : ""
        )}', '${escape(c.location)}', '${escape(c.country)}', ${
          c.year_founded || c.founded || "NULL"
        }, ${c.team_size || "NULL"}, '${escape(c.website)}', '${escape(
          c.logo_url
        )}', '${escape(c.slug)}', ${c.is_hiring ? "TRUE" : "FALSE"}, ${
          c.top_company ? "TRUE" : "FALSE"
        }, ${c.nonprofit ? "TRUE" : "FALSE"})`;
      })
      .join(",\n    ");

    batches.push(
      `INSERT INTO yc_companies (company_id, company_name, short_description, long_description, batch, status, tags, location, country, year_founded, team_size, website, logo_url, slug, is_hiring, top_company, nonprofit) VALUES\n    ${values};`
    );
  }

  const sqlContent = schema + batches.join("\n\n");
  const blob = new Blob([sqlContent], { type: "text/sql" });
  download(blob, "yc_companies.sql");
}

function download(blob: Blob, filename: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
