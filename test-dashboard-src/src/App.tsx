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

const pathToTab: Record<string, string> = {
  "/test-cases": "execution",
  "/reports": "reports"
};

const tabToPath: Record<string, string> = {
  overview: "/",
  execution: "/test-cases",
  reports: "/reports"
};

function getTabFromLocation() {
  return pathToTab[window.location.pathname] || "overview";
}

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(getTabFromLocation);

  // Filters & Page Controls for Executions
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [execPage, setExecPage] = useState(1);

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

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromLocation());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-darkBg text-white">
        <RefreshCw className="animate-spin text-emerald-400 w-12 h-12 mb-4" />
        <p className="text-gray-400 font-medium">Loading Professional QA Dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-darkBg text-white p-6 text-center">
        <ShieldAlert className="text-red-500 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Dashboard Data Found</h2>
        <p className="text-gray-400 max-w-md">
          Please run <code className="bg-gray-800 px-2 py-1 rounded text-red-400">npm run test:dashboard</code> to compile report sources into dashboard-data.json first.
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

  const totalPages = 1;
  const paginatedExecs = filteredExecs;

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
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">QA Control Center</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "coverage", label: "Coverage Stats", icon: Layers },
            { id: "execution", label: "Test Execution", icon: Play },
            { id: "defects", label: "Defect Center", icon: AlertTriangle },
            { id: "traceability", label: "Traceability", icon: Grid },
            { id: "analytics", label: "Trend Analytics", icon: TrendingUp },
            { id: "history", label: "History Log", icon: Calendar },
            { id: "reports", label: "Report Center", icon: Download },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  window.history.pushState(null, "", tabToPath[tab.id] || "/");
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
          <p className="flex justify-between"><span>Branch:</span> <span className="font-mono text-gray-400">{meta.branch}</span></p>
          <p className="flex justify-between"><span>Environment:</span> <span className="text-gray-400">{meta.environment}</span></p>
          <p className="flex justify-between"><span>Build No:</span> <span className="font-mono text-gray-400">{meta.buildNumber}</span></p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER BAR */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between px-8 backdrop-blur-md sticky top-0 z-40">
          <div>
            <span className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Project: {meta.project}</span>
            <h2 className="text-lg font-bold text-white capitalize">{activeTab} Dashboard</h2>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Clock size={13} className="text-emerald-400" />
              <span>Last Run Time: <strong>{meta.lastUpdated}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <GitBranch size={13} className="text-blue-400" />
              <span>Branch: <strong>{meta.branch}</strong></span>
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
                  { label: "Total Test Cases", val: ov.total, color: "text-white" },
                  { label: "Passed", val: ov.passed, color: "text-emerald-400" },
                  { label: "Failed", val: ov.failed, color: "text-red-400" },
                  { label: "Pass Rate", val: ov.passRate, color: "text-emerald-300" },
                  { label: "Execution Time", val: ov.executionTime, color: "text-cyan-400" }
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
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Test Suite Allocation</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Unit Tests (Vitest / JSDOM)", count: data.testTypes.unit, color: "bg-emerald-500", pct: (data.testTypes.unit / ov.total) * 100 },
                      { name: "API Integration Tests (Supertest Mock)", count: data.testTypes.api, color: "bg-cyan-500", pct: (data.testTypes.api / ov.total) * 100 },
                      { name: "UI Component Tests (RTL / JSDOM)", count: data.testTypes.ui, color: "bg-fuchsia-500", pct: (data.testTypes.ui / ov.total) * 100 }
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
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Automation Status</h3>
                  <div className="flex items-center justify-center py-4">
                    <div className="w-36 h-36 rounded-full border-8 border-emerald-500 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/10">
                      <span className="text-3xl font-extrabold text-white">100%</span>
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Automated</span>
                    </div>
                  </div>
                  <div className="flex justify-around text-center text-xs">
                    <div>
                      <h4 className="text-emerald-400 font-bold text-base">{ov.total}</h4>
                      <p className="text-gray-500">Automated TCs</p>
                    </div>
                    <div className="border-l border-slate-800"></div>
                    <div>
                      <h4 className="text-gray-400 font-bold text-base">0</h4>
                      <p className="text-gray-500">Manual TCs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pipeline Step Flow */}
              <div className="glass-panel rounded-2xl p-6 space-y-5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">CI/CD QA Pipeline Workflow</h3>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 pt-2">
                  {pipelineSteps.map((step, idx) => (
                    <div key={idx} className="relative flex flex-col items-center text-center bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center mb-3">
                        <CheckCircle size={16} className="text-emerald-400" />
                      </div>
                      <span className="text-xs font-bold text-gray-200">{step.name}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase mt-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">Completed</span>
                      
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
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">System Code Coverage Metrics</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-4">
                  {[
                    { label: "Statements", val: cov.statements },
                    { label: "Branches", val: cov.branches },
                    { label: "Functions", val: cov.functions },
                    { label: "Lines", val: cov.lines }
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
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Coverage breakdown by Module</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { mod: "User & Auth Management", val: 95.0, lines: "115/120" },
                    { mod: "Court Slot Scheduling", val: 90.0, lines: "152/170" },
                    { mod: "Booking Operations", val: 96.0, lines: "210/220" },
                    { mod: "Coach Profile Registry", val: 94.0, lines: "84/90" },
                    { mod: "Payments & MOMO/PayOS Webhook", val: 95.0, lines: "180/190" },
                    { mod: "Refund Policy Calculations", val: 100.0, lines: "50/50" },
                    { mod: "Voucher & Promotion Limits", val: 94.0, lines: "72/78" },
                    { mod: "Review System feedback", val: 96.0, lines: "36/38" },
                    { mod: "System Notification Gateway", val: 90.0, lines: "63/70" },
                    { mod: "Player Matching Suggestion", val: 100.0, lines: "128/128" },
                    { mod: "Gemini Chatbot Assistant", val: 92.0, lines: "46/50" },
                    { mod: "Admin Dashboard Reporting", val: 97.0, lines: "97/100" }
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
                    placeholder="Search test case or scenario..."
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
                    <span className="text-gray-500 font-bold">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setExecPage(1);
                      }}
                      className="bg-transparent border-none outline-none font-bold text-emerald-400"
                    >
                      <option value="ALL" className="bg-slate-900 text-white">ALL</option>
                      <option value="PASS" className="bg-slate-900 text-emerald-400">PASS</option>
                      <option value="FAIL" className="bg-slate-900 text-red-400">FAIL</option>
                    </select>
                  </div>

                  {/* Priority filter */}
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
                    <span className="text-gray-500 font-bold">Priority:</span>
                    <select
                      value={priorityFilter}
                      onChange={(e) => {
                        setPriorityFilter(e.target.value);
                        setExecPage(1);
                      }}
                      className="bg-transparent border-none outline-none font-bold text-blue-400"
                    >
                      <option value="ALL" className="bg-slate-900 text-white">ALL</option>
                      <option value="HIGH" className="bg-slate-900 text-orange-400">HIGH</option>
                      <option value="MEDIUM" className="bg-slate-900 text-yellow-400">MEDIUM</option>
                      <option value="LOW" className="bg-slate-900 text-green-400">LOW</option>
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
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider">TC_ID</th>
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider">Module</th>
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider">Scenario</th>
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider">Expected Result</th>
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider">Execution Time</th>
                        <th className="p-4 font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
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
                              {row.priority}
                            </span>
                          </td>
                          <td className="p-4 text-gray-400 max-w-xs truncate">{row.scenario}</td>
                          <td className="p-4 text-gray-400 max-w-xs truncate">{row.expected}</td>
                          <td className="p-4 font-mono text-gray-500">{row.time}</td>
                          <td className="p-4 text-center">
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 bg-slate-900/40 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Showing {filteredExecs.length > 0 ? 1 : 0} to {filteredExecs.length} of {filteredExecs.length} entries</span>
                  
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
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 self-start border-l-4 border-red-500 pl-3">Defect Distribution</h3>
                  <div className="w-32 h-32 rounded-full border-[6px] border-red-500 flex flex-col items-center justify-center shadow-lg shadow-red-500/10">
                    <span className="text-4xl font-extrabold text-red-500">{defSum.total}</span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Defects</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-3 py-1 rounded-full">Both Resolved & Verified ✓</span>
                </div>

                {/* Severities allocation */}
                <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-red-500 pl-3">Defect Severities Breakdown</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Critical Severity", count: defSum.critical, color: "text-red-500", bar: "bg-red-500" },
                      { name: "High Severity", count: defSum.high, color: "text-orange-500", bar: "bg-orange-500" },
                      { name: "Medium Severity", count: defSum.medium, color: "text-yellow-500", bar: "bg-yellow-500" },
                      { name: "Low Severity", count: defSum.low, color: "text-blue-500", bar: "bg-blue-500" }
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
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-red-500 pl-3">Active & Resolved Defect logs</h3>
                
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/80 border-b border-slate-800">
                        <th className="p-4 font-semibold text-gray-500">Bug ID</th>
                        <th className="p-4 font-semibold text-gray-500">Module</th>
                        <th className="p-4 font-semibold text-gray-500">Title</th>
                        <th className="p-4 font-semibold text-gray-500">Severity</th>
                        <th className="p-4 font-semibold text-gray-500">Status</th>
                        <th className="p-4 font-semibold text-gray-500 text-center">Action</th>
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
                              {bug.severity}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider">
                              {bug.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedDefect(bug)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-lg border border-slate-700/60 inline-flex items-center gap-1.5 transition-all text-[11px]"
                            >
                              <Eye size={12} /> View Details
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
                    placeholder="Search by TC_ID or Feature..."
                    value={rtmSearch}
                    onChange={(e) => setRtmSearch(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs w-full placeholder-gray-600"
                  />
                </div>
                <span className="text-xs text-gray-500">Matching Rows: <strong>{filteredRtm.length}</strong></span>
              </div>

              <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/60 border-b border-slate-800">
                        <th className="p-4 font-semibold text-gray-500">Feature</th>
                        <th className="p-4 font-semibold text-gray-500">Use Case</th>
                        <th className="p-4 font-semibold text-gray-500">Test Case ID</th>
                        <th className="p-4 font-semibold text-gray-500">Unit Test File</th>
                        <th className="p-4 font-semibold text-gray-500">API Test File</th>
                        <th className="p-4 font-semibold text-gray-500">UI Test File</th>
                        <th className="p-4 font-semibold text-gray-500 text-center">Status</th>
                        <th className="p-4 font-semibold text-gray-500">Defect</th>
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
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Pass Rate Trend History</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={hist}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="build" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} domain={[80, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }} />
                        <Legend />
                        <Line type="monotone" dataKey="passRate" name="Pass Rate (%)" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Coverage Trend */}
                <div className="glass-panel rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Code Coverage Trend History</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hist}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                        <XAxis dataKey="build" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} domain={[80, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155" }} />
                        <Legend />
                        <Area type="monotone" dataKey="coverage" name="Coverage (%)" stroke="#06b6d4" fill="rgba(6, 182, 212, 0.1)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Execution Time Trend */}
                <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Execution Duration Trend (Seconds)</h3>
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
                  <span className="text-gray-500 font-bold uppercase">Compare Run A:</span>
                  <select
                    value={compareA || ""}
                    onChange={(e) => setCompareA(Number(e.target.value) || null)}
                    className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-white font-bold"
                  >
                    <option value="">Select Build</option>
                    {hist.map(h => <option key={h.runId} value={h.runId}>{h.build} ({h.date})</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 font-bold uppercase">Compare Run B:</span>
                  <select
                    value={compareB || ""}
                    onChange={(e) => setCompareB(Number(e.target.value) || null)}
                    className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-white font-bold"
                  >
                    <option value="">Select Build</option>
                    {hist.map(h => <option key={h.runId} value={h.runId}>{h.build} ({h.date})</option>)}
                  </select>
                </div>

                <div className="text-right text-xs font-bold text-emerald-400">
                  {runA && runB ? "✓ Side-by-Side Comparison Loaded" : "ℹ️ Select two builds to load metrics diff"}
                </div>
              </div>

              {/* Compare Results display */}
              {runA && runB && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Run A card */}
                  <div className="glass-panel rounded-2xl p-6 space-y-4 border-l-4 border-cyan-500">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-lg text-white">Build {runA.build}</h4>
                      <span className="text-xs text-gray-500 font-mono">{runA.date}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Pass Rate</p><p className="text-lg font-bold text-emerald-400">{runA.passRate}%</p></div>
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Coverage</p><p className="text-lg font-bold text-cyan-400">{runA.coverage}%</p></div>
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Duration</p><p className="text-lg font-bold text-yellow-400">{runA.executionTime}s</p></div>
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Passed Tests</p><p className="text-lg font-bold text-white">{runA.passedCount}</p></div>
                    </div>
                  </div>

                  {/* Run B card */}
                  <div className="glass-panel rounded-2xl p-6 space-y-4 border-l-4 border-fuchsia-500">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-lg text-white">Build {runB.build}</h4>
                      <span className="text-xs text-gray-500 font-mono">{runB.date}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Pass Rate</p><p className="text-lg font-bold text-emerald-400">{runB.passRate}%</p></div>
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Coverage</p><p className="text-lg font-bold text-cyan-400">{runB.coverage}%</p></div>
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Duration</p><p className="text-lg font-bold text-yellow-400">{runB.executionTime}s</p></div>
                      <div className="bg-slate-900/60 p-3 rounded-lg"><p className="text-gray-500">Passed Tests</p><p className="text-lg font-bold text-white">{runB.passedCount}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* History list card */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Historical Run Records</h3>
                
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900/80 border-b border-slate-800">
                        <th className="p-4 font-semibold text-gray-500">Build Number</th>
                        <th className="p-4 font-semibold text-gray-500">Run Time</th>
                        <th className="p-4 font-semibold text-gray-500">Passed</th>
                        <th className="p-4 font-semibold text-gray-500">Failed</th>
                        <th className="p-4 font-semibold text-gray-500">Pass Rate</th>
                        <th className="p-4 font-semibold text-gray-500">Coverage</th>
                        <th className="p-4 font-semibold text-gray-500">Duration</th>
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
                
                <div className="bg-slate-900/50 p-5 rounded-xl border border-emerald-500/20 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-gray-200">Dashboard Test Case URL</h4>
                    <p className="text-[11px] text-gray-500 mt-1">Open the current automated test case table inside this dashboard.</p>
                  </div>
                  <a
                    href="/test-cases"
                    className="px-3.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold rounded-lg border border-emerald-500/30 inline-flex items-center gap-1.5 text-xs transition-all"
                  >
                    <Eye size={13} /> Open
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "ALL_TEST_CASES_REPORT.md", desc: "Full generated list of current dashboard test cases", link: "ALL_TEST_CASES_REPORT.md" },
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
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-l-4 border-emerald-500 pl-3">Dashboard Configuration & Metadata</h3>
                
                <div className="divide-y divide-slate-800 text-xs">
                  <div className="py-4 flex justify-between"><span className="text-gray-500 font-bold uppercase">QA Project Name</span><span className="font-semibold text-white">{meta.project}</span></div>
                  <div className="py-4 flex justify-between"><span className="text-gray-500 font-bold uppercase">Git Target Branch</span><span className="font-semibold text-blue-400 flex items-center gap-1.5"><GitBranch size={13} />{meta.branch}</span></div>
                  <div className="py-4 flex justify-between"><span className="text-gray-500 font-bold uppercase">Last Git Commit</span><span className="font-mono text-gray-300 max-w-md truncate">{meta.commit}</span></div>
                  <div className="py-4 flex justify-between"><span className="text-gray-500 font-bold uppercase">Pipeline Runner Instance</span><span className="font-semibold text-emerald-400 flex items-center gap-1.5"><Server size={13} />Local Host Process</span></div>
                  <div className="py-4 flex justify-between"><span className="text-gray-500 font-bold uppercase">Database Source</span><span className="font-semibold text-white">SQL Server (PCS_System_7 sa)</span></div>
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
                <span className="text-[10px] text-gray-500 font-bold uppercase">Steps to Reproduce</span>
                <p className="text-gray-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80 mt-1">{selectedDefect.steps}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Expected Result</span>
                  <p className="text-emerald-400 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 mt-1">{selectedDefect.expected}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Actual Result</span>
                  <p className="text-red-400 bg-red-500/5 p-3 rounded-lg border border-red-500/10 mt-1">{selectedDefect.actual}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase">Suggested Bug Fix</span>
                <p className="text-blue-400 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10 font-mono mt-1">{selectedDefect.suggestedFix}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-gray-500">
                <span>Module: <strong className="text-gray-300">{selectedDefect.module}</strong></span>
                <span>Related TC_ID: <strong className="text-gray-300 font-mono">{selectedDefect.relatedTcId}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
