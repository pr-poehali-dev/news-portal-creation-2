import { useState } from 'react';
import Header from '@/components/Header';
import NewsSection from '@/components/NewsSection';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const newsCategories = [
    { id: 'politics', label: 'Политика', icon: 'Landmark' },
    { id: 'economy', label: 'Экономика', icon: 'TrendingUp' },
    { id: 'business', label: 'Бизнес', icon: 'Briefcase' },
    { id: 'beauty', label: 'Красота', icon: 'Sparkles' },
    { id: 'fashion', label: 'Мода', icon: 'Shirt' },
    { id: 'sale', label: 'Продажа', icon: 'ShoppingBag' },
  ];

  const articleCategories = [
    'Банки', 'Связь', 'ИТ', 'Маркетинг', 'Финансы', 'Технологии', 
    'Стартапы', 'Недвижимость', 'Туризм', 'Образование', 'Здоровье',
    'Авто', 'Инвестиции', 'Развлечения', 'Медицина', 'Производство',
    'Энергетика', 'Медиа', 'Лайфстайл'
  ];

  const allNews = [
    {
      id: 1,
      title: 'Президент подписал важный закон о развитии экономики',
      category: 'politics',
      categoryLabel: 'Политика',
      time: '2 часа назад',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    },
    {
      id: 2,
      title: 'Центробанк снизил ключевую ставку: что это значит для экономики',
      category: 'economy',
      categoryLabel: 'Экономика',
      time: '4 часа назад',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
    },
    {
      id: 3,
      title: 'Российские стартапы привлекли рекордные инвестиции',
      category: 'business',
      categoryLabel: 'Бизнес',
      time: '6 часов назад',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400'
    },
    {
      id: 4,
      title: 'Новые тренды в макияже: что будет популярно этой осенью',
      category: 'beauty',
      categoryLabel: 'Красота',
      time: '8 часов назад',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400'
    },
    {
      id: 5,
      title: 'Главные модные показы недели: обзор коллекций',
      category: 'fashion',
      categoryLabel: 'Мода',
      time: '10 часов назад',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400'
    },
    {
      id: 6,
      title: 'Черная пятница началась: лучшие скидки на электронику',
      category: 'sale',
      categoryLabel: 'Продажа',
      time: '12 часов назад',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400'
    }
  ];

  const filteredNews = activeCategory === 'all' ? allNews : allNews.filter(news => news.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <Header 
        newsCategories={newsCategories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <NewsSection 
            filteredNews={filteredNews}
            articleCategories={articleCategories}
          />
          
          <Sidebar />
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-8 text-white animate-fade-in">
            <h3 className="text-xl font-semibold mb-2">Баннер 468x60</h3>
            <p className="text-sm opacity-90">Горизонтальный баннер</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-lg p-8 text-white animate-fade-in">
            <h3 className="text-xl font-semibold mb-2">Баннер 468x60</h3>
            <p className="text-sm opacity-90">Горизонтальный баннер</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg p-8 text-white animate-fade-in">
            <h3 className="text-xl font-semibold mb-2">Баннер 468x60</h3>
            <p className="text-sm opacity-90">Горизонтальный баннер</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
