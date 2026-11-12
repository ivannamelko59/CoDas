'use client';

import React, { useState, useEffect } from 'react';

type Role = 'public' | 'executor' | 'admin';

export default function CoDaSPortal() {
  const [role, setRole] = useState<Role>('public');
  const [activeTab, setActiveTab] = useState<'overview' | 'consortium' | 'wp' | 'publications' | 'reports'>('overview');
  const [kpiProgress, setKpiProgress] = useState(84);
  const [newPubTitle, setNewPubTitle] = useState('');
  const [newPubDoi, setNewPubDoi] = useState('');
  const [publications, setPublications] = useState([
    {
      title: 'Joint Communications and Data Science Curriculum Framework for European Master Programmes',
      authors: 'Aalto University, TU Braunschweig, Grenoble INP Consortium',
      venue: 'IEEE Global Engineering Education Conference (EDUCON)',
      year: '2025',
      doi: '10.1109/EDUCON.2025.1048291',
    },
    {
      title: 'AI-Driven Network Telemetry and 6G Edge Analytics in Cross-Border Academic Testbeds',
      authors: 'J. Korhonen, M. Weber, L. Moreau, O. Kovalenko',
      venue: 'IEEE Communications Magazine',
      year: '2026',
      doi: '10.1109/MCOM.2026.9841204',
    },
    {
      title: 'Double-Degree Mobility Models in ICT: Outcomes of the Erasmus+ CoDaS Initiative',
      authors: 'CoDaS Quality Assurance Board',
      venue: 'European Journal of Engineering Education',
      year: '2026',
      doi: '10.1080/03043797.2026.219405',
    },
  ]);

  useEffect(() => {
    const savedRole = localStorage.getItem('codas_role') as Role;
    if (savedRole) setRole(savedRole);
  }, []);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem('codas_role', newRole);
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
        doi: newPubDoi,
      },
      ...publications,
    ]);
    setNewPubTitle('');
    setNewPubDoi('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center shadow-sm">
              CD
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-900">CoDaS</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Erasmus+ EMJM
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {[
              { id: 'overview', label: 'Паспорт проєкту' },
              { id: 'consortium', label: 'Консорціум' },
              { id: 'wp', label: 'Робочі пакети' },
              { id: 'publications', label: 'Публікації (DOI)' },
              { id: 'reports', label: 'Звіти та KPI' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-2 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Role Switcher (RBAC) */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => handleRoleChange('public')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                role === 'public' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Гість
            </button>
            <button
              onClick={() => handleRoleChange('executor')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                role === 'executor' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Виконавець
            </button>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                role === 'admin' ? 'bg-blue-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Адмін
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-14 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium mb-4">
            <span>Co-funded by the European Union</span>
            <span>•</span>
            <span>Grant Agreement № 101082451</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl leading-tight">
            Communications Engineering &amp; Data Science (CoDaS)
          </h1>
          <p className="mt-4 text-slate-300 max-w-2xl text-base sm:text-lg leading-relaxed">
            Міжнародний академічний портал спільного магістерського та дослідницького консорціуму у сфері
            інтелектуальних телекомунікаційних мереж, 5G/6G систем та науки про дані.
          </p>

          {/* Role Status Banner */}
          <div className="mt-8 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              Поточний режим доступу:{' '}
              <strong className="text-white uppercase">
                {role === 'public' ? 'Публічний перегляд' : role === 'executor' ? 'Виконавець (WP Lead)' : 'Адміністратор консорціуму'}
              </strong>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Mobile Tabs */}
        <div className="flex md:hidden overflow-x-auto gap-2 pb-2">
          {[
            { id: 'overview', label: 'Паспорт' },
            { id: 'consortium', label: 'Консорціум' },
            { id: 'wp', label: 'Робочі пакети' },
            { id: 'publications', label: 'Публікації' },
            { id: 'reports', label: 'Звіти/KPI' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                activeTab === tab.id ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. PROJECT PASSPORT */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Акронім / Код', value: 'CoDaS / EMJM-2023', sub: 'Erasmus Mundus Joint Master' },
                { label: 'Період реалізації', value: '2023 – 2027', sub: '48 місяців (Етап 3 активний)' },
                { label: 'Бюджет гранту ЄС', value: '€ 4,860,000', sub: '100% співфінансування EU' },
                { label: 'Виконання KPI', value: `${kpiProgress}%`, sub: 'Поточний індекс результативності' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="mt-1 text-xs text-slate-500">{stat.sub}</div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Паспорт та стратегічні цілі проєкту</h2>
              <p className="text-slate-600 leading-relaxed">
                Проєкт <strong>CoDaS (Communications Engineering and Data Science)</strong> об&apos;єднує провідні технічні
                університети Європи для підготовки фахівців нового покоління на перетині інженерії зв&apos;язку, хмарних
                обчислень, кібербезпеки та машинного навчання.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-semibold text-slate-900">Подвійні дипломи</div>
                  <p className="text-sm text-slate-600 mt-1">
                    Мобільність студентів між двома європейськими університетами-партнерами протягом 2 років (120 ECTS).
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-semibold text-slate-900">Індустріальні кейси</div>
                  <p className="text-sm text-slate-600 mt-1">
                    Спільні R&amp;D лабораторії з Nokia, Ericsson, Siemens та регіональними телеком-операторами.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-semibold text-slate-900">Відкрита наука</div>
                  <p className="text-sm text-slate-600 mt-1">
                    Усі навчальні модулі, набори даних (datasets) та наукові статті індексуються з відкритим DOI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. CONSORTIUM */}
        {activeTab === 'consortium' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                name: 'Aalto University',
                country: 'Фінляндія (Координатор)',
                dept: 'Department of Information and Communications Engineering',
                focus: '5G/6G Wireless Systems, Autonomous Networks, Signal Processing',
              },
              {
                name: 'Grenoble INP – UGA',
                country: 'Франція (Партнер)',
                dept: 'École nationale supérieure d’informatique et de mathématiques appliquées',
                focus: 'Data Science, Distributed Systems, Edge AI & Cybersecurity',
              },
              {
                name: 'Technische Universität Braunschweig',
                country: 'Німеччина (Партнер)',
                dept: 'Institute for Communications Technology (IfN)',
                focus: 'Vehicular Communications, Optical Networks, IoT Telemetry',
              },
              {
                name: 'Universitat Politècnica de Catalunya (UPC)',
                country: 'Іспанія (Асоційований партнер)',
                dept: 'Barcelona School of Telecommunications Engineering',
                focus: 'Smart Cities, Cloud-Native Core Networks, Big Data Analytics',
              },
            ].map((uni, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
                    {uni.country}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">{uni.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{uni.dept}</p>
                  <p className="mt-3 text-sm text-slate-600">{uni.focus}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. WORK PACKAGES */}
        {activeTab === 'wp' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Робочі пакети проєкту (Work Packages)</h2>
              {role !== 'public' && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                  Доступно редагування статусів ({role})
                </span>
              )}
            </div>
            <div className="divide-y divide-slate-200">
              {[
                { code: 'WP1', title: 'Управління консорціумом та забезпечення якості', lead: 'Aalto University', progress: 95, status: 'Виконується' },
                { code: 'WP2', title: 'Гармонізація навчальних планів та акредитація', lead: 'TU Braunschweig', progress: 100, status: 'Завершено' },
                { code: 'WP3', title: 'Академічна мобільність та літні школи CoDaS', lead: 'Grenoble INP', progress: 80, status: 'Виконується' },
                { code: 'WP4', title: 'Спільні наукові дослідження та публікації (Open Science)', lead: 'UPC / Aalto', progress: 72, status: 'Активна фаза' },
                { code: 'WP5', title: 'Поширення результатів та взаємодія з індустрією', lead: 'All Partners', progress: 85, status: 'Виконується' },
              ].map((wp, i) => (
                <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-white">{wp.code}</span>
                      <span className="font-semibold text-slate-900">{wp.title}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Відповідальний партнер: {wp.lead}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${wp.progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 w-10">{wp.progress}%</span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {wp.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. PUBLICATIONS */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            {(role === 'executor' || role === 'admin') && (
              <form onSubmit={handleAddPublication} className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-3">
                <div className="text-sm font-bold text-blue-900">
                  + Додати нову наукову публікацію до репозиторію (Права: {role})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Назва статті..."
                    value={newPubTitle}
                    onChange={(e) => setNewPubTitle(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                  <input
                    type="text"
                    placeholder="DOI (напр. 10.1109/...)"
                    value={newPubDoi}
                    onChange={(e) => setNewPubDoi(e.target.value)}
                    className="px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 transition"
                >
                  Опублікувати запис
                </button>
              </form>
            )}

            <div className="space-y-4">
              {publications.map((pub, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900">{pub.title}</h3>
                      <p className="text-xs text-slate-600 mt-1">{pub.authors}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {pub.venue} ({pub.year})
                      </p>
                    </div>
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-xs font-mono px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 text-blue-700 border border-slate-200"
                    >
                      DOI: {pub.doi}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. REPORTS & KPI */}
        {activeTab === 'reports' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Моніторинг KPI та фінансова звітність</h2>
                <p className="text-sm text-slate-500">Ключові індикатори виконання грантової угоди</p>
              </div>
              {role === 'admin' && (
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
                  <span className="text-xs font-semibold text-blue-900">Адмін-коригування KPI:</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={kpiProgress}
                    onChange={(e) => setKpiProgress(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs font-bold rounded border border-blue-300 bg-white"
                  />
                  <span className="text-xs font-bold text-blue-900">%</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Зараховані студенти (Cohort 1–3)</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">118 / 120</div>
                <div className="text-xs text-emerald-600 mt-1">98.3% виконання плану</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Спільні наукові статті (Scopus/WoS)</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{publications.length + 21}</div>
                <div className="text-xs text-emerald-600 mt-1">Перевиконання норми на 14%</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Освоєння бюджету гранту</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">€ 3.42M</div>
                <div className="text-xs text-slate-600 mt-1">Аудит ЄК пройдено без зауважень</div>
              </div>
            </div>

            {role === 'public' && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                Для завантаження внутрішніх фінансових актів та редагування показників KPI перемкніть роль у правому верхньому кутку на <strong>Виконавець</strong> або <strong>Адмін</strong>.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16 py-8 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 CoDaS Consortium (Communications Engineering &amp; Data Science). All rights reserved.</div>
          <div>Co-funded by the Erasmus+ Programme of the European Union</div>
        </div>
      </footer>
    </div>
  );
}
