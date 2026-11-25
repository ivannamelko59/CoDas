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

interface PublicationItem {
  title: string;
  authors: string;
  venue: string;
  year: string;
  pubType: 'Article' | 'Conference' | 'Monograph';
  indexation: 'Scopus' | 'WoS';
  doi: string;
}

interface NewsItem {
  date: string;
  titleUa: string;
  titleEn: string;
  textUa: string;
  textEn: string;
}

export default function CoDaSPortal() {
  const [lang, setLang] = useState<Lang>('ua');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>([
    { name: 'Олена Коваленко', email: 'olena@student.edu', password: '123', role: 'applicant' },
    { name: 'Dr. Jussi Korhonen', email: 'admin@codas.eu', password: 'admin', role: 'admin' },
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

  // Applications
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'APP-2026-01',
      fullName: 'Максим Бондаренко',
      email: 'm.bondarenko@kpi.ua',
      university: 'NTUU Igor Sikorsky Kyiv Polytechnic Institute',
      gpa: '4.85',
      track: 'Aalto University (FI) → Grenoble INP (FR)',
      motivation: 'Research on 6G network architecture and distributed Edge AI.',
      portfolioUrl: 'https://github.com/mbondarenko-ml',
      status: 'approved',
      submittedAt: '10.11.2026',
    },
    {
      id: 'APP-2026-02',
      fullName: 'Софія Мельник',
      email: 'sofia.melnyk@lnu.edu.ua',
      university: 'Ivan Franko National University of Lviv',
      gpa: '4.92',
      track: 'TU Braunschweig (DE) → UPC Barcelona (ES)',
      motivation: 'Optimization of cloud-native telecom networks and IoT cybersecurity.',
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

  // Development Ideas
  const [ideas, setIdeas] = useState<DevelopmentIdea[]>([
    {
      id: 'IDEA-01',
      author: 'Тарас Савчук',
      category: 'R&D / Workshop',
      title: '6G Network Simulation Hackathon based on CoDaS Open Datasets',
      description: 'Organize a 48-hour online hackathon for consortium students and partner universities.',
      status: 'accepted',
    },
    {
      id: 'IDEA-02',
      author: 'Ірина Лисенко',
      category: 'Curriculum Module',
      title: 'Micro-credential Course on Green Cloud & Energy-Efficient Edge AI',
      description: 'Add a practical module on optimizing ML model energy consumption in telecom nodes.',
      status: 'new',
    },
  ]);
  const [ideaAuthor, setIdeaAuthor] = useState('');
  const [ideaCategory, setIdeaCategory] = useState('R&D / Workshop');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');

  // Work Packages Progress
  const [wpProgressList, setWpProgressList] = useState([95, 100, 80, 72, 88]);

  // Publications & Crossref DOI Autofill
  const [pubSearch, setPubSearch] = useState('');
  const [pubIndexFilter, setPubIndexFilter] = useState<'all' | 'Scopus' | 'WoS'>('all');
  const [pubYearFilter, setPubYearFilter] = useState<string>('all');
  const [pubTypeFilter, setPubTypeFilter] = useState<string>('all');

  const [newPubTitle, setNewPubTitle] = useState('');
  const [newPubAuthors, setNewPubAuthors] = useState('');
  const [newPubVenue, setNewPubVenue] = useState('');
  const [newPubYear, setNewPubYear] = useState('2026');
  const [newPubDoi, setNewPubDoi] = useState('');
  const [newPubType, setNewPubType] = useState<'Article' | 'Conference' | 'Monograph'>('Article');
  const [newPubIndex, setNewPubIndex] = useState<'Scopus' | 'WoS'>('Scopus');
  const [isFetchingDoi, setIsFetchingDoi] = useState(false);

  const [publications, setPublications] = useState<PublicationItem[]>([
    {
      title: 'Joint Communications and Data Science Curriculum Framework for European Master Programmes',
      authors: 'J. Korhonen, M. Weber, L. Moreau',
      venue: 'IEEE Global Engineering Education Conference (EDUCON)',
      year: '2025',
      pubType: 'Conference',
      indexation: 'Scopus',
      doi: '10.1109/EDUCON.2025.1048291',
    },
    {
      title: 'AI-Driven Network Telemetry and 6G Edge Analytics in Cross-Border Academic Testbeds',
      authors: 'J. Korhonen, O. Kovalenko, A. Garcia',
      venue: 'IEEE Communications Magazine',
      year: '2026',
      pubType: 'Article',
      indexation: 'WoS',
      doi: '10.1109/MCOM.2026.9841204',
    },
    {
      title: 'Double-Degree Mobility Models in ICT: Outcomes of the Erasmus+ CoDaS Initiative',
      authors: 'CoDaS Quality Assurance Board',
      venue: 'European Journal of Engineering Education',
      year: '2026',
      pubType: 'Monograph',
      indexation: 'Scopus',
      doi: '10.1080/03043797.2026.219405',
    },
  ]);

  // Events & Bilingual News
  const [events, setEvents] = useState([
    {
      title: 'CoDaS Summer School: 6G & Edge Intelligence',
      typeUa: 'Літня школа / Воркшоп',
      typeEn: 'Summer School / Workshop',
      date: '14.07.2026',
      location: 'Espoo, Finland (Aalto University)',
      participants: 85,
    },
    {
      title: 'International Symposium on Data-Driven Telecom Networks',
      typeUa: 'Міжнародна конференція',
      typeEn: 'International Conference',
      date: '22.10.2026',
      location: 'Grenoble, France (Grenoble INP)',
      participants: 140,
    },
    {
      title: 'CoDaS Consortium Mid-Term Review & Industry Day',
      typeUa: 'Семінар консорціуму',
      typeEn: 'Consortium Seminar',
      date: '04.12.2026',
      location: 'Barcelona, Spain (UPC) / Online',
      participants: 62,
    },
  ]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');

  const [newsList, setNewsList] = useState<NewsItem[]>([
    {
      date: '10.11.2026',
      titleUa: 'Відкрито набір на стипендії Erasmus Mundus CoDaS 2027',
      titleEn: 'Applications Open for Erasmus Mundus CoDaS 2027 Scholarships',
      textUa: 'Консорціум оголосив прийом заявок на подвійні магістерські програми у Фінляндії, Франції та Німеччині.',
      textEn: 'The consortium announced applications for double-degree master tracks in Finland, France, and Germany.',
    },
    {
      date: '24.10.2026',
      titleUa: 'Успішно завершено проміжний аудит Європейської Комісії',
      titleEn: 'European Commission Mid-Term Audit Successfully Passed',
      textUa: 'Усі робочі пакети першого етапу отримали найвищу оцінку експертів EACEA.',
      textEn: 'All first-phase work packages received the highest evaluation from EACEA experts.',
    },
  ]);
  const [newsTitleUa, setNewsTitleUa] = useState('');
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsTextUa, setNewsTextUa] = useState('');
  const [newsTextEn, setNewsTextEn] = useState('');

  // Custom Period Report Generator
  const [reportStartDate, setReportStartDate] = useState('2026-01-01');
  const [reportEndDate, setReportEndDate] = useState('2026-12-31');

  const syncStateToDb = async (patch: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/state');
      const json = await res.json();
      const current = json?.state || {};
      await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...current, ...patch }),
      });
    } catch (err) {
      console.error('MongoDB sync error:', err);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('codas_current_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    fetch('/api/state')
      .then((res) => res.json())
      .then((json) => {
        const db = json?.state;
        if (db) {
          if (db.registeredUsers) setRegisteredUsers(db.registeredUsers);
          if (db.applications) setApplications(db.applications);
          if (db.ideas) setIdeas(db.ideas);
          if (db.wpProgressList) setWpProgressList(db.wpProgressList);
          if (db.publications) setPublications(db.publications);
          if (db.events) setEvents(db.events);
          if (db.newsList) setNewsList(db.newsList);
        } else {
          const savedUsersList = localStorage.getItem('codas_users_list');
          const savedApps = localStorage.getItem('codas_applications');
          const savedIdeas = localStorage.getItem('codas_ideas');
          if (savedUsersList) setRegisteredUsers(JSON.parse(savedUsersList));
          if (savedApps) setApplications(JSON.parse(savedApps));
          if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
        }
      })
      .catch(() => {
        const savedUsersList = localStorage.getItem('codas_users_list');
        const savedApps = localStorage.getItem('codas_applications');
        const savedIdeas = localStorage.getItem('codas_ideas');
        if (savedUsersList) setRegisteredUsers(JSON.parse(savedUsersList));
        if (savedApps) setApplications(JSON.parse(savedApps));
        if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
      });
  }, []);

  const role: Role = currentUser ? currentUser.role : 'public';
  const isUa = lang === 'ua';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const workPackagesData = [
    {
      code: 'WP1',
      title: isUa ? 'Управління консорціумом та забезпечення якості' : 'Consortium Management & Quality Assurance',
      deliverable: isUa ? 'D1.2 Звіт ради якості (Q3 2026)' : 'D1.2 Quality Assurance Board Report (Q3 2026)',
      deadline: '15.12.2026',
      lead: 'Aalto University',
      progress: wpProgressList[0],
    },
    {
      code: 'WP2',
      title: isUa ? 'Гармонізація навчальних планів та акредитація' : 'Curriculum Harmonization & Joint Accreditation',
      deliverable: isUa ? 'D2.1 Спільний стандарт 120 ECTS' : 'D2.1 Joint 120 ECTS Curriculum Standard',
      deadline: '01.09.2026',
      lead: 'TU Braunschweig',
      progress: wpProgressList[1],
    },
    {
      code: 'WP3',
      title: isUa ? 'Академічна мобільність та літні школи CoDaS' : 'Academic Mobility & CoDaS Summer Schools',
      deliverable: isUa ? 'D3.3 Каталог треків мобільності' : 'D3.3 Student Mobility Tracks Catalogue',
      deadline: '20.01.2027',
      lead: 'Grenoble INP',
      progress: wpProgressList[2],
    },
    {
      code: 'WP4',
      title: isUa ? 'Спільні наукові дослідження (Open Science)' : 'Joint Research & Open Science Repository',
      deliverable: isUa ? 'D4.2 Відкритий репозиторій датасетів' : 'D4.2 Open 6G/AI Datasets Repository',
      deadline: '30.03.2027',
      lead: 'UPC Barcelona',
      progress: wpProgressList[3],
    },
    {
      code: 'WP5',
      title: isUa ? 'Поширення результатів та індустріальні кейси' : 'Dissemination & Industrial R&D Cases',
      deliverable: isUa ? 'D5.1 План взаємодії з Nokia/Ericsson' : 'D5.1 Nokia/Ericsson Industry Cooperation Plan',
      deadline: '10.05.2027',
      lead: 'All Partners',
      progress: wpProgressList[4],
    },
  ];

  // Crossref DOI Autofill Handler (Story SRP-14)
  const handleFetchDoiMetadata = async () => {
    const cleanDoi = newPubDoi.trim().replace(/^https?:\/\/doi\.org\//i, '');
    if (!cleanDoi) {
      showToast(isUa ? 'Введіть DOI перед автозаповненням' : 'Enter a DOI before autofilling');
      return;
    }
    setIsFetchingDoi(true);
    try {
      const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`);
      if (!response.ok) {
        throw new Error('DOI not found');
      }
      const data = await response.json();
      const work = data.message;
      const fetchedTitle = Array.isArray(work.title) ? work.title[0] : '';
      const fetchedAuthors = Array.isArray(work.author)
        ? work.author
            .slice(0, 4)
            .map((a: { given?: string; family?: string }) => `${a.given ? a.given[0] + '. ' : ''}${a.family || ''}`)
            .join(', ')
        : '';
      const fetchedVenue = Array.isArray(work['container-title']) ? work['container-title'][0] : 'Crossref Indexed Journal';
      const fetchedYear = work.published?.['date-parts']?.[0]?.[0]?.toString() || '2026';

      if (fetchedTitle) setNewPubTitle(fetchedTitle);
      if (fetchedAuthors) setNewPubAuthors(fetchedAuthors);
      if (fetchedVenue) setNewPubVenue(fetchedVenue);
      setNewPubYear(fetchedYear);
      setNewPubDoi(cleanDoi);
      showToast(isUa ? 'Дані успішно завантажено з Crossref API!' : 'Metadata loaded from Crossref API!');
    } catch {
      showToast(
        isUa
          ? 'Публікацію за таким DOI не знайдено у Crossref — заповніть поля вручну.'
          : 'DOI not found in Crossref — please fill fields manually.'
      );
    } finally {
      setIsFetchingDoi(false);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'login') {
      const found = registeredUsers.find(
        (u) => u.email.toLowerCase() === authEmail.trim().toLowerCase() && u.password === authPassword
      );
      if (!found) {
        setAuthError(
          isUa
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
      showToast(`${isUa ? 'Вітаємо' : 'Welcome'}, ${found.name}!`);
    } else {
      if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
        setAuthError(isUa ? 'Заповніть усі поля для реєстрації.' : 'Please fill in all fields.');
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
      syncStateToDb({ registeredUsers: updatedUsers });
      setIsAuthModalOpen(false);
      setAuthName('');
      setAuthEmail('');
      setAuthPassword('');
      setActiveTab('applications');
      showToast(isUa ? 'Акаунт учасника / виконавця створено!' : 'Participant account created!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('codas_current_user');
    setActiveTab('overview');
    showToast(isUa ? 'Ви вийшли з системи' : 'Logged out');
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
    syncStateToDb({ applications: updated });
    setAppFullName('');
    setAppEmail('');
    setAppUniversity('');
    setAppGpa('');
    setAppPortfolio('');
    setAppMotivation('');
    showToast(isUa ? 'Кандидатуру успішно надіслано на розгляд!' : 'Application submitted successfully!');
  };

  const handleApplicationStatus = (id: string, status: 'approved' | 'rejected') => {
    const updated = applications.map((app) => (app.id === id ? { ...app, status } : app));
    setApplications(updated);
    localStorage.setItem('codas_applications', JSON.stringify(updated));
    syncStateToDb({ applications: updated });
    showToast(
      status === 'approved'
        ? isUa
          ? 'Кандидата схвалено!'
          : 'Candidate approved!'
        : isUa
          ? 'Заявку відхилено.'
          : 'Application rejected.'
    );
  };

  const handleIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim() || !ideaDesc.trim()) return;
    const newIdea: DevelopmentIdea = {
      id: `IDEA-0${ideas.length + 1}`,
      author: ideaAuthor.trim() || currentUser?.name || (isUa ? 'Учасник спільноти' : 'Community Member'),
      category: ideaCategory,
      title: ideaTitle.trim(),
      description: ideaDesc.trim(),
      status: 'new',
    };
    const updated = [newIdea, ...ideas];
    setIdeas(updated);
    localStorage.setItem('codas_ideas', JSON.stringify(updated));
    syncStateToDb({ ideas: updated });
    setIdeaAuthor('');
    setIdeaTitle('');
    setIdeaDesc('');
    showToast(isUa ? 'Ідею для розвитку проєкту додано!' : 'Development idea submitted!');
  };

  const handleAcceptIdea = (id: string) => {
    const updated = ideas.map((item) => (item.id === id ? { ...item, status: 'accepted' as const } : item));
    setIdeas(updated);
    localStorage.setItem('codas_ideas', JSON.stringify(updated));
    syncStateToDb({ ideas: updated });
    showToast(isUa ? 'Ідею схвалено до беклогу!' : 'Idea accepted into backlog!');
  };

  const handleUpdateWpProgress = (index: number, delta: number) => {
    const updated = wpProgressList.map((val, i) => (i === index ? Math.min(100, Math.max(0, val + delta)) : val));
    setWpProgressList(updated);
    syncStateToDb({ wpProgressList: updated });
    showToast(isUa ? 'Прогрес робочого пакета оновлено' : 'Work package progress updated');
  };

  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPubTitle.trim() || !newPubDoi.trim()) return;
    const updatedPubs = [
      {
        title: newPubTitle.trim(),
        authors: newPubAuthors.trim() || currentUser?.name || 'CoDaS Researcher',
        venue: newPubVenue.trim() || 'CoDaS Open Repository / IEEE Proceedings',
        year: newPubYear.trim() || '2026',
        pubType: newPubType,
        indexation: newPubIndex,
        doi: newPubDoi.trim().replace(/^https?:\/\/doi\.org\//i, ''),
      },
      ...publications,
    ];
    setPublications(updatedPubs);
    syncStateToDb({ publications: updatedPubs });
    setNewPubTitle('');
    setNewPubAuthors('');
    setNewPubVenue('');
    setNewPubDoi('');
    showToast(isUa ? 'Публікацію додано до реєстру DOI' : 'Publication added to DOI registry');
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate.trim()) return;
    const updatedEvents = [
      {
        title: newEventTitle,
        typeUa: 'Академічний семінар',
        typeEn: 'Academic Seminar',
        date: newEventDate,
        location: newEventLocation || 'Online / Consortium',
        participants: 45,
      },
      ...events,
    ];
    setEvents(updatedEvents);
    syncStateToDb({ events: updatedEvents });
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventLocation('');
    showToast(isUa ? 'Захід додано до календаря' : 'Event added to calendar');
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitleUa.trim() || !newsTitleEn.trim()) return;
    const updatedNews = [
      {
        date: new Date().toLocaleDateString('uk-UA'),
        titleUa: newsTitleUa.trim(),
        titleEn: newsTitleEn.trim(),
        textUa: newsTextUa.trim() || newsTitleUa.trim(),
        textEn: newsTextEn.trim() || newsTitleEn.trim(),
      },
      ...newsList,
    ];
    setNewsList(updatedNews);
    syncStateToDb({ newsList: updatedNews });
    setNewsTitleUa('');
    setNewsTitleEn('');
    setNewsTextUa('');
    setNewsTextEn('');
    showToast(isUa ? 'Двомовну новину опубліковано!' : 'Bilingual news published!');
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

  const filteredPublications = publications.filter((p) => {
    const matchesIndex = pubIndexFilter === 'all' || p.indexation === pubIndexFilter;
    const matchesYear = pubYearFilter === 'all' || p.year === pubYearFilter;
    const matchesType = pubTypeFilter === 'all' || p.pubType === pubTypeFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(pubSearch.toLowerCase()) ||
      p.authors.toLowerCase().includes(pubSearch.toLowerCase()) ||
      p.doi.toLowerCase().includes(pubSearch.toLowerCase());
    return matchesIndex && matchesYear && matchesType && matchesSearch;
  });

  const approvedCount = applications.filter((a) => a.status === 'approved').length;

  const getPubTypeLabel = (type: PublicationItem['pubType']) => {
    if (type === 'Article') return isUa ? 'Стаття' : 'Journal Article';
    if (type === 'Conference') return isUa ? 'Тези конференції' : 'Conference Paper';
    return isUa ? 'Монографія' : 'Monograph';
  };

  const navTabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: isUa ? 'Паспорт' : 'Passport' },
    { id: 'team', label: isUa ? 'Команда та ВНЗ' : 'Team & Consortium' },
    { id: 'wp', label: isUa ? 'Робочі пакети' : 'Work Packages' },
    { id: 'publications', label: isUa ? 'Публікації' : 'Publications' },
    { id: 'events_news', label: isUa ? 'Заходи та Новини' : 'Events & News' },
    {
      id: 'applications',
      label:
        role === 'admin'
          ? isUa
            ? `Відбір і Ідеї (${applications.length})`
            : `Selection & Ideas (${applications.length})`
          : isUa
            ? 'Участь та Ідеї'
            : 'Apply & Ideas',
    },
    { id: 'reports', label: isUa ? 'Звіти та KPI' : 'Reports & KPI' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F3FC] via-[#EFE7FA] to-[#F9F2FA] text-[#2D1B4E] font-sans selection:bg-[#9D65D0] selection:text-white relative overflow-x-hidden">
      {/* Ambient Lavender Blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[#C084FC]/25 blur-[110px]" />
        <div className="absolute top-1/3 -right-32 w-[440px] h-[440px] rounded-full bg-[#E879F9]/20 blur-[120px]" />
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#2D1B4E] border border-[#D8B4FE]/40 text-sm text-white shadow-xl backdrop-blur-xl"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#E879F9] animate-ping" />
          <span>{toast}</span>
        </div>
      )}

      {/* AUTH MODAL */}
      {isAuthModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isUa ? 'Вікно входу в систему' : 'Authentication Modal'}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D1B4E]/45 backdrop-blur-md p-4"
        >
          <div className="w-full max-w-md rounded-3xl bg-white/95 border border-[#E2D4F5] p-6 sm:p-8 shadow-2xl space-y-5 relative">
            <button
              aria-label={isUa ? 'Закрити вікно' : 'Close modal'}
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#6B21A8] flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9333EA]">CoDaS Access Control</span>
              <h2 className="text-2xl font-black text-[#2D1B4E] mt-1">
                {authMode === 'login'
                  ? isUa
                    ? 'Вхід до системи'
                    : 'Sign In to Portal'
                  : isUa
                    ? 'Реєстрація учасника'
                    : 'Participant Registration'}
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
                {isUa ? 'Вхід (Login)' : 'Login'}
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
                {isUa ? 'Реєстрація (Sign Up)' : 'Sign Up'}
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#4C3575] mb-1">
                    {isUa ? "Прізвище та ім'я" : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isUa ? 'Іван Мельник' : 'John Doe'}
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
                <label className="block text-xs font-semibold text-[#4C3575] mb-1">
                  {isUa ? 'Пароль' : 'Password'}
                </label>
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
                {authMode === 'login'
                  ? isUa
                    ? 'Увійти в кабінет'
                    : 'Login'
                  : isUa
                    ? 'Зареєструватися'
                    : 'Create Account'}
              </button>
            </form>

            <div className="pt-3 border-t border-[#EFE5FA] space-y-2">
              <div className="text-[11px] text-[#6B5B85] text-center">
                {isUa ? 'Швидке заповнення для перевірки ролей:' : 'Quick demo credentials for role testing:'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('applicant')}
                  className="py-2 px-3 rounded-xl bg-[#F3E8FF] hover:bg-[#E9D5FF] border border-[#D8B4FE] text-[11px] font-bold text-[#6B21A8]"
                >
                  {isUa ? 'Виконавець / Учасник' : 'Demo Applicant'}
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="py-2 px-3 rounded-xl bg-[#FAE8FF] hover:bg-[#F5D0FE] border border-[#F0ABFC] text-[11px] font-bold text-[#86198F]"
                >
                  {isUa ? 'Керівник / Адмін' : 'Demo Admin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Glass Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-[#E5D5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setActiveTab('overview')}
            onKeyDown={(e) => e.key === 'Enter' && setActiveTab('overview')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
          >
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
              <p className="text-[10px] text-[#6B5B85] hidden sm:block">
                {isUa ? 'Портал звітності та мобільності консорціуму' : 'Consortium Reporting & Mobility Portal'}
              </p>
            </div>
          </div>

          {/* Center Navigation */}
          <nav
            aria-label={isUa ? 'Головна навігація' : 'Main navigation'}
            className="hidden lg:flex items-center gap-1 bg-[#F5EEFD] p-1 rounded-2xl border border-[#E6D6F8]"
          >
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#C084FC] text-white shadow-sm'
                    : 'text-[#5B467A] hover:text-[#2D1B4E] hover:bg-white/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Language Switcher + Auth Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              role="group"
              aria-label={isUa ? 'Вибір мови інтерфейсу' : 'Interface language'}
              className="flex items-center bg-[#F5EEFD] p-0.5 rounded-xl border border-[#E6D6F8] text-[11px] font-bold"
            >
              <button
                onClick={() => setLang('ua')}
                aria-pressed={isUa}
                className={`px-2 py-1 rounded-lg transition ${
                  isUa ? 'bg-[#8B5CF6] text-white' : 'text-[#6B5B85]'
                }`}
              >
                UA
              </button>
              <button
                onClick={() => setLang('en')}
                aria-pressed={!isUa}
                className={`px-2 py-1 rounded-lg transition ${
                  !isUa ? 'bg-[#8B5CF6] text-white' : 'text-[#6B5B85]'
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
                {isUa ? 'Увійти / Реєстрація' : 'Login / Sign Up'}
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-[#F5EEFD] pl-2.5 pr-1 py-1 rounded-2xl border border-[#DFCCF5]">
                <div className="text-right hidden sm:block">
                  <div className="text-[11px] font-bold text-[#2D1B4E] leading-tight">{currentUser.name}</div>
                  <div className="text-[9px] font-extrabold uppercase text-[#9333EA]">
                    {currentUser.role === 'admin'
                      ? isUa
                        ? 'Керівник / Admin'
                        : 'Project Lead / Admin'
                      : isUa
                        ? 'Виконавець / Учасник'
                        : 'Executor / Applicant'}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-600 text-[11px] font-semibold text-[#5B467A] border border-[#E6D6F8]"
                >
                  {isUa ? 'Вийти' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sub-nav */}
        <div className="flex lg:hidden overflow-x-auto gap-1.5 px-4 pb-3">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                activeTab === tab.id ? 'bg-[#8B5CF6] text-white' : 'bg-white text-[#5B467A] border border-[#E6D6F8]'
              }`}
            >
              {tab.label}
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
                Communications Engineering &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#D946EF]">
                  Data Science (CoDaS)
                </span>
              </h1>

              <p className="text-[#5B467A] text-sm sm:text-base leading-relaxed max-w-2xl">
                {isUa
                  ? 'Офіційна платформа звітності та академічної мобільності спільного магістерського проєкту ЄС: робочі пакети, публікації (DOI), заходи, KPI та відбір кандидатів.'
                  : 'Official reporting and academic mobility platform of the EU Joint Master project: work packages, DOI publications, events, KPIs, and candidate selection.'}
              </p>
            </div>

            <div className="shrink-0 rounded-2xl bg-white/90 border border-[#E2D0F8] p-4 min-w-[250px] space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#6B5B85]">
                <span>{isUa ? 'Рівень доступу (RBAC)' : 'Access Role (RBAC)'}</span>
                <span className="text-[#7E22CE] font-bold">● Online</span>
              </div>
              <div className="text-sm font-extrabold text-[#2D1B4E]">
                {role === 'public' && (isUa ? 'Відвідувач (Публічний звіт)' : 'Public Visitor (Read-Only)')}
                {role === 'applicant' && (
                  <span className="text-[#C026D3]">{isUa ? 'Виконавець / Учасник' : 'Executor / Applicant'}</span>
                )}
                {role === 'admin' && (
                  <span className="text-[#7C3AED]">{isUa ? 'Керівник проєкту / Адмін' : 'Project Lead / Admin'}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 1. OVERVIEW (PROJECT PASSPORT) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: isUa ? 'Код / Програма' : 'Grant / Programme',
                  value: '101082451 / EMJM',
                  sub: 'Erasmus+ Key Action 2',
                  accent: 'from-[#8B5CF6] to-[#A855F7]',
                },
                {
                  label: isUa ? 'Терміни виконання' : 'Implementation Period',
                  value: '2023 – 2027',
                  sub: isUa ? '48 місяців (Етап 3)' : '48 Months (Phase 3)',
                  accent: 'from-[#C084FC] to-[#E879F9]',
                },
                {
                  label: isUa ? 'Бюджет гранту ЄС' : 'EU Grant Budget',
                  value: '€ 4,860,000',
                  sub: 'European Commission (EACEA)',
                  accent: 'from-[#A78BFA] to-[#F472B6]',
                },
                {
                  label: isUa ? 'Виконання KPI' : 'KPI Achievement',
                  value: `${kpiProgress}%`,
                  sub: isUa ? `${116 + approvedCount}/120 студентів` : `${116 + approvedCount}/120 students enrolled`,
                  accent: 'from-[#7C3AED] to-[#D946EF]',
                },
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
                {isUa ? 'Анотація, мета та завдання проєкту' : 'Project Abstract, Goal & Objectives'}
              </span>
              <h2 className="text-2xl font-bold text-[#2D1B4E]">
                Communications Engineering and Data Science (CoDaS)
              </h2>
              <p className="text-[#5B467A] text-sm sm:text-base leading-relaxed">
                {isUa
                  ? 'Міжнародний науково-освітній проєкт спрямований на підготовку магістрів та проведення спільних досліджень у галузі телекомунікаційних мереж 5G/6G, хмарних обчислень, кібербезпеки та науки про дані (Data Science). Програма реалізується консорціумом 4 провідних технічних університетів Європи.'
                  : 'An international research and educational initiative aimed at training MSc specialists and conducting joint research in 5G/6G telecommunication networks, cloud computing, cybersecurity, and Data Science across 4 leading European technical universities.'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                  <div className="font-bold text-sm text-[#7E22CE]">
                    {isUa ? 'Завдання 1: Мобільність 120 ECTS' : 'Objective 1: 120 ECTS Mobility'}
                  </div>
                  <p className="text-xs text-[#6B5B85] mt-1">
                    {isUa
                      ? 'Навчання за системою подвійних дипломів у двох країнах ЄС.'
                      : 'Double-degree master studies across two EU partner universities.'}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                  <div className="font-bold text-sm text-[#7E22CE]">
                    {isUa ? 'Завдання 2: Відкрита наука' : 'Objective 2: Open Science'}
                  </div>
                  <p className="text-xs text-[#6B5B85] mt-1">
                    {isUa
                      ? 'Публікація результатів досліджень у виданнях Scopus та Web of Science.'
                      : 'Publishing open-access research results in Scopus and Web of Science.'}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                  <div className="font-bold text-sm text-[#7E22CE]">
                    {isUa ? 'Завдання 3: Індустріальне R&D' : 'Objective 3: Industrial R&D'}
                  </div>
                  <p className="text-xs text-[#6B5B85] mt-1">
                    {isUa
                      ? 'Спільні проєкти з Nokia, Ericsson, Siemens та телеком-операторами.'
                      : 'Joint R&D projects with Nokia, Ericsson, Siemens, and telecom operators.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TEAM & CONSORTIUM */}
        {activeTab === 'team' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#2D1B4E]">
                {isUa ? 'Ключові виконавці проєкту (ORCID та афіліація)' : 'Project Team Members (ORCID & Affiliation)'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    name: 'Prof. Jussi Korhonen',
                    role: isUa ? 'Координатор проєкту (Lead)' : 'Project Coordinator (Lead)',
                    uni: 'Aalto University (FI)',
                    orcid: '0000-0002-1825-0097',
                  },
                  {
                    name: 'Dr. Laurent Moreau',
                    role: isUa ? 'Керівник WP3 (Мобільність)' : 'WP3 Lead (Mobility)',
                    uni: 'Grenoble INP – UGA (FR)',
                    orcid: '0000-0001-5109-3700',
                  },
                  {
                    name: 'Prof. Markus Weber',
                    role: isUa ? 'Керівник WP2 (Акредитація)' : 'WP2 Lead (Accreditation)',
                    uni: 'TU Braunschweig (DE)',
                    orcid: '0000-0003-2419-8821',
                  },
                  {
                    name: 'Dr. Elena García',
                    role: isUa ? 'Керівник WP4 (Open Science)' : 'WP4 Lead (Open Science)',
                    uni: 'UPC Barcelona (ES)',
                    orcid: '0000-0002-9410-5514',
                  },
                ].map((member, i) => (
                  <div key={i} className="rounded-2xl bg-white/90 border border-[#E2D0F8] p-5 space-y-2 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#E879F9] text-white font-bold text-xs flex items-center justify-center">
                      {member.name
                        .split(' ')
                        .slice(1)
                        .map((n) => n[0])
                        .join('')}
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

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#2D1B4E]">
                {isUa ? 'Університети-партнери консорціуму' : 'Consortium Partner Universities'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    name: 'Aalto University',
                    country: isUa ? 'Фінляндія • Координатор' : 'Finland • Coordinator',
                    code: 'FI',
                    dept: 'Department of Information and Communications Engineering',
                    focus: '5G/6G Wireless Systems, Autonomous Networks, Signal Processing',
                  },
                  {
                    name: 'Grenoble INP – UGA',
                    country: isUa ? 'Франція • Партнер' : 'France • Partner',
                    code: 'FR',
                    dept: 'École nationale supérieure d’informatique et de mathématiques appliquées',
                    focus: 'Data Science, Distributed Systems, Edge AI & Cybersecurity',
                  },
                  {
                    name: 'Technische Universität Braunschweig',
                    country: isUa ? 'Німеччина • Партнер' : 'Germany • Partner',
                    code: 'DE',
                    dept: 'Institute for Communications Technology (IfN)',
                    focus: 'Vehicular Communications, Optical Networks, IoT Telemetry',
                  },
                  {
                    name: 'Universitat Politècnica de Catalunya (UPC)',
                    country: isUa ? 'Іспанія • Асоційований партнер' : 'Spain • Associated Partner',
                    code: 'ES',
                    dept: 'Barcelona School of Telecommunications Engineering',
                    focus: 'Smart Cities, Cloud-Native Core Networks, Big Data Analytics',
                  },
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
                <h2 className="text-xl font-bold text-[#2D1B4E]">
                  {isUa
                    ? 'Робочі пакети (WP) та заплановані результати (Deliverables)'
                    : 'Work Packages (WP) & Planned Deliverables'}
                </h2>
                <p className="text-xs text-[#6B5B85] mt-0.5">
                  {isUa
                    ? 'Статус виконання та дедлайни за грантовою угодою'
                    : 'Execution status and deadlines under the Grant Agreement'}
                </p>
              </div>
              {role === 'admin' && (
                <span className="text-xs font-bold text-[#9333EA]">
                  {isUa ? 'Режим редагування активний' : 'Edit mode active'}
                </span>
              )}
            </div>
            <div className="divide-y divide-[#EFE5FA]">
              {workPackagesData.map((wp, i) => (
                <div key={wp.code} className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F3E8FF] text-[#7E22CE]">{wp.code}</span>
                      <span className="font-bold text-[#2D1B4E]">{wp.title}</span>
                    </div>
                    <div className="text-xs text-[#5B467A]">
                      <strong>{isUa ? 'Результат:' : 'Deliverable:'}</strong> {wp.deliverable} •{' '}
                      <strong>{isUa ? 'Термін:' : 'Deadline:'}</strong> {wp.deadline} •{' '}
                      <strong>{isUa ? 'Лідер:' : 'Lead:'}</strong> {wp.lead}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-[#EFE5FA] rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] h-full" style={{ width: `${wp.progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-[#2D1B4E] w-10">{wp.progress}%</span>
                    {role === 'admin' && (
                      <div className="flex gap-1">
                        <button
                          aria-label={`Decrease ${wp.code}`}
                          onClick={() => handleUpdateWpProgress(i, -5)}
                          className="w-7 h-7 rounded-lg bg-[#F3E8FF] text-[#6B21A8] text-xs font-bold"
                        >
                          -
                        </button>
                        <button
                          aria-label={`Increase ${wp.code}`}
                          onClick={() => handleUpdateWpProgress(i, 5)}
                          className="w-7 h-7 rounded-lg bg-[#8B5CF6] text-white text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. PUBLICATIONS WITH CROSSREF DOI AUTOFILL & MULTI-FILTERS */}
        {activeTab === 'publications' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <input
                type="text"
                aria-label={isUa ? 'Пошук публікацій' : 'Search publications'}
                placeholder={isUa ? 'Пошук за назвою, автором або DOI...' : 'Search by title, author, or DOI...'}
                value={pubSearch}
                onChange={(e) => setPubSearch(e.target.value)}
                className="md:col-span-5 px-4 py-2.5 rounded-2xl bg-white/90 border border-[#DFCCF5] text-sm text-[#2D1B4E]"
              />
              <select
                aria-label={isUa ? 'Фільтр за роком' : 'Filter by year'}
                value={pubYearFilter}
                onChange={(e) => setPubYearFilter(e.target.value)}
                className="md:col-span-2 px-3 py-2.5 rounded-2xl bg-white/90 border border-[#DFCCF5] text-xs font-semibold text-[#4C3575]"
              >
                <option value="all">{isUa ? 'Усі роки' : 'All Years'}</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
              <select
                aria-label={isUa ? 'Фільтр за типом' : 'Filter by type'}
                value={pubTypeFilter}
                onChange={(e) => setPubTypeFilter(e.target.value)}
                className="md:col-span-2 px-3 py-2.5 rounded-2xl bg-white/90 border border-[#DFCCF5] text-xs font-semibold text-[#4C3575]"
              >
                <option value="all">{isUa ? 'Усі типи' : 'All Types'}</option>
                <option value="Article">{isUa ? 'Статті' : 'Articles'}</option>
                <option value="Conference">{isUa ? 'Тези' : 'Conference'}</option>
                <option value="Monograph">{isUa ? 'Монографії' : 'Monographs'}</option>
              </select>
              <div className="md:col-span-3 flex items-center justify-between bg-white/90 p-1 rounded-2xl border border-[#DFCCF5] text-xs font-semibold">
                {(['all', 'Scopus', 'WoS'] as const).map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setPubIndexFilter(idx)}
                    className={`flex-1 py-1.5 rounded-xl transition ${
                      pubIndexFilter === idx ? 'bg-[#8B5CF6] text-white' : 'text-[#6B5B85]'
                    }`}
                  >
                    {idx === 'all' ? (isUa ? 'Усі' : 'All') : idx}
                  </button>
                ))}
              </div>
            </div>

            {(role === 'applicant' || role === 'admin') && (
              <form onSubmit={handleAddPublication} className="rounded-3xl bg-white/90 border border-[#D8B4FE] p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-sm font-bold text-[#7E22CE]">
                    {isUa
                      ? '+ Додати публікацію (автозаповнення через Crossref REST API)'
                      : '+ Add Publication (Crossref REST API DOI Autofill)'}
                  </div>
                  <span className="text-[11px] text-[#6B5B85]">
                    {isUa ? 'Приклад DOI: 10.1109/5.771073' : 'Sample DOI: 10.1109/5.771073'}
                  </span>
                </div>

                {/* DOI Input + Autofill Button */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    placeholder="DOI (e.g. 10.1109/5.771073)"
                    value={newPubDoi}
                    onChange={(e) => setNewPubDoi(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                  />
                  <button
                    type="button"
                    onClick={handleFetchDoiMetadata}
                    disabled={isFetchingDoi}
                    className="px-4 py-2 rounded-xl bg-[#F3E8FF] hover:bg-[#E9D5FF] border border-[#D8B4FE] text-[#6B21A8] text-xs font-bold transition"
                  >
                    {isFetchingDoi
                      ? isUa
                        ? 'Пошук у Crossref...'
                        : 'Fetching Crossref...'
                      : isUa
                        ? '⚡ Заповнити за DOI'
                        : '⚡ Autofill by DOI'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    placeholder={isUa ? 'Назва публікації...' : 'Publication title...'}
                    value={newPubTitle}
                    onChange={(e) => setNewPubTitle(e.target.value)}
                    className="sm:col-span-2 px-4 py-2 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                  />
                  <input
                    type="text"
                    placeholder={isUa ? 'Автори (J. Korhonen...)' : 'Authors (J. Korhonen...)'}
                    value={newPubAuthors}
                    onChange={(e) => setNewPubAuthors(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                  />
                  <input
                    type="text"
                    placeholder={isUa ? 'Видання / Конференція' : 'Journal / Conference'}
                    value={newPubVenue}
                    onChange={(e) => setNewPubVenue(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder={isUa ? 'Рік (2026)' : 'Year (2026)'}
                    value={newPubYear}
                    onChange={(e) => setNewPubYear(e.target.value)}
                    className="px-4 py-2 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                  />
                  <select
                    value={newPubType}
                    onChange={(e) => setNewPubType(e.target.value as PublicationItem['pubType'])}
                    className="px-4 py-2 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                  >
                    <option value="Article">{isUa ? 'Стаття' : 'Journal Article'}</option>
                    <option value="Conference">{isUa ? 'Тези конференції' : 'Conference Paper'}</option>
                    <option value="Monograph">{isUa ? 'Монографія' : 'Monograph'}</option>
                  </select>
                  <select
                    value={newPubIndex}
                    onChange={(e) => setNewPubIndex(e.target.value as 'Scopus' | 'WoS')}
                    className="px-4 py-2 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                  >
                    <option value="Scopus">Scopus</option>
                    <option value="WoS">Web of Science</option>
                  </select>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold">
                    {isUa ? 'Зберегти публікацію' : 'Save Publication'}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {filteredPublications.map((pub, i) => (
                <div key={i} className="rounded-2xl bg-white/90 border border-[#E2D0F8] p-5 flex flex-col sm:flex-row justify-between gap-4 shadow-sm">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#F3E8FF] text-[#7E22CE]">
                        {pub.indexation} • {pub.year}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF7FE] border border-[#E6D6F8] text-[#5B467A]">
                        {getPubTypeLabel(pub.pubType)}
                      </span>
                    </div>
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

        {/* 5. EVENTS, BILINGUAL NEWS & ALUMNI REVIEWS */}
        {activeTab === 'events_news' && (
          <div className="space-y-8">
            <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-5 shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">
                  {isUa ? 'Академічний календар' : 'Academic Calendar'}
                </span>
                <h2 className="text-xl font-bold text-[#2D1B4E]">
                  {isUa ? 'Конференції, семінари та воркшопи' : 'Conferences, Seminars & Workshops'}
                </h2>
              </div>

              {(role === 'applicant' || role === 'admin') && (
                <form onSubmit={handleAddEvent} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                  <input
                    type="text"
                    placeholder={isUa ? 'Назва заходу...' : 'Event title...'}
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                  />
                  <input
                    type="text"
                    placeholder={isUa ? 'Дата (15.12.2026)' : 'Date (15.12.2026)'}
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                  />
                  <button type="submit" className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold">
                    {isUa ? '+ Додати захід' : '+ Add Event'}
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {events.map((ev, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8] space-y-2">
                    <span className="text-[11px] font-bold text-[#9333EA]">{isUa ? ev.typeUa : ev.typeEn}</span>
                    <h3 className="font-bold text-sm text-[#2D1B4E]">{ev.title}</h3>
                    <div className="text-xs text-[#6B5B85]">📅 {ev.date} • 📍 {ev.location}</div>
                    <div className="text-xs font-semibold text-[#4C3575]">
                      {isUa ? `Учасників: ${ev.participants} осіб` : `Participants: ${ev.participants}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-[#2D1B4E]">
                  {isUa ? 'Останні новини проєкту (UA / EN)' : 'Latest Project News (UA / EN)'}
                </h3>

                {role === 'admin' && (
                  <form onSubmit={handleAddNews} className="p-4 rounded-2xl bg-[#FAF7FE] border border-[#D8B4FE] space-y-2.5">
                    <div className="text-xs font-bold text-[#7E22CE]">
                      {isUa ? '+ Опублікувати двомовну новину' : '+ Publish Bilingual News'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Заголовок (UA)"
                        value={newsTitleUa}
                        onChange={(e) => setNewsTitleUa(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Title (EN)"
                        value={newsTitleEn}
                        onChange={(e) => setNewsTitleEn(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Текст новини (UA)"
                        value={newsTextUa}
                        onChange={(e) => setNewsTextUa(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                      />
                      <input
                        type="text"
                        placeholder="News summary (EN)"
                        value={newsTextEn}
                        onChange={(e) => setNewsTextEn(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                      />
                    </div>
                    <button type="submit" className="px-4 py-1.5 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold">
                      {isUa ? 'Додати новину' : 'Publish News'}
                    </button>
                  </form>
                )}

                <div className="space-y-3">
                  {newsList.map((n, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                      <div className="text-[11px] text-[#9333EA] font-bold">{n.date}</div>
                      <div className="font-bold text-sm text-[#2D1B4E] mt-0.5">{isUa ? n.titleUa : n.titleEn}</div>
                      <p className="text-xs text-[#6B5B85] mt-1">{isUa ? n.textUa : n.textEn}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-[#2D1B4E]">
                  {isUa ? 'Відгуки учасників програми мобільності' : 'Alumni & Student Testimonials'}
                </h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F5EEFD] to-[#FAE8FF] border border-[#E2D0F8]">
                    <p className="text-xs italic text-[#4C3575]">
                      {isUa
                        ? '«Перший рік в Aalto University дав потужну базу з 5G/6G, а другий у Grenoble INP — реальний досвід у лабораторіях Edge AI. Захистила диплом із двома європейськими ступенями!»'
                        : '“The first year at Aalto University provided a strong foundation in 5G/6G, while the second at Grenoble INP gave hands-on experience in Edge AI labs. Graduated with two European MSc degrees!”'}
                    </p>
                    <div className="mt-2 text-xs font-bold text-[#2D1B4E]">
                      {isUa
                        ? 'Анастасія Демчук • Випускниця Cohort 1 (Aalto → Grenoble INP)'
                        : 'Anastasiia Demchuk • Cohort 1 Alumna (Aalto → Grenoble INP)'}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F5EEFD] to-[#FAE8FF] border border-[#E2D0F8]">
                    <p className="text-xs italic text-[#4C3575]">
                      {isUa
                        ? '«Завдяки індустріальному стажуванню в межах проєкту CoDaS я опублікував статтю на конференції IEEE та отримав офер R&D-інженера ще до випуску.»'
                        : '“Thanks to the industrial internship within CoDaS, I published a paper at an IEEE conference and received an R&D Engineer job offer prior to graduation.”'}
                    </p>
                    <div className="mt-2 text-xs font-bold text-[#2D1B4E]">
                      {isUa
                        ? 'Олександр Ткаченко • Випускник Cohort 1 (TU Braunschweig → UPC)'
                        : 'Oleksandr Tkachenko • Cohort 1 Alumnus (TU Braunschweig → UPC)'}
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
            {role === 'public' && (
              <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-8 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
                <div className="text-2xl">🔒</div>
                <h2 className="text-xl font-black text-[#2D1B4E]">
                  {isUa ? 'Подача кандидатури на програму CoDaS' : 'Submit Candidacy to CoDaS Programme'}
                </h2>
                <p className="text-xs sm:text-sm text-[#5B467A]">
                  {isUa
                    ? 'Авторизуйтесь або зареєструйтесь як учасник, щоб подати анкету кандидата на стипендію або перейти до кабінету керівника.'
                    : 'Please sign in or register as a participant to submit a scholarship application or access the admin panel.'}
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#D946EF] text-white text-xs font-bold"
                  >
                    {isUa ? 'Реєстрація учасника' : 'Register as Participant'}
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#F5EEFD] border border-[#DFCCF5] text-[#4C3575] text-xs font-semibold"
                  >
                    {isUa ? 'Увійти в кабінет' : 'Sign In'}
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
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C026D3]">
                    {isUa ? 'Кабінет кандидата' : 'Applicant Dashboard'}
                  </span>
                  <h2 className="text-xl font-bold text-[#2D1B4E]">
                    {isUa ? 'Подача кандидатури на програму CoDaS' : 'Submit Application to CoDaS'}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">
                        {isUa ? 'ПІБ Кандидата *' : 'Candidate Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isUa ? "Введіть ваше прізвище та ім'я" : 'Enter your full name'}
                        value={appFullName}
                        onChange={(e) => setAppFullName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">
                        {isUa ? 'Контактний Email *' : 'Contact Email *'}
                      </label>
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
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">
                        {isUa ? 'Університет та спеціальність *' : 'Home University & Major *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isUa ? 'Напр.: ЗУНУ, Інженерія ПЗ' : 'e.g. WUNU, Software Engineering'}
                        value={appUniversity}
                        onChange={(e) => setAppUniversity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">
                        {isUa ? 'Середній бал (GPA) *' : 'GPA Score *'}
                      </label>
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
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">
                        {isUa ? 'Трек мобільності *' : 'Mobility Track *'}
                      </label>
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
                      <label className="block text-xs font-semibold text-[#4C3575] mb-1">
                        {isUa ? 'Посилання на GitHub / CV' : 'GitHub / CV Link'}
                      </label>
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
                    <label className="block text-xs font-semibold text-[#4C3575] mb-1">
                      {isUa ? 'Мотиваційний лист *' : 'Motivation Statement *'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={isUa ? 'Опишіть ваш досвід та наукові інтереси...' : 'Describe your experience and research interests...'}
                      value={appMotivation}
                      onChange={(e) => setAppMotivation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-sm text-[#2D1B4E]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white text-sm font-extrabold shadow-md shadow-purple-300"
                  >
                    {isUa ? 'Надіслати кандидатуру' : 'Submit Candidacy'}
                  </button>
                </form>

                <div className="lg:col-span-2 rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 space-y-3 shadow-sm">
                  <h3 className="text-lg font-bold text-[#2D1B4E]">
                    {isUa ? 'Подані заявки' : 'Submitted Applications'}
                  </h3>
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
                            {item.status === 'approved'
                              ? isUa
                                ? '✓ Схвалено'
                                : '✓ Approved'
                              : item.status === 'rejected'
                                ? isUa
                                  ? '✕ Відхилено'
                                  : '✕ Rejected'
                                : isUa
                                  ? '⏳ На розгляді'
                                  : '⏳ Pending'}
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
                    <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">
                      {isUa ? 'Панель керівника / Admin' : 'Selection Committee Panel (Admin)'}
                    </span>
                    <h2 className="text-xl font-bold text-[#2D1B4E]">
                      {isUa ? 'Фільтрація та модерація заявок кандидатів' : 'Candidate Application Filtering & Moderation'}
                    </h2>
                  </div>
                  <div className="flex gap-2 text-xs font-semibold">
                    <span className="px-3 py-1 rounded-xl bg-[#F5EEFD] text-[#4C3575]">
                      {isUa ? `Усього: ${applications.length}` : `Total: ${applications.length}`}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800">
                      {isUa ? `Схвалено: ${approvedCount}` : `Approved: ${approvedCount}`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#F7F2FC] border border-[#E5D5F7]">
                  <input
                    type="text"
                    placeholder={isUa ? 'Пошук за ПІБ або ВНЗ...' : 'Search by name or university...'}
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                  >
                    <option value="all">{isUa ? 'Усі статуси' : 'All Statuses'}</option>
                    <option value="pending">{isUa ? '⏳ На розгляді' : '⏳ Pending'}</option>
                    <option value="approved">{isUa ? '✓ Схвалені' : '✓ Approved'}</option>
                    <option value="rejected">{isUa ? '✕ Відхилені' : '✕ Rejected'}</option>
                  </select>
                  <select
                    value={filterTrack}
                    onChange={(e) => setFilterTrack(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                  >
                    <option value="all">{isUa ? 'Усі треки мобільності' : 'All Mobility Tracks'}</option>
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
                          {isUa ? '✓ Схвалити' : '✓ Approve'}
                        </button>
                        <button
                          onClick={() => handleApplicationStatus(app.id, 'rejected')}
                          className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold"
                        >
                          {isUa ? '✕ Відхилити' : '✕ Reject'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Development Ideas */}
            <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">Product Backlog</span>
                <h2 className="text-xl font-bold text-[#2D1B4E]">
                  {isUa ? 'Ідеї та пропозиції для розвитку проєкту CoDaS' : 'Development Ideas & Community Proposals'}
                </h2>
                <p className="text-xs text-[#6B5B85] mt-1">
                  {isUa
                    ? 'Кожен відвідувач або учасник може запропонувати ідею нового воркшопу чи дослідження, а керівник — схвалити її до плану наступного спринту.'
                    : 'Any visitor or participant can propose a new workshop or research topic, and the project lead can approve it into the next sprint backlog.'}
                </p>
              </div>

              <form onSubmit={handleIdeaSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                <input
                  type="text"
                  required
                  placeholder={isUa ? "Ваше ім'я" : 'Your name'}
                  value={ideaAuthor}
                  onChange={(e) => setIdeaAuthor(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                />
                <select
                  value={ideaCategory}
                  onChange={(e) => setIdeaCategory(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                >
                  <option value="R&D / Workshop">R&amp;D / Workshop</option>
                  <option value="Curriculum Module">Curriculum Module</option>
                  <option value="Industry Partnership">Industry Partnership</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder={isUa ? 'Назва ідеї...' : 'Idea title...'}
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  className="sm:col-span-2 px-3.5 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder={isUa ? 'Короткий опис цінності для проєкту...' : 'Short description of project value...'}
                  value={ideaDesc}
                  onChange={(e) => setIdeaDesc(e.target.value)}
                  className="sm:col-span-3 px-3.5 py-2 rounded-xl bg-white border border-[#DFCCF5] text-xs"
                />
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold">
                  {isUa ? '+ Запропонувати ідею' : '+ Submit Idea'}
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
                          {idea.status === 'accepted'
                            ? isUa
                              ? '✓ Взято в план розвитку'
                              : '✓ Accepted to Backlog'
                            : isUa
                              ? 'Нова пропозиція'
                              : 'New Proposal'}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-[#2D1B4E] mt-1">{idea.title}</h3>
                      <p className="text-xs text-[#6B5B85] mt-1">{idea.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#EFE5FA] text-[11px] text-[#6B5B85]">
                      <span>{isUa ? `Автор: ${idea.author}` : `Author: ${idea.author}`}</span>
                      {role === 'admin' && idea.status !== 'accepted' && (
                        <button
                          onClick={() => handleAcceptIdea(idea.id)}
                          className="px-3 py-1 rounded-lg bg-[#8B5CF6] text-white font-bold"
                        >
                          {isUa ? 'Схвалити в беклог' : 'Approve to Backlog'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. REPORTS & KPI WITH CUSTOM DATE RANGE REPORT BUILDER */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#2D1B4E]">
                    {isUa ? 'Показники ефективності проєкту (KPI)' : 'Project Key Performance Indicators (KPI)'}
                  </h2>
                  <p className="text-xs text-[#6B5B85]">
                    {isUa
                      ? 'Порівняння планових і фактичних значень грантової угоди'
                      : 'Planned vs. actual Grant Agreement indicators'}
                  </p>
                </div>
                {role === 'admin' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#7E22CE]">KPI:</span>
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
                  <div className="text-xs text-[#6B5B85]">
                    {isUa ? 'Зараховані студенти (План: 120)' : 'Enrolled Students (Target: 120)'}
                  </div>
                  <div className="text-3xl font-black text-[#2D1B4E] mt-1">{116 + approvedCount} / 120</div>
                  <div className="text-xs text-emerald-700 font-semibold mt-1">
                    {isUa ? '98.3% виконання плану' : '98.3% target achieved'}
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                  <div className="text-xs text-[#6B5B85]">
                    {isUa ? 'Статті Scopus / WoS (План: 20)' : 'Scopus / WoS Papers (Target: 20)'}
                  </div>
                  <div className="text-3xl font-black text-[#2D1B4E] mt-1">{publications.length + 21}</div>
                  <div className="text-xs text-[#7E22CE] font-semibold mt-1">
                    {isUa ? 'Перевиконання на +20%' : '+20% above target'}
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8]">
                  <div className="text-xs text-[#6B5B85]">
                    {isUa ? 'Проведені заходи (План: 12)' : 'Completed Events (Target: 12)'}
                  </div>
                  <div className="text-3xl font-black text-[#2D1B4E] mt-1">{events.length + 8} / 12</div>
                  <div className="text-xs text-[#7E22CE] font-semibold mt-1">
                    {isUa ? 'За графіком консорціуму' : 'On consortium schedule'}
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Period Report Builder (Release 1.0 Requirement) */}
            <div className="rounded-3xl bg-white/90 border border-[#D8B4FE] p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9333EA]">
                    {isUa ? 'Конструктор звітності (Реліз 1.0)' : 'Report Builder (Release 1.0)'}
                  </span>
                  <h2 className="text-xl font-bold text-[#2D1B4E]">
                    {isUa ? 'Формування зведення за обраний період' : 'Generate Custom Period Summary Report'}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="date"
                    aria-label={isUa ? 'Початкова дата' : 'Start date'}
                    value={reportStartDate}
                    onChange={(e) => setReportStartDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-xs font-semibold text-[#2D1B4E]"
                  />
                  <span className="text-xs text-[#6B5B85]">—</span>
                  <input
                    type="date"
                    aria-label={isUa ? 'Кінцева дата' : 'End date'}
                    value={reportEndDate}
                    onChange={(e) => setReportEndDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7FE] border border-[#DFCCF5] text-xs font-semibold text-[#2D1B4E]"
                  />
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#C084FC] text-white text-xs font-bold hover:opacity-95 shadow-sm"
                  >
                    {isUa ? '🖨 Експорт зведення у PDF' : '🖨 Export Summary PDF'}
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7FE] border border-[#E6D6F8] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[#6B5B85] block">
                    {isUa ? 'Обраний період звітування:' : 'Selected Reporting Period:'}
                  </span>
                  <strong className="text-sm text-[#2D1B4E]">{reportStartDate} → {reportEndDate}</strong>
                </div>
                <div>
                  <span className="text-[#6B5B85] block">
                    {isUa ? 'Включено до звіту:' : 'Included in Summary:'}
                  </span>
                  <strong className="text-sm text-[#7E22CE]">
                    {isUa
                      ? `${publications.length} публікацій • ${events.length} заходів • 5 WP`
                      : `${publications.length} publications • ${events.length} events • 5 WPs`}
                  </strong>
                </div>
                <div>
                  <span className="text-[#6B5B85] block">
                    {isUa ? 'Середній прогрес робочих пакетів:' : 'Average Work Package Progress:'}
                  </span>
                  <strong className="text-sm text-emerald-700">
                    {Math.round(wpProgressList.reduce((a, b) => a + b, 0) / wpProgressList.length)}%
                  </strong>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white/90 border border-[#E2D0F8] p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-[#2D1B4E]">
                {isUa ? 'Архів офіційних звітів консорціуму (PDF)' : 'Official Consortium Reports Archive (PDF)'}
              </h2>
              <div className="divide-y divide-[#EFE5FA]">
                {[
                  {
                    name: isUa
                      ? 'Періодичний звіт №1 (Технічний та фінансовий)'
                      : 'Periodic Report #1 (Technical & Financial)',
                    period: '01.09.2023 – 31.08.2024',
                    status: isUa ? 'Прийнято EACEA' : 'Accepted by EACEA',
                  },
                  {
                    name: isUa
                      ? 'Проміжний звіт №2 (Mid-Term Consortium Report)'
                      : 'Interim Report #2 (Mid-Term Consortium Report)',
                    period: '01.09.2024 – 31.08.2025',
                    status: isUa ? 'Прийнято EACEA' : 'Accepted by EACEA',
                  },
                  {
                    name: isUa
                      ? 'Поточний звіт за 2026 рік (WP1–WP5 & KPI)'
                      : 'Current Annual Report 2026 (WP1–WP5 & KPI)',
                    period: '01.09.2025 – 23.11.2026',
                    status: isUa ? 'На перевірці керівника' : 'Under Lead Review',
                  },
                ].map((rep, i) => (
                  <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm text-[#2D1B4E]">{rep.name}</div>
                      <div className="text-xs text-[#6B5B85]">
                        {isUa ? `Звітний період: ${rep.period}` : `Reporting period: ${rep.period}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F3E8FF] text-[#7E22CE]">
                        {rep.status}
                      </span>
                      <button
                        onClick={() => window.print()}
                        className="text-xs font-bold text-[#9333EA] hover:underline"
                      >
                        {isUa ? 'Завантажити PDF ↓' : 'Download PDF ↓'}
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
          <div>
            © 2026 CoDaS Consortium (Communications Engineering &amp; Data Science).{' '}
            {isUa ? 'Усі права захищено.' : 'All rights reserved.'}
          </div>
          <div className="text-[#8E7AA8]">Co-funded by the Erasmus+ Programme of the European Union</div>
        </div>
      </footer>
    </div>
  );
}
