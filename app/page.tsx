'use client';

import React, { useState, useEffect } from 'react';

type Role = 'public' | 'executor' | 'admin';
type TabId = 'overview' | 'consortium' | 'wp' | 'publications' | 'reports';

export default function CoDaSPortal() {
  const [role, setRole] = useState<Role>('public');
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [kpiProgress, setKpiProgress] = useState(84);
  const [searchQuery, setSearchQuery] = useState('');
  const [newPubTitle, setNewPubTitle] = useState('');
  const [newPubDoi, setNewPubDoi] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const [workPackages, setWorkPackages] = useState([
    { code: 'WP1', title: 'Управління консорціумом та забезпечення якості', lead: 'Aalto University', progress: 95, status: 'Активний' },
    { code: 'WP2', title: 'Гармонізація навчальних планів та акредитація', lead: 'TU Braunschweig', progress: 100, status: 'Завершено' },
    { code: 'WP3', title: 'Академічна мобільність та літні школи CoDaS', lead: 'Grenoble INP', progress: 80, status: 'Активний' },
    { code: 'WP4', title: 'Спільні наукові дослідження (Open Science)', lead: 'UPC Barcelona', progress: 72, status: 'У роботі' },
    { code: 'WP5', title: 'Поширення результатів та індустріальні кейси', lead: 'All Partners', progress: 88, status: 'Активний' },
  ]);

  const [publications, setPublications] = useState([
    {
      title: 'Joint Communications and Data Science Curriculum Framework for European Master Programmes',
      authors: 'Aalto University, TU Braunschweig, Grenoble INP Consortium',
      venue: 'IEEE Global Engineering Education Conference (EDUCON)',
      year: '2025',
      tag: 'Curriculum',
      doi: '10.1109/EDUCON.2025.1048291',
    },
    {
      title: 'AI-Driven Network Telemetry and 6G Edge Analytics in Cross-Border Academic Testbeds',
      authors: 'J. Korhonen, M. Weber, L. Moreau, O. Kovalenko',
      venue: 'IEEE Communications Magazine',
      year: '2026',
      tag: '6G & Edge AI',
      doi: '10.1109/MCOM.2026.9841204',
    },
    {
      title: 'Double-Degree Mobility Models in ICT: Outcomes of the Erasmus+ CoDaS Initiative',
      authors: 'CoDaS Quality Assurance Board',
      venue: 'European Journal of Engineering Education',
      year: '2026',
      tag: 'Mobility',
      doi: '10.1080/03043797.2026.219405',
    },
  ]);

  useEffect(() => {
    const savedRole = localStorage.getItem('codas_role') as Role;
    if (savedRole) setRole(savedRole);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem('codas_role', newRole);
    const names = { public: 'Публічний гість', executor: 'Виконавець (WP Lead)', admin: 'Адміністратор' };
    showToast(`Активовано режим: ${names[newRole]}`);
  };

  const handleUpdateWpProgress = (index: number, delta: number) => {
    setWorkPackages((prev) =>
      prev.map((wp, i) => {
        if (i !== index) return wp;
        const nextVal = Math.min(100, Math.max(0, wp.progress + delta));
        return {
          ...wp,
          progress: nextVal,
          status: nextVal === 100 ? 'Завершено' : 'Активний',
        };
      })
    );
    showToast('Прогрес робочого пакета оновлено');
  };

  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPubTitle.trim() || !newPubDoi.trim()) return;
    setPublications([
      {
        title: newPubTitle,
        authors: 'CoDaS Research Group (Added via Portal)',
        venue: 'CoDaS Open Repository / Preprint',
        year: '2026',
        tag: 'New Release',
        doi: newPubDoi,
      },
      ...publications,
    ]);
    setNewPubTitle('');
    setNewPubDoi('');
    showToast('Публікацію додано до бази DOI');
  };

  const filteredPublications = publications.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.doi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-indigo-600/20 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-[460px] h-[460px] rounded-full bg-cyan-500/15 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[350px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 border border-indigo-500/40 text-sm text-white shadow-2xl shadow-indigo-950/50 backdrop-blur-xl animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Glass Navbar */}
      <header className="sticky top-0 z-40 bg-[#070B14]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full rounded-[11px] bg-[#0B1120] flex items-center justify-center font-black text-base tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300 group-hover:scale-105 transition">
                CD
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">CoDaS</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-400/25">
                  EU Horizon / EMJM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Academic Consortium Portal</p>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.04] p-1 rounded-2xl border border-white/10">
            {[
              { id: 'overview', label: 'Паспорт' },
              { id: 'consortium', label: 'Консорціум' },
              { id: 'wp', label: 'Робочі пакети' },
              { id: 'publications', label: 'Публікації' },
              { id: 'reports', label: 'Аналітика та KPI' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Role Switcher Pill */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => handleRoleChange('public')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                role === 'public'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Гість
            </button>
            <button
              onClick={() => handleRoleChange('executor')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                role === 'executor'
                  ? 'bg-amber-500/90 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Виконавець
            </button>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
                role === 'admin'
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Адмін
            </button>
          </div>
        </div>

        {/* Mobile Sub-nav */}
        <div className="flex lg:hidden overflow-x-auto gap-1.5 px-4 pb-3 no-scrollbar">
          {[
            { id: 'overview', label: 'Паспорт' },
            { id: 'consortium', label: 'Консорціум' },
            { id: 'wp', label: 'Робочі пакети' },
            { id: 'publications', label: 'Публікації' },
            { id: 'reports', label: 'Аналітика' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-slate-400 border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        {/* Modern Hero Banner */}
        <section className="relative rounded-3xl bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent border border-white/10 p-6 sm:p-10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/20 via-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/25 text-cyan-300 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>Co-funded by the European Union • Grant № 101082451</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] text-white">
                Communications Engineering &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300">
                  Data Science
                </span>
              </h1>

              <p className="text-slate-300/90 text-sm sm:text-base leading-relaxed max-w-2xl">
                Європейський міжуніверситетський R&amp;D портал: інтелектуальні мережі 5G/6G, хмарні обчислення,
                академічна мобільність подвійних дипломів та відкриті наукові репозиторії.
              </p>
            </div>

            {/* Live Access Badge Card */}
            <div className="shrink-0 rounded-2xl bg-[#0B1120]/90 border border-white/10 p-5 min-w-[260px] space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Статус системи</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Online
                </span>
              </div>
              <div className="h-[1px] bg-white/10" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400">Активна роль (RBAC)</div>
                <div className="mt-1 text-sm font-bold text-white flex items-center gap-2">
                  {role === 'public' && 'Публічний перегляд'}
                  {role === 'executor' && <span className="text-amber-400">Виконавець проєкту</span>}
                  {role === 'admin' && <span className="text-cyan-300">Адміністратор консорціуму</span>}
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                {role === 'public'
                  ? 'Перемкніть роль зверху, щоб редагувати WP та публікації.'
                  : 'Режим редагування активний — зміни застосовуються миттєво.'}
              </div>
            </div>
          </div>
        </section>

        {/* TAB 1: OVERVIEW (BENTO GRID) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: 'Акронім програми',
                  value: 'CoDaS EMJM',
                  sub: 'Erasmus Mundus Joint Master',
                  accent: 'from-indigo-500 to-blue-500',
                },
                {
                  label: 'Період реалізації',
                  value: '2023 – 2027',
                  sub: '48 місяців • Етап 3 активний',
                  accent: 'from-cyan-400 to-teal-500',
                },
                {
                  label: 'Бюджет гранту ЄС',
                  value: '€ 4,860,000',
                  sub: '100% фінансування Єврокомісії',
                  accent: 'from-emerald-400 to-green-500',
                },
                {
                  label: 'Загальний індекс KPI',
                  value: `${kpiProgress}%`,
                  sub: 'Середній прогрес по 5 пакетах',
                  accent: 'from-amber-400 to-orange-500',
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 p-5 transition-all duration-300"
                >
                  <div className={`w-10 h-1 rounded-full bg-gradient-to-r ${stat.accent} mb-4`} />
                  <div className="text-xs font-medium text-slate-400">{stat.label}</div>
                  <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-xs text-slate-400">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Bento Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-8 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Паспорт та місія проєкту
                </span>
                <h2 className="text-2xl font-bold text-white">
                  Інтеграція телекомунікаційних систем нового покоління та Data Science
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Консорціум <strong>CoDaS</strong> формує спільний європейський освітній та науковий простір.
                  Студенти та дослідники працюють над архітектурою мереж 6G, штучним інтелектом на межі мережі
                  (Edge AI), кібербезпекою критичної інфраструктури та аналізом великих даних у реальному часі.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div className="p-4 rounded-2xl bg-[#0B1120]/80 border border-white/10">
                    <div className="text-cyan-300 font-bold text-sm">120 ECTS</div>
                    <div className="text-xs text-slate-400 mt-1">Подвійні дипломи магістра двох університетів ЄС</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0B1120]/80 border border-white/10">
                    <div className="text-indigo-300 font-bold text-sm">4 Університети</div>
                    <div className="text-xs text-slate-400 mt-1">Фінляндія, Франція, Німеччина та Іспанія</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#0B1120]/80 border border-white/10">
                    <div className="text-emerald-300 font-bold text-sm">Open Science</div>
                    <div className="text-xs text-slate-400 mt-1">Усі публікації та датасети мають відкритий DOI</div>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Card */}
              <div className="rounded-3xl bg-gradient-to-b from-indigo-950/60 to-white/[0.03] border border-indigo-500/25 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Швидкий доступ
                  </span>
                  <h3 className="text-xl font-bold text-white">Інтерактивні модулі порталу</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Переходьте між розділами для перегляду університетів-партнерів, прогресу робочих пакетів або
                    додавання нових наукових статей.
                  </p>
                </div>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab('wp')}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-left text-xs font-semibold text-white flex items-center justify-between transition"
                  >
                    <span>Переглянути Робочі пакети (WP1–WP5)</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('publications')}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-left text-xs font-semibold text-white flex items-center justify-between transition shadow-lg shadow-indigo-600/25"
                  >
                    <span>Репозиторій публікацій (DOI)</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONSORTIUM */}
        {activeTab === 'consortium' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                name: 'Aalto University',
                country: 'Фінляндія • Координатор',
                code: 'FI',
                dept: 'Department of Information and Communications Engineering',
                focus: '5G/6G Wireless Systems, Autonomous Networks, Signal Processing',
                color: 'from-blue-500 to-cyan-400',
              },
              {
                name: 'Grenoble INP – UGA',
                country: 'Франція • Партнер',
                code: 'FR',
                dept: 'École nationale supérieure d’informatique et de mathématiques appliquées',
                focus: 'Data Science, Distributed Systems, Edge AI & Cybersecurity',
                color: 'from-indigo-500 to-purple-500',
              },
              {
                name: 'Technische Universität Braunschweig',
                country: 'Німеччина • Партнер',
                code: 'DE',
                dept: 'Institute for Communications Technology (IfN)',
                focus: 'Vehicular Communications, Optical Networks, IoT Telemetry',
                color: 'from-amber-400 to-red-500',
              },
              {
                name: 'Universitat Politècnica de Catalunya (UPC)',
                country: 'Іспанія • Асоційований партнер',
                code: 'ES',
                dept: 'Barcelona School of Telecommunications Engineering',
                focus: 'Smart Cities, Cloud-Native Core Networks, Big Data Analytics',
                color: 'from-emerald-400 to-teal-500',
              },
            ].map((uni, i) => (
              <div
                key={i}
                className="group rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-cyan-300 border border-white/10">
                      {uni.country}
                    </span>
                    <span
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${uni.color} text-slate-950 font-black text-xs flex items-center justify-center shadow-md`}
                    >
                      {uni.code}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-white group-hover:text-cyan-300 transition">
                    {uni.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{uni.dept}</p>
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm text-slate-300">
                    <span className="text-xs text-slate-400 block mb-1">Ключові напрямки R&amp;D:</span>
                    {uni.focus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: WORK PACKAGES */}
        {activeTab === 'wp' && (
          <div className="rounded-3xl bg-white/[0.04] border border-white/10 overflow-hidden">
            <div className="p-6 sm:p-7 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Робочі пакети консорціуму (Work Packages)</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Моніторинг виконання етапів грантової угоди по університетах-лідерах
                </p>
              </div>
              {role !== 'public' ? (
                <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Режим редагування активний ({role})
                </span>
              ) : (
                <span className="text-xs text-slate-400">
                  Перемкніть роль на «Виконавець», щоб змінювати прогрес
                </span>
              )}
            </div>

            <div className="divide-y divide-white/10">
              {workPackages.map((wp, i) => (
                <div
                  key={wp.code}
                  className="p-5 sm:p-6 hover:bg-white/[0.02] transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                        {wp.code}
                      </span>
                      <span className="font-bold text-white text-sm sm:text-base">{wp.title}</span>
                    </div>
                    <div className="text-xs text-slate-400 pl-1">Лідер пакету: {wp.lead}</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="w-36 bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                        style={{ width: `${wp.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-white w-10">{wp.progress}%</span>

                    {role !== 'public' && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdateWpProgress(i, -5)}
                          className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                          title="-5%"
                        >
                          -
                        </button>
                        <button
                          onClick={() => handleUpdateWpProgress(i, 5)}
                          className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                          title="+5%"
                        >
                          +
                        </button>
                      </div>
                    )}

                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                        wp.progress === 100
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                          : 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30'
                      }`}
                    >
                      {wp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PUBLICATIONS */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            {/* Search & Add Controls */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <input
                type="text"
                placeholder="Пошук за назвою статті, автором або DOI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:max-w-md px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/15 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
              />
              <div className="text-xs text-slate-400 self-center">
                Знайдено публікацій: <strong className="text-white">{filteredPublications.length}</strong>
              </div>
            </div>

            {(role === 'executor' || role === 'admin') && (
              <form
                onSubmit={handleAddPublication}
                className="rounded-3xl bg-gradient-to-r from-indigo-950/70 to-cyan-950/40 border border-cyan-400/30 p-6 space-y-4"
              >
                <div className="text-sm font-bold text-cyan-300">
                  + Додати нову наукову публікацію до репозиторію (Права: {role})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Повна назва наукової публікації..."
                    value={newPubTitle}
                    onChange={(e) => setNewPubTitle(e.target.value)}
                    className="sm:col-span-2 px-4 py-2.5 text-sm rounded-xl bg-[#070B14]/80 border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="DOI (напр. 10.1109/6G.2026)"
                    value={newPubDoi}
                    onChange={(e) => setNewPubDoi(e.target.value)}
                    className="px-4 py-2.5 text-sm rounded-xl bg-[#070B14]/80 border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-bold hover:opacity-95 transition shadow-lg shadow-indigo-600/25"
                >
                  Опублікувати запис у базі
                </button>
              </form>
            )}

            <div className="space-y-4">
              {filteredPublications.map((pub, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] border border-white/10 p-5 sm:p-6 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300">
                        {pub.tag} • {pub.year}
                      </span>
                      <h3 className="font-bold text-white text-base sm:text-lg leading-snug">{pub.title}</h3>
                      <p className="text-xs text-slate-300">{pub.authors}</p>
                      <p className="text-xs text-slate-400">{pub.venue}</p>
                    </div>
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 self-start text-xs font-mono px-3 py-1.5 rounded-xl bg-white/10 hover:bg-cyan-500/20 text-cyan-300 border border-white/10 transition"
                    >
                      DOI: {pub.doi} ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REPORTS & KPI */}
        {activeTab === 'reports' && (
          <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Аналітика KPI та фінансова звітність</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Ключові індикатори виконання грантової угоди Європейської Комісії
                </p>
              </div>
              {role === 'admin' && (
                <div className="flex items-center gap-2.5 bg-cyan-500/10 px-4 py-2.5 rounded-2xl border border-cyan-400/30">
                  <span className="text-xs font-semibold text-cyan-300">Адмін-коригування KPI:</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={kpiProgress}
                    onChange={(e) => setKpiProgress(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs font-bold rounded-lg border border-cyan-400/40 bg-[#070B14] text-white text-center"
                  />
                  <span className="text-xs font-bold text-cyan-300">%</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#0B1120]/90 border border-white/10">
                <div className="text-xs text-slate-400">Зараховані студенти (Cohort 1–3)</div>
                <div className="text-3xl font-black text-white mt-2">118 / 120</div>
                <div className="text-xs text-emerald-400 mt-1.5 font-medium">98.3% виконання плану мобільності</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0B1120]/90 border border-white/10">
                <div className="text-xs text-slate-400">Спільні статті (Scopus / WoS)</div>
                <div className="text-3xl font-black text-white mt-2">{publications.length + 21}</div>
                <div className="text-xs text-cyan-300 mt-1.5 font-medium">+14% понад цільовий показник</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0B1120]/90 border border-white/10">
                <div className="text-xs text-slate-400">Освоєння бюджету гранту</div>
                <div className="text-3xl font-black text-white mt-2">€ 3.42M</div>
                <div className="text-xs text-indigo-300 mt-1.5 font-medium">Проміжний аудит ЄК пройдено</div>
              </div>
            </div>

            {role === 'public' && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/25 text-xs text-amber-200">
                Для редагування показників KPI та керування прогресом робочих пакетів перемкніть роль у верхньому
                меню на <strong>Виконавець</strong> або <strong>Адмін</strong>.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#050810] mt-16 py-8 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 CoDaS Consortium (Communications Engineering &amp; Data Science). All rights reserved.</div>
          <div className="text-slate-500">Co-funded by the Erasmus+ Programme of the European Union</div>
        </div>
      </footer>
    </div>
  );
}
