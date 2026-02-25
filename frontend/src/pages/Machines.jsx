import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Plus, Pencil, Trash2, Settings, Hash, Activity, DollarSign, Search } from 'lucide-react';

export default function Machines() {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = () => {
    api.get('/machines').then(res => setMachines(res.data.data || []));
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('confirm_delete'))) {
      await api.delete(`/machines/${id}`);
      loadMachines();
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'maintenance':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-rose-50 text-rose-600 border-rose-100';
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
            {t('machines')}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {t('manage_equipment')}
          </p>
        </div>
        <Button 
          onClick={() => navigate('/machines/add')}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex gap-2"
        >
          <Plus size={20} />
          <span className="font-bold tracking-wide text-sm">{t('add_machine')}</span>
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{t('name')}</th>
                <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{t('serial_number')}</th>
                <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{t('cost_per_unit')}</th>
                {user?.role === 'admin' && <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{t('company')}</th>}
                <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{t('status')}</th>
                <th className="px-8 py-5 text-right text-xs font-bold uppercase tracking-widest text-slate-400">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {machines.map(m => (
                <tr key={m.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shadow-sm group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Settings size={22} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base">
                          {i18n.language === 'ar' && m.name_ar ? m.name_ar : m.name}
                        </div>
                        <div className="text-slate-400 text-xs font-medium uppercase tracking-tighter">
                          {m.category ? (i18n.language === 'ar' && m.category.name_ar ? m.category.name_ar : m.category.name) : t(m.type)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 font-mono text-sm text-slate-500 bg-slate-50 w-fit px-3 py-1 rounded-lg border border-slate-100">
                      <Hash size={14} className="text-slate-300" />
                      {m.serial_number}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <DollarSign size={16} className="text-emerald-500" />
                      {m.cost_per_unit}
                      <span className="text-slate-400 font-medium text-xs">/ {m.unit}</span>
                    </div>
                  </td>
                  {user?.role === 'admin' && (
                    <td className="px-8 py-6 text-slate-600 font-medium italic">
                      {m.company?.name || '—'}
                    </td>
                  )}
                  <td className="px-8 py-6">
                    <Badge className={`px-3 py-1 rounded-full border shadow-none font-bold text-[10px] uppercase tracking-wider ${getStatusStyles(m.status)}`}>
                      <Activity size={12} className="mr-1.5 inline" />
                      {t(m.status)}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => navigate(`/machines/edit/${m.id}`)}
                        className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-none hover:shadow-md transition-all border border-transparent hover:border-slate-100"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(m.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {machines.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <Search size={40} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('no_machines_found')}</h3>
            <p className="text-slate-400 max-w-[200px] mx-auto mt-1">Start by registering your first piece of equipment</p>
          </div>
        )}
      </div>
    </div>
  );
}