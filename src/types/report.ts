
export interface ReportFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'daterange';
  options?: { value: string; label: string }[];
  value: string | string[];
}

export interface ReportColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface ReportData {
  id: string;
  [key: string]: any;
}

export interface ReportConfig {
  title: string;
  description: string;
  filters: ReportFilter[];
  columns: ReportColumn[];
  data: ReportData[];
  exportable: boolean;
}