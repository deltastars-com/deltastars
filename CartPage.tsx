
import React, { useState, useEffect } from 'react';
import { CartItem, Page } from '../../../types';
import { COMPANY_INFO } from '../../constants';
import { TrashIcon, SparklesIcon, PhoneIcon, LocationMarkerIcon, UserIcon, GlobeAltIcon } from './Icons';
import { useI18n } from './I18nContext';
import { PaymentPortal } from '../PaymentPortal';
import { useToast } from '../../ToastContext';
import api from '../api';

interface CartPageProps {
  cart: CartItem[];
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  clearCart: () => void;
  setPage: (page: Page) => void;
  addPurchaseHistory: (items: CartItem[]) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ cart, removeFromCart, updateQuantity, clearCart, setPage, addPurchaseHistory }) => {
  const { t, language, formatCurrency } = useI18n();
  const { addToast } = useToast();

  const REMEMBERED_PHONE_KEY = 'delta-remembered-phone-v27';
  
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'phone' | 'otp' | 'address' | 'payment' | 'success'>('cart');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState(() => localStorage.getItem(REMEMBERED_PHONE_KEY) || '');
  const [otpInput, setOtpInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [waitTimer, setWaitTimer] = useState(0);
  
  const [address, setAddress] = useState({
      city: '', district: '', street: '', type: 'house', building: '', unit: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWithVat = subtotal * 1.15;
  const MIN_ORDER_THRESHOLD = 50;

  useEffect(() => {
    let timer: any;
    if (waitTimer > 0) {
        timer = setInterval(() => setWaitTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [waitTimer]);

  const handleStartCheckout = () => {
      if (subtotal < MIN_ORDER_THRESHOLD) {
          addToast(t('checkout.minOrderError'), 'error');
          return;
      }
      
      const savedPhone = localStorage.getItem(REMEMBERED_PHONE_KEY);
      if (savedPhone) {
          setPhone(savedPhone);
          setCheckoutStep('address');
          addToast(language === 'ar' ? `مرحباً بك مجدداً، تم التعرف على هويتك` : `Welcome back, identity verified`, 'success');
      } else {
          setCheckoutStep('phone');
      }
  };

  const handleSendOtp = async () => {
      if (waitTimer > 0) return;
      const saudiPhoneRegex = /^(05|5)([0-9]{8})$/;
      if (!saudiPhoneRegex.test(phone)) {
          addToast(language === 'ar' ? "يرجى إدخال رقم هاتف صحيح (05XXXXXXXX)" : "Valid phone required", 'error');
          return;
      }
      
      setIsLoading(true);
      const res = await api.sendOtp(phone);
      setIsLoading(false);

      if (res.success) {
          setCheckoutStep('otp');
          setWaitTimer(60);
          addToast(res.message, 'success');
      } else {
          addToast(res.message, 'error');
          if (res.waitTime) setWaitTimer(res.waitTime);
      }
  };

  const handleVerifyOtp = async () => {
      setIsLoading(true);
      const res = await api.verifyOtp(phone, otpInput);
      setIsLoading(false);

      if (res.success) {
          localStorage.setItem(REMEMBERED_PHONE_KEY, phone);
          setCheckoutStep('address');
          addToast(res.message, 'success');
      } else {
          addToast(res.message, 'error');
      }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setCheckoutStep('payment');
  };

  const handleFinalOrder = async (method: 'online' | 'cod') => {
      setIsLoading(true);
      const res = await api.createOrder({
          phone, items: cart, total: totalWithVat, address, paymentMethod: method
      });
      setIsLoading(false);

      if (res.success) {
          setOrderId(res.orderId || '');
          addPurchaseHistory(cart);
          if (method === 'online') setShowPaymentGateway(true);
          else setCheckoutStep('success');
      }
  };

  const handleGatewaySuccess = (txnId: string) => {
      setShowPaymentGateway(false);
      setCheckoutStep('success');
  };

  const resetIdentity = () => {
      localStorage.removeItem(REMEMBERED_PHONE_KEY);
      setPhone('');
      setCheckoutStep('phone');
  };

  if(checkoutStep === 'success') {
    return (
        <div className="container mx-auto px-4 py-20 text-black animate-fade-in">
            <div className="bg-white p-12 md:p-24 rounded-[5rem] shadow-sovereign max-w-4xl mx-auto text-center border-t-[30px] border-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full"></div>
                <div className="w-40 h-40 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-12 border-8 border-green-100 shadow-inner">
                    <svg className="w-24 h-24 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h1 className="text-6xl font-black text-primary mb-6 tracking-tighter uppercase">{t('cart.checkout.successTitle')}</h1>
                <p className="text-3xl text-gray-400 font-bold mb-16 leading-relaxed">{t('cart.checkout.successSubtitle')}</p>
                
                <div className="bg-gray-50 p-12 rounded-[3.5rem] mb-16 border-4 border-gray-100 shadow-inner flex flex-col items-center">
                    <p className="text-gray-400 font-black text-xs uppercase tracking-[0.5em] mb-6">{t('cart.checkout.orderId')}</p>
                    <p className="text-6xl font-mono font-black text-primary tracking-widest">{orderId}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <a href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=Confirm%20Order%20${orderId}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-6 bg-green-500 text-white font-black py-8 rounded-[2.5rem] text-3xl hover:bg-green-600 transition-all shadow-4xl border-b-[10px] border-green-700 active:translate-y-2 active:border-b-0">
                        💬 {t('cart.checkout.whatsappConfirmation')}
                    </a>
                    <button onClick={() => { clearCart(); setCheckoutStep('cart'); setPage('home'); }} className="bg-slate-100 text-slate-400 font-black py-8 rounded-[2.5rem] text-2xl hover:bg-primary hover:text-white transition-all shadow-xl">
                        {t('cart.checkout.backToStore')}
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-24 text-black selection:bg-secondary selection:text-white">
      {showPaymentGateway && <PaymentPortal amount={totalWithVat} orderId={orderId} onCancel={() => setShowPaymentGateway(false)} onSuccess={handleGatewaySuccess} />}

      {checkoutStep === 'cart' && (
        <div className="animate-fade-in max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <div className="space-y-4">
                <h1 className="text-7xl font-black text-primary tracking-tighter uppercase">{t('cart.title')}</h1>
                <p className="text-3xl font-bold text-gray-400 italic border-r-8 border-secondary pr-6 leading-none">"التزامنا بالجودة يبدأ من سلتكم"</p>
            </div>
            {cart.length > 0 && <button onClick={clearCart} className="bg-red-50 text-red-500 px-12 py-5 rounded-[2rem] font-black text-xl hover:bg-red-500 hover:text-white transition-all shadow-lg">{t('cart.clear')}</button>}
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-44 bg-gray-50 rounded-[6rem] border-8 border-dashed border-gray-100 shadow-inner">
              <div className="text-[12rem] mb-12 opacity-10 grayscale scale-x-[-1]">🛒</div>
              <p className="text-4xl font-black text-gray-300 uppercase tracking-[0.4em] mb-12">{t('cart.empty')}</p>
              <button onClick={() => setPage('products')} className="bg-primary text-white font-black py-8 px-24 rounded-[2.5rem] text-3xl shadow-4xl hover:scale-105 transition-all">
                {t('cart.continueShopping')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
              <div className="xl:col-span-8 space-y-10">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white p-10 rounded-[4rem] shadow-2xl border border-gray-50 flex flex-col md:flex-row items-center gap-12 group hover:border-primary/10 transition-all relative">
                    <div className="w-44 h-44 rounded-[3rem] overflow-hidden shadow-2xl flex-shrink-0 border-4 border-white">
                        <img src={item.image} alt={item.name_ar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                    <div className="flex-grow text-center md:text-right space-y-2">
                        <span className="text-xs font-black text-secondary uppercase tracking-widest">{t(`categories.${item.category}`)}</span>
                        <h3 className="text-3xl font-black text-slate-800 leading-tight">{language === 'ar' ? item.name_ar : item.name_en}</h3>
                        <p className="text-primary font-bold text-xl">{formatCurrency(item.price)} <span className="text-gray-400 text-sm">/ {language === 'ar' ? item.unit_ar : item.unit_en}</span></p>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="bg-gray-50 p-3 rounded-[2.5rem] flex items-center gap-8 border border-gray-100 shadow-inner">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-14 h-14 bg-white shadow-xl rounded-2xl font-black text-3xl hover:bg-primary hover:text-white transition-all transform active:scale-90">-</button>
                            <span className="font-black text-3xl min-w-[3rem] text-center text-primary">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-14 h-14 bg-white shadow-xl rounded-2xl font-black text-3xl hover:bg-primary hover:text-white transition-all transform active:scale-90">+</button>
                        </div>
                        <div className="text-right min-w-[160px]">
                            <p className="text-4xl font-black text-primary">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="p-6 text-gray-300 hover:text-red-500 transition-all"><TrashIcon className="w-8 h-8" /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="xl:col-span-4">
                  <div className="bg-primary text-white p-12 rounded-[5rem] shadow-4xl sticky top-36 border-b-[30px] border-secondary overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full"></div>
                      <h2 className="text-4xl font-black mb-12 border-b border-white/10 pb-8 flex items-center gap-6">
                          <SparklesIcon className="w-10 h-10 text-secondary animate-pulse" />
                          {t('cart.summary')}
                      </h2>
                      <div className="space-y-8 mb-16">
                          <div className="flex justify-between font-bold text-2xl opacity-60"><span>{t('cart.items_value')}</span><span>{formatCurrency(subtotal)}</span></div>
                          <div className="flex justify-between font-bold text-2xl opacity-60"><span>{t('cart.vat')}</span><span>{formatCurrency(subtotal * 0.15)}</span></div>
                          <div className="pt-10 border-t border-white/20 flex justify-between items-center">
                              <span className="text-3xl font-black">الإجمالي الكلي</span>
                              <span className="text-6xl font-black text-secondary">{formatCurrency(totalWithVat)}</span>
                          </div>
                      </div>
                      <button onClick={handleStartCheckout} className="w-full py-10 bg-secondary text-white rounded-[3rem] font-black text-4xl shadow-4xl hover:scale-[1.03] transition-all border-b-[15px] border-orange-800 uppercase tracking-tighter">
                         ✅ {language === 'ar' ? 'إتمام الطلب الآن' : 'Finalize Checkout'}
                      </button>
                  </div>
              </div>
            </div>
          )}
        </div>
      )}

      {checkoutStep === 'phone' && (
          <div className="max-w-3xl mx-auto bg-white p-16 md:p-24 rounded-[6rem] shadow-sovereign border-t-[25px] border-primary animate-fade-in-up">
              <div className="text-center mb-16">
                  <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-10 text-primary border-4 border-primary/10 shadow-inner">
                      <PhoneIcon className="w-16 h-16" />
                  </div>
                  <h2 className="text-5xl font-black text-primary mb-4 tracking-tighter">{t('checkout.phoneStep')}</h2>
                  <p className="text-2xl text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">يرجى إدخال رقم الجوال لتلقي رمز التحقق الرقمي لتفعيل طلبك</p>
              </div>
              <div className="space-y-12">
                  <div className="relative group">
                      <input type="tel" placeholder={t('checkout.phonePlaceholder')} value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-10 bg-gray-50 border-[6px] border-gray-100 rounded-[3rem] font-black text-5xl text-center focus:border-primary focus:bg-white outline-none transition-all shadow-inner" />
                      <div className="absolute left-10 top-1/2 -translate-y-1/2 text-4xl opacity-40">🇸🇦</div>
                  </div>
                  <button onClick={handleSendOtp} disabled={isLoading || waitTimer > 0} className="w-full py-10 bg-primary text-white rounded-[3rem] font-black text-4xl shadow-4xl hover:scale-[1.02] transition-all disabled:opacity-50">
                      {isLoading ? 'جاري الإرسال...' : waitTimer > 0 ? `إعادة الإرسال بعد ${waitTimer}ث` : t('checkout.sendCode')}
                  </button>
              </div>
          </div>
      )}

      {checkoutStep === 'otp' && (
          <div className="max-w-3xl mx-auto bg-white p-16 md:p-24 rounded-[6rem] shadow-sovereign border-t-[25px] border-secondary animate-fade-in-up text-center">
              <h2 className="text-5xl font-black text-primary mb-6 tracking-tighter">{t('checkout.otpStep')}</h2>
              <p className="text-2xl text-gray-400 font-bold mb-16 leading-relaxed">أدخل الكود المكون من 4 أرقام لتأكيد هويتك</p>
              <input type="text" maxLength={4} placeholder="0 0 0 0" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="w-full p-12 bg-gray-50 border-[6px] border-gray-100 rounded-[3rem] font-black text-8xl text-center tracking-[0.5em] focus:border-secondary focus:bg-white outline-none transition-all mb-12 shadow-inner text-primary" />
              <button onClick={handleVerifyOtp} disabled={isLoading} className="w-full py-10 bg-secondary text-white rounded-[3rem] font-black text-4xl shadow-4xl hover:scale-[1.02] transition-all">
                  {isLoading ? 'جاري التحقق...' : t('checkout.verifyCode')} 🛡️
              </button>
              <button onClick={() => setCheckoutStep('phone')} className="block mx-auto mt-8 text-primary font-black text-xl underline opacity-50">تغيير رقم الجوال؟</button>
          </div>
      )}

      {checkoutStep === 'address' && (
          <div className="max-w-5xl mx-auto bg-white p-12 md:p-24 rounded-[6rem] shadow-sovereign border-t-[30px] border-primary animate-fade-in">
              <div className="flex flex-col md:flex-row items-center gap-10 mb-20 border-b-4 border-gray-50 pb-12">
                  <div className="bg-primary p-8 rounded-[3rem] text-white shadow-4xl transform -rotate-3"><LocationMarkerIcon className="w-20 h-20" /></div>
                  <div className="flex-grow text-center md:text-right">
                      <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-5xl font-black text-primary uppercase tracking-tighter mb-2">{t('checkout.addressStep')}</h2>
                            <p className="text-2xl text-gray-400 font-bold">يرجى تسجيل بيانات الموقع اللوجستية بدقة</p>
                          </div>
                          {localStorage.getItem(REMEMBERED_PHONE_KEY) && (
                              <button onClick={resetIdentity} className="text-xs font-black text-red-500 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-all">
                                  {language === 'ar' ? 'تغيير رقم الجوال؟' : 'Change Phone?'}
                              </button>
                          )}
                      </div>
                  </div>
              </div>
              <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <input required type="text" value={address.city} onChange={e=>setAddress({...address, city:e.target.value})} className="w-full p-8 bg-gray-50 border-4 border-gray-100 rounded-[2.5rem] font-black text-2xl focus:border-primary outline-none" placeholder={t('checkout.city')} />
                  <input required type="text" value={address.district} onChange={e=>setAddress({...address, district:e.target.value})} className="w-full p-8 bg-gray-50 border-4 border-gray-100 rounded-[2.5rem] font-black text-2xl focus:border-primary outline-none" placeholder={t('checkout.district')} />
                  <input required type="text" value={address.street} onChange={e=>setAddress({...address, street:e.target.value})} className="w-full p-8 bg-gray-50 border-4 border-gray-100 rounded-[2.5rem] font-black text-2xl focus:border-primary outline-none md:col-span-2" placeholder={t('checkout.street')} />
                  <button type="submit" className="w-full py-10 bg-primary text-white rounded-[3.5rem] font-black text-4xl shadow-4xl hover:scale-[1.02] transition-all md:col-span-2 border-b-[15px] border-primary-dark">
                      تأكيد العنوان والانتقال للسداد 🚚
                  </button>
              </form>
          </div>
      )}

      {checkoutStep === 'payment' && (
          <div className="max-w-5xl mx-auto space-y-16 animate-fade-in-right">
              <div className="bg-primary text-white p-16 rounded-[6rem] shadow-4xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden border-b-[30px] border-secondary">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-3xl rounded-full"></div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter relative z-10">{t('checkout.paymentStep')}</h2>
                  <p className="text-secondary font-black text-3xl relative z-10">{formatCurrency(totalWithVat)}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div onClick={() => handleFinalOrder('online')} className="bg-white p-14 rounded-[5rem] shadow-sovereign border-4 border-transparent hover:border-primary transition-all flex flex-col items-center text-center cursor-pointer group">
                      <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-10 text-7xl group-hover:scale-110 transition-transform">💳</div>
                      <h3 className="text-4xl font-black text-slate-800 mb-6">{t('checkout.onlinePayment')}</h3>
                      <button className="mt-auto w-full py-8 bg-primary text-white rounded-[2.5rem] font-black text-2xl">اختيار السداد الإلكتروني</button>
                  </div>
                  <div onClick={() => handleFinalOrder('cod')} className="bg-white p-14 rounded-[5rem] shadow-sovereign border-4 border-transparent hover:border-secondary transition-all flex flex-col items-center text-center cursor-pointer group">
                      <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-10 text-7xl group-hover:scale-110 transition-transform">💵</div>
                      <h3 className="text-4xl font-black text-slate-800 mb-6">{t('checkout.cod')}</h3>
                      <button className="mt-auto w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-2xl">تأكيد الدفع عند الاستلام</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
