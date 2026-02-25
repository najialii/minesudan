import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Plus } from 'lucide-react';

export default function MachineForm() {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', name_ar: '' });
  const [formData, setFormData] = useState({
    name: '', name_ar: '', serial_number: '', type: 'refining', status: 'active', 
    cost_per_unit: '', unit: 'hour', description: '', company_id: '', category_id: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/companies').then(res => setCompanies(res.data.data || []));
    }
    api.get('/machine-categories').then(res => setCategories(res.data || []));
    if (id) {
      api.get(`/machines/${id}`).then(res => setFormData(res.data));
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData };
      if (user?.role === 'company_manager') {
        data.company_id = user.company_id;
      }
      
      if (id) {
        await api.put(`/machines/${id}`, data);
      } else {
        await api.post('/machines', data);
      }
      navigate('/machines');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving machine');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) return;
    try {
      const data = { ...newCategory, company_id: user?.role === 'admin' ? formData.company_id : user.company_id };
      const res = await api.post('/machine-categories', data);
      setCategories([...categories, res.data]);
      setFormData({...formData, category_id: res.data.id});
      setNewCategory({ name: '', name_ar: '' });
      setShowCategoryForm(false);
    } catch (err) {
      alert('Error adding category');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{id ? t('edit_machine') : t('add_machine')}</CardTitle>
          <CardDescription>{t('manage_equipment_and_costs')}</CardDescription>
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
                  placeholder="Gold Refining Machine A1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name_ar">{t('name_ar')}</Label>
                <Input 
                  id="name_ar"
                  value={formData.name_ar} 
                  onChange={e => setFormData({...formData, name_ar: e.target.value})} 
                  placeholder="آلة تكرير الذهب A1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serial_number">{t('serial_number')} *</Label>
                <Input 
                  id="serial_number"
                  value={formData.serial_number} 
                  onChange={e => setFormData({...formData, serial_number: e.target.value})} 
                  required 
                  placeholder="GRM-2024-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">{t('equipment_type')} *</Label>
                <div className="flex gap-2">
                  <select 
                    id="category_id"
                    value={formData.category_id} 
                    onChange={e => setFormData({...formData, category_id: e.target.value})} 
                    required 
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">{t('select_category')}</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {i18n.language === 'ar' && c.name_ar ? c.name_ar : c.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => setShowCategoryForm(!showCategoryForm)}
                    title={t('add_category')}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {showCategoryForm && (
                  <Card className="mt-2">
                    <CardContent className="pt-4 space-y-3">
                      <Input
                        placeholder={t('category_name') + ' (English)'}
                        value={newCategory.name}
                        onChange={e => setNewCategory({...newCategory, name: e.target.value})}
                      />
                      <Input
                        placeholder={t('category_name_ar') + ' (العربية)'}
                        value={newCategory.name_ar}
                        onChange={e => setNewCategory({...newCategory, name_ar: e.target.value})}
                      />
                      <div className="flex gap-2">
                        <Button type="button" size="sm" onClick={handleAddCategory}>
                          {t('save')}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowCategoryForm(false);
                            setNewCategory({ name: '', name_ar: '' });
                          }}
                        >
                          {t('cancel')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">{t('status')} *</Label>
                <select 
                  id="status"
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})} 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="active">{t('active')}</option>
                  <option value="maintenance">{t('maintenance')}</option>
                  <option value="inactive">{t('inactive')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost_per_unit">{t('cost_per_unit')} *</Label>
                <Input 
                  id="cost_per_unit"
                  type="number"
                  step="0.01"
                  value={formData.cost_per_unit} 
                  onChange={e => setFormData({...formData, cost_per_unit: e.target.value})} 
                  required 
                  placeholder="150.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">{t('unit')} *</Label>
                <Input 
                  id="unit"
                  value={formData.unit} 
                  onChange={e => setFormData({...formData, unit: e.target.value})} 
                  required 
                  placeholder="hour"
                />
              </div>

              {user?.role === 'admin' && (
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
              )}

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">{t('description')}</Label>
                <textarea 
                  id="description"
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="flex min-h-[100px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  placeholder="High-capacity gold refining machine"
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
              <Button type="button" variant="outline" onClick={() => navigate('/machines')}>
                {t('cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
