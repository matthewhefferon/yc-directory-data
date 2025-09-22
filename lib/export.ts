import { Parser } from "json2csv";

export function exportToCsv(data: any[]) {
  // Export only the columns that match the table display
  const flattenedData = data.map((company) => ({
    company_name: company.company_name || company.name,
    short_description: company.short_description || company.one_liner,
    batch: company.batch,
    industry: company.tags ? company.tags.join(", ") : "",
    location:
      company.location && company.country
        ? `${company.location}, ${company.country}`
        : company.location || company.country || "N/A",
    year_founded: company.year_founded || company.founded,
    team_size: company.team_size,
    status: company.status,
    is_hiring: company.is_hiring ? "Yes" : "No",
    top_company: company.top_company ? "Yes" : "No",
    nonprofit: company.nonprofit ? "Yes" : "No",
    website: company.website,
  }));

  const parser = new Parser();
  const csv = parser.parse(flattenedData);
  const blob = new Blob([csv], { type: "text/csv" });
  download(blob, "yc_companies.csv");
}

export function exportToSql(data: any[]) {
  const schema = `
-- YC Companies Database Schema (matches table display)
CREATE TABLE yc_companies (
  company_name VARCHAR(255) NOT NULL,
  short_description TEXT,
  batch VARCHAR(50),
  industry TEXT,
  location VARCHAR(255),
  year_founded INT,
  team_size INT,
  status VARCHAR(50),
  is_hiring VARCHAR(10),
  top_company VARCHAR(10),
  nonprofit VARCHAR(10),
  website VARCHAR(500),
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
        return `('${escape(c.company_name || c.name)}', '${escape(
          c.short_description || c.one_liner
        )}', '${escape(c.batch)}', '${escape(
          c.tags ? c.tags.join(", ") : ""
        )}', '${escape(
          c.location && c.country
            ? `${c.location}, ${c.country}`
            : c.location || c.country || "N/A"
        )}', ${c.year_founded || c.founded || "NULL"}, ${
          c.team_size || "NULL"
        }, '${escape(c.status)}', '${c.is_hiring ? "Yes" : "No"}', '${
          c.top_company ? "Yes" : "No"
        }', '${c.nonprofit ? "Yes" : "No"}', '${escape(c.website)}')`;
      })
      .join(",\n    ");

    batches.push(
      `INSERT INTO yc_companies (company_name, short_description, batch, industry, location, year_founded, team_size, status, is_hiring, top_company, nonprofit, website) VALUES\n    ${values};`
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
