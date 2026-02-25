import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Card } from '../components/ui/card';
import { Building2, Users, Wrench, UserCog, ArrowUpRight } from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ companies: 0, users: 0, workers: 0, machines: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.role === 'admin') {
          const [companies, managers] = await Promise.all([
            api.get('/companies'),
            api.get('/users'),
          ]);
          const managersList = managers.data.data?.filter(u => u.role === 'company_manager') || [];
          setStats({
            companies: companies.data.total || companies.data.data?.length || 0,
            users: managersList.length,
            workers: 0,
            machines: 0,
          });
        } else if (user?.role === 'company_manager') {
          const [users, workers, machines] = await Promise.all([
            api.get('/users'),
            api.get('/workers'),
            api.get('/machines'),
          ]);
          setStats({
            users: users.data.total || users.data.data?.length || 0,
            workers: workers.data.total || workers.data.data?.length || 0,
            machines: machines.data.total || machines.data.data?.length || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, [user]);

  const StatCard = ({ icon: Icon, value, label, trend }) => (
    <Card className="relative overflow-hidden border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <div className="p-2.5 bg-slate-50 w-fit rounded-xl group-hover:bg-primary/10 transition-colors">
            <Icon size={24} className="text-slate-600 group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
          </div>
        </div>
        <div className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
          <ArrowUpRight size={14} />
          {trend || 'Live'}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-6 space-y-10 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <header className="relative flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            {t('welcome')}, <span className="text-primary">{user?.name}</span>
          </h1>
          <div className="flex items-center gap-3 mt-3 text-slate-500">
            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold uppercase tracking-widest text-slate-600">
              {t(user?.role)}
            </span>
            {user?.company && (
              <>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <p className="text-sm font-medium">{user.company.name}</p>
              </>
            )}
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-sm text-slate-400 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {user?.role === 'admin' && (
          <StatCard 
            icon={Building2} 
            value={stats.companies} 
            label={t('total_companies')} 
          />
        )}
        {['admin', 'company_manager'].includes(user?.role) && (
          <>
            <StatCard 
              icon={UserCog} 
              value={stats.users} 
              label={t('managers')} 
            />
            <StatCard 
              icon={Users} 
              value={stats.workers} 
              label={t('total_workers')} 
            />
            <StatCard 
              icon={Wrench} 
              value={stats.machines} 
              label={t('total_machines')} 
            />
          </>
        )}
      </div>

      {/* Decorative "Neom-style" background element */}
      <div className="absolute top-0 right-0 -z-10 w-1/3 h-1/3 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
    </div>
  );
}