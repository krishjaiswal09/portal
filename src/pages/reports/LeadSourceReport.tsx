import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Download, Search, TrendingUp, Users, Calendar } from "lucide-react";
import { ReportLayout } from "@/components/reports/ReportLayout";
import { hasPermission } from "@/utils/checkPermission";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { fetchApi } from "@/services/api/fetchApi";
import { useQuery } from "@tanstack/react-query";
import { TablePagination } from "@/components/ui/table-pagination";

const MODERN_COLORS = [
  "#6366f1", // indigo-500 - Facebook
  "#8b5cf6", // violet-500 - Instagram
  "#ec4899", // pink-500 - YouTube
  "#f59e0b", // amber-500 - LinkedIn
  "#10b981", // emerald-500 - WhatsApp
  "#3b82f6", // blue-500 - Google
];

export default function LeadSourceReport() {
  const navigate = useNavigate();

  // All hooks must be at the top before any conditional returns
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: apiData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lead-source"],
    queryFn: async () => {
      try {
        const response = await fetchApi<{
          users: Array<{
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            phone_number: string;
            country: string;
            created_at: string;
            lead_source_name: string;
          }>;
          source_statistics: Array<{
            source_name: string;
            total_users: number;
            percentage: number;
          }>;
          total_lead_sources_count: number;
          top_source: {
            source_name: string;
            total_users: number;
            percentage: number;
          };
          this_month_count: number;
          this_month_sources: Array<{
            source_name: string;
            total_users: number;
            percentage: number;
          }>;
          generated_at: string;
        }>({
          path: "lead-source/reports/comprehensive",
        });
        return response;
      } catch (error) {
        console.warn("API call failed, using mock data:", error);
        return null;
      }
    },
  });

  if (!hasPermission("HAS_READ_REPORTS")) {
    return (
      <DashboardLayout title="No Permission">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Access Denied
          </h2>
          <p className="text-muted-foreground">
            You do not have permission to view this page.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Get users from API data or empty array if not available
  const users = apiData?.users || [];
  const sourceStatistics = apiData?.source_statistics || [];
  const topSource = apiData?.top_source;
  const thisMonthCount = apiData?.this_month_count || 0;

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number.includes(searchTerm);

      const matchesPlatform =
        selectedPlatform === "all" || user.lead_source_name === selectedPlatform;

      return matchesSearch && matchesPlatform;
    });
  }, [users, searchTerm, selectedPlatform]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Calculate chart data from API source statistics
  const chartData = useMemo(() => {
    return sourceStatistics.map((source) => ({
      name: source.source_name,
      value: source.total_users,
      percentage: source.percentage,
    }));
  }, [sourceStatistics]);

  // Get unique lead sources for filter dropdown
  const uniqueLeadSources = useMemo(() => {
    const sources = new Set(users.map((user) => user.lead_source_name));
    return Array.from(sources).filter(Boolean);
  }, [users]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleExport = (format: "csv" | "excel") => {
    if (filteredData.length === 0) {
      console.warn("No data to export");
      return;
    }

    // Define headers for the export
    const headers = [
      'Name',
      'Email',
      'Phone Number',
      'Lead Source',
      'Country',
      'Created Date'
    ];

    // Prepare the data for export
    const exportData = filteredData.map((user) => [
      `${user.first_name} ${user.last_name}`.trim() || "N/A",
      user.email,
      user.phone_number,
      user.lead_source_name,
      user.country || "N/A",
      new Date(user.created_at).toLocaleDateString()
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...exportData.map(row =>
        row.map(value =>
          typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value
        ).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], {
      type: format === "csv" ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lead-source-report-${new Date().toISOString().split('T')[0]}.${format === "csv" ? "csv" : "xlsx"}`;
    link.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
  };

  const handleExportSummary = (format: "csv" | "excel") => {
    if (sourceStatistics.length === 0) {
      console.warn("No summary data to export");
      return;
    }

    // Define headers for summary export
    const summaryHeaders = [
      'Lead Source',
      'Total Users',
      'Percentage',
      'Total Leads Count',
      'Top Source',
      'This Month Count',
      'Generated At'
    ];

    // Prepare summary data for export
    const summaryData = sourceStatistics.map((source) => [
      source.source_name,
      source.total_users,
      `${source.percentage}%`,
      users.length,
      topSource?.source_name || "N/A",
      thisMonthCount,
      new Date(apiData?.generated_at || new Date()).toLocaleString()
    ]);

    // Create CSV content for summary
    const csvContent = [
      summaryHeaders.join(','),
      ...summaryData.map(row =>
        row.map(value =>
          typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value
        ).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], {
      type: format === "csv" ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lead-source-summary-${new Date().toISOString().split('T')[0]}.${format === "csv" ? "csv" : "xlsx"}`;
    link.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPlatform("all");
    setCurrentPage(1);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-2xl">
          <p className="font-bold text-lg text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600 mt-1">
            Count:{" "}
            <span className="font-semibold text-gray-800">{data.value}</span>
          </p>
          <p className="text-sm text-gray-600">
            Percentage:{" "}
            <span className="font-semibold text-gray-800">
              {data.percentage}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {payload?.map((entry: any, index: number) => {
          const data = chartData.find((item) => item.name === entry.value);
          return (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700">
                {entry.value} ({data?.percentage || 0}%)
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <ReportLayout
        title="Lead Source Report"
        description="Track and analyze student lead sources and conversion metrics"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </ReportLayout>
    );
  }

  if (error) {
    return (
      <ReportLayout
        title="Lead Source Report"
        description="Track and analyze student lead sources and conversion metrics"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">
            Error loading data. Please try again.
          </div>
        </div>
      </ReportLayout>
    );
  }

  return (
    <ReportLayout
      title="Lead Source Report"
      description="Track and analyze student lead sources and conversion metrics"
    >
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Top Source</p>
                  <p className="text-lg font-bold">
                    {topSource?.source_name || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{thisMonthCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={selectedPlatform}
                onValueChange={setSelectedPlatform}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {uniqueLeadSources.map((source: string) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>

              {/* CSV Export */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("csv")}
                disabled={filteredData.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>

              {/* Excel Export */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("excel")}
                disabled={filteredData.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modern Enhanced Pie Chart */}
        <Card className="shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Lead Source Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <ResponsiveContainer width="100%" height={600}>
                <PieChart>
                  <defs>
                    {MODERN_COLORS.map((color, index) => (
                      <linearGradient
                        key={index}
                        id={`gradient-${index}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor={color}
                          stopOpacity={0.8}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="45%"
                    outerRadius={180}
                    innerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={3}
                    stroke="white"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#gradient-${index % MODERN_COLORS.length})`}
                        className="hover:opacity-90 transition-all duration-300 cursor-pointer drop-shadow-lg"
                        style={{
                          filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))",
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Data Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Student Details ({filteredData.length} records)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Contact
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Lead Source
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Country
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((user: any, index: number) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 font-medium text-gray-900">
                        {`${user.first_name} ${user.last_name}`.trim() || "N/A"}
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div className="text-gray-900">{user.email}</div>
                          <div className="text-gray-500">
                            {user.phone_number}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className="font-medium"
                          style={{
                            borderColor:
                              MODERN_COLORS[
                              uniqueLeadSources.indexOf(
                                user.lead_source_name
                              ) % MODERN_COLORS.length
                              ],
                            color:
                              MODERN_COLORS[
                              uniqueLeadSources.indexOf(
                                user.lead_source_name
                              ) % MODERN_COLORS.length
                              ],
                          }}
                        >
                          {user.lead_source_name}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-700">
                        {user.country || "N/A"}
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {filteredData.length > 0 && (
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={filteredData.length}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ReportLayout>
  );
}
