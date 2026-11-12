'use client';

import React, { useState, useEffect } from 'react';

type Role = 'public' | 'applicant' | 'admin';
type TabId = 'overview' | 'consortium' | 'wp' | 'publications' | 'applications' | 'reports';

interface UserAccount {
  name: string;
  email: string;
  password?: string;
  role: Role;
}

interface Application {
  id: string;
  fullName: string;
  email: string;
  university: string;
  gpa: string;
  track: string;
  motivation: string;
  portfolioUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export default function CoDaSPortal() {
  // Auth & User State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>([
    { name: 'Олена Коваленко', email: 'olena@student.edu', password: '123', role: 'applicant' },
    { name: 'Dr. Jussi Korhonen (Admin)', email: 'admin@codas.eu', password: 'admin', role: 'admin' },
  ]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [kpiProgress, setKpiProgress] = useState(84);
  const [toast, setToast] = useState<string | null>(null);

  // Applications State (End-to-End Flow)
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'APP-2026-01',
      fullName: 'Максим Бондаренко',
      email: 'm.bondarenko@kpi.ua',
      university: 'НТУУ «КПІ ім. Ігоря Сікорського»',
      gpa: '4.85',
      track: 'Aalto University (FI) → Grenoble INP (FR)',
      motivation: 'Дослідження архітектури 6G та розподіленого машинного навчання на межі мережі (Edge AI).',
      portfolioUrl: 'https://github.com/mbondarenko-ml',
      status: 'approved',
      submittedAt: '10.11.2026',
    },
    {
      id: 'APP-2026-02',
      fullName: 'Софія Мельник',
      email: 'sofia.melnyk@lnu.edu.ua',
      university: 'ЛНУ ім. Івана Франка',
      gpa: '4.92',
      track: 'TU Braunschweig (DE) → UPC Barcelona (ES)',
      motivation: 'Оптимізація хмарних телекомунікаційних мереж та кібербезпека IoT-інфраструктури.',
      portfolioUrl: 'https://github.com/smelnyk-net',
      status: 'pending',
      submittedAt: '11.11.2026',
    },
  ]);

  // New Application Form State
  const [appUniversity, setAppUniversity] = useState('');
  const [appGpa, setAppGpa] = useState('');
  const [appTrack, setAppTrack] = useState('Aalto University (FI) → Grenoble INP (FR)');
  const [appPortfolio, setAppPortfolio] = useState('');
  const [appMotivation, setAppMotivation] = useState('');

  // Admin Filters for Applications
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterTrack, setFilterTrack] = useState<string>('all');
  const [appSearch, setAppSearch] = useState('');

  // Publications & WP State
  const [pubSearch, setPubSearch] = useState('');
  const [newPubTitle, setNewPubTitle] = useState('');
  const [newPubDoi, setNewPubDoi] = useState('');
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

  // Load persisted data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('codas_current_user');
    const savedUsersList = localStorage.getItem('codas_users_list');
    const savedApps = localStorage.getItem('codas_applications');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedUsersList) setRegisteredUsers(JSON.parse(savedUsersList));
    if (savedApps) setApplications(JSON.parse(savedApps));
  }, []);

  const role: Role = currentUser ? currentUser.role : 'public';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Auth Handlers
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'login') {
      const found = registeredUsers.find(
        (u) => u.email.toLowerCase() === authEmail.trim().toLowerCase() && u.password === authPassword
      );
      if (!found) {
        setAuthError('Невірний email або пароль. Скористайтеся швидким демо-входом нижче.');
        return;
      }
      setCurrentUser(found);
      localStorage.setItem('codas_current_user', JSON.stringify(found));
      setIsAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      showToast(`Вітаємо, ${found.name}!`);
      if (found.role === 'admin' || found.role === 'applicant') {
        setActiveTab('applications');
      }
    } else {
      if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
        setAuthError('Заповніть усі поля для реєстрації.');
        return;
      }
      if (registeredUsers.some((u) => u.email.toLowerCase() === authEmail.trim().toLowerCase())) {
        setAuthError('Користувач із таким email уже зареєстрований.');
        return;
      }
      const newUser: UserAccount = {
        name: authName.trim(),
        email: authEmail.trim(),
        password: authPassword,
        role: 'applicant',
      };
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      setCurrentUser(newUser);
      localStorage.setItem('codas_users_list', JSON.stringify(updatedUsers));
      localStorage.setItem('codas_current_user', JSON.stringify(newUser));
      setIsAuthModalOpen(false);
      setAuthName('');
      setAuthEmail('');
      setAuthPassword('');
      setActiveTab('applications');
      showToast('Акаунт учасника створено! Тепер ви можете подати заявку.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('codas_current_user');
    setActiveTab('overview');
    showToast('Ви вийшли з облікового запису (Режим Гостя)');
  };

  const fillDemoCredentials = (type: 'applicant' | 'admin') => {
    setAuthMode('login');
    setAuthError('');
    if (type === 'applicant') {
      setAuthEmail('olena@student.edu');
      setAuthPassword('123');
    } else {
      setAuthEmail('admin@codas.eu');
      setAuthPassword('admin');
    }
  };

  // Application Submission (Applicant)
  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !appUniversity.trim() || !appGpa.trim() || !appMotivation.trim()) return;

    const newApp: Application = {
      id: `APP-2026-0${applications.length + 1}`,
      fullName: currentUser.name,
      email: currentUser.email,
      university: appUniversity.trim(),
      gpa: appGpa.trim(),
      track: appTrack,
      motivation: appMotivation.trim(),
      portfolioUrl: appPortfolio.trim() || 'https://github.com',
      status: 'pending',
      submittedAt: new Date().toLocaleDateString('uk-UA'),
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    localStorage.setItem('codas_applications', JSON.stringify(updated));
    setAppUniversity('');
    setAppGpa('');
    setAppPortfolio('');
    setAppMotivation('');
    showToast('Вашу кандидатуру успішно передано на розгляд комісії!');
  };

  // Admin Decision Handler
  const handleApplicationStatus = (id: string, status: 'approved' | 'rejected') => {
    const updated = applications.map((app) => (app.id === id ? { ...app, status } : app));
    setApplications(updated);
    localStorage.setItem('codas_applications', JSON.stringify(updated));
    showToast(status === 'approved' ? 'Кандидата схвалено на програму!' : 'Заявку відхилено.');
  };

  // WP & Publications Handlers
  const handleUpdateWpProgress = (index: number, delta: number) => {
    setWorkPackages((prev) =>
      prev.map((wp, i) => {
        if (i !== index) return wp;
        const nextVal = Math.min(100, Math.max(0, wp.progress + delta));
        return { ...wp, progress: nextVal, status: nextVal === 100 ? 'Завершено' : 'Активний' };
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
        authors: `${currentUser?.name || 'CoDaS Researcher'} (Portal Submission)`,
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

  // Filtered Lists
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesTrack = filterTrack === 'all' || app.track.includes(filterTrack);
    const matchesSearch =
      app.fullName.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.university.toLowerCase().includes(appSearch.toLowerCase()) ||
      app.id.toLowerCase().includes(appSearch.toLowerCase());
    return matchesStatus && matchesTrack && matchesSearch;
  });

  const filteredPublications = publications.filter(
    (p) =>
      p.title.toLowerCase().includes(pubSearch.toLowerCase()) ||
      p.authors.toLowerCase().includes(pubSearch.toLowerCase()) ||
      p.doi.toLowerCase().includes(pubSearch.toLowerCase())
  );

  const approvedCount = applications.filter((a) => a.status === 'approved').length;

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-indigo-600/20 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 w-[460px] h-[460px] rounded-full bg-cyan-500/15 blur-[130px]" />
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 border border-cyan-400/40 text-sm text-white shadow-2xl backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* AUTH MODAL (LOGIN / REGISTER) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#0D1425] border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center text-sm"
            >
              ✕
            </button>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                CoDaS Identity &amp; Access
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {authMode === 'login' ? 'Вхід до системи' : 'Реєстрація учасника'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === 'login'
                  ? 'Увійдіть як кандидат для подачі заявки або як адміністратор консорціуму.'
                  : 'Створіть обліковий запис кандидата для участі в програмі CoDaS EMJM.'}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
                className={`py-2 rounded-lg transition ${
                  authMode === 'login' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Вхід (Login)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError('');
                }}
                className={`py-2 rounded-lg transition ${
                  authMode === 'register' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Реєстрація (Sign Up)
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Прізвище та ім&apos;я</label>
                  <input
                    type="text"
                    required
                    placeholder="Наприклад: Іван Мельник"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-slate-300 mb-1">Електронна пошта (Email)</label>
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Пароль</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-bold hover:opacity-95 transition shadow-lg shadow-indigo-600/30"
              >
                {authMode === 'login' ? 'Увійти в кабінет' : 'Зареєструватися та увійти'}
              </button>
            </form>

            {/* Quick Demo Fillers for Presentation */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="text-[11px] text-slate-400 text-center">Швидке заповнення для перевірки ролей:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('applicant')}
                  className="py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-[11px] font-semibold text-amber-300 transition"
                >
                  Демо-Учасник
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-[11px] font-semibold text-cyan-300 transition"
                >
                  Демо-Адмін
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Glass Navbar */}
      <header className="sticky top-0 z-40 bg-[#070B14]/85 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div onClick={() => setActiveTab('overview')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full rounded-[11px] bg-[#0B1120] flex items-center justify-center font-black text-base text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300">
                CD
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">CoDaS</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-400/25">
                  Erasmus+ EMJM
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
              { id: 'applications', label: role === 'admin' ? `Відбір заявок (${applications.length})` : 'Подача кандидатури' },
              { id: 'wp', label: 'Робочі пакети' },
              { id: 'publications', label: 'Публікації' },
              { id: 'reports', label: 'KPI' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Auth Controls */}
          <div className="flex items-center gap-2.5">
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs text-slate-400 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                  Режим: Гість
                </span>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-bold hover:opacity-95 transition shadow-lg shadow-indigo-600/25"
                >
                  Увійти / Реєстрація
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 bg-white/[0.05] pl-3 pr-1.5 py-1 rounded-2xl border border-white/15">
                <div className="text-right">
                  <div className="text-xs font-bold text-white leading-tight">{currentUser.name}</div>
                  <div
                    className={`text-[10px] font-bold uppercase ${
                      currentUser.role === 'admin' ? 'text-cyan-400' : 'text-amber-400'
                    }`}
                  >
                    {currentUser.role === 'admin' ? 'Адміністратор' : 'Учасник / Кандидат'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-xs font-semibold text-slate-300 transition"
                >
                  Вийти
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sub-nav */}
        <div className="flex lg:hidden overflow-x-auto gap-1.5 px-4 pb-3">
          {[
            { id: 'overview', label: 'Паспорт' },
            { id: 'consortium', label: 'Консорціум' },
            { id: 'applications', label: role === 'admin' ? 'Відбір заявок' : 'Подати заявку' },
            { id: 'wp', label: 'Пакети' },
            { id: 'publications', label: 'Публікації' },
            { id: 'reports', label: 'KPI' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
        {/* Hero Banner */}
        <section className="relative rounded-3xl bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent border border-white/10 p-6 sm:p-10 overflow-hidden shadow-2xl">
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
                Міжнародний академічний портал спільного магістерського та дослідницького консорціуму: мережі 5G/6G,
                Edge AI, подвійні дипломи та конкурсний відбір кандидатів.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('applications')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs sm:text-sm font-bold hover:opacity-95 transition shadow-lg shadow-indigo-600/25"
                >
                  {role === 'admin' ? 'Перейти до модерації заявок →' : 'Подати кандидатуру на програму →'}
                </button>
                <button
                  onClick={() => setActiveTab('consortium')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-semibold transition"
                >
                  Університети-партнери
                </button>
              </div>
            </div>

            {/* Role Status Box */}
            <div className="shrink-0 rounded-2xl bg-[#0B1120]/90 border border-white/10 p-5 min-w-[270px] space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Статус сесії</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Активна
                </span>
              </div>
              <div className="h-[1px] bg-white/10" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400">Поточна роль користувача</div>
                <div className="mt-1 text-sm font-bold text-white">
                  {role === 'public' && 'Гість (Ознайомчий доступ)'}
                  {role === 'applicant' && <span className="text-amber-400">Учасник / Кандидат</span>}
                  {role === 'admin' && <span className="text-cyan-300">Адміністратор комісії</span>}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 leading-relaxed">
                {role === 'public' && 'Авторизуйтесь або зареєструйтесь, щоб подати анкету кандидата.'}
                {role === 'applicant' && 'Ви можете подати свою кандидатуру та відстежувати її статус.'}
                {role === 'admin' && 'Вам доступні фільтрація анкет, ухвалення рішень та керування KPI.'}
              </div>
            </div>
          </div>
        </section>

        {/* TAB: APPLICATIONS (END-TO-END CANDIDATE & ADMIN WORKFLOW) */}
        {activeTab === 'applications' && (
          <div className="space-y-8">
            {/* 1. GUEST VIEW: Prompt to Login/Register */}
            {role === 'public' && (
              <div className="rounded-3xl bg-gradient-to-br from-indigo-950/70 via-[#0D1425] to-cyan-950/40 border border-indigo-400/30 p-8 sm:p-10 text-center max-w-2xl mx-auto space-y-5 shadow-2xl">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-cyan-300 flex items-center justify-center mx-auto text-2xl font-black">
                  🔒
                </div>
                <h2 className="text-2xl font-black text-white">Подача кандидатури доступна авторизованим учасникам</h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Щоб подати заявку на участь у магістерській та дослідницькій програмі <strong>CoDaS EMJM</strong> або
                  перевірити статус розгляду своєї анкети, увійдіть в обліковий запис або пройдіть швидку реєстрацію.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-bold hover:opacity-95 transition shadow-lg shadow-indigo-600/30"
                  >
                    Зареєструватися як Учасник
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold transition"
                  >
                    Увійти в кабінет
                  </button>
                </div>
              </div>
            )}

            {/* 2. APPLICANT VIEW: Submit Application + Track My Applications */}
            {role === 'applicant' && currentUser && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Application Form */}
                <form
                  onSubmit={handleApplicationSubmit}
                  className="lg:col-span-3 rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-8 space-y-5"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Кабінет кандидата
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">Подача кандидатури на програму CoDaS</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Заповніть академічний профіль. Після відправки заявка надійде на розгляд відбірковій комісії.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Кандидат</label>
                      <input
                        type="text"
                        disabled
                        value={currentUser.name}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Контактний Email</label>
                      <input
                        type="text"
                        disabled
                        value={currentUser.email}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-300 mb-1">Поточний університет та спеціальність *</label>
                      <input
                        type="text"
                        required
                        placeholder="Напр.: ТНТУ / КПІ, Комп'ютерні науки"
                        value={appUniversity}
                        onChange={(e) => setAppUniversity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Середній бал (GPA) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Напр.: 4.85"
                        value={appGpa}
                        onChange={(e) => setAppGpa(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Бажаний трек мобільності *</label>
                      <select
                        value={appTrack}
                        onChange={(e) => setAppTrack(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Aalto University (FI) → Grenoble INP (FR)">
                          Aalto University (FI) → Grenoble INP (FR)
                        </option>
                        <option value="TU Braunschweig (DE) → UPC Barcelona (ES)">
                          TU Braunschweig (DE) → UPC Barcelona (ES)
                        </option>
                        <option value="Grenoble INP (FR) → Aalto University (FI)">
                          Grenoble INP (FR) → Aalto University (FI)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Посилання на CV / GitHub / ORCID</label>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={appPortfolio}
                        onChange={(e) => setAppPortfolio(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Мотиваційний лист та наукові інтереси *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Опишіть ваш досвід у Data Science / мережах та тему майбутнього дослідження..."
                      value={appMotivation}
                      onChange={(e) => setAppMotivation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#070B14] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-sm font-extrabold hover:opacity-95 transition shadow-lg shadow-amber-500/20"
                  >
                    Надіслати кандидатуру на розгляд
                  </button>
                </form>

                {/* My Submitted Applications Status */}
                <div className="lg:col-span-2 rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-7 space-y-4">
                  <h3 className="text-lg font-bold text-white">Мої подані заявки</h3>
                  <p className="text-xs text-slate-400">
                    Статус оновлюється автоматично після перевірки адміністратором консорціуму.
                  </p>

                  <div className="space-y-3 pt-2">
                    {applications.filter((a) => a.email === currentUser.email).length === 0 ? (
                      <div className="p-5 rounded-2xl bg-[#0B1120] border border-white/10 text-xs text-slate-400 text-center">
                        Ви ще не подали жодної заявки. Заповніть форму ліворуч!
                      </div>
                    ) : (
                      applications
                        .filter((a) => a.email === currentUser.email)
                        .map((myApp) => (
                          <div
                            key={myApp.id}
                            className="p-4 rounded-2xl bg-[#0B1120] border border-white/15 space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs text-slate-400">{myApp.id}</span>
                              {myApp.status === 'pending' && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                                  ⏳ На розгляді
                                </span>
                              )}
                              {myApp.status === 'approved' && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                                  ✓ Схвалено
                                </span>
                              )}
                              {myApp.status === 'rejected' && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                                  ✕ Відхилено
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-bold text-white">{myApp.track}</div>
                            <div className="text-xs text-slate-400">
                              Університет: {myApp.university} • GPA: <strong className="text-white">{myApp.gpa}</strong>
                            </div>
                            <div className="text-[11px] text-slate-500">Дата подачі: {myApp.submittedAt}</div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. ADMIN VIEW: Filter, Search & Approve/Reject Applications */}
            {role === 'admin' && (
              <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-8 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Панель відбіркової комісії (Admin)
                    </span>
                    <h2 className="text-2xl font-bold text-white mt-1">Фільтрація та модерація заявок кандидатів</h2>
                  </div>

                  {/* Quick Counters */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300">
                      Усього: <strong>{applications.length}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300">
                      Очікують: <strong>{applications.filter((a) => a.status === 'pending').length}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                      Схвалено: <strong>{approvedCount}</strong>
                    </span>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#0B1120]/90 border border-white/10">
                  <input
                    type="text"
                    placeholder="Пошук за ПІБ, ВНЗ або ID..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-[#070B14] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="px-3.5 py-2 rounded-xl bg-[#070B14] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="all">Усі статуси розгляду</option>
                    <option value="pending">⏳ На розгляді (Pending)</option>
                    <option value="approved">✓ Схвалені (Approved)</option>
                    <option value="rejected">✕ Відхилені (Rejected)</option>
                  </select>

                  <select
                    value={filterTrack}
                    onChange={(e) => setFilterTrack(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-[#070B14] border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="all">Усі університетські треки</option>
                    <option value="Aalto">Трек: Aalto University</option>
                    <option value="Braunschweig">Трек: TU Braunschweig</option>
                    <option value="Grenoble">Трек: Grenoble INP</option>
                  </select>
                </div>

                {/* Filtered Applications List */}
                <div className="space-y-4">
                  {filteredApplications.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-400 rounded-2xl bg-[#0B1120] border border-white/10">
                      За обраними фільтрами кандидатів не знайдено.
                    </div>
                  ) : (
                    filteredApplications.map((app) => (
                      <div
                        key={app.id}
                        className="p-5 sm:p-6 rounded-2xl bg-[#0B1120]/90 border border-white/10 hover:border-white/20 transition flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                      >
                        <div className="space-y-2 max-w-2xl">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300">
                              {app.id}
                            </span>
                            <h3 className="text-base font-bold text-white">{app.fullName}</h3>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                              GPA: {app.gpa}
                            </span>
                            {app.status === 'pending' && (
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                                На розгляді
                              </span>
                            )}
                            {app.status === 'approved' && (
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                                Схвалено
                              </span>
                            )}
                            {app.status === 'rejected' && (
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold">
                                Відхилено
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-300">
                            <strong>ВНЗ:</strong> {app.university} • <strong>Трек:</strong> {app.track}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{app.motivation}</p>
                          <div className="flex items-center gap-4 text-[11px] text-slate-500">
                            <span>Email: {app.email}</span>
                            <a
                              href={app.portfolioUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:underline"
                            >
                              CV / GitHub ↗
                            </a>
                          </div>
                        </div>

                        {/* Admin Moderation Actions */}
                        <div className="flex sm:flex-row lg:flex-col gap-2 shrink-0">
                          <button
                            onClick={() => handleApplicationStatus(app.id, 'approved')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                              app.status === 'approved'
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30'
                            }`}
                          >
                            ✓ Схвалити
                          </button>
                          <button
                            onClick={() => handleApplicationStatus(app.id, 'rejected')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                              app.status === 'rejected'
                                ? 'bg-rose-500 text-white'
                                : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-400/30'
                            }`}
                          >
                            ✕ Відхилити
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Акронім програми', value: 'CoDaS EMJM', sub: 'Erasmus Mundus Joint Master', accent: 'from-indigo-500 to-blue-500' },
                { label: 'Період реалізації', value: '2023 – 2027', sub: '48 місяців • Етап 3 активний', accent: 'from-cyan-400 to-teal-500' },
                { label: 'Бюджет гранту ЄС', value: '€ 4,860,000', sub: '100% фінансування Єврокомісії', accent: 'from-emerald-400 to-green-500' },
                { label: 'Зараховані кандидати', value: `${116 + approvedCount} / 120`, sub: `Індекс KPI програми: ${kpiProgress}%`, accent: 'from-amber-400 to-orange-500' },
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 p-5 transition">
                  <div className={`w-10 h-1 rounded-full bg-gradient-to-r ${stat.accent} mb-4`} />
                  <div className="text-xs font-medium text-slate-400">{stat.label}</div>
                  <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</div>
                  <div className="mt-1.5 text-xs text-slate-400">{stat.sub}</div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Паспорт та місія проєкту</span>
              <h2 className="text-2xl font-bold text-white">
                Інтеграція телекомунікаційних систем нового покоління та Data Science
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Консорціум <strong>CoDaS</strong> формує спільний європейський освітній та науковий простір.
                Студенти та дослідники працюють над архітектурою мереж 6G, штучним інтелектом на межі мережі
                (Edge AI), кібербезпекою критичної інфраструктури та аналізом великих даних у реальному часі.
              </p>
            </div>
          </div>
        )}

        {/* TAB: CONSORTIUM */}
        {activeTab === 'consortium' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { name: 'Aalto University', country: 'Фінляндія • Координатор', code: 'FI', dept: 'Department of Information and Communications Engineering', focus: '5G/6G Wireless Systems, Autonomous Networks, Signal Processing', color: 'from-blue-500 to-cyan-400' },
              { name: 'Grenoble INP – UGA', country: 'Франція • Партнер', code: 'FR', dept: 'École nationale supérieure d’informatique et de mathématiques appliquées', focus: 'Data Science, Distributed Systems, Edge AI & Cybersecurity', color: 'from-indigo-500 to-purple-500' },
              { name: 'Technische Universität Braunschweig', country: 'Німеччина • Партнер', code: 'DE', dept: 'Institute for Communications Technology (IfN)', focus: 'Vehicular Communications, Optical Networks, IoT Telemetry', color: 'from-amber-400 to-red-500' },
              { name: 'Universitat Politècnica de Catalunya (UPC)', country: 'Іспанія • Асоційований партнер', code: 'ES', dept: 'Barcelona School of Telecommunications Engineering', focus: 'Smart Cities, Cloud-Native Core Networks, Big Data Analytics', color: 'from-emerald-400 to-teal-500' },
            ].map((uni, i) => (
              <div key={i} className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-7 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-cyan-300">{uni.country}</span>
                  <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${uni.color} text-slate-950 font-black text-xs flex items-center justify-center`}>
                    {uni.code}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{uni.name}</h3>
                <p className="text-xs text-slate-400">{uni.dept}</p>
                <p className="text-sm text-slate-300 pt-2 border-t border-white/10">{uni.focus}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB: WORK PACKAGES */}
        {activeTab === 'wp' && (
          <div className="rounded-3xl bg-white/[0.04] border border-white/10 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Робочі пакети консорціуму (WP1–WP5)</h2>
              {role === 'admin' && <span className="text-xs text-cyan-300">Керування прогресом активне</span>}
            </div>
            <div className="divide-y divide-white/10">
              {workPackages.map((wp, i) => (
                <div key={wp.code} className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300">{wp.code}</span>
                      <span className="font-bold text-white">{wp.title}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Лідер: {wp.lead}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-white/10 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full" style={{ width: `${wp.progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-white w-10">{wp.progress}%</span>
                    {role === 'admin' && (
                      <div className="flex gap-1">
                        <button onClick={() => handleUpdateWpProgress(i, -5)} className="w-7 h-7 rounded-lg bg-white/10 text-xs font-bold">-</button>
                        <button onClick={() => handleUpdateWpProgress(i, 5)} className="w-7 h-7 rounded-lg bg-indigo-600 text-xs font-bold">+</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PUBLICATIONS */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Пошук публікацій за назвою або DOI..."
              value={pubSearch}
              onChange={(e) => setPubSearch(e.target.value)}
              className="w-full sm:max-w-md px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/15 text-sm text-white"
            />
            {(role === 'applicant' || role === 'admin') && (
              <form onSubmit={handleAddPublication} className="rounded-3xl bg-white/[0.04] border border-cyan-400/30 p-6 space-y-3">
                <div className="text-sm font-bold text-cyan-300">+ Додати наукову публікацію / препринт</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Назва статті..."
                    value={newPubTitle}
                    onChange={(e) => setNewPubTitle(e.target.value)}
                    className="sm:col-span-2 px-4 py-2 rounded-xl bg-[#070B14] border border-white/15 text-sm text-white"
                  />
                  <input
                    type="text"
                    placeholder="DOI (напр. 10.1109/6G.2026)"
                    value={newPubDoi}
                    onChange={(e) => setNewPubDoi(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-[#070B14] border border-white/15 text-sm text-white"
                  />
                </div>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
                  Опублікувати
                </button>
              </form>
            )}
            <div className="space-y-4">
              {filteredPublications.map((pub, i) => (
                <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-indigo-300">{pub.tag} • {pub.year}</span>
                    <h3 className="font-bold text-white mt-1">{pub.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{pub.authors} — {pub.venue}</p>
                  </div>
                  <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" className="self-start text-xs font-mono px-3 py-1.5 rounded-xl bg-white/10 text-cyan-300">
                    DOI: {pub.doi} ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: KPI REPORTS */}
        {activeTab === 'reports' && (
          <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Аналітика та KPI проєкту</h2>
              {role === 'admin' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cyan-300">KPI:</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={kpiProgress}
                    onChange={(e) => setKpiProgress(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg bg-[#070B14] border border-cyan-400/40 text-xs text-white text-center"
                  />
                  <span className="text-xs text-cyan-300">%</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#0B1120] border border-white/10">
                <div className="text-xs text-slate-400">Зараховані студенти</div>
                <div className="text-3xl font-black text-white mt-2">{116 + approvedCount} / 120</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0B1120] border border-white/10">
                <div className="text-xs text-slate-400">Опубліковані статті</div>
                <div className="text-3xl font-black text-white mt-2">{publications.length + 21}</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#0B1120] border border-white/10">
                <div className="text-xs text-slate-400">Освоєння бюджету</div>
                <div className="text-3xl font-black text-white mt-2">€ 3.42M</div>
              </div>
            </div>
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
