// src/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { fetchDashboardStats } from './mockApi';
import type { AuthProps, DashboardStats } from './apiTypes';

// --- IMAGE IMPORTS ---
import logoImg from './assets/logo.png';          // Big Text Logo
import wolfBlack from './assets/wolf-black.jpeg'; // Light Mode Wolf
import wolfWhite from './assets/wolf-white.jpeg'; // Dark Mode Wolf

// --- THEME & BRAND CONFIG ---
const BRAND_GRADIENT = 'linear-gradient(135deg, #702ABD 0%, #305FB3 60%, #2F7EC0 100%)';

type Theme = {
  mode: 'light' | 'dark';
  bg: string;
  bgLighter: string;
  text: string;
  textSecondary: string;
  border: string;
  cardBg: string;
  sidebarBg: string;
};

const themes = {
  light: {
    mode: 'light',
    bg: '#F3F4F6',
    bgLighter: '#ffffff',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    cardBg: '#ffffff',
    sidebarBg: '#ffffff',
  },
  dark: {
    mode: 'dark',
    bg: '#0B1120', 
    bgLighter: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
    cardBg: '#151d2e',
    sidebarBg: '#0f1623', 
  },
} as const;

// --- Main Dashboard Component ---
const Dashboard: React.FC<AuthProps> = ({ setAuth }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const theme = themes[themeMode];

  useEffect(() => {
    fetchDashboardStats().then((data) => setStats(data));
  }, []);

  if (!stats) return <div style={{...styles.loading, background: theme.bg, color: theme.text}}>Loading ScalingWolf...</div>;

  return (
    <div style={{...styles.layout, backgroundColor: theme.bg}}>
      
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} theme={theme} />

      {/* MAIN CONTENT */}
      <div style={styles.mainWrapper}>
        <Topbar 
          theme={theme}
          toggleTheme={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={() => setAuth(false)}
        />

        <main style={{...styles.contentArea, color: theme.text}}>
          <div style={styles.header}>
            <h1 style={{margin:0, fontSize:'2rem', fontWeight:700}}>Dashboard Overview</h1>
            <p style={{color: theme.textSecondary, marginTop:'5px'}}>Welcome back, Admin</p>
          </div>

          <div style={styles.grid}>
            {/* Highlight Card (Gradient) */}
            <div style={{...styles.card, background: BRAND_GRADIENT, border: 'none', color: 'white'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                  <div>
                    <p style={{margin:0, opacity:0.9, fontSize:'0.9rem'}}>TOTAL USERS</p>
                    <h2 style={{margin:'5px 0 0 0', fontSize:'2.5rem'}}>{stats.totalUsers}</h2>
                  </div>
                  <div style={{background: 'rgba(255,255,255,0.2)', padding:'10px', borderRadius:'10px'}}>
                    <UsersIcon color="#fff" />
                  </div>
               </div>
               <p style={{marginTop:'15px', fontSize:'0.85rem', opacity:0.8}}>+12% from last week</p>
            </div>

            <StatCard theme={theme} title="Basic Plan" value={stats.subscriptions.basic} color="#2F7EC0" icon={<LeafIcon />} />
            <StatCard theme={theme} title="Standard Plan" value={stats.subscriptions.standard} color="#305FB3" icon={<StarIcon />} />
            <StatCard theme={theme} title="Premium Plan" value={stats.subscriptions.premium} color="#702ABD" icon={<CrownIcon />} />
          </div>

          <div style={{...styles.analyticsBox, backgroundColor: theme.cardBg, border: `1px solid ${theme.border}`}}>
            <ActivityIcon color={theme.textSecondary} />
            <h3 style={{marginTop:'15px'}}>User Growth Analytic</h3>
            <p style={{color: theme.textSecondary}}>Data visualization API connection ready.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const Sidebar: React.FC<{ isOpen: boolean, theme: Theme }> = ({ isOpen, theme }) => {
  const width = isOpen ? '300px' : '90px'; 
  
  // Logic to choose which Wolf image to show when minimized
  const collapsedLogo = theme.mode === 'light' ? wolfBlack : wolfWhite;
  
  // CSS Trick to remove background from JPEG (Multiply for white bg, Screen for black bg)
  const blendMode = theme.mode === 'light' ? 'multiply' : 'screen';

  return (
    <aside style={{...styles.sidebar, width, backgroundColor: theme.sidebarBg, borderRight: `1px solid ${theme.border}`}}>
      <div style={styles.sidebarLogo}>
        {isOpen ? (
          // EXPANDED: Show Big Text Logo
          <img 
            src={logoImg} 
            alt="ScalingWolf" 
            style={{width: '240px', height: 'auto', objectFit: 'contain'}} 
          />
        ) : (
          // MINIMIZED: Show Jumping Wolf (with background removal trick)
          <img 
            src={collapsedLogo} 
            alt="Wolf" 
            style={{
              width: '50px', 
              height: 'auto', 
              objectFit: 'contain',
              mixBlendMode: blendMode // <--- THIS REMOVES THE BACKGROUND
            }} 
          />
        )}
      </div>

      <nav style={styles.nav}>
        <SidebarLink theme={theme} text="Overview" icon={<DashboardIcon />} isOpen={isOpen} active />
        <SidebarLink theme={theme} text="Subscribers" icon={<UsersIcon />} isOpen={isOpen} />
        <SidebarLink theme={theme} text="API Keys" icon={<CodeIcon />} isOpen={isOpen} />
        <SidebarLink theme={theme} text="Settings" icon={<SettingsIcon />} isOpen={isOpen} />
      </nav>

      <div style={{...styles.sidebarFooter, borderTop: `1px solid ${theme.border}`}}>
        <div style={{width:'32px', height:'32px', borderRadius:'50%', background: BRAND_GRADIENT, display:'flex', alignItems:'center', justifyContent:'center', color: 'white', fontSize:'12px', fontWeight:'bold'}}>
           AD
        </div>
        <div style={{marginLeft:'12px', opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0, transition: 'opacity 0.3s'}}>
           <div style={{fontSize:'0.85rem', fontWeight:600, color: theme.text}}>Admin</div>
           <div style={{fontSize:'0.75rem', color: theme.textSecondary}}>admin@wolf.ai</div>
        </div>
      </div>
    </aside>
  );
};

const Topbar: React.FC<any> = ({ theme, toggleTheme, toggleSidebar, onLogout }) => (
  <header style={{...styles.topbar, background: theme.bgLighter, borderBottom: `1px solid ${theme.border}`}}>
    <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
      {/* STANDARD HAMBURGER MENU */}
      <button onClick={toggleSidebar} style={{...styles.iconBtn, color: theme.text}}>
        <MenuIcon />
      </button>
    </div>
    
    <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
      <button onClick={toggleTheme} style={{...styles.iconBtn, color: theme.text}}>
        {theme.mode === 'light' ? <MoonIcon /> : <SunIcon />}
      </button>
      <button onClick={onLogout} style={{...styles.logoutBtn, color: theme.text, borderColor: theme.border}}>
        Logout
      </button>
    </div>
  </header>
);

const SidebarLink: React.FC<any> = ({ theme, text, icon, isOpen, active }) => {
  const [hover, setHover] = useState(false);
  
  const activeStyle = {
    background: BRAND_GRADIENT,
    boxShadow: '0 4px 15px rgba(112, 42, 189, 0.3)',
    color: 'white',
    border: 'none'
  };

  const inactiveStyle = {
    color: hover ? theme.text : theme.textSecondary,
    background: hover ? 'rgba(255,255,255,0.05)' : 'transparent'
  };

  return (
    <div 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...styles.link,
        justifyContent: isOpen ? 'flex-start' : 'center',
        ...(active ? activeStyle : inactiveStyle)
    }}>
      <div style={{minWidth:'24px', display:'flex', justifyContent:'center'}}>{icon}</div>
      <span style={{...styles.linkText, opacity: isOpen ? 1 : 0, width: isOpen ? 'auto' : 0, marginLeft: isOpen ? '12px' : 0}}>
        {text}
      </span>
    </div>
  );
};

const StatCard: React.FC<any> = ({ theme, title, value, color, icon }) => (
  <div style={{...styles.card, background: theme.cardBg, border: `1px solid ${theme.border}`, color: theme.text}}>
    <div style={{display:'flex', justifyContent:'space-between'}}>
       <div>
          <p style={{margin:0, fontSize:'0.9rem', color: theme.textSecondary}}>{title}</p>
          <h3 style={{margin:'5px 0', fontSize:'2rem'}}>{value}</h3>
       </div>
       <div style={{color: color, background: `${color}15`, padding:'12px', borderRadius:'12px', height:'fit-content'}}>
          {icon}
       </div>
    </div>
    <div style={{height:'4px', width:'100%', background:`${color}20`, marginTop:'15px', borderRadius:'2px'}}>
       <div style={{height:'100%', width:'60%', background: color, borderRadius:'2px'}}></div>
    </div>
  </div>
);

// --- ICONS (SVG) ---
const MenuIcon = () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const DashboardIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const UsersIcon = ({color="currentColor"}) => <svg width="20" height="20" fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const SettingsIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const CodeIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const SunIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="19.78"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const MoonIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const LeafIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.5 2 6 0 5.5-4.5 10-10 12z"/><path d="M8 14s1.5 2 4 2.5"/></svg>;
const StarIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const CrownIcon = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>;
const ActivityIcon = ({color}:{color:string}) => <svg width="48" height="48" fill="none" stroke={color} strokeWidth="1" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;

// --- CSS STYLES ---
const styles: { [key: string]: React.CSSProperties } = {
  loading: { height: '100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif'},
  layout: { display: 'flex', minHeight: '100vh', fontFamily: '"Inter", sans-serif', transition: 'background 0.3s' },
  
  // SIDEBAR
  sidebar: { 
    display:'flex', flexDirection:'column', 
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
    overflow: 'hidden', whiteSpace: 'nowrap', 
    zIndex: 10
  },
  sidebarLogo: { 
    height: '120px', 
    display:'flex', alignItems:'center', padding:'0 24px', justifyContent: 'flex-start' 
  },
  nav: { padding: '20px 12px', flex: 1 },
  link: { 
    display: 'flex', alignItems: 'center', 
    padding: '12px 16px', margin: '8px 0', borderRadius: '12px', 
    cursor: 'pointer', transition: 'all 0.2s', height: '50px',
    fontWeight: 500
  },
  linkText: { transition:'opacity 0.2s', fontSize:'0.95rem' },
  sidebarFooter: { padding: '20px', display:'flex', alignItems:'center' },

  // MAIN LAYOUT
  mainWrapper: { flex: 1, display:'flex', flexDirection:'column', height: '100vh', overflowY:'hidden' },
  topbar: { height: '70px', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 30px', transition:'all 0.3s' },
  iconBtn: { background:'transparent', border:'none', cursor:'pointer', padding:'8px', display:'flex'},
  logoutBtn: { background:'transparent', border:'1px solid', padding:'8px 16px', borderRadius:'6px', cursor:'pointer', fontSize:'0.85rem'},

  // CONTENT AREA
  contentArea: { flex:1, padding:'30px', overflowY:'auto' },
  header: { marginBottom: '30px' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'24px' },
  
  // CARDS
  card: { padding:'24px', borderRadius:'16px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'transform 0.2s' },
  analyticsBox: { marginTop:'30px', padding:'40px', borderRadius:'16px', textAlign:'center', minHeight:'250px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}
};

export default Dashboard;