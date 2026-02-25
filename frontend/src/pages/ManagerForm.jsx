import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function ManagerForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', company_id: '', phone: '', locale: 'en'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/companies').then(res => setCompanies(res.data.data || []));
    if (id) {
      api.get(`/users/${id}`).then(res => setFormData({ ...res.data, password: '' }));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData, role: 'company_manager' };
      if (id && !data.password) delete data.password;
      
      if (id) {
        await api.put(`/users/${id}`, data);
      } else {
        await api.post('/users', data);
      }
      navigate('/managers');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving manager');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{id ? t('edit_manager') : t('add_manager')}</CardTitle>
          <CardDescription>{t('assign_manager_to_company')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')} *</Label>
                <Input 
                  id="name"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                  placeholder="Full Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')} *</Label>
                <Input 
                  id="email"
                  type="email"
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                  placeholder="manager@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {t('password')} {id && <span className="text-muted-foreground font-normal">({t('leave_blank_to_keep')})</span>}
                </Label>
                <Input 
                  id="password"
                  type="password"
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  required={!id}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input 
                  id="phone"
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  placeholder="+000 000 0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_id">{t('company')} *</Label>
                <select 
                  id="company_id"
                  value={formData.company_id} 
                  onChange={e => setFormData({...formData, company_id: e.target.value})} 
                  required 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="">{t('select_company')}</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locale">{t('language')}</Label>
                <select 
                  id="locale"
                  value={formData.locale} 
                  onChange={e => setFormData({...formData, locale: e.target.value})} 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit">{t('save')}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/managers')}>
                {t('cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
