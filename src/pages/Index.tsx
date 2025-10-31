import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import NewsSection from '@/components/NewsSection';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/d0b4ea43-ed3e-4e1c-9d9f-851adbff0718';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [newsCategories, setNewsCategories] = useState<Array<{ id: string; label: string; icon: string }>>([]);
  const [allNews, setAllNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const articleCategories = [
    'Банки', 'Связь', 'ИТ', 'Маркетинг', 'Финансы', 'Технологии', 
    'Стартапы', 'Недвижимость', 'Туризм', 'Образование', 'Здоровье',
    'Авто', 'Инвестиции', 'Развлечения', 'Медицина', 'Производство',
    'Энергетика', 'Медиа', 'Лайфстайл'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [newsRes, categoriesRes] = await Promise.all([
        fetch(`${API_URL}?resource=news`),
        fetch(`${API_URL}?resource=categories`)
      ]);
      const newsData = await newsRes.json();
      const categoriesData = await categoriesRes.json();
      
      const formattedCategories = categoriesData.map((cat: any) => ({
        id: cat.code,
        label: cat.label,
        icon: cat.icon
      }));
      
      const formattedNews = newsData.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        categoryLabel: item.category_label,
        time: item.time,
        image: item.image,
        description: item.description
      }));
      
      setNewsCategories(formattedCategories);
      setAllNews(formattedNews);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = activeCategory === 'all' ? allNews : allNews.filter(news => news.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-primary" size={48} />
      </div>
    );
  }

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
