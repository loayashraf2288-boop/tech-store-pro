import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      alert('فشل تسجيل الدخول: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-12 tracking-widest">
          <span className="text-neon neon-text">TECH</span>
          <span className="text-white">STORE</span>
        </h1>
        
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-xl mb-6 text-right">لوحة التحكم - تسجيل الدخول</h2>
          
          <form onSubmit={handleLogin} className="space-y-6 text-right">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">اسم المستخدم</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark border border-dark-border rounded-lg p-3 text-white focus:border-neon outline-none transition-all"
                dir="rtl"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2 text-sm">كلمة المرور</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark border border-dark-border rounded-lg p-3 text-white focus:border-neon outline-none transition-all"
                dir="rtl"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-neon to-blue-500 text-black font-bold py-3 rounded-lg mt-8 hover:opacity-90 transition-opacity"
            >
              تسجيل الدخول
            </button>
            
            <p className="text-center text-gray-500 text-sm mt-4">لوحة تحكم آمنة ومشفرة</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
