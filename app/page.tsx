'use client';

import React, { useState, useEffect } from 'react';

type Role = 'public' | 'applicant' | 'admin';
type Lang = 'ua' | 'en';
type TabId = 'overview' | 'team' | 'wp' | 'publications' | 'events_news' | 'applications' | 'reports';

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

interface DevelopmentIdea {
  id: string;
  author: string;
  category: string;
  title: string;
  description: string;
  status: 'new' | 'accepted';
}

export default function CoDaSPortal() {
  const [lang, setLang] = useState<Lang>('ua');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>([
    { name: 'Олена Коваленко (Виконавець)', email: 'olena@student.edu', password: '123', role: 'applicant' },
    { name: 'Dr. Jussi Korhonen (Керівник / Admin)', email: 'admin@codas.eu', password: 'admin', role: 'admin' },
  ]);

  // Auth Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Navigation & UI
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [kpiProgress, setKpiProgress] = useState(84);
  const [toast, setToast] = useState<string | null>(null);

  // Applications (Open input fields)
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

  const [appFullName, setAppFullName] = useState('');
  const [appEmail, setAppEmail] = useState('');
  const [appUniversity, setAppUniversity] = useState('');
  const [appGpa, setAppGpa] = useState('');
  const [appTrack, setAppTrack] = useState('Aalto University (FI) → Grenoble INP (FR)');
  const [appPortfolio, setAppPortfolio] = useState('');
  const [appMotivation, setAppMotivation] = useState('');

  // Admin Filters
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterTrack, setFilterTrack] = useState<string>('all');
  const [appSearch, setAppSearch] = useState('');

  // Development Ideas (Community & Executors -> Admin moderation)
  const [ideas, setIdeas] = useState<DevelopmentIdea[]>([
    {
      id: 'IDEA-01',
      author: 'Тарас Савчук',
      category: 'R&D / Воркшоп',
      title: 'Хакатон із моделювання 6G-мереж на базі відкритих датасетів CoDaS',
      description: 'Провести 48-годинний онлайн-хакатон для студентів консорціуму та партнерських вишів України.',
      status: 'accepted',
    },
    {
      id: 'IDEA-02',
      author: 'Ірина Лисенко',
      category: 'Навчальний модуль',
      title: 'Мікрокурс із зелених хмарних обчислень (Green Cloud & Edge AI)',
      description: 'Додати практичний модуль з оптимізації енергоспоживання ML-моделей у телеком-вузлах.',
      status: 'new',
    },
  ]);
  const [ideaAuthor, setIdeaAuthor] = useState('');
  const [ideaCategory, setIdeaCategory] = useState('R&D / Воркшоп');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');

  // Work Packages & Deliverables
  const [workPackages, setWorkPackages] = useState([
    { code: 'WP1', title: 'Управління консорціумом та забезпечення якості', deliverable: 'D1.2 Звіт ради якості (Q3 2026)', deadline: '15.12.2026', lead: 'Aalto University', progress: 95 },
    { code: 'WP2', title: 'Гармонізація навчальних планів та акредитація', deliverable: 'D2.1 Спільний стандарт 120 ECTS', deadline: '01.09.2026', lead: 'TU Braunschweig', progress: 100 },
    { code: 'WP3', title: 'Академічна мобільність та літні школи CoDaS', deliverable: 'D3.3 Каталог треків мобільності', deadline: '20.01.2027', lead: 'Grenoble INP', progress: 80 },
    { code: 'WP4', title: 'Спільні наукові дослідження (Open Science)', deliverable: 'D4.2 Відкритий репозиторій датасетів', deadline: '30.03.2027', lead: 'UPC Barcelona', progress: 72 },
    { code: 'WP5', title: 'Поширення результатів та індустріальні кейси', deliverable: 'D5.1 План взаємодії з Nokia/Ericsson', deadline: '10.05.2027', lead: 'All Partners', progress: 88 },
  ]);

  // Publications (with indexation filter)
  const [pubSearch, setPubSearch] = useState('');
  const [pubIndexFilter, setPubIndexFilter] = useState<'all' | 'Scopus' | 'WoS'>('all');
  const [newPubTitle, setNewPubTitle] = useState('');
  const [newPubDoi, setNewPubDoi] = useState('');
  const [newPubIndex, setNewPubIndex] = useState<'Scopus' | 'WoS'>('Scopus');
  const [publications, setPublications] = useState([
    {
      title: 'Joint Communications and Data Science Curriculum Framework for European Master Programmes',
      authors: 'J. Korhonen, M. Weber, L. Moreau',
      venue: 'IEEE Global Engineering Education Conference (EDUCON)',
      year: '2025',
      indexation: 'Scopus',
      doi: '10.1109/EDUCON.2025.1048291',
    },
    {
      title: 'AI-Driven Network Telemetry and 6G Edge Analytics in Cross-Border Academic Testbeds',
      authors: 'J. Korhonen, O. Kovalenko, A. Garcia',
      venue: 'IEEE Communications Magazine',
      year: '2026',
      indexation: 'WoS',
      doi: '10.1109/MCOM.2026.9841204',
    },
    {
      title: 'Double-Degree Mobility Models in ICT: Outcomes of the Erasmus+ CoDaS Initiative',
      authors: 'CoDaS Quality Assurance Board',
      venue: 'European Journal of Engineering Education',
      year: '2026',
      indexation: 'Scopus',
      doi: '10.1080/03043797.2026.219405',
    },
  ]);

  // Events & News
  const [events, setEvents] = useState([
    {
      title: 'CoDaS Summer School: 6G & Edge Intelligence',
      type: 'Літня школа / Воркшоп',
      date: '14–18.07.2026',
      location: 'Espoo, Finland (Aalto University)',
      participants: 85,
    },
    {
      title: 'International Symposium on Data-Driven Telecom Networks',
      type: 'Міжнародна конференція',
      date: '22.10.2026',
      location: 'Grenoble, France (Grenoble INP)',
      participants: 140,
    },
    {
      title: 'CoDaS Consortium Mid-Term Review & Industry Day',
      type: 'Семінар консорціуму',
      date: '04.12.2026',
      location: 'Barcelona, Spain (UPC) / Online',
      participants: 62,
    },
  ]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('codas_current_user');
    const savedUsersList = localStorage.getItem('codas_users_list');
    const savedApps = localStorage.getItem('codas_applications');
    const savedIdeas = localStorage.getItem('codas_ideas');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedUsersList) setRegisteredUsers(JSON.parse(savedUsersList));
    if (savedApps) setApplications(JSON.parse(savedApps));
    if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
  }, []);

  const role: Role = currentUser ? currentUser.role : 'public';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Translations Dictionary (UA / EN)
  const t = {
    subtitle: lang === 'ua' ? 'Портал звітності та мобільності консорціуму' : 'Consortium Reporting & Mobility Portal',
    guestMode: lang === 'ua' ? 'Режим: Відвідувач (Гість)' : 'Mode: Public Visitor',
    loginBtn: lang === 'ua' ? 'Увійти / Реєстрація' : 'Login / Sign Up',
    logoutBtn: lang === 'ua' ? 'Вийти' : 'Logout',
    heroTitle1: 'Communications Engineering & ',
    heroDesc:
      lang === 'ua'
        ? 'Офіційна платформа звітності та академічної мобільності спільного магістерського проєкту ЄС: робочі пакети, публікації (DOI), заходи, KPI та відбір кандидатів.'
        : 'Official reporting and academic mobility platform of the EU Joint Master project: work packages, DOI publications, events, KPIs, and candidate selection.',
    tabs: {
      overview: lang === 'ua' ? 'Паспорт' : 'Project Passport',
      team: lang === 'ua' ? 'Команда та ВНЗ' : 'Team & Consortium',
      wp: lang === 'ua' ? 'Робочі пакети' : 'Work Packages',
      publications: lang === 'ua' ? 'Публікації' : 'Publications',
      events_news: lang === 'ua' ? 'Заходи та Новини' : 'Events & News',
      applications:
        role === 'admin'
          ? lang === 'ua'
            ? `Відбір і Ідеї (${applications.length})`
            : `Selection & Ideas (${applications.length})`
          : lang === 'ua'
            ? 'Участь та Ідеї'
            : 'Apply & Ideas',
      reports: lang === 'ua' ? 'Звіти та KPI' : 'Reports & KPI',
    },
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
        setAuthError(
          lang === 'ua'
            ? 'Невірний email або пароль. Використайте швидкий демо-вхід нижче.'
            : 'Invalid email or password. Use quick demo login below.'
        );
        return;
      }
      setCurrentUser(found);
      localStorage.setItem('codas_current_user', JSON.stringify(found));
      setIsAuthModalOpen(false);
      setAuthEmail('');
      setAuthPassword('');
      showToast(`${lang === 'ua' ? 'Вітаємо' : 'Welcome'}, ${found.name}!`);
    } else {
      if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
        setAuthError('Заповніть усі поля для реєстрації.');
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
      showToast('Акаунт учасника / виконавця створено!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('codas_current_user');
    setActiveTab('overview');
    showToast(lang === 'ua' ? 'Ви вийшли з системи' : 'Logged out');
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

  // Application Submission (Open Name & Email fields)
  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appFullName.trim() || !appEmail.trim() || !appUniversity.trim() || !appGpa.trim() || !appMotivation.trim()) return;

    const newApp: Application = {
      id: `APP-2026-0${applications.length + 1}`,
      fullName: appFullName.trim(),
      email: appEmail.trim(),
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
    setAppFullName('');
    setAppEmail('');
    setAppUniversity('');
    setAppGpa('');
    setAppPortfolio('');
    setAppMotivation('');
    showToast('Кандидатуру успішно надіслано на розгляд комісії!');
  };

  const handleApplicationStatus = (id: string, status: 'approved' | 'rejected') => {
    const updated = applications.map((app) => (app.id === id ? { ...app, status } : app));
    setApplications(updated);
    localStorage.setItem('codas_applications', JSON.stringify(updated));
    showToast(status === 'approved' ? 'Кандидата схвалено!' : 'Заявку відхилено.');
  };

  // Development Idea Submission
  const handleIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim() || !ideaDesc.trim()) return;
    const newIdea: DevelopmentIdea = {
      id: `IDEA-0${ideas.length + 1}`,
      author: ideaAuthor.trim() || currentUser?.name || 'Учасник спільноти',
      category: ideaCategory,
      title: ideaTitle.trim(),
      description: ideaDesc.trim(),
      status: 'new',
    };
    const updated = [newIdea, ...ideas];
    setIdeas(updated);
    localStorage.setItem('codas_ideas', JSON.stringify(updated));
    setIdeaAuthor('');
    setIdeaTitle('');
    setIdeaDesc('');
    showToast('Ідею для розвитку проєкту додано!');
  };

  const handleAcceptIdea = (id: string) => {
    const updated = ideas.map((item) => (item.id === id ? { ...item, status: 'accepted' as const } : item));
    setIdeas(updated);
    localStorage.setItem('codas_ideas', JSON.stringify(updated));
    showToast('Ідею схвалено до беклогу наступного етапу!');
  };

  // WP, Publications, Events Handlers
  const handleUpdateWpProgress = (index: number, delta: number) => {
    setWorkPackages((prev) =>
      prev.map((wp, i) => (i === index ? { ...wp, progress: Math.min(100, Math.max(0, wp.progress + delta)) } : wp))
    );
    showToast('Прогрес робочого пакета оновлено');
  };

  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPubTitle.trim() || !newPubDoi.trim()) return;
    setPublications([
      {
        title: newPubTitle,
        authors: `${currentUser?.name || 'CoDaS Researcher'}`,
        venue: 'CoDaS Open Repository / IEEE Proceedings',
        year: '2026',
        indexation: newPubIndex,
        doi: newPubDoi,
      },
      ...publications,
    ]);
    setNewPubTitle('');
    setNewPubDoi('');
    showToast('Публікацію додано до реєстру DOI');
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate.trim()) return;
    setEvents([
      {
        title: newEventTitle,
        type: 'Академічний семінар',
        date: newEventDate,
        location: newEventLocation || 'Online / Consortium',
        participants: 45,
      },
      ...events,
    ]);
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventLocation('');
    showToast('Захід додано до календаря проєкту');
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

  const filteredPublications = publications.filter((p) => {
    const matchesIndex = pubIndexFilter === 'all' || p.indexation === pubIndexFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(pubSearch.toLowerCase()) ||
      p.authors.toLowerCase().includes(pubSearch.toLowerCase()) ||
      p.doi.toLowerCase().includes(pubSearch.toLowerCase());
    return matchesIndex && matchesSearch;
  });

  const approvedCount = applications.filter((a) => a.status === 'approved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F3FC] via-[#EFE7FA] to-[#F9F2FA] text-[#2D1B4E] font-sans selection:bg-[#9D65D0] selection:text-white relative overflow-x-hidden">
      {/* Ambient Lavender Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[#C084FC]/25 blur-[110px]" />
        <div className="absolute top-1/3 -right-32 w-[440px] h-[440px] rounded-full bg-[#E879F9]/20 blur-[120px]" />
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#2D1B4E] border border-[#D8B4FE]/40 text-sm text-white shadow-xl backdrop-blur-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E879F9] animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D1B4E]/45 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-white/95 border border-[#E2D4F5] p-6 sm:p-8 shadow-2xl space-y-5 relative">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#6B21A8] flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9333EA]">CoDaS Access Control</span>
              <h2 className="text-2xl font-black text-[#2D1B4E] mt-1">
                {authMode === 'login' ? 'Вхід до системи' : 'Реєстрація учасника'}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#F5EEFD] border border-[#E5D5F7] text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
                className={`py-2 rounded-lg transition ${
                  authMode === 'login' ? 'bg-gradient-to-r from-[#8B5CF6] to-[#C084FC] text-white' : 'text-[#6B5B85]'
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
                  authMode === 'register' ? 'bg-gradient-to-r from-[#8B5CF6] to-[#C084FC] text-white' : 'text-[#6B5B85]'
                }`}
              >
                Реєстрація (Sign Up)
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#4C3575] mb-1">Прізвище та ім&apos;я</label>
                  <input
                    type="text"
                    required
                    placeholder="Іван Мельник"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#4C3575] mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                />
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">{authError}</div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#D946EF] text-white text-sm font-bold shadow-lg shadow-purple-300"
              >
                {authMode === 'login' ? 'Увійти в кабінет' : 'Зареєструватися'}
              </button>
            </form>

            <div className="pt-3 border-t border-[#EFE5FA] space-y-2">
              <div className="text-[11px] text-[#6B5B85] text-center">Швидке заповнення для перевірки ролей:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('applicant')}
                  className="py-2 px-3 rounded-xl bg-[#F3E8FF] hover:bg-[#E9D5FF] border border-[#D8B4FE] text-[11px] font-bold text-[#6B21A8]"
                >
                  Виконавець / Учасник
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="py-2 px-3 rounded-xl bg-[#FAE8FF] hover:bg-[#F5D0FE] border border-[#F0ABFC] text-[11px] font-bold text-[#86198F]"
                >
                  Керівник / Адмін
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Glass Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-[#E5D5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div onClick={() => setActiveTab('overview')} className="flex items-center gap-2.5 cursor-pointer shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#C084FC] to-[#E879F9] flex items-center justify-center font-black text-sm text-white shadow-md shadow-purple-200">
              CD
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-[#2D1B4E]">CoDaS</span>
                <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]">
                  Erasmus+ EMJM
                </span>
              </div>
              <p className="text-[10px] text-[#6B5B85] hidden sm:block">{t.subtitle}</p>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F5EEFD] p-1 rounded-2xl border border-[#E6D6F8]">
            {(Object.keys(t.tabs) as TabId[]).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tabKey
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#C084FC] text-white shadow-sm'
                    : 'text-[#5B467A] hover:text-[#2D1B4E] hover:bg-white/70'
                }`}
              >
                {t.tabs[tabKey]}
              </button>
            ))}
          </nav>

          {/* Language Switcher + Auth Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Bilingual Switcher UA / EN */}
            <div className="flex items-center bg-[#F5EEFD] p-0.5 rounded-xl border border-[#E6D6F8] text-[11px] font-bold">
              <button
                onClick={() => setLang('ua')}
                className={`px-2 py-1 rounded-lg transition ${
                  lang === 'ua' ? 'bg-[#8B5CF6] text-white' : 'text-[#6B5B85]'
                }`}
              >
                UA
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg transition ${
                  lang === 'en' ? 'bg-[#8B5CF6] text-white' : 'text-[#6B5B85]'
                }`}
              >
                EN
              </button>
            </div>

            {!currentUser ? (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#C084FC] text-white text-xs font-bold hover:opacity-95 transition shadow-md shadow-purple-200"
              >
                {t.loginBtn}
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-[#F5EEFD] pl-2.5 pr-1 py-1 rounded-2xl border border-[#DFCCF5]">
                <div className="text-right hidden sm:block">
                  <div className="text-[11px] font-bold text-[#2D1B4E] leading-tight">{currentUser.name}</div>
                  <div className="text-[9px] font-extrabold uppercase text-[#9333EA]">
                    {currentUser.role === 'admin' ? 'Керівник / Admin' : 'Виконавець / Учасник'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-600 text-[11px] font-semibold text-[#5B467A] border border-[#E6D6F8]"
                >
                  {t.logoutBtn}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sub-nav */}
        <div className="flex lg:hidden overflow-x-auto gap-1.5 px-4 pb-3">
          {(Object.keys(t.tabs) as TabId[]).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                activeTab === tabKey ? 'bg-[#8B5CF6] text-white' : 'bg-white text-[#5B467A] border border-[#E6D6F8]'
              }`}
            >
              {t.tabs[tabKey]}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Banner */}
        <section className="relative rounded-3xl bg-gradient-to-br from-white/95 via-[#F6EEFF]/90 to-[#FBE8FF]/90 border border-[#E2D0F8] p-6 sm:p-9 shadow-xl shadow-purple-200/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E8FF] border border-[#D8B4FE] text-[#7E22CE] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-ping" />
                <span>Co-funded by the European Union • Grant Agreement № 101082451</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#2D1B4E]">
                {t.heroTitle1}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#D946EF]">
                  Data Science (CoDaS)
                </span>
              </h1>

              <p className="text-[#5B467A] text-sm sm:text-base leading-relaxed max-w-2xl">{t.heroDesc}</p>
            </div>

            <div className="shrink-0 rounded-2xl bg-white/90 border border-[#E2D0F8] p-4 min-w-[250px] space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#6B5B85]">
                <span>{lang === 'ua' ? 'Рівень доступу (RBAC)' : 'Access Role (RBAC)'}</span>
                <span className="text-[#7E22CE] font-bold">● Online</span>
              </div>
              <div className="text-sm font-extrabold text-[#2D1B4E]">
                {role === 'public' && (lang === 'ua' ? 'Відвідувач (Публічний звіт)' : 'Public Visitor')}
                {role === 'applicant' && <span className="text-[#C026D3]">Виконавець / Учасник</span>}
                {role === 'admin' && <span className="text-[#7C3AED]">Керівник проєкту / Адмін</span>}
              </div>
            </div>
          </div>
        </section>

        {/* 1. OVERVIEW (PROJECT PASSPORT) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: lang === 'ua' ? 'Код / Програма' : 'Grant / Programme', value: '101082451 / EMJM', sub: 'Erasmus+ Key Action 2', accent: 'from-[#8B5CF6] to-[#A855F7]' },
                { label: lang === 'ua' ? 'Терміни виконання' : 'Implementation Period', value: '2023 – 2027', sub: '48 місяців (Етап 3)', accent: 'from-[#C084FC] to-[#E879F9]' },
                { label: lang === 'ua' ? 'Бюджет гранту ЄС' : 'EU Grant Budget', value: '€ 4,860,000', sub: 'European Commission (EACEA)', accent: 'from-[#A78BFA] to-[#F472B6]' },
                { label: lang === 'ua' ? 'Виконання KPI' : 'KPI Achievement', value: `${kpiProgress}%`, sub: `${116 + approvedCount}/120 студентів`, accent: 'from-[#7C3AED] to-[#D946EF]' },
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl bg-white/90 border border-[#E2D0F8] p-5 shadow-sm">
                  <div className={`w-10 h-1.5 rounded-full bg-gradient-to-r ${stat.accent} mb-3`} />
                  <div className="text-xs font-semibold text-[#6B5B85]">{stat.label}</div>
                  <div className="mt-1 text-2xl font-extrabold text-[#2D1B4E]">{stat.value}</div>
                  <div className="mt-1 text-xs text-[#6B5B85]">{stat.sub}</div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">
                {lang === 'ua' ? 'Анотація, мета та завдання проєкту' : 'Project Abstract, Goal & Objectives'}
              </span>
              <h2 className="text-2xl font-bold text-[#2D1B4E]">
                Communications Engineering and Data Science (CoDaS)
              </h2>
              <p className="text-[#5B467A] text-sm sm:text-base leading-relaxed">
                Міжнародний науково-освітній проєкт спрямований на підготовку магістрів та проведення спільних
                досліджень у галузі телекомунікаційних мереж 5G/6G, хмарних обчислень, кібербезпеки та науки про дані
                (Data Science). Програма реалізується консорціумом 4 провідних технічних університетів Європи.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                  <div className="font-bold text-sm text-[#7E22CE]">Завдання 1: Мобільність 120 ECTS</div>
                  <p className="text-xs text-[#6B5B85] mt-1">Навчання за системою подвійних дипломів у двох країнах ЄС.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                  <div className="font-bold text-sm text-[#7E22CE]">Завдання 2: Відкрита наука</div>
                  <p className="text-xs text-[#6B5B85] mt-1">Публікація результатів досліджень у виданнях Scopus та Web of Science.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                  <div className="font-bold text-sm text-[#7E22CE]">Завдання 3: Індустріальне R&amp;D</div>
                  <p className="text-xs text-[#6B5B85] mt-1">Спільні проєкти з Nokia, Ericsson, Siemens та телеком-операторами.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TEAM (ORCID & AFFILIATION) + CONSORTIUM */}
        {activeTab === 'team' && (
          <div className="space-y-8">
            {/* Project Team with ORCID */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#2D1B4E]">
                {lang === 'ua' ? 'Ключові виконавці проєкту (ORCID та афіліація)' : 'Project Team Members (ORCID & Affiliation)'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Prof. Jussi Korhonen', role: 'Координатор проєкту (Lead)', uni: 'Aalto University (FI)', orcid: '0000-0002-1825-0097' },
                  { name: 'Dr. Laurent Moreau', role: 'Керівник WP3 (Мобільність)', uni: 'Grenoble INP – UGA (FR)', orcid: '0000-0001-5109-3700' },
                  { name: 'Prof. Markus Weber', role: 'Керівник WP2 (Акредитація)', uni: 'TU Braunschweig (DE)', orcid: '0000-0003-2419-8821' },
                  { name: 'Dr. Elena García', role: 'Керівник WP4 (Open Science)', uni: 'UPC Barcelona (ES)', orcid: '0000-0002-9410-5514' },
                ].map((member, i) => (
                  <div key={i} className="rounded-2xl bg-white/90 border border-[#E2D0F8] p-5 space-y-2 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#E879F9] text-white font-bold text-xs flex items-center justify-center">
                      {member.name.split(' ').slice(1).map((n) => n[0]).join('')}
                    </div>
                    <h3 className="font-bold text-sm text-[#2D1B4E]">{member.name}</h3>
                    <div className="text-xs font-semibold text-[#9333EA]">{member.role}</div>
                    <div className="text-xs text-[#6B5B85]">{member.uni}</div>
                    <a
                      href={`https://orcid.org/${member.orcid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#F3E8FF] text-[#6B21A8] hover:bg-[#E9D5FF]"
                    >
                      ORCID: {member.orcid} ↗
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Consortium Universities */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#2D1B4E]">
                {lang === 'ua' ? 'Університети-партнери консорціуму' : 'Consortium Partner Universities'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { name: 'Aalto University', country: 'Фінляндія • Координатор', code: 'FI', dept: 'Department of Information and Communications Engineering', focus: '5G/6G Wireless Systems, Autonomous Networks, Signal Processing' },
                  { name: 'Grenoble INP – UGA', country: 'Франція • Партнер', code: 'FR', dept: 'École nationale supérieure d’informatique et de mathématiques appliquées', focus: 'Data Science, Distributed Systems, Edge AI & Cybersecurity' },
                  { name: 'Technische Universität Braunschweig', country: 'Німеччина • Партнер', code: 'DE', dept: 'Institute for Communications Technology (IfN)', focus: 'Vehicular Communications, Optical Networks, IoT Telemetry' },
                  { name: 'Universitat Politècnica de Catalunya (UPC)', country: 'Іспанія • Асоційований партнер', code: 'ES', dept: 'Barcelona School of Telecommunications Engineering', focus: 'Smart Cities, Cloud-Native Core Networks, Big Data Analytics' },
                ].map((uni, i) => (
                  <div key={i} className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F3E8FF] text-[#7E22CE]">{uni.country}</span>
                      <span className="w-8 h-8 rounded-xl bg-[#8B5CF6] text-white font-black text-xs flex items-center justify-center">
                        {uni.code}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#2D1B4E]">{uni.name}</h3>
                    <p className="text-xs text-[#6B5B85]">{uni.dept}</p>
                    <p className="text-xs text-[#4C3575] pt-2 border-t border-[#EFE5FA]">{uni.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. WORK PACKAGES & DELIVERABLES */}
        {activeTab === 'wp' && (
          <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-[#EFE5FA] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#2D1B4E]">Робочі пакети (WP) та заплановані результати (Deliverables)</h2>
                <p className="text-xs text-[#6B5B85] mt-0.5">Статус виконання та дедлайни за грантовою угодою</p>
              </div>
              {role === 'admin' && <span className="text-xs font-bold text-[#9333EA]">Режим редагування активний</span>}
            </div>
            <div className="divide-y divide-[#EFE5FA]">
              {workPackages.map((wp, i) => (
                <div key={wp.code} className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F3E8FF] text-[#7E22CE]">{wp.code}</span>
                      <span className="font-bold text-[#2D1B4E]">{wp.title}</span>
                    </div>
                    <div className="text-xs text-[#5B467A]">
                      <strong>Результат:</strong> {wp.deliverable} • <strong>Термін:</strong> {wp.deadline} • <strong>Лідер:</strong> {wp.lead}
                    </div>
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

        {/* 4. PUBLICATIONS (DOI + INDEXATION FILTERS) */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <input
                type="text"
                placeholder="Пошук за назвою, автором або DOI..."
                value={pubSearch}
                onChange={(e) => setPubSearch(e.target.value)}
                className="w-full sm:max-w-md px-4 py-2.5 rounded-2xl bg-white/90 border border-[#DFCCF5] text-sm text-[#2D1B4E]"
              />
              <div className="flex items-center gap-1.5 bg-white/90 p-1 rounded-2xl border border-[#DFCCF5] text-xs font-semibold">
                {(['all', 'Scopus', 'WoS'] as const).map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setPubIndexFilter(idx)}
                    className={`px-3 py-1.5 rounded-xl transition ${
                      pubIndexFilter === idx ? 'bg-[#8B5CF6] text-white' : 'text-[#6B5B85]'
                    }`}
                  >
                    {idx === 'all' ? 'Усі бази' : idx}
                  </button>
                ))}
              </div>
            </div>

            {(role === 'applicant' || role === 'admin') && (
              <form onSubmit={handleAddPublication} className="rounded-3xl bg-white/90 border border-[#D8B4FE] p-6 space-y-3 shadow-sm">
                <div className="text-sm font-bold text-[#7E22CE]">+ Додати наукову публікацію до реєстру</div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
                  <select
                    value={newPubIndex}
                    onChange={(e) => setNewPubIndex(e.target.value as 'Scopus' | 'WoS')}
                    className="px-4 py-2 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                  >
                    <option value="Scopus">Індексація: Scopus</option>
                    <option value="WoS">Індексація: Web of Science</option>
                  </select>
                </div>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold">
                  Опублікувати запис
                </button>
              </form>
            )}

            <div className="space-y-4">
              {filteredPublications.map((pub, i) => (
                <div key={i} className="rounded-2xl bg-white/90 border border-[#E2D0F8] p-5 flex flex-col sm:flex-row justify-between gap-4 shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#F3E8FF] text-[#7E22CE]">
                      {pub.indexation} • {pub.year}
                    </span>
                    <h3 className="font-bold text-[#2D1B4E] mt-1.5">{pub.title}</h3>
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

        {/* 5. EVENTS, NEWS & ALUMNI REVIEWS */}
        {activeTab === 'events_news' && (
          <div className="space-y-8">
            {/* Events Section */}
            <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">Академічний календар</span>
                  <h2 className="text-xl font-bold text-[#2D1B4E]">Конференції, семінари та воркшопи</h2>
                </div>
              </div>

              {(role === 'applicant' || role === 'admin') && (
                <form onSubmit={handleAddEvent} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                  <input
                    type="text"
                    placeholder="Назва заходу..."
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Дата (напр. 15.12.2026)"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                  />
                  <button type="submit" className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold">
                    + Додати захід
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {events.map((ev, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8] space-y-2">
                    <span className="text-[11px] font-bold text-[#9333EA]">{ev.type}</span>
                    <h3 className="font-bold text-sm text-[#2D1B4E]">{ev.title}</h3>
                    <div className="text-xs text-[#6B5B85]">📅 {ev.date} • 📍 {ev.location}</div>
                    <div className="text-xs font-semibold text-[#4C3575]">Учасників: {ev.participants} осіб</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bilingual News & Alumni Reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bilingual News */}
              <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-[#2D1B4E]">
                  {lang === 'ua' ? 'Останні новини проєкту (UA / EN)' : 'Latest Project News (EN / UA)'}
                </h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                    <div className="text-[11px] text-[#9333EA] font-bold">10.11.2026</div>
                    <div className="font-bold text-sm text-[#2D1B4E] mt-0.5">
                      {lang === 'ua'
                        ? 'Відкрито набір на стипендії Erasmus Mundus CoDaS 2027'
                        : 'Applications Open for Erasmus Mundus CoDaS 2027 Scholarships'}
                    </div>
                    <p className="text-xs text-[#6B5B85] mt-1">
                      {lang === 'ua'
                        ? 'Консорціум оголосив прийом заявок на подвійні магістерські програми у Фінляндії, Франції та Німеччині.'
                        : 'The consortium announced applications for double-degree master tracks in Finland, France, and Germany.'}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                    <div className="text-[11px] text-[#9333EA] font-bold">24.10.2026</div>
                    <div className="font-bold text-sm text-[#2D1B4E] mt-0.5">
                      {lang === 'ua'
                        ? 'Успішно завершено проміжний аудит Європейської Комісії'
                        : 'European Commission Mid-Term Audit Successfully Passed'}
                    </div>
                    <p className="text-xs text-[#6B5B85] mt-1">
                      {lang === 'ua'
                        ? 'Усі робочі пакети першого етапу отримали найвищу оцінку експертів EACEA.'
                        : 'All first-phase work packages received the highest evaluation from EACEA experts.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Alumni Testimonials */}
              <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-[#2D1B4E]">
                  {lang === 'ua' ? 'Відгуки учасників програми мобільності' : 'Alumni & Student Testimonials'}
                </h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F5EEFD] to-[#FAE8FF] border border-[#E2D0F8]">
                    <p className="text-xs italic text-[#4C3575]">
                      «Перший рік в Aalto University дав потужну базу з 5G/6G, а другий у Grenoble INP — реальний
                      досвід у лабораторіях Edge AI. Захистила диплом із двома європейськими ступенями!»
                    </p>
                    <div className="mt-2 text-xs font-bold text-[#2D1B4E]">
                      Анастасія Демчук • Випускниця Cohort 1 (Aalto → Grenoble INP)
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F5EEFD] to-[#FAE8FF] border border-[#E2D0F8]">
                    <p className="text-xs italic text-[#4C3575]">
                      «Завдяки індустріальному стажуванню в межах проєкту CoDaS я опублікував статтю на конференції
                      IEEE та отримав офер R&amp;D-інженера ще до випуску.»
                    </p>
                    <div className="mt-2 text-xs font-bold text-[#2D1B4E]">
                      Олександр Ткаченко • Випускник Cohort 1 (TU Braunschweig → UPC)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. APPLICATIONS + DEVELOPMENT IDEAS */}
        {activeTab === 'applications' && (
          <div className="space-y-10">
            {/* PART A: Candidate Applications */}
            {role === 'public' && (
              <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-8 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
                <div className="text-2xl">🔒</div>
                <h2 className="text-xl font-black text-[#2D1B4E]">Подача кандидатури на програму CoDaS</h2>
                <p className="text-xs sm:text-sm text-[#5B467A]">
                  Авторизуйтесь або зареєструйтесь як учасник, щоб подати анкету кандидата на стипендію або перейти до
                  кабінету керівника.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#D946EF] text-white text-xs font-bold"
                  >
                    Реєстрація учасника
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#F5EEFD] border border-[#DFCCF5] text-[#4C3575] text-xs font-semibold"
                  >
                    Увійти в кабінет
                  </button>
                </div>
              </div>
            )}

            {role === 'applicant' && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <form
                  onSubmit={handleApplicationSubmit}
                  className="lg:col-span-3 rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-4 shadow-sm"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C026D3]">Кабінет кандидата</span>
                  <h2 className="text-xl font-bold text-[#2D1B4E]">Подача кандидатури на програму CoDaS</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">ПІБ Кандидата *</label>
                      <input
                        type="text"
                        required
                        placeholder="Введіть ваше прізвище та ім'я"
                        value={appFullName}
                        onChange={(e) => setAppFullName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">Контактний Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        value={appEmail}
                        onChange={(e) => setAppEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">Університет та спеціальність *</label>
                      <input
                        type="text"
                        required
                        placeholder="Напр.: ЗУНУ, Інженерія програмного забезпечення"
                        value={appUniversity}
                        onChange={(e) => setAppUniversity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">Середній бал (GPA) *</label>
                      <input
                        type="text"
                        required
                        placeholder="4.85"
                        value={appGpa}
                        onChange={(e) => setAppGpa(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">Трек мобільності *</label>
                      <select
                        value={appTrack}
                        onChange={(e) => setAppTrack(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                      >
                        <option value="Aalto University (FI) → Grenoble INP (FR)">Aalto University (FI) → Grenoble INP (FR)</option>
                        <option value="TU Braunschweig (DE) → UPC Barcelona (ES)">TU Braunschweig (DE) → UPC Barcelona (ES)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">Посилання на GitHub / CV</label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={appPortfolio}
                        onChange={(e) => setAppPortfolio(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4C3575] mb-1">Мотиваційний лист *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Опишіть ваш досвід та наукові інтереси..."
                      value={appMotivation}
                      onChange={(e) => setAppMotivation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white text-sm font-extrabold shadow-md shadow-purple-300"
                  >
                    Надіслати кандидатуру
                  </button>
                </form>

                <div className="lg:col-span-2 rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 space-y-3 shadow-sm">
                  <h3 className="text-lg font-bold text-[#2D1B4E]">Подані заявки</h3>
                  <div className="space-y-3">
                    {applications.map((item) => (
                      <div key={item.id} className="p-4 rounded-2xl bg-[#FAF7FE] border border-[#DFCCF5] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#2D1B4E]">{item.fullName}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.status === 'approved' ? '✓ Схвалено' : item.status === 'rejected' ? '✕ Відхилено' : '⏳ На розгляді'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#6B5B85]">{item.university} • GPA: {item.gpa}</div>
                        <div className="text-[11px] text-[#7E22CE]">{item.track}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {role === 'admin' && (
              <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">Панель керівника / Admin</span>
                    <h2 className="text-xl font-bold text-[#2D1B4E]">Фільтрація та модерація заявок кандидатів</h2>
                  </div>
                  <div className="flex gap-2 text-xs font-semibold">
                    <span className="px-3 py-1 rounded-xl bg-[#F5EEFD] text-[#4C3575]">Усього: {applications.length}</span>
                    <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800">Схвалено: {approvedCount}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#F7F2FC] border border-[#E5D5F7]">
                  <input
                    type="text"
                    placeholder="Пошук за ПІБ або ВНЗ..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                  >
                    <option value="all">Усі статуси</option>
                    <option value="pending">⏳ На розгляді</option>
                    <option value="approved">✓ Схвалені</option>
                    <option value="rejected">✕ Відхилені</option>
                  </select>
                  <select
                    value={filterTrack}
                    onChange={(e) => setFilterTrack(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                  >
                    <option value="all">Усі треки мобільності</option>
                    <option value="Aalto">Aalto University</option>
                    <option value="Braunschweig">TU Braunschweig</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {filteredApplications.map((app) => (
                    <div key={app.id} className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E5D5F7] flex flex-col lg:flex-row justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#EDE9FE] text-[#5B21B6]">{app.id}</span>
                          <span className="font-bold text-sm text-[#2D1B4E]">{app.fullName}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#F3E8FF] text-[#7E22CE] font-bold">GPA: {app.gpa}</span>
                        </div>
                        <div className="text-xs text-[#4C3575]">{app.university} • {app.track}</div>
                        <p className="text-xs text-[#6B5B85]">{app.motivation}</p>
                        <div className="text-[11px] text-[#6B5B85]">Email: {app.email}</div>
                      </div>
                      <div className="flex gap-2 shrink-0 self-start">
                        <button
                          onClick={() => handleApplicationStatus(app.id, 'approved')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold"
                        >
                          ✓ Схвалити
                        </button>
                        <button
                          onClick={() => handleApplicationStatus(app.id, 'rejected')}
                          className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold"
                        >
                          ✕ Відхилити
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PART B: Development Ideas & Proposals */}
            <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">Беклог ідей (Product Backlog)</span>
                <h2 className="text-xl font-bold text-[#2D1B4E]">Ідеї та пропозиції для розвитку проєкту CoDaS</h2>
                <p className="text-xs text-[#6B5B85] mt-1">
                  Кожен відвідувач або учасник може запропонувати ідею нового воркшопу чи дослідження, а керівник —
                  схвалити її до плану наступного спринту.
                </p>
              </div>

              <form onSubmit={handleIdeaSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                <input
                  type="text"
                  required
                  placeholder="Ваше ім'я"
                  value={ideaAuthor}
                  onChange={(e) => setIdeaAuthor(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                />
                <select
                  value={ideaCategory}
                  onChange={(e) => setIdeaCategory(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                >
                  <option value="R&D / Воркшоп">R&amp;D / Воркшоп</option>
                  <option value="Навчальний модуль">Навчальний модуль</option>
                  <option value="Партнерство з бізнесом">Партнерство з бізнесом</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="Назва ідеї..."
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="Короткий опис цінності для проєкту..."
                  value={ideaDesc}
                  onChange={(e) => setIdeaDesc(e.target.value)}
                  className="sm:col-span-3 px-3.5 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                />
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold">
                  + Запропонувати ідею
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ideas.map((idea) => (
                  <div key={idea.id} className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E5D5F7] flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-[#9333EA]">{idea.category}</span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            idea.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {idea.status === 'accepted' ? '✓ Взято в план розвитку' : 'Нова пропозиція'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-[#2D1B4E] mt-1">{idea.title}</h3>
                      <p className="text-xs text-[#6B5B85] mt-1">{idea.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#EFE5FA] text-[11px] text-[#6B5B85]">
                      <span>Автор: {idea.author}</span>
                      {role === 'admin' && idea.status !== 'accepted' && (
                        <button
                          onClick={() => handleAcceptIdea(idea.id)}
                          className="px-3 py-1 rounded-lg bg-[#8B5CF6] text-white font-bold"
                        >
                          Схвалити в беклог
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. REPORTS & KPI */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* KPI Metrics */}
            <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#2D1B4E]">Показники ефективності проєкту (KPI)</h2>
                  <p className="text-xs text-[#6B5B85]">Порівняння планових і фактичних значень грантової угоди</p>
                </div>
                {role === 'admin' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#7E22CE]">Загальний KPI:</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={kpiProgress}
                      onChange={(e) => setKpiProgress(Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg bg-[#FAF7FE] border border-[#D8B4FE] text-xs font-bold text-center"
                    />
                    <span className="text-xs font-bold text-[#7E22CE]">%</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                  <div className="text-xs text-[#6B5B85]">Зараховані студенти (План: 120)</div>
                  <div className="text-3xl font-black text-[#2D1B4E] mt-1">{116 + approvedCount} / 120</div>
                  <div className="text-xs text-emerald-700 font-semibold mt-1">98.3% виконання плану</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                  <div className="text-xs text-[#6B5B85]">Статті Scopus / WoS (План: 20)</div>
                  <div className="text-3xl font-black text-[#2D1B4E] mt-1">{publications.length + 21}</div>
                  <div className="text-xs text-[#7E22CE] font-semibold mt-1">Перевиконання на +20%</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                  <div className="text-xs text-[#6B5B85]">Проведені заходи (План: 12)</div>
                  <div className="text-3xl font-black text-[#2D1B4E] mt-1">{events.length + 8} / 12</div>
                  <div className="text-xs text-[#7E22CE] font-semibold mt-1">За графіком консорціуму</div>
                </div>
              </div>
            </div>

            {/* Official Reports Table (PDF Export / Print) */}
            <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#2D1B4E]">Звіти за періодами реалізації (PDF)</h2>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold hover:opacity-95"
                >
                  🖨 Сформувати / Друк звіту (PDF)
                </button>
              </div>
              <div className="divide-y divide-[#EFE5FA]">
                {[
                  { name: 'Періодичний звіт №1 (Технічний та фінансовий)', period: '01.09.2023 – 31.08.2024', status: 'Прийнято EACEA' },
                  { name: 'Проміжний звіт №2 (Mid-Term Consortium Report)', period: '01.09.2024 – 31.08.2025', status: 'Прийнято EACEA' },
                  { name: 'Поточний звіт за 2026 рік (WP1–WP5 & KPI)', period: '01.09.2025 – 12.11.2026', status: 'На перевірці керівника' },
                ].map((rep, i) => (
                  <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm text-[#2D1B4E]">{rep.name}</div>
                      <div className="text-xs text-[#6B5B85]">Звітний період: {rep.period}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F3E8FF] text-[#7E22CE]">
                        {rep.status}
                      </span>
                      <button
                        onClick={() => window.print()}
                        className="text-xs font-bold text-[#9333EA] hover:underline"
                      >
                        Завантажити PDF ↓
                      </button>
                    </div>
                  </div>
                ))}
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
