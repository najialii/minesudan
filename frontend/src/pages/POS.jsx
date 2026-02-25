import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Minus, Plus, Search, ShoppingBag, User, CreditCard, X } from 'lucide-react';

export default function POS() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    loadProducts();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadProducts = () => {
    api.get('/products').then(res => setProducts(res.data));
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.product_id === product.id);
    if (existing) {
      setCart(cart.map(item => item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, {
        product_id: product.id,
        name: isRtl && product.name_ar ? product.name_ar : product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock
      }]);
    }
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      setCart(cart.filter(item => item.product_id !== productId));
    } else {
      setCart(cart.map(item => item.product_id === productId ? { ...item, quantity: newQty } : item));
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.17;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!customerName || cart.length === 0) return;
    try {
      await api.post('/sales', {
        customer_name: customerName,
        items: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity }))
      });
      setCart([]); setCustomerName(''); loadProducts();
      alert(t('sale_completed'));
    } catch (e) { console.error(e); }
  };

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} h-[calc(100vh-2rem)] gap-6 p-6 bg-slate-50/50`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="mb-6 flex flex-col gap-4">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('pos_terminal')}</h1>
          <div className="relative group">
            <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors`} size={20} />
            <Input
              type="text"
              placeholder={t('search_products')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-12 pr-12 py-7 rounded-2xl border-none shadow-sm bg-white text-lg focus-visible:ring-primary/20 transition-all"
            />
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
            <Card
              key={product.id}
              onClick={() => product.stock > 0 && addToCart(product)}
              className={`group cursor-pointer border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[1.5rem] overflow-hidden ${product.stock <= 0 ? 'opacity-50 grayscale pointer-events-none' : ''}`}
            >
              <CardContent className="p-0">
                <div className="h-32 bg-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <ShoppingBag size={40} />
                </div>
                <div className="p-4 text-center">
                  <div className="font-bold text-slate-800 line-clamp-1">{isRtl ? product.name_ar : product.name}</div>
                  <div className="text-primary font-black text-lg mt-1">
                    {product.price.toLocaleString()} <span className="text-[10px] uppercase opacity-60">SDG</span>
                  </div>
                  <div className="mt-3 flex justify-center">
                    <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-bold border-none px-3 py-1 text-[10px]">
                      {t('stock')}: {product.stock}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className={`${isMobile ? 'w-full' : 'w-[400px]'} flex flex-col bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden`}>
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShoppingBag size={20} />
            </div>
            <h2 className="font-bold text-lg tracking-wide">{t('current_order')}</h2>
          </div>
          <Badge className="bg-primary text-white border-none px-3 py-1 rounded-full text-xs">
            {cart.length} {t('items')}
          </Badge>
        </div>

        <div className="p-6 flex-1 flex flex-col overflow-hidden">
          <div className="relative mb-6">
            <User className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
            <Input
              type="text" 
              placeholder={t('customer_name')} 
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className={`py-6 rounded-xl border-slate-100 bg-slate-50/50 ${isRtl ? 'pr-10' : 'pl-10'} font-medium`}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {cart.map(item => (
              <div key={item.product_id} className="group flex flex-col p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-bold text-slate-800">{item.name}</span>
                  <button onClick={() => updateQuantity(item.product_id, 0)} className="text-slate-300 hover:text-rose-500 transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">{ (item.price * item.quantity).toLocaleString() } SDG</span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-lg hover:bg-slate-50"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </Button>
                    <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-lg hover:bg-slate-50"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-slate-400 font-medium text-sm">
                <span>{t('subtotal')}</span>
                <span>{subtotal.toLocaleString()} SDG</span>
              </div>
              <div className="flex justify-between text-slate-400 font-medium text-sm">
                <span>{t('tax')} (17%)</span>
                <span>{tax.toLocaleString()} SDG</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-900 font-black text-xl">{t('total')}</span>
                <span className="text-slate-900 font-black text-2xl tracking-tighter">{total.toLocaleString()} <span className="text-xs">SDG</span></span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={cart.length === 0 || !customerName}
              className="w-full py-8 rounded-2xl bg-slate-900 hover:bg-primary text-white font-bold text-lg shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95 flex gap-3"
            >
              <CreditCard size={22} />
              {t('complete_sale')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}