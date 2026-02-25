import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function Companies() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    api.get('/companies').then(res => setCompanies(res.data.data || []));
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('confirm_delete'))) {
      await api.delete(`/companies/${id}`);
      loadCompanies();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('companies')}</h1>
        <Button onClick={() => navigate('/companies/add')}>
          <Plus className="h-4 w-4" />
          {t('add_company')}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
            <TableHead>{t('email')}</TableHead>
            <TableHead>{t('phone')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map(company => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">
                {i18n.language === 'ar' && company.name_ar ? company.name_ar : company.name}
              </TableCell>
              <TableCell>{company.email}</TableCell>
              <TableCell>{company.phone}</TableCell>
              <TableCell>
                <Badge variant={company.is_active ? "default" : "destructive"}>
                  {company.is_active ? t('active') : t('inactive')}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/companies/edit/${company.id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(company.id)}
                  >
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
