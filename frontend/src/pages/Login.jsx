import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { t, i18n } = useTranslation();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isRegister) {
        if (formData.password !== formData.password_confirmation) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        const res = await api.post('/register', formData);
        localStorage.setItem('token', res.data.token);
        window.location.href = '/';
      } else {
        await login(formData.email, formData.password);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || (isRegister ? 'Registration failed' : 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const isRtl = i18n.language === 'ar';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-5" dir={isRtl ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{t('gold_erp')}</CardTitle>
          <CardDescription>
            {isRegister ? t('Create your account') : t('Welcome back')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="name">{t('Full Name')}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('Full Name')}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('Email Address')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('Email Address')}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('Password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('Password')}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={isRtl ? "pl-10" : "pr-10"}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`absolute top-0 ${isRtl ? 'left-0' : 'right-0'} h-full px-3`}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">{t('Confirm Password')}</Label>
                <Input
                  id="password_confirmation"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('Confirm Password')}
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                  required
                />
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? t('Processing...') : (isRegister ? t('Create Account') : t('Sign In'))}
            </Button>
          </form>

          <div className="text-center mt-6">
            <Button 
              variant="link"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setFormData({ name: '', email: '', password: '', password_confirmation: '', phone: '' });
              }}
            >
              {isRegister ? t('Already have an account? Sign In') : t('New to Gold ERP? Create an account')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}