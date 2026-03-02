import { useState, useMemo, ReactNode } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  BookOpen, 
  Users, 
  Clock, 
  MapPin, 
  ChevronDown,
  Info,
  CalendarDays,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SCHEDULE_DATA, ScheduleEntry } from './constants';

export default function App() {
  // Filter states
  const [searchDate, setSearchDate] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Derived data
  const subjects = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(SCHEDULE_DATA.map(item => item.subject)));
    return ['All', ...uniqueSubjects.sort()];
  }, []);

  const months = [
    'All', 'March', 'April', 'May', 'June'
  ];

  const monthMap: Record<string, number> = {
    'March': 2, // JS months are 0-indexed
    'April': 3,
    'May': 4,
    'June': 5
  };

  // Filtering logic
  const filteredData = useMemo(() => {
    return SCHEDULE_DATA.filter(item => {
      const itemDate = new Date(item.date);
      
      // Date search
      if (searchDate && item.date !== searchDate) return false;

      // Date range
      if (fromDate && item.date < fromDate) return false;
      if (toDate && item.date > toDate) return false;

      // Month filter
      if (selectedMonth !== 'All') {
        if (itemDate.getMonth() !== monthMap[selectedMonth]) return false;
      }

      // Subject filter
      if (selectedSubject !== 'All' && item.subject !== selectedSubject) return false;

      // Type filter
      if (selectedType !== 'All' && item.type !== selectedType) return false;

      return true;
    });
  }, [searchDate, fromDate, toDate, selectedMonth, selectedSubject, selectedType]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredData.length;
    const lectures = filteredData.filter(item => item.type === 'Lecture').length;
    const seminars = filteredData.filter(item => item.type === 'Seminar').length;
    return { total, lectures, seminars };
  }, [filteredData]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-200 shadow-lg">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  169 Group Schedule
                </h1>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  North Western State Medical University
                </p>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <StatCard label="Total" value={stats.total} color="bg-indigo-100 text-indigo-700" icon={<BookOpen className="w-3.5 h-3.5" />} />
              <StatCard label="Lectures" value={stats.lectures} color="bg-emerald-100 text-emerald-700" icon={<Users className="w-3.5 h-3.5" />} />
              <StatCard label="Seminars" value={stats.seminars} color="bg-amber-100 text-amber-700" icon={<Clock className="w-3.5 h-3.5" />} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-6 text-slate-800">
            <Filter className="w-5 h-5" />
            <h2 className="font-semibold">Filter Schedule</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Specific Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Specific Date
              </label>
              <input 
                type="date" 
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            {/* Month */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> Month
              </label>
              <div className="relative">
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                >
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Subject
              </label>
              <div className="relative">
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                >
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Class Type
              </label>
              <div className="relative">
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value="Lecture">Lecture</option>
                  <option value="Seminar">Seminar</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Date Range */}
            <div className="sm:col-span-2 lg:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Custom Date Range
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                <input 
                  type="date" 
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Reset Button */}
            <div className="lg:col-span-2 flex items-end">
              <button 
                onClick={() => {
                  setSearchDate('');
                  setFromDate('');
                  setToDate('');
                  setSelectedMonth('All');
                  setSelectedSubject('All');
                  setSelectedType('All');
                }}
                className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors flex items-center gap-2"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </section>

        {/* Schedule Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Day</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">End Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={item.id} 
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{formatDate(item.date)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-600">{item.day}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>{item.startTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span>{item.endTime}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-800 line-clamp-1 group-hover:line-clamp-none transition-all">
                            {item.subject}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            item.type === 'Lecture' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{item.location}</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-slate-400">
                          <Search className="w-12 h-12 opacity-20" />
                          <p className="text-lg font-medium">No classes found for the selected filters</p>
                          <button 
                            onClick={() => {
                              setSearchDate('');
                              setFromDate('');
                              setToDate('');
                              setSelectedMonth('All');
                              setSelectedSubject('All');
                              setSelectedType('All');
                            }}
                            className="text-indigo-600 font-semibold hover:underline"
                          >
                            Clear all filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <footer className="mt-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-600 text-sm font-medium border border-slate-200">
            <Info className="w-4 h-4 text-slate-400" />
            <span>It might be wrong, Confirm by Checking Actual Schedule ~ Thanks</span>
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
            &copy; 2026 169 Group Schedule Portal
          </p>
        </footer>
      </main>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string, value: number, color: string, icon: ReactNode }) {
  return (
    <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg ${color} transition-transform hover:scale-105`}>
      <div className="opacity-80">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase leading-none opacity-70">{label}</span>
        <span className="text-sm font-bold leading-tight">{value}</span>
      </div>
    </div>
  );
}
