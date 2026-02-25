import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Plus, Pencil, Trash2, User, Mail, ShieldCheck, Building, Search } from 'lucide-react';

export default function Users() {
  const { t, i18n } = useTranslation();
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  
  const isAdminPage = window.location.pathname === '/managers';

  useEffect(() => {
    loadUsers();
  }, [isAdminPage, currentUser]);

  const loadUsers = () => {
    api.get('/users').then(res => {
      let filteredUsers = res.data.data || [];
      if (isAdminPage) {
        filteredUsers = filteredUsers.filter(u => u.role === 'company_manager');
      } else if (currentUser?.role === 'company_manager') {
        filteredUsers = filteredUsers.filter(u => u.role === 'salesman' && u.company_id === currentUser.company_id);
      }
      setUsers(filteredUsers);
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('confirm_delete'))) {
      await api.delete(`/users/${id}`);
      loadUsers();
    }
  };

  const pageTitle = isAdminPage ? t('managers') : t('users');
  const addButtonText = isAdminPage ? t('add_manager') : t('add_user');
  const addRoute = isAdminPage ? '/managers/add' : '/users/add';

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 uppercase">
            {pageTitle}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isAdminPage ? t('manage_company_admins') : t('manage_staff_and_sales')}
          </p>
        </div>
        <Button 
          onClick={() => navigate(addRoute)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex gap-2"
        >
          <Plus size={20} />
          <span className="font-bold tracking-wide text-sm">{addButtonText}</span>
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{t('user_info')}</th>
                <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{t('role')}</th>
                <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{t('company')}</th>
                <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">{t('status')}</th>
                <th className="px-8 py-5 text-right text-xs font-bold uppercase tracking-widest text-slate-400">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(u => (
                <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shadow-sm group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <User size={22} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base">{u.name}</div>
                        <div className="flex items-center gap-1 text-slate-400 text-xs font-medium lowercase">
                          <Mail size={12} />
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 font-bold text-slate-600 bg-slate-50 w-fit px-3 py-1 rounded-lg border border-slate-100">
                      <ShieldCheck size={14} className="text-slate-300" />
                      <span className="text-[11px] uppercase tracking-wider">{t(u.role)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-600 font-medium italic">
                      <Building size={14} className="text-slate-300" />
                      {u.company?.name || '—'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Badge className={`px-3 py-1 rounded-full border shadow-none font-bold text-[10px] uppercase tracking-wider ${
                      u.is_active 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {u.is_active ? t('active') : t('inactive')}
                    </Badge>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => navigate(isAdminPage ? `/managers/edit/${u.id}` : `/users/edit/${u.id}`)}
                        className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-none hover:shadow-md transition-all border border-transparent hover:border-slate-100"
                      >
                        <Pencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
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

        {users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <Search size={40} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('no_users_found')}</h3>
            <p className="text-slate-400 max-w-[200px] mx-auto mt-1">Start by adding your first team member</p>
          </div>
        )}
      </div>
    </div>
  );
}