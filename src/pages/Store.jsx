import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../contexts/CartContext';
import CartSidebar from '../components/CartSidebar';
import AIChat from '../components/AIChat';
import Navbar from '../components/Navbar';

const Store = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const q = collection(db, 'products');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white" dir="rtl">
      <Navbar onCartClick={() => setCartOpen(true)} />
      
      {/* البانر العلوي - عروض الصيف */}
      <div className="bg-gradient-to-l from-blue-500 to-neon p-8 text-center text-black">
        <h1 className="text-4xl font-bold">عروض الصيف الكبرى</h1>
        <p className="text-2xl mt-2">خصومات تصل حتى <span className="text-6xl font-black">50%</span></p>
        <button className="mt-4 bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition">تسوق الآن</button>
      </div>

      {/* عرض المنتجات */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold border-r-4 border-neon pr-4">أحدث المنتجات</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-neon transition-all group">
              <div className="h-40 bg-dark rounded-lg mb-4 flex items-center justify-center text-6xl">
                {product.image ? <img src={product.image} alt={product.name} className="h-full object-contain" /> : '📱'}
              </div>
              <h3 className="font-bold text-lg">{product.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-neon font-bold text-xl">{product.price} <span className="text-xs text-gray-400">جنيه</span></span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-dark group-hover:bg-neon group-hover:text-black p-2 rounded-lg transition"
                >
                  🛒 أضف للسلة
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* شريط الخدمات */}
      <div className="bg-dark-card border-t border-dark-border py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div><span className="text-2xl">🚚</span><p>شحن سريع 24-48 ساعة</p></div>
          <div><span className="text-2xl">↩️</span><p>ضمان استرجاع 14 يوم</p></div>
          <div><span className="text-2xl">🔒</span><p>دفع آمن 100%</p></div>
          <div><span className="text-2xl">📞</span><p>دعم فني 24/7</p></div>
        </div>
      </div>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <AIChat />
    </div>
  );
};

export default Store;
