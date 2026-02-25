import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function Workers() {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const [workers, setWorkers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', name_ar: '', phone: '', id_number: '', company_id: ''
  });

  useEffect(() => {
    loadWorkers();
    if (user?.role === 'admin') {
      api.get('/companies').then(res => setCompanies(res.data.data || []));
    }
  }, [user]);

  const loadWorkers = () => {
    api.get('/workers').then(res => setWorkers(res.data.data || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData };
      if (user?.role === 'company_manager') data.company_id = user.company_id;
      
      if (editingId) {
        await api.put(`/workers/${editingId}`, data);
      } else {
        await api.post('/workers', data);
      }
      loadWorkers();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving worker');
    }
  };

  const handleEdit = (worker) => {
    setFormData(worker);
    setEditingId(worker.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('confirm_delete'))) {
      await api.delete(`/workers/${id}`);
      loadWorkers();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', name_ar: '', phone: '', id_number: '', company_id: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('workers')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('manage_workforce')}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? t('cancel') : t('add_worker')}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? t('edit_worker') : t('add_worker')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="phone">{t('phone')}</Label>
                  <Input 
                    id="phone"
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_number">{t('id_number')}</Label>
                  <Input 
                    id="id_number"
                    value={formData.id_number} 
                    onChange={e => setFormData({...formData, id_number: e.target.value})} 
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
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit">{t('save')}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>{t('cancel')}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('phone')}</TableHead>
            <TableHead>{t('id_number')}</TableHead>
            {user?.role === 'admin' && <TableHead>{t('company')}</TableHead>}
            <TableHead>{t('status')}</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workers.map(w => (
            <TableRow key={w.id}>
              <TableCell className="font-medium">
                {i18n.language === 'ar' && w.name_ar ? w.name_ar : w.name}
              </TableCell>
              <TableCell>{w.phone}</TableCell>
              <TableCell className="font-mono text-sm">{w.id_number}</TableCell>
              {user?.role === 'admin' && <TableCell>{w.company?.name || '-'}</TableCell>}
              <TableCell>
                <Badge variant={w.is_active ? "default" : "destructive"}>
                  {w.is_active ? t('active') : t('inactive')}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(w)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(w.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
