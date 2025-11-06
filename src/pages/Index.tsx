import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import NewsSection from '@/components/NewsSection';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import AdBlock from '@/components/AdBlock';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/2314879f-983a-4813-8c6b-2a8e19afe034';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [newsCategories, setNewsCategories] = useState<Array<{ id: string; label: string; icon: string }>>([]);
  const [allNews, setAllNews] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [horoscopes, setHoroscopes] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [biographies, setBiographies] = useState<any[]>([]);
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
      const [newsRes, categoriesRes, articlesRes, pressRes, horoscopesRes, blogsRes, biographiesRes] = await Promise.all([
        fetch(`${API_URL}?resource=news`),
        fetch(`${API_URL}?resource=categories`),
        fetch(`${API_URL}?resource=articles`),
        fetch(`${API_URL}?resource=press-releases`),
        fetch(`${API_URL}?resource=horoscopes`),
        fetch(`${API_URL}?resource=blogs`),
        fetch(`${API_URL}?resource=biographies`)
      ]);
      
      const newsData = await newsRes.json();
      const categoriesData = await categoriesRes.json();
      const articlesData = await articlesRes.json();
      const pressData = await pressRes.json();
      const horoscopesData = await horoscopesRes.json();
      const blogsData = await blogsRes.json();
      const biographiesData = await biographiesRes.json();
      
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
        description: item.description,
        source_url: item.source_url
      }));
      
      setNewsCategories(formattedCategories);
      setAllNews(formattedNews);
      setArticles(Array.isArray(articlesData) ? articlesData : []);
      setPressReleases(Array.isArray(pressData) ? pressData : []);
      setHoroscopes(Array.isArray(horoscopesData) ? horoscopesData : []);
      setBlogs(Array.isArray(blogsData) ? blogsData : []);
      setBiographies(Array.isArray(biographiesData) ? biographiesData : []);
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

      <div className="flex justify-center bg-gray-50 py-4">
        <AdBlock blockId="R-A-XXXXXX-1" format="top" />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="hidden lg:block lg:col-span-2">
            <AdBlock blockId="R-A-XXXXXX-2" format="sidebar-left" />
          </div>
          
          <div className="lg:col-span-8">
            <NewsSection 
            filteredNews={filteredNews}
            articleCategories={articleCategories}
            articles={articles}
            pressReleases={pressReleases}
            horoscopes={horoscopes}
            blogs={blogs}
            biographies={biographies}
          />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <Sidebar />
            <div className="hidden lg:block">
              <AdBlock blockId="R-A-XXXXXX-3" format="sidebar-right" />
            </div>
          </div>
        </div>


      </main>

      <Footer />
    </div>
  );
};

export default Index;