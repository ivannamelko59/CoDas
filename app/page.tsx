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

  // Applications State
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

  // Admin Filters
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

  const handleApplicationStatus = (id: string, status: 'approved' | 'rejected') => {
    const updated = applications.map((app) => (app.id === id ? { ...app, status } : app));
    setApplications(updated);
    localStorage.setItem('codas_applications', JSON.stringify(updated));
    showToast(status === 'approved' ? 'Кандидата схвалено на програму!' : 'Заявку відхилено.');
  };

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
    <div className="min-h-screen bg-gradient-to-br from-[#F7F3FC] via-[#EFE7FA] to-[#F9F2FA] text-[#2D1B4E] font-sans selection:bg-[#9D65D0] selection:text-white relative overflow-x-hidden">
      {/* Pastel Lavender & Orchid Ambient Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[#C084FC]/25 blur-[110px]" />
        <div className="absolute top-1/3 -right-32 w-[440px] h-[440px] rounded-full bg-[#E879F9]/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[360px] rounded-full bg-[#A78BFA]/20 blur-[110px]" />
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#2D1B4E] border border-[#D8B4FE]/40 text-sm text-white shadow-xl backdrop-blur-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E879F9] animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* AUTH MODAL (LOGIN / REGISTER) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D1B4E]/45 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-white/95 border border-[#E2D4F5] p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#6B21A8] flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9333EA]">
                CoDaS Identity &amp; Access
              </span>
              <h2 className="text-2xl font-black text-[#2D1B4E] mt-1">
                {authMode === 'login' ? 'Вхід до системи' : 'Реєстрація учасника'}
              </h2>
              <p className="text-xs text-[#6B5B85] mt-1">
                {authMode === 'login'
                  ? 'Увійдіть як кандидат для подачі заявки або як адміністратор консорціуму.'
                  : 'Створіть обліковий запис кандидата для участі в програмі CoDaS EMJM.'}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#F5EEFD] border border-[#E5D5F7] text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
                className={`py-2 rounded-lg transition ${
                  authMode === 'login'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#C084FC] text-white shadow-sm'
                    : 'text-[#6B5B85] hover:text-[#2D1B4E]'
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
                  authMode === 'register'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#C084FC] text-white shadow-sm'
                    : 'text-[#6B5B85] hover:text-[#2D1B4E]'
                }`}
              >
                Реєстрація (Sign Up)
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#4C3575] mb-1">Прізвище та ім&apos;я</label>
                  <input
                    type="text"
                    required
                    placeholder="Наприклад: Іван Мельник"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E] focus:outline-none focus:border-[#9333EA]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#4C3575] mb-1">Електронна пошта (Email)</label>
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E] focus:outline-none focus:border-[#9333EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4C3575] mb-1">Пароль</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E] focus:outline-none focus:border-[#9333EA]"
                />
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#D946EF] text-white text-sm font-bold hover:opacity-95 transition shadow-lg shadow-purple-300"
              >
                {authMode === 'login' ? 'Увійти в кабінет' : 'Зареєструватися та увійти'}
              </button>
            </form>

            {/* Quick Demo Fillers */}
            <div className="pt-4 border-t border-[#EFE5FA] space-y-2">
              <div className="text-[11px] text-[#6B5B85] text-center">Швидке заповнення для перевірки ролей:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('applicant')}
                  className="py-2 px-3 rounded-xl bg-[#F3E8FF] hover:bg-[#E9D5FF] border border-[#D8B4FE] text-[11px] font-bold text-[#6B21A8] transition"
                >
                  Демо-Учасник
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="py-2 px-3 rounded-xl bg-[#FAE8FF] hover:bg-[#F5D0FE] border border-[#F0ABFC] text-[11px] font-bold text-[#86198F] transition"
                >
                  Демо-Адмін
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Glass Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#E5D5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div onClick={() => setActiveTab('overview')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#C084FC] to-[#E879F9] flex items-center justify-center font-black text-base text-white shadow-md shadow-purple-200 group-hover:scale-105 transition">
              CD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-[#2D1B4E]">CoDaS</span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]">
                  Erasmus+ EMJM
                </span>
              </div>
              <p className="text-[11px] text-[#6B5B85] hidden sm:block">Academic Consortium Portal</p>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F5EEFD] p-1 rounded-2xl border border-[#E6D6F8]">
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
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#C084FC] text-white shadow-sm'
                    : 'text-[#5B467A] hover:text-[#2D1B4E] hover:bg-white/70'
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
                <span className="hidden sm:inline-block text-xs font-medium text-[#6B5B85] px-2.5 py-1 rounded-lg bg-[#F5EEFD] border border-[#E6D6F8]">
                  Режим: Гість
                </span>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#C084FC] text-white text-xs font-bold hover:opacity-95 transition shadow-md shadow-purple-200"
                >
                  Увійти / Реєстрація
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 bg-[#F5EEFD] pl-3 pr-1.5 py-1 rounded-2xl border border-[#DFCCF5]">
                <div className="text-right">
                  <div className="text-xs font-bold text-[#2D1B4E] leading-tight">{currentUser.name}</div>
                  <div
                    className={`text-[10px] font-extrabold uppercase ${
                      currentUser.role === 'admin' ? 'text-[#9333EA]' : 'text-[#C026D3]'
                    }`}
                  >
                    {currentUser.role === 'admin' ? 'Адміністратор' : 'Учасник / Кандидат'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold text-[#5B467A] border border-[#E6D6F8] transition"
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
                activeTab === tab.id
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-white text-[#5B467A] border border-[#E6D6F8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
        {/* Pastel Lavender Hero Banner */}
        <section className="relative rounded-3xl bg-gradient-to-br from-white/95 via-[#F6EEFF]/90 to-[#FBE8FF]/90 border border-[#E2D0F8] p-6 sm:p-10 overflow-hidden shadow-xl shadow-purple-200/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3E8FF] border border-[#D8B4FE] text-[#7E22CE] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-ping" />
                <span>Co-funded by the European Union • Grant № 101082451</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12] text-[#2D1B4E]">
                Communications Engineering &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#D946EF]">
                  Data Science
                </span>
              </h1>

              <p className="text-[#5B467A] text-sm sm:text-base leading-relaxed max-w-2xl">
                Міжнародний академічний портал спільного магістерського та дослідницького консорціуму: мережі 5G/6G,
                Edge AI, подвійні дипломи та конкурсний відбір кандидатів.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('applications')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#D946EF] text-white text-xs sm:text-sm font-bold hover:opacity-95 transition shadow-lg shadow-purple-300/60"
                >
                  {role === 'admin' ? 'Перейти до модерації заявок →' : 'Подати кандидатуру на програму →'}
                </button>
                <button
                  onClick={() => setActiveTab('consortium')}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F5EEFD] border border-[#DFCCF5] text-[#4C3575] text-xs sm:text-sm font-semibold transition"
                >
                  Університети-партнери
                </button>
              </div>
            </div>

            {/* Role Status Box */}
            <div className="shrink-0 rounded-2xl bg-white/90 border border-[#E2D0F8] p-5 min-w-[270px] space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#6B5B85]">
                <span>Статус сесії</span>
                <span className="inline-flex items-center gap-1.5 text-[#7E22CE] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#A855F7]" /> Активна
                </span>
              </div>
              <div className="h-[1px] bg-[#EFE5FA]" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-[#6B5B85]">Поточна роль користувача</div>
                <div className="mt-1 text-sm font-extrabold text-[#2D1B4E]">
                  {role === 'public' && 'Гість (Ознайомчий доступ)'}
                  {role === 'applicant' && <span className="text-[#C026D3]">Учасник / Кандидат</span>}
                  {role === 'admin' && <span className="text-[#7C3AED]">Адміністратор комісії</span>}
                </div>
              </div>
              <div className="text-[11px] text-[#6B5B85] leading-relaxed">
                {role === 'public' && 'Авторизуйтесь або зареєструйтесь, щоб подати анкету кандидата.'}
                {role === 'applicant' && 'Ви можете подати свою кандидатуру та відстежувати її статус.'}
                {role === 'admin' && 'Вам доступні фільтрація анкет, ухвалення рішень та керування KPI.'}
              </div>
            </div>
          </div>
        </section>

        {/* TAB: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="space-y-8">
            {/* 1. GUEST VIEW */}
            {role === 'public' && (
              <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-8 sm:p-10 text-center max-w-2xl mx-auto space-y-5 shadow-xl shadow-purple-200/40">
                <div className="w-14 h-14 rounded-2xl bg-[#F3E8FF] border border-[#D8B4FE] text-[#7E22CE] flex items-center justify-center mx-auto text-2xl">
                  🔒
                </div>
                <h2 className="text-2xl font-black text-[#2D1B4E]">Подача кандидатури доступна авторизованим учасникам</h2>
                <p className="text-sm text-[#5B467A] leading-relaxed">
                  Щоб подати заявку на участь у магістерській та дослідницькій програмі <strong>CoDaS EMJM</strong> або
                  перевірити статус розгляду своєї анкети, увійдіть в обліковий запис або пройдіть швидку реєстрацію.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#D946EF] text-white text-sm font-bold hover:opacity-95 transition shadow-lg shadow-purple-300/60"
                  >
                    Зареєструватися як Учасник
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-6 py-3 rounded-xl bg-[#F5EEFD] hover:bg-[#E9D5FF] border border-[#DFCCF5] text-[#4C3575] text-sm font-semibold transition"
                  >
                    Увійти в кабінет
                  </button>
                </div>
              </div>
            )}

            {/* 2. APPLICANT VIEW */}
            {role === 'applicant' && currentUser && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <form
                  onSubmit={handleApplicationSubmit}
                  className="lg:col-span-3 rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-5 shadow-lg shadow-purple-200/30"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C026D3]">
                      Кабінет кандидата
                    </span>
                    <h2 className="text-2xl font-bold text-[#2D1B4E] mt-1">Подача кандидатури на програму CoDaS</h2>
                    <p className="text-xs text-[#6B5B85] mt-1">
                      Заповніть академічний профіль. Після відправки заявка надійде на розгляд відбірковій комісії.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#6B5B85] mb-1">Кандидат</label>
                      <input
                        type="text"
                        disabled
                        value={currentUser.name}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5EEFD] border border-[#E6D6F8] text-sm text-[#4C3575]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#6B5B85] mb-1">Контактний Email</label>
                      <input
                        type="text"
                        disabled
                        value={currentUser.email}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5EEFD] border border-[#E6D6F8] text-sm text-[#4C3575]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">Поточний університет та спеціальність *</label>
                      <input
                        type="text"
                        required
                        placeholder="Напр.: ТНТУ / КПІ, Комп'ютерні науки"
                        value={appUniversity}
                        onChange={(e) => setAppUniversity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E] focus:outline-none focus:border-[#9333EA]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">Середній бал (GPA) *</label>
                      <input
                        type="text"
                        required
                        placeholder="Напр.: 4.85"
                        value={appGpa}
                        onChange={(e) => setAppGpa(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E] focus:outline-none focus:border-[#9333EA]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">Бажаний трек мобільності *</label>
                      <select
                        value={appTrack}
                        onChange={(e) => setAppTrack(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E] focus:outline-none focus:border-[#9333EA]"
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
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">Посилання на CV / GitHub / ORCID</label>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={appPortfolio}
                        onChange={(e) => setAppPortfolio(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E] focus:outline-none focus:border-[#9333EA]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4C3575] mb-1">Мотиваційний лист та наукові інтереси *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Опишіть ваш досвід у Data Science / мережах та тему майбутнього дослідження..."
                      value={appMotivation}
                      onChange={(e) => setAppMotivation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E] focus:outline-none focus:border-[#9333EA]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white text-sm font-extrabold hover:opacity-95 transition shadow-md shadow-purple-300"
                  >
                    Надіслати кандидатуру на розгляд
                  </button>
                </form>

                {/* My Submitted Applications Status */}
                <div className="lg:col-span-2 rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-7 space-y-4 shadow-lg shadow-purple-200/30">
                  <h3 className="text-lg font-bold text-[#2D1B4E]">Мої подані заявки</h3>
                  <p className="text-xs text-[#6B5B85]">
                    Статус оновлюється автоматично після перевірки адміністратором консорціуму.
                  </p>

                  <div className="space-y-3 pt-2">
                    {applications.filter((a) => a.email === currentUser.email).length === 0 ? (
                      <div className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8] text-xs text-[#6B5B85] text-center">
                        Ви ще не подали жодної заявки. Заповніть форму ліворуч!
                      </div>
                    ) : (
                      applications
                        .filter((a) => a.email === currentUser.email)
                        .map((myApp) => (
                          <div
                            key={myApp.id}
                            className="p-4 rounded-2xl bg-[#FAF7FE] border border-[#DFCCF5] space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs text-[#6B5B85]">{myApp.id}</span>
                              {myApp.status === 'pending' && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  ⏳ На розгляді
                                </span>
                              )}
                              {myApp.status === 'approved' && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  ✓ Схвалено
                                </span>
                              )}
                              {myApp.status === 'rejected' && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  ✕ Відхилено
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-bold text-[#2D1B4E]">{myApp.track}</div>
                            <div className="text-xs text-[#5B467A]">
                              Університет: {myApp.university} • GPA: <strong className="text-[#2D1B4E]">{myApp.gpa}</strong>
                            </div>
                            <div className="text-[11px] text-[#6B5B85]">Дата подачі: {myApp.submittedAt}</div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. ADMIN VIEW */}
            {role === 'admin' && (
              <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-6 shadow-xl shadow-purple-200/30">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">
                      Панель відбіркової комісії (Admin)
                    </span>
                    <h2 className="text-2xl font-bold text-[#2D1B4E] mt-1">Фільтрація та модерація заявок кандидатів</h2>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="px-3 py-1.5 rounded-xl bg-[#F5EEFD] border border-[#DFCCF5] text-[#4C3575]">
                      Усього: <strong>{applications.length}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-800">
                      Очікують: <strong>{applications.filter((a) => a.status === 'pending').length}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800">
                      Схвалено: <strong>{approvedCount}</strong>
                    </span>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F7F2FC] border border-[#E5D5F7]">
                  <input
                    type="text"
                    placeholder="Пошук за ПІБ, ВНЗ або ID..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs text-[#2D1B4E] focus:outline-none focus:border-[#9333EA]"
                  />

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs text-[#2D1B4E] focus:outline-none focus:border-[#9333EA]"
                  >
                    <option value="all">Усі статуси розгляду</option>
                    <option value="pending">⏳ На розгляді (Pending)</option>
                    <option value="approved">✓ Схвалені (Approved)</option>
                    <option value="rejected">✕ Відхилені (Rejected)</option>
                  </select>

                  <select
                    value={filterTrack}
                    onChange={(e) => setFilterTrack(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs text-[#2D1B4E] focus:outline-none focus:border-[#9333EA]"
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
                    <div className="p-8 text-center text-sm text-[#6B5B85] rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                      За обраними фільтрами кандидатів не знайдено.
                    </div>
                  ) : (
                    filteredApplications.map((app) => (
                      <div
                        key={app.id}
                        className="p-5 sm:p-6 rounded-2xl bg-[#FAF7FE] border border-[#E5D5F7] hover:border-[#C084FC] transition flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                      >
                        <div className="space-y-2 max-w-2xl">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#EDE9FE] text-[#5B21B6] font-semibold">
                              {app.id}
                            </span>
                            <h3 className="text-base font-bold text-[#2D1B4E]">{app.fullName}</h3>
                            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#7E22CE] font-bold">
                              GPA: {app.gpa}
                            </span>
                            {app.status === 'pending' && (
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                                На розгляді
                              </span>
                            )}
                            {app.status === 'approved' && (
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                                Схвалено
                              </span>
                            )}
                            {app.status === 'rejected' && (
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
                                Відхилено
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-[#4C3575]">
                            <strong>ВНЗ:</strong> {app.university} • <strong>Трек:</strong> {app.track}
                          </div>
                          <p className="text-xs text-[#6B5B85] leading-relaxed">{app.motivation}</p>
                          <div className="flex items-center gap-4 text-[11px] text-[#6B5B85]">
                            <span>Email: {app.email}</span>
                            <a
                              href={app.portfolioUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#9333EA] font-semibold hover:underline"
                            >
                              CV / GitHub ↗
                            </a>
                          </div>
                        </div>

                        <div className="flex sm:flex-row lg:flex-col gap-2 shrink-0">
                          <button
                            onClick={() => handleApplicationStatus(app.id, 'approved')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                              app.status === 'approved'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            ✓ Схвалити
                          </button>
                          <button
                            onClick={() => handleApplicationStatus(app.id, 'rejected')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                              app.status === 'rejected'
                                ? 'bg-rose-600 text-white'
                                : 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300'
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
                { label: 'Акронім програми', value: 'CoDaS EMJM', sub: 'Erasmus Mundus Joint Master', accent: 'from-[#8B5CF6] to-[#A855F7]' },
                { label: 'Період реалізації', value: '2023 – 2027', sub: '48 місяців • Етап 3 активний', accent: 'from-[#C084FC] to-[#E879F9]' },
                { label: 'Бюджет гранту ЄС', value: '€ 4,860,000', sub: '100% фінансування Єврокомісії', accent: 'from-[#A78BFA] to-[#F472B6]' },
                { label: 'Зараховані кандидати', value: `${116 + approvedCount} / 120`, sub: `Індекс KPI програми: ${kpiProgress}%`, accent: 'from-[#7C3AED] to-[#D946EF]' },
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl bg-white/90 hover:bg-white border border-[#E2D0F8] p-5 transition shadow-sm">
                  <div className={`w-10 h-1.5 rounded-full bg-gradient-to-r ${stat.accent} mb-4`} />
                  <div className="text-xs font-semibold text-[#6B5B85]">{stat.label}</div>
                  <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#2D1B4E]">{stat.value}</div>
                  <div className="mt-1.5 text-xs text-[#6B5B85]">{stat.sub}</div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">Паспорт та місія проєкту</span>
              <h2 className="text-2xl font-bold text-[#2D1B4E]">
                Інтеграція телекомунікаційних систем нового покоління та Data Science
              </h2>
              <p className="text-[#5B467A] text-sm sm:text-base leading-relaxed">
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
              { name: 'Aalto University', country: 'Фінляндія • Координатор', code: 'FI', dept: 'Department of Information and Communications Engineering', focus: '5G/6G Wireless Systems, Autonomous Networks, Signal Processing', color: 'from-[#8B5CF6] to-[#C084FC]' },
              { name: 'Grenoble INP – UGA', country: 'Франція • Партнер', code: 'FR', dept: 'École nationale supérieure d’informatique et de mathématiques appliquées', focus: 'Data Science, Distributed Systems, Edge AI & Cybersecurity', color: 'from-[#A855F7] to-[#E879F9]' },
              { name: 'Technische Universität Braunschweig', country: 'Німеччина • Партнер', code: 'DE', dept: 'Institute for Communications Technology (IfN)', focus: 'Vehicular Communications, Optical Networks, IoT Telemetry', color: 'from-[#7C3AED] to-[#A78BFA]' },
              { name: 'Universitat Politècnica de Catalunya (UPC)', country: 'Іспанія • Асоційований партнер', code: 'ES', dept: 'Barcelona School of Telecommunications Engineering', focus: 'Smart Cities, Cloud-Native Core Networks, Big Data Analytics', color: 'from-[#C026D3] to-[#F472B6]' },
            ].map((uni, i) => (
              <div key={i} className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-7 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F3E8FF] text-[#7E22CE]">{uni.country}</span>
                  <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${uni.color} text-white font-black text-xs flex items-center justify-center shadow-sm`}>
                    {uni.code}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#2D1B4E]">{uni.name}</h3>
                <p className="text-xs text-[#6B5B85]">{uni.dept}</p>
                <p className="text-sm text-[#4C3575] pt-2 border-t border-[#EFE5FA]">{uni.focus}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB: WORK PACKAGES */}
        {activeTab === 'wp' && (
          <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#EFE5FA] flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#2D1B4E]">Робочі пакети консорціуму (WP1–WP5)</h2>
              {role === 'admin' && <span className="text-xs font-bold text-[#9333EA]">Керування прогресом активне</span>}
            </div>
            <div className="divide-y divide-[#EFE5FA]">
              {workPackages.map((wp, i) => (
                <div key={wp.code} className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F3E8FF] text-[#7E22CE]">{wp.code}</span>
                      <span className="font-bold text-[#2D1B4E]">{wp.title}</span>
                    </div>
                    <div className="text-xs text-[#6B5B85] mt-1">Лідер: {wp.lead}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-[#EFE5FA] rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] h-full" style={{ width: `${wp.progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-[#2D1B4E] w-10">{wp.progress}%</span>
                    {role === 'admin' && (
                      <div className="flex gap-1">
                        <button onClick={() => handleUpdateWpProgress(i, -5)} className="w-7 h-7 rounded-lg bg-[#F3E8FF] text-[#6B21A8] text-xs font-bold">-</button>
                        <button onClick={() => handleUpdateWpProgress(i, 5)} className="w-7 h-7 rounded-lg bg-[#8B5CF6] text-white text-xs font-bold">+</button>
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
              className="w-full sm:max-w-md px-4 py-2.5 rounded-2xl bg-white/90 border border-[#DFCCF5] text-sm text-[#2D1B4E] focus:outline-none focus:border-[#9333EA]"
            />
            {(role === 'applicant' || role === 'admin') && (
              <form onSubmit={handleAddPublication} className="rounded-3xl bg-white/90 border border-[#D8B4FE] p-6 space-y-3 shadow-sm">
                <div className="text-sm font-bold text-[#7E22CE]">+ Додати наукову публікацію / препринт</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Назва статті..."
                    value={newPubTitle}
                    onChange={(e) => setNewPubTitle(e.target.value)}
                    className="sm:col-span-2 px-4 py-2 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                  />
                  <input
                    type="text"
                    placeholder="DOI (напр. 10.1109/6G.2026)"
                    value={newPubDoi}
                    onChange={(e) => setNewPubDoi(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                  />
                </div>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold">
                  Опублікувати
                </button>
              </form>
            )}
            <div className="space-y-4">
              {filteredPublications.map((pub, i) => (
                <div key={i} className="rounded-2xl bg-white/90 border border-[#E2D0F8] p-5 flex flex-col sm:flex-row justify-between gap-4 shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#9333EA]">{pub.tag} • {pub.year}</span>
                    <h3 className="font-bold text-[#2D1B4E] mt-1">{pub.title}</h3>
                    <p className="text-xs text-[#6B5B85] mt-1">{pub.authors} — {pub.venue}</p>
                  </div>
                  <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" className="self-start text-xs font-mono px-3 py-1.5 rounded-xl bg-[#F3E8FF] text-[#7E22CE] font-semibold">
                    DOI: {pub.doi} ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: KPI REPORTS */}
        {activeTab === 'reports' && (
          <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#2D1B4E]">Аналітика та KPI проєкту</h2>
              {role === 'admin' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#7E22CE]">KPI:</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={kpiProgress}
                    onChange={(e) => setKpiProgress(Number(e.target.value))}
                    className="w-16 px-2 py-1 rounded-lg bg-[#FAF7FE] border border-[#D8B4FE] text-xs text-[#2D1B4E] text-center font-bold"
                  />
                  <span className="text-xs font-bold text-[#7E22CE]">%</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                <div className="text-xs text-[#6B5B85]">Зараховані студенти</div>
                <div className="text-3xl font-black text-[#2D1B4E] mt-2">{116 + approvedCount} / 120</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                <div className="text-xs text-[#6B5B85]">Опубліковані статті</div>
                <div className="text-3xl font-black text-[#2D1B4E] mt-2">{publications.length + 21}</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                <div className="text-xs text-[#6B5B85]">Освоєння бюджету</div>
                <div className="text-3xl font-black text-[#2D1B4E] mt-2">€ 3.42M</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#E5D5F7] bg-white/80 mt-16 py-8 px-4 sm:px-6 text-xs text-[#6B5B85]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 CoDaS Consortium (Communications Engineering &amp; Data Science). All rights reserved.</div>
          <div className="text-[#8E7AA8]">Co-funded by the Erasmus+ Programme of the European Union</div>
        </div>
      </footer>
    </div>
  );
}
