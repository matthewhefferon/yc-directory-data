export default function CompanyTable({
  data,
  totalCount,
}: {
  data: any[];
  totalCount?: number;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-semibold text-black border-b border-gray-200 whitespace-nowrap">
                Company
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-black border-b border-gray-200 whitespace-nowrap">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black border-b border-gray-200 whitespace-nowrap">
                Batch
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black border-b border-gray-200 whitespace-nowrap">
                Industry
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black border-b border-gray-200 whitespace-nowrap">
                Location
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black border-b border-gray-200 whitespace-nowrap">
                Founded
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black border-b border-gray-200 whitespace-nowrap">
                Team Size
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black border-b border-gray-200 whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black border-b border-gray-200 whitespace-nowrap">
                Website
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr
                key={c.company_id || c.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-3 text-sm font-medium text-black border-b border-gray-100 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {c.logo_url && (
                      <img
                        src={c.logo_url}
                        alt={`${c.company_name || c.name} logo`}
                        className="w-8 h-8 rounded object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <span>{c.company_name || c.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 border-b border-gray-100 min-w-96 max-w-lg">
                  <div className="break-words">
                    {c.short_description || c.one_liner}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm border-b border-gray-100 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-yc-orange text-white">
                    {c.batch}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm border-b border-gray-100 whitespace-nowrap">
                  {c.tags && c.tags.length > 0 ? (
                    <div className="flex gap-1">
                      {c.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100 whitespace-nowrap">
                  {c.location && c.country
                    ? `${c.location}, ${c.country}`
                    : c.location || c.country || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-black border-b border-gray-100 whitespace-nowrap">
                  {c.year_founded || c.founded || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-black border-b border-gray-100 whitespace-nowrap">
                  {c.team_size || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-black border-b border-gray-100 whitespace-nowrap">
                  {c.status || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm border-b border-gray-100 whitespace-nowrap">
                  {c.website ? (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {c.website}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
