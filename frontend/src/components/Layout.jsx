import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Building2, Users, UserCog, Wrench, ShoppingCart, LogOut, Menu, X, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isRTL = i18n.language === 'ar';

  const navItemClass = (path) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
      location.pathname === path 
        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 lg:scale-[1.02]' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`;

  const NavLinks = ({ onClick = () => {} }) => (
    <>
      <Link to="/" className={navItemClass('/')} onClick={onClick}>
        <LayoutDashboard size={18} />
        {t('dashboard')}
      </Link>
      {user?.role === 'admin' && (
        <>
          <Link to="/companies" className={navItemClass('/companies')} onClick={onClick}>
            <Building2 size={18} />
            {t('companies')}
          </Link>
          <Link to="/managers" className={navItemClass('/managers')} onClick={onClick}>
            <UserCog size={18} />
            {t('managers')}
          </Link>
        </>
      )}
      {user?.role === 'company_manager' && (
        <>
          <Link to="/users" className={navItemClass('/users')} onClick={onClick}>
            <Users size={18} />
            {t('users')}
          </Link>
          <Link to="/workers" className={navItemClass('/workers')} onClick={onClick}>
            <Users size={18} />
            {t('workers')}
          </Link>
          <Link to="/machines" className={navItemClass('/machines')} onClick={onClick}>
            <Wrench size={18} />
            {t('machines')}
          </Link>
        </>
      )}
      <Link to="/pos" className={navItemClass('/pos')} onClick={onClick}>
        <ShoppingCart size={18} />
        {t('pos')}
      </Link>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16 lg:h-20">
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setIsOpen(true)}
              aria-label="Open Menu"
            >
              <Menu size={24} />
            </button>

            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate('/')}
            >
              <div className="p-4 bg-slate-900 rounded-lg lg:rounded-xl flex items-center justify-center text-white font-black text-lg lg:text-xl transition-transform group-hover:rotate-3">
                Minesudan
              </div>
              <h2 className="text-lg lg:text-xl font-black tracking-tighter text-slate-900 hidden xs:block">
                mine<span className="text-slate-400 font-light">sudan</span>
              </h2>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="ghost"
              className="rounded-xl font-bold text-slate-600 px-2 sm:px-4 hover:bg-slate-50"
              onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')}
            >
              <Globe size={18} className={isRTL ? 'ml-0 lg:ml-2' : 'mr-0 lg:mr-2'} />
              <span className="hidden md:inline">{i18n.language === 'en' ? 'العربية' : 'English'}</span>
              <span className="md:hidden uppercase text-xs">{i18n.language === 'en' ? 'AR' : 'EN'}</span>
            </Button>
            
            <div className="hidden sm:block h-8 w-[1px] bg-slate-100" />

            <div className="flex items-center gap-2 lg:gap-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-sm font-bold text-slate-900 leading-none">{user?.name}</span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">{t(user?.role)}</span>
              </div>
              <Button 
                variant="ghost"
                size="icon"
                className="rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                onClick={handleLogout}
              >
                <LogOut size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      >
        <aside 
          onClick={e => e.stopPropagation()}
          className={`absolute top-0 h-full w-72 bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')
          } ${isRTL ? 'right-0' : 'left-0'}`}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="font-black text-2xl tracking-tighter">GOLDERP</div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <nav className="flex flex-col gap-2">
            <NavLinks onClick={() => setIsOpen(false)} />
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-900 truncate">{user?.name}</span>
                <span className="text-xs text-slate-400 truncate">{user?.email}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-10 transition-all">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto w-full px-6 py-6 lg:py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 font-medium text-xs sm:text-sm border-t border-slate-100/50 sm:border-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{t('system_status')}: {t('online')}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{t('gold_erp')} © 2026</span>
          <span className="hidden sm:inline">—</span>
          <span>{t('secure_terminal')}</span>
        </div>
      </footer>
    </div>
  );
}