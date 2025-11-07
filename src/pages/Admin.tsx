import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import NewsList from '@/components/admin/NewsList';
import NewsEditor from '@/components/admin/NewsEditor';

const ADMIN_API_URL = 'https://functions.poehali.dev/2314879f-983a-4813-8c6b-2a8e19afe034';

export interface NewsItem {
  id?: number;
  title: string;
  category_code: string;
  time_label: string;
  image_url: string;
  description?: string;
  content?: string;
  author?: string;
  source_url?: string;
  video_url?: string;
  priority?: number;
  views?: number;
  moderation_status?: string;
  published_date?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  images?: Array<{ id?: number; image_url: string; caption: string; position: number }>;
  links?: Array<{ id?: number; title: string; url: string; position: number }>;
  tags?: string[];
}

export interface Category {
  id?: number;
  code: string;
  label: string;
  icon: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isCreatingNews, setIsCreatingNews] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [newsRes, categoriesRes] = await Promise.all([
        fetch(`${ADMIN_API_URL}?resource=news`),
        fetch(`${ADMIN_API_URL}?resource=categories`)
      ]);
      const newsData = await newsRes.json();
      const categoriesData = await categoriesRes.json();
      setNews(newsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditNews = async (id: number) => {
    try {
      const response = await fetch(`${ADMIN_API_URL}?resource=news&id=${id}`);
      const newsDetail = await response.json();
      setEditingNews(newsDetail);
      setIsCreatingNews(false);
    } catch (error) {
      console.error('Error loading news detail:', error);
    }
  };

  const handleCreateNews = () => {
    setEditingNews({
      title: '',
      category_code: categories[0]?.code || '',
      time_label: 'Только что',
      image_url: '',
      description: '',
      content: '',
      author: '',
      source_url: '',
      video_url: '',
      priority: 0,
      moderation_status: 'published',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      images: [],
      links: [],
      tags: []
    });
    setIsCreatingNews(true);
  };

  const handleSaveNews = async (newsData: NewsItem) => {
    try {
      const url = isCreatingNews 
        ? `${ADMIN_API_URL}?resource=news`
        : `${ADMIN_API_URL}?resource=news&id=${newsData.id}`;
      
      const response = await fetch(url, {
        method: isCreatingNews ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsData)
      });

      if (response.ok) {
        await loadData();
        setEditingNews(null);
        setIsCreatingNews(false);
      }
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm('Удалить эту новость?')) return;
    try {
      const response = await fetch(`${ADMIN_API_URL}?resource=news&id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleCancel = () => {
    setEditingNews(null);
    setIsCreatingNews(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Админ-панель NewsHub</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/admin/ads')}>
                <Icon name="ImagePlus" size={18} className="mr-2" />
                Реклама
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                <Icon name="Home" size={18} className="mr-2" />
                На главную
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.removeItem('adminAuth');
                  navigate('/login');
                }}
              >
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {editingNews ? (
          <NewsEditor
            news={editingNews}
            categories={categories}
            isCreating={isCreatingNews}
            onSave={handleSaveNews}
            onCancel={handleCancel}
          />
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Управление новостями</CardTitle>
              <Button onClick={handleCreateNews}>
                <Icon name="Plus" size={18} className="mr-2" />
                Создать новость
              </Button>
            </CardHeader>
            <CardContent>
              <NewsList
                news={news}
                categories={categories}
                onEdit={handleEditNews}
                onDelete={handleDeleteNews}
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Admin;