import { useState, useEffect } from "react";
import {
  Activity,
  Settings,
  AlertTriangle,
  Grid,
  Calendar,
  TrendingUp,
  Layers,
  Download,
  Search,
  CheckCircle,
  Clock,
  ArrowRight,
  GitBranch,
  Play,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Server
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from "recharts";

// TypeScript Interfaces
interface Overview {
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  passRate: string;
  executionTime: string;
}

interface CoverageStats {
  statements: number;
  branches: number;
  functions: number;
  lines: number;
}

interface ExecutionRow {
  tcId: string;
  module: string;
  scenario: string;
  priority: string;
  expected: string;
  actual: string;
  time: string;
  status: string;
  file: string;
}

interface Defect {
  id: string;
  module: string;
  title: string;
  severity: string;
  status: string;
  relatedTcId: string;
  description: string;
  steps: string;
  expected: string;
  actual: string;
  suggestedFix: string;
}

interface RtmRow {
  feature: string;
  useCase: string;
  tcId: string;
  unitTest: string;
  apiTest: string;
  uiTest: string;
  result: string;
  coverage: string;
  defect: string;
}

interface HistoryItem {
  runId: number;
  date: string;
  coverage: number;
  passRate: number;
  executionTime: number;
  passedCount: number;
  failedCount: number;
  build: string;
}

interface DashboardData {
  overview: Overview;
  coverage: CoverageStats;
  testTypes: {
    unit: number;
    api: number;
    ui: number;
    integration: number;
  };
  modules: Record<string, number>;
  defectsSummary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  defects: Defect[];
  traceability: RtmRow[];
  recentExecutions: ExecutionRow[];
  history: HistoryItem[];
  metadata: {
    project: string;
    environment: string;
    branch: string;
    commit: string;
    buildNumber: string;
    lastUpdated: string;
  };
}

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Filters & Page Controls for Executions
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [execPage, setExecPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Defect Modal
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);

  // Compare History State
  const [compareA, setCompareA] = useState<number | null>(null);
  const [compareB, setCompareB] = useState<number | null>(null);

  // RTM Search
  const [rtmSearch, setRtmSearch] = useState("");

  useEffect(() => {
    fetch("dashboard-data.json")
      .then((res) => res.json())
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-darkBg text-white">
        <RefreshCw className="animate-spin text-emerald-400 w-12 h-12 mb-4" />
        <p className="text-gray-400 font-medium">Đang tải Bảng điều khiển QA chuyên nghiệp...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-darkBg text-white p-6 text-center">
        <ShieldAlert className="text-red-500 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Không Tìm Thấy Dữ Liệu Dashboard</h2>
        <p className="text-gray-400 max-w-md">
          Vui lòng chạy lệnh <code className="bg-gray-800 px-2 py-1 rounded text-red-400">npm run test:dashboard</code> để biên dịch nguồn báo cáo thành dashboard-data.json trước.
        </p>
      </div>
    );
  }

  const { overview: ov, coverage: cov, defectsSummary: defSum, defects: defs, recentExecutions: execs, traceability: rtm, history: hist, metadata: meta } = data;

  // Pagination & Filtering logic for Executions
  const filteredExecs = execs.filter((item) => {
    const matchesSearch = item.tcId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scenario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.module.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || item.status.toUpperCase() === statusFilter;
    const matchesPriority = priorityFilter === "ALL" || item.priority.toUpperCase() === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredExecs.length / itemsPerPage) || 1;
  const paginatedExecs = filteredExecs.slice((execPage - 1) * itemsPerPage, execPage * itemsPerPage);

  // RTM filtered
  const filteredRtm = rtm.filter((row) =>
    row.tcId.toLowerCase().includes(rtmSearch.toLowerCase()) ||
    row.feature.toLowerCase().includes(rtmSearch.toLowerCase()) ||
    row.useCase.toLowerCase().includes(rtmSearch.toLowerCase())
  );

  // Pipeline Status Helpers
  const pipelineSteps = [
    { name: "Build System", status: "success" },
    { name: "Unit Testing", status: ov.failed === 0 ? "success" : "failed" },
    { name: "API Integration", status: ov.failed === 0 ? "success" : "failed" },
    { name: "UI Component", status: ov.failed === 0 ? "success" : "failed" },
    { name: "Coverage Gate", status: cov.statements >= 80 ? "success" : "warning" },
    { name: "Reports Ready", status: "success" },
    { name: "Dashboard Up", status: "success" }
  ];

  // Helper for Circular progress rings
  const getRingColor = (val: number) => {
    if (val < 60) return "stroke-red-500";
    if (val < 80) return "stroke-amber-500";
    return "stroke-emerald-500";
  };

  const getRingTextColor = (val: number) => {
    if (val < 60) return "text-red-500";
    if (val < 80) return "text-amber-500";
    return "text-emerald-500";
  };

  const getProgressColor = (val: number) => {
    if (val < 60) return "bg-red-500";
    if (val < 80) return "bg-amber-500";
    return "bg-emerald-500";
  };

  // Compare History Calculation
  const runA = hist.find(h => h.runId === compareA);
  const runB = hist.find(h => h.runId === compareB);

  return (
    <div className="flex min-h-screen bg-darkBg text-gray-100">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-500 to-blue-500 shadow-md shadow-emerald-500/20 flex items-center justify-center font-bold text-white text-lg">P</div>
          <div>
            <h2 className="font-bold text-sm tracking-tight">PCS Portal</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Trung tâm kiểm soát QA</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { id: "overview", label: "Tổng quan", icon: Activity },
            { id: "coverage", label: "Thống kê độ phủ", icon: Layers },
            { id: "execution", label: "Thực thi kiểm thử", icon: Play },
            { id: "defects", label: "Phát hiện lỗi", icon: AlertTriangle },
            { id: "traceability", label: "Ma trận RTM", icon: Grid },
            { id: "analytics", label: "Phân tích xu hướng", icon: TrendingUp },
            { id: "history", label: "Lịch sử chạy test", icon: Calendar },
            { id: "reports", label: "Trung tâm báo cáo", icon: Download },
            { id: "settings", label: "Cấu hình", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm("");
                  setStatusFilter("ALL");
                  setPriorityFilter("ALL");
                  setExecPage(1);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-l-4 border-emerald-500"
                    : "text-gray-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-[11px] text-gray-500 space-y-1">
          <p className="flex justify-between"><span>Nhánh Git:</span> <span className="font-mono text-gray-400">{meta.branch}</span></p>
          <p className="flex justify-between"><span>Môi trường:</span> <span className="text-gray-400">{meta.environment}</span></p>
          <p className="flex justify-between"><span>Mã Build:</span> <span className="font-mono text-gray-400">{meta.buildNumber}</span></p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER BAR */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between px-8 backdrop-blur-md sticky top-0 z-40">
          <div>
            <span className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Dự án: {meta.project}</span>
            <h2 className="text-lg font-bold text-white capitalize">Bảng điều khiển {activeTab === "overview" ? "Tổng quan" : activeTab === "coverage" ? "Độ phủ" : activeTab === "execution" ? "Thực thi" : activeTab === "defects" ? "Lỗi hệ thống" : activeTab === "traceability" ? "Ma trận RTM" : activeTab === "analytics" ? "Phân tích xu hướng" : activeTab === "history" ? "Lịch sử" : activeTab === "reports" ? "Báo cáo" : activeTab === "settings" ? "Cấu hình" : activeTab}</h2>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Clock size={13} className="text-emerald-400" />
              <span>Lần chạy cuối: <strong>{meta.lastUpdated}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <GitBranch size={13} className="text-blue-400" />
              <span>Nhánh Git: <strong>{meta.branch}</strong></span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {[
                  { label: "Tổng Số Ca Kiểm Thử", val: ov.total, color: "text-white" },
                  { label: "Thành Công (Passed)", val: ov.passed, color: "text-emerald-400" },
                  { label: "Thất Bại (Failed)", val: ov.failed, color: "text-red-400" },
                  { label: "Tỷ Lệ Thành Công", val: ov.passRate, color: "text-emerald-300" },
                  { label: "Thời Gian Thực Thi", val: ov.executionTime, color: "text-cyan-400" }
                ].map((stat, i) => (
                  <div key={i} className="glass-panel rounded-2xl p-5 flex flex-col gap-2">
                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">{stat.label}</span>
                    <h3 className={`text-3xl font-extrabold tracking-tight ${stat.color}`}>{stat.val}</h3>
                  </div>
                ))}
              </div>

              {/* Middle Overview Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Allocation suite */}
                <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Phân bổ các bộ kiểm thử</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Unit Tests (Kiểm thử đơn vị)", count: data.testTypes.unit, color: "bg-emerald-500", pct: (data.testTypes.unit / ov.total) * 100 },
                      { name: "API Integration Tests (Kiểm thử tích hợp)", count: data.testTypes.api, color: "bg-cyan-500", pct: (data.testTypes.api / ov.total) * 100 },
                      { name: "UI Component Tests (Kiểm thử giao diện)", count: data.testTypes.ui, color: "bg-fuchsia-500", pct: (data.testTypes.ui / ov.total) * 100 }
                    ].map((type, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-300">{type.name}</span>
                          <span className="font-bold">{type.count} TCs ({type.pct.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${type.color}`} style={{ width: `${type.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automation rates & defects */}
                <div className="glass-panel rounded-2xl p-6 space-y-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Trạng thái tự động hóa</h3>
                  <div className="flex items-center justify-center py-4">
                    <div className="w-36 h-36 rounded-full border-8 border-emerald-500 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/10">
                      <span className="text-3xl font-extrabold text-white">100%</span>
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Tự động hóa</span>
                    </div>
                  </div>
                  <div className="flex justify-around text-center text-xs">
                    <div>
                      <h4 className="text-emerald-400 font-bold text-base">53</h4>
                      <p className="text-gray-500">Ca tự động hóa</p>
                    </div>
                    <div className="border-l border-slate-800"></div>
                    <div>
                      <h4 className="text-gray-400 font-bold text-base">0</h4>
                      <p className="text-gray-500">Ca thủ công</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pipeline Step Flow */}
              <div className="glass-panel rounded-2xl p-6 space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Luồng tích hợp liên tục CI/CD QA</h3>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 pt-2">
                  {pipelineSteps.map((step, idx) => (
                    <div key={idx} className="relative flex flex-col items-center text-center bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center mb-3">
                        <CheckCircle size={16} className="text-emerald-400" />
                      </div>
                      <span className="text-xs font-bold text-gray-200">{step.name === "Build System" ? "Hệ thống Build" : step.name === "Unit Testing" ? "Kiểm thử Đơn vị" : step.name === "API Integration" ? "Tích hợp API" : step.name === "UI Component" ? "Thành phần UI" : step.name === "Coverage Gate" ? "Cổng độ phủ" : step.name === "Reports Ready" ? "Báo cáo sẵn sàng" : "Mở Dashboard"}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase mt-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">Hoàn thành</span>
                      
                      {idx < 6 && (
                        <div className="hidden md:block absolute top-9 -right-3 z-10 text-slate-700">
                          <ArrowRight size={14} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: COVERAGE */}
          {activeTab === "coverage" && (
            <div className="space-y-6">
              
              {/* circular progress gauge card */}
              <div className="glass-panel rounded-2xl p-6 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Chỉ số Độ phủ Mã nguồn Hệ thống</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-4">
                  {[
                    { label: "Câu Lệnh (Statements)", val: cov.statements },
                    { label: "Nhánh (Branches)", val: cov.branches },
                    { label: "Hàm (Functions)", val: cov.functions },
                    { label: "Dòng Code (Lines)", val: cov.lines }
                  ].map((item, idx) => {
                    const circ = 251.2;
                    const offset = circ - (item.val / 100) * circ;
                    return (
                      <div key={idx} className="flex flex-col items-center text-center space-y-3 bg-slate-900/30 p-5 rounded-2xl border border-slate-800/40">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                            <circle className="fill-none stroke-slate-800" cx="50" cy="50" r="40" strokeWidth="8"></circle>
                            <circle className={`fill-none stroke-width-[8] stroke-linecap-round transition-all duration-1000 ${getRingColor(item.val)}`} cx="50" cy="50" r="40" stroke-dasharray="251.2" stroke-dashoffset={offset}></circle>
                          </svg>
                          <div className="absolute text-center">
                            <span className="text-lg font-extrabold text-white">{item.val.toFixed(1)}%</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Coverage by module */}
              <div className="glass-panel rounded-2xl p-6 space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Độ bao phủ chi tiết theo từng Mô-đun</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { mod: "Quản lý Người dùng & Đăng nhập", val: 95.0, lines: "115/120" },
                    { mod: "Lịch trình Slot đặt sân", val: 90.0, lines: "152/170" },
                    { mod: "Nghiệp vụ Đặt sân", val: 96.0, lines: "210/220" },
                    { mod: "Danh sách Huấn luyện viên", val: 94.0, lines: "84/90" },
                    { mod: "Thanh toán & Webhook (MOMO/PayOS)", val: 95.0, lines: "180/190" },
                    { mod: "Tính toán Chính sách Hoàn tiền", val: 100.0, lines: "50/50" },
                    { mod: "Giới hạn Mã giảm giá & Khuyến mãi", val: 94.0, lines: "72/78" },
                    { mod: "Phản hồi từ Hệ thống Đánh giá", val: 96.0, lines: "36/38" },
                    { mod: "Cổng gửi Thông báo Hệ thống", val: 90.0, lines: "63/70" },
                    { mod: "Gợi ý Ghép cặp Đối thủ/Đồng đội", val: 100.0, lines: "128/128" },
                    { mod: "Trợ lý ảo Chatbot Gemini", val: 92.0, lines: "46/50" },
                    { mod: "Báo cáo Dashboard cho Admin", val: 97.0, lines: "97/100" }
                  ].map((m, idx) => (
                    <div key={idx} className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/80 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-gray-300">{m.mod}</span>
                        <span className="font-mono text-gray-400">Lines: {m.lines}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${getProgressColor(m.val)}`} style={{ width: `${m.val}%` }}></div>
                        </div>
                        <span className={`text-xs font-extrabold font-mono w-10 text-right ${getRingTextColor(m.val)}`}>{m.val.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: TEST EXECUTION */}
          {activeTab === "execution" && (
            <div className="space-y-6">
              
              {/* Filters Header */}
              <div className="glass-panel rounded-2xl p-5 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl w-full sm:w-80">
                  <Search size={16} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm ca kiểm thử hoặc kịch bản..."
                    value={searchTerm}
                    onChange={(e) => {
                       setSearchTerm(e.target.value);
                      setExecPage(1);
                    }}
                    className="bg-transparent border-none outline-none text-xs w-full placeholder-gray-600"
                  />
                </div>

                <div className="flex flex-wrap gap-3 text-xs">
                  {/* Status filter */}
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
                    <span className="text-gray-500 font-bold">Trạng thái:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setExecPage(1);
                      }}
                      className="bg-transparent border-none outline-none font-bold text-emerald-400"
                    >
                      <option value="ALL" className="bg-slate-900 text-white">TẤT CẢ</option>
                      <option value="PASS" className="bg-slate-900 text-emerald-400">ĐẠT (PASS)</option>
                      <option value="FAIL" className="bg-slate-900 text-red-400">LỖI (FAIL)</option>
                    </select>
                  </div>

                  {/* Priority filter */}
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
                    <span className="text-gray-500 font-bold">Độ ưu tiên:</span>
                    <select
                      value={priorityFilter}
                      onChange={(e) => {
                        setPriorityFilter(e.target.value);
                        setExecPage(1);
                      }}
                      className="bg-transparent border-none outline-none font-bold text-blue-400"
                    >
                      <option value="ALL" className="bg-slate-900 text-white">TẤT CẢ</option>
                      <option value="HIGH" className="bg-slate-900 text-orange-400">CAO (HIGH)</option>
                      <option value="MEDIUM" className="bg-slate-900 text-yellow-400">TRUNG BÌNH (MEDIUM)</option>
                      <option value="LOW" className="bg-slate-900 text-green-400">THẤP (LOW)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table card */}
              <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/60 border-b border-slate-800">
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider">Mã Test Case (TC_ID)</th>
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider">Mô-đun</th>
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider">Độ ưu tiên</th>
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider">Kịch bản test</th>
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider">Kết quả mong đợi</th>
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider">Thời gian chạy</th>
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {paginatedExecs.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-900/20 transition-all">
                          <td className="p-4 font-bold text-white font-mono">{row.tcId}</td>
                          <td className="p-4 font-semibold text-gray-300">{row.module}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                              row.priority === "HIGH" ? "bg-orange-500/10 text-orange-400 border border-orange-500/15" :
                              row.priority === "MEDIUM" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/15" :
                              "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                            }`}>
                              {row.priority === "HIGH" ? "CAO" : row.priority === "MEDIUM" ? "TRUNG BÌNH" : "THẤP"}
                            </span>
                          </td>
                          <td className="p-4 text-gray-400 max-w-xs truncate">{row.scenario}</td>
                          <td className="p-4 text-gray-400 max-w-xs truncate">{row.expected}</td>
                          <td className="p-4 font-mono text-gray-500">{row.time}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                              row.status.toUpperCase() === "PASS"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}>
                              {row.status.toUpperCase() === "PASS" ? "ĐẠT (PASS)" : "LỖI (FAIL)"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 bg-slate-900/40 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Hiển thị {Math.min(filteredExecs.length, (execPage-1)*itemsPerPage+1)} đến {Math.min(filteredExecs.length, execPage*itemsPerPage)} trong số {filteredExecs.length} bản ghi</span>
                  
                  <div className="flex gap-2">
                    <button
                      disabled={execPage === 1}
                      onClick={() => setExecPage(p => p - 1)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="px-3 py-1 bg-slate-800/80 rounded-lg font-bold flex items-center">{execPage} / {totalPages}</span>
                    <button
                      disabled={execPage === totalPages}
                      onClick={() => setExecPage(p => p + 1)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: DEFECT CENTER */}
          {activeTab === "defects" && (
            <div className="space-y-6">
              
              {/* Defect overview widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Defect count ring */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 self-start border-l-4 border-red-500 pl-3">Phân bố lỗi hệ thống</h3>
                  <div className="w-32 h-32 rounded-full border-[6px] border-red-500 flex flex-col items-center justify-center shadow-lg shadow-red-500/10">
                    <span className="text-4xl font-extrabold text-red-500">{defSum.total}</span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Lỗi</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-3 py-1 rounded-full">Đã Giải Quyết & Xác Minh ✓</span>
                </div>

                {/* Severities allocation */}
                <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-red-500 pl-3">Mức độ nghiêm trọng của lỗi</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Nghiêm trọng (Critical)", count: defSum.critical, color: "text-red-500", bar: "bg-red-500" },
                      { name: "Cao (High)", count: defSum.high, color: "text-orange-500", bar: "bg-orange-500" },
                      { name: "Trung bình (Medium)", count: defSum.medium, color: "text-yellow-500", bar: "bg-yellow-500" },
                      { name: "Thấp (Low)", count: defSum.low, color: "text-blue-500", bar: "bg-blue-500" }
                    ].map((sev, idx) => (
                      <div key={idx} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-gray-400">{sev.name}</span>
                          <span className={`font-extrabold font-mono text-base ${sev.color}`}>{sev.count}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${sev.bar}`} style={{ width: `${defSum.total > 0 ? (sev.count / defSum.total) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bug List Table */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-red-500 pl-3">Nhật ký lỗi hệ thống</h3>
                
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/80 border-b border-slate-800">
                        <th className="p-4 font-semibold text-gray-500">Mã Lỗi (Bug ID)</th>
                        <th className="p-4 font-semibold text-gray-500">Mô-đun</th>
                        <th className="p-4 font-semibold text-gray-500">Tiêu đề lỗi</th>
                        <th className="p-4 font-semibold text-gray-500">Mức độ</th>
                        <th className="p-4 font-semibold text-gray-500">Trạng thái</th>
                        <th className="p-4 font-semibold text-gray-500 text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {defs.map((bug, i) => (
                        <tr key={i} className="hover:bg-slate-900/20">
                          <td className="p-4 font-bold text-white font-mono">{bug.id}</td>
                          <td className="p-4 text-gray-300 font-medium">{bug.module}</td>
                          <td className="p-4 text-gray-400 max-w-sm truncate">{bug.title}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                              bug.severity === "High" ? "bg-orange-500/10 text-orange-400 border border-orange-500/15" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/15"
                            }`}>
                              {bug.severity === "High" ? "Cao" : "Trung bình"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">
                              {bug.status === "Resolved" ? "ĐÃ SỬA" : "ĐÃ XÁC MINH"}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedDefect(bug)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-lg border border-slate-700/60 inline-flex items-center gap-1.5 transition-all text-[11px]"
                            >
                              <Eye size={12} /> Xem Chi Tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: TRACEABILITY MATRIX */}
          {activeTab === "traceability" && (
            <div className="space-y-6">
              
              <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl w-80">
                  <Search size={16} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo TC_ID hoặc Chức năng..."
                    value={rtmSearch}
                    onChange={(e) => setRtmSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs w-full placeholder-gray-600"
                  />
                </div>
                <span className="text-xs text-gray-500">Số dòng khớp: <strong>{filteredRtm.length}</strong></span>
              </div>

              <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/60 border-b border-slate-800">
                        <th className="p-4 font-semibold text-gray-500">Chức năng</th>
                        <th className="p-4 font-semibold text-gray-500">Kịch bản sử dụng (Use Case)</th>
                        <th className="p-4 font-semibold text-gray-500">Mã Ca Kiểm Thử (TC_ID)</th>
                        <th className="p-4 font-semibold text-gray-500">Tệp Unit Test</th>
                        <th className="p-4 font-semibold text-gray-500">Tệp API Test</th>
                        <th className="p-4 font-semibold text-gray-500">Tệp UI Test</th>
                        <th className="p-4 font-semibold text-gray-500 text-center">Trạng thái</th>
                        <th className="p-4 font-semibold text-gray-500">Lỗi liên quan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {filteredRtm.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-900/10">
                          <td className="p-4 font-bold text-gray-200">{row.feature}</td>
                          <td className="p-4 text-gray-400 max-w-xs truncate">{row.useCase}</td>
                          <td className="p-4 font-mono font-bold text-white">{row.tcId}</td>
                          <td className="p-4 font-mono text-cyan-400">{row.unitTest || "-"}</td>
                          <td className="p-4 font-mono text-cyan-400">{row.apiTest || "-"}</td>
                          <td className="p-4 font-mono text-cyan-400">{row.uiTest || "-"}</td>
                          <td className="p-4 text-center">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full uppercase">
                              {row.result}
                            </span>
                          </td>
                          <td className="p-4">
                            {row.defect !== "None" ? (
                              <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/15 px-2 py-0.5 rounded-full">
                                {row.defect}
                              </span>
                            ) : (
                              <span className="text-gray-600">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Pass Rate Trend */}
                <div className="glass-panel rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Lịch sử tỷ lệ đạt kiểm thử (Pass Rate)</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={hist}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="build" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} domain={[80, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }} />
                        <Legend />
                        <Line type="monotone" dataKey="passRate" name="Tỷ lệ đạt (%)" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Coverage Trend */}
                <div className="glass-panel rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Lịch sử xu hướng độ bao phủ (Coverage)</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hist}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="build" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} domain={[80, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }} />
                        <Legend />
                        <Area type="monotone" dataKey="coverage" name="Độ bao phủ (%)" stroke="#06b6d4" fill="rgba(6, 182, 212, 0.1)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Execution Time Trend */}
                <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Xu hướng thời gian thực thi (Giây)</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={hist}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="build" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }} />
                        <Legend />
                        <Line type="monotone" dataKey="executionTime" name="Time (seconds)" stroke="#eab308" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 7: HISTORY LOG & COMPARE */}
          {activeTab === "history" && (
            <div className="space-y-6">
              
              {/* Compare Config Box */}
              <div className="glass-panel rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 font-bold uppercase">So sánh bản chạy A:</span>
                  <select
                    value={compareA || ""}
                    onChange={(e) => setCompareA(Number(e.target.value) || null)}
                    className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-white font-bold"
                  >
                    <option value="">Chọn bản Build</option>
                    {hist.map(h => <option key={h.runId} value={h.runId}>{h.build} ({h.date})</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 font-bold uppercase">So sánh bản chạy B:</span>
                  <select
                    value={compareB || ""}
                    onChange={(e) => setCompareB(Number(e.target.value) || null)}
                    className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-white font-bold"
                  >
                    <option value="">Chọn bản Build</option>
                    {hist.map(h => <option key={h.runId} value={h.runId}>{h.build} ({h.date})</option>)}
                  </select>
                </div>

                <div className="text-right text-xs font-bold text-emerald-400">
                  {runA && runB ? "✓ Đã tải dữ liệu so sánh song song" : "ℹ️ Chọn hai bản build để tải chênh lệch chỉ số"}
                </div>
              </div>

              {/* Compare Results display */}
              {runA && runB && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Run A card */}
                  <div className="glass-panel rounded-2xl p-6 space-y-4 border-l-4 border-cyan-500">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-lg text-white">Bản Build {runA.build}</h4>
                      <span className="text-xs text-gray-500 font-mono">{runA.date}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Tỷ lệ đạt</p><p className="text-lg font-bold text-emerald-400">{runA.passRate}%</p></div>
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Độ bao phủ</p><p className="text-lg font-bold text-cyan-400">{runA.coverage}%</p></div>
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Thời gian</p><p className="text-lg font-bold text-yellow-400">{runA.executionTime}s</p></div>
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Ca thành công</p><p className="text-lg font-bold text-white">{runA.passedCount}</p></div>
                    </div>
                  </div>

                  {/* Run B card */}
                  <div className="glass-panel rounded-2xl p-6 space-y-4 border-l-4 border-fuchsia-500">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-lg text-white">Bản Build {runB.build}</h4>
                      <span className="text-xs text-gray-500 font-mono">{runB.date}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Tỷ lệ đạt</p><p className="text-lg font-bold text-emerald-400">{runB.passRate}%</p></div>
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Độ bao phủ</p><p className="text-lg font-bold text-cyan-400">{runB.coverage}%</p></div>
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Thời gian</p><p className="text-lg font-bold text-yellow-400">{runB.executionTime}s</p></div>
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Ca thành công</p><p className="text-lg font-bold text-white">{runB.passedCount}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* History list card */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Bản ghi Lịch sử Chạy Kiểm thử</h3>
                
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/80 border-b border-slate-800">
                        <th className="p-4 font-semibold text-gray-500">Mã số Build</th>
                        <th className="p-4 font-semibold text-gray-500">Thời gian chạy</th>
                        <th className="p-4 font-semibold text-gray-500">Thành công</th>
                        <th className="p-4 font-semibold text-gray-500">Thất bại</th>
                        <th className="p-4 font-semibold text-gray-500">Tỷ lệ đạt</th>
                        <th className="p-4 font-semibold text-gray-500">Độ bao phủ</th>
                        <th className="p-4 font-semibold text-gray-500">Thời gian</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {hist.map((run, i) => (
                        <tr key={i} className="hover:bg-slate-900/10">
                          <td className="p-4 font-bold text-white font-mono">{run.build}</td>
                          <td className="p-4 text-gray-400">{run.date}</td>
                          <td className="p-4 text-emerald-400 font-bold">{run.passedCount}</td>
                          <td className="p-4 text-red-400 font-bold">{run.failedCount}</td>
                          <td className="p-4 font-bold">{run.passRate}%</td>
                          <td className="p-4 text-cyan-400 font-bold">{run.coverage}%</td>
                          <td className="p-4 font-mono text-gray-500">{run.executionTime}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: REPORT CENTER */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Báo cáo & Workbook Downloads</h3>
                <p className="text-xs text-gray-400">Tải xuống các tệp tin cấu hình và tài liệu kiểm thử chi tiết phục vụ báo cáo đồ án và kiểm thử.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "FEATURE_MATRIX.md", desc: "Bảng ma trận ánh xạ module và API", link: "FEATURE_MATRIX.md" },
                    { name: "TEST_DATA_REPORT.md", desc: "Bảng tổng hợp dữ liệu đầu vào và kỳ vọng", link: "TEST_DATA_REPORT.md" },
                    { name: "TEST_EXECUTION_REPORT.md", desc: "Chi tiết các ca kiểm thử chạy thực tế", link: "TEST_EXECUTION_REPORT.md" },
                    { name: "DEFECT_REPORT.md", desc: "Nhật ký lưu trữ và sửa lỗi hệ thống", link: "DEFECT_REPORT.md" },
                    { name: "TRACEABILITY_MATRIX.md", desc: "Bảng ma trận ánh xạ 2 chiều yêu cầu", link: "TRACEABILITY_MATRIX.md" },
                    { name: "TEST_SUMMARY_REPORT.md", desc: "Báo cáo tổng kết độ bao phủ coverage", link: "TEST_SUMMARY_REPORT.md" },
                    { name: "UNIT_TEST_REPORT.md", desc: "Báo cáo kết quả kiểm thử đơn vị Unit Test", link: "UNIT_TEST_REPORT.md" },
                    { name: "AUTOMATION_TEST_REPORT.md", desc: "Báo cáo kết quả kiểm thử tự động Automation Test", link: "AUTOMATION_TEST_REPORT.md" },
                    { name: "PCS.postman_collection.json", desc: "Bộ Postman API collection cho backend", link: "PCS.postman_collection.json" },
                    { name: "PCS.postman_environment.json", desc: "Tệp tin cấu hình môi trường Postman", link: "PCS.postman_environment.json" }
                  ].map((rep, idx) => (
                    <div key={idx} className="bg-slate-900/50 p-5 rounded-xl border border-slate-800/80 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm text-gray-200">{rep.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-1">{rep.desc}</p>
                      </div>
                      <a
                        href={rep.link}
                        download
                        className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold rounded-lg border border-slate-700/60 inline-flex items-center gap-1.5 text-xs transition-all"
                      >
                        <Download size={13} /> Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              
              <div className="glass-panel rounded-2xl p-6 space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Cấu hình Dashboard & Dữ liệu đặc tả</h3>
                
                <div className="divide-y divide-slate-800 text-xs">
                  <div className="py-4 flex justify-between"><span className="text-gray-500 font-bold uppercase">Tên Dự Án QA</span><span className="font-semibold text-white">{meta.project}</span></div>
                  <div className="py-4 flex justify-between"><span className="text-gray-500 font-bold uppercase">Nhánh Git Đích</span><span className="font-semibold text-blue-400 flex items-center gap-1.5"><GitBranch size={13} />{meta.branch}</span></div>
                  <div className="py-4 flex justify-between"><span className="text-gray-500 font-bold uppercase">Commit Git Cuối</span><span className="font-mono text-gray-300 max-w-md truncate">{meta.commit}</span></div>
                  <div className="py-4 flex justify-between"><span className="text-gray-500 font-bold uppercase">Môi trường thực thi Pipeline</span><span className="font-semibold text-emerald-400 flex items-center gap-1.5"><Server size={13} />Tiến trình máy cục bộ (Local Host)</span></div>
                  <div className="py-4 flex justify-between"><span className="text-gray-500 font-bold uppercase">Cơ sở dữ liệu nguồn</span><span className="font-semibold text-white">SQL Server (PCS_System_7 sa)</span></div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* DEFECT MODAL DETAIL VIEW */}
      {selectedDefect && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700 shadow-2xl shadow-black/80 overflow-hidden">
            <div className="bg-slate-900 p-5 border-b border-slate-800 flex justify-between items-center">
              <div>
                <span className="bg-red-500/10 text-red-400 border border-red-500/25 px-2 py-0.5 rounded font-mono font-bold text-[9px] uppercase tracking-wider">{selectedDefect.id}</span>
                <h3 className="font-bold text-white text-base mt-1">{selectedDefect.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDefect(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-gray-500 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase">Các bước tái hiện lỗi (Steps to Reproduce)</span>
                <p className="text-gray-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 mt-1">{selectedDefect.steps}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Kết quả mong đợi</span>
                  <p className="text-emerald-400 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 mt-1">{selectedDefect.expected}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Kết quả thực tế</span>
                  <p className="text-red-400 bg-red-500/5 p-3 rounded-lg border border-red-500/10 mt-1">{selectedDefect.actual}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase">Đề xuất phương án sửa lỗi</span>
                <p className="text-blue-400 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10 font-mono mt-1">{selectedDefect.suggestedFix}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-gray-500">
                <span>Mô-đun: <strong className="text-gray-300">{selectedDefect.module}</strong></span>
                <span>Ca kiểm thử liên quan: <strong className="text-gray-300 font-mono">{selectedDefect.relatedTcId}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
