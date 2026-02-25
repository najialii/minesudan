import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function CompanyForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '', name_ar: '', email: '', phone: '', address: '', address_ar: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      api.get(`/companies/${id}`).then(res => setFormData(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/companies/${id}`, formData);
      } else {
        await api.post('/companies', formData);
      }
      navigate('/companies');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving company');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{id ? t('edit_company') : t('add_company')}</CardTitle>
          <CardDescription>{t('company_details_description')}</CardDescription>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name_ar">{t('name_ar')}</Label>
                <Input 
                  id="name_ar"
                  value={formData.name_ar} 
                  onChange={e => setFormData({...formData, name_ar: e.target.value})} 
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input 
                  id="phone"
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">{t('address')}</Label>
                <textarea 
                  id="address"
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address_ar">{t('address_ar')}</Label>
                <textarea 
                  id="address_ar"
                  value={formData.address_ar} 
                  onChange={e => setFormData({...formData, address_ar: e.target.value})} 
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit">{t('save')}</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/companies')}>
                {t('cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
