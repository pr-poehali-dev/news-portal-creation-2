import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const API_URL = 'https://functions.poehali.dev/d0b4ea43-ed3e-4e1c-9d9f-851adbff0718';

interface ContentItem {
  id?: number;
  title: string;
  category_code?: string;
  category_label?: string;
  time_label: string;
  image_url: string;
  description?: string;
}

const AdminContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('news');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [news, setNews] = useState<ContentItem[]>([]);
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [pressReleases, setPressReleases] = useState<ContentItem[]>([]);
  const [horoscopes, setHoroscopes] = useState<ContentItem[]>([]);
  const [blogs, setBlogs] = useState<ContentItem[]>([]);
  const [biographies, setBiographies] = useState<ContentItem[]>([]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      loadAllContent();
    }
  }, [navigate]);

  const loadAllContent = async () => {
    setLoading(true);
    try {
      const [newsRes, articlesRes, pressRes, horoscopesRes, blogsRes, biographiesRes] = await Promise.all([
        fetch(`${API_URL}?resource=news`),
        fetch(`${API_URL}?resource=articles`),
        fetch(`${API_URL}?resource=press-releases`),
        fetch(`${API_URL}?resource=horoscopes`),
        fetch(`${API_URL}?resource=blogs`),
        fetch(`${API_URL}?resource=biographies`)
      ]);

      const newsData = newsRes.ok ? await newsRes.json() : [];
      const articlesData = articlesRes.ok ? await articlesRes.json() : [];
      const pressData = pressRes.ok ? await pressRes.json() : [];
      const horoscopesData = horoscopesRes.ok ? await horoscopesRes.json() : [];
      const blogsData = blogsRes.ok ? await blogsRes.json() : [];
      const biographiesData = biographiesRes.ok ? await biographiesRes.json() : [];

      setNews(Array.isArray(newsData) ? newsData : []);
      setArticles(Array.isArray(articlesData) ? articlesData : []);
      setPressReleases(Array.isArray(pressData) ? pressData : []);
      setHoroscopes(Array.isArray(horoscopesData) ? horoscopesData : []);
      setBlogs(Array.isArray(blogsData) ? blogsData : []);
      setBiographies(Array.isArray(biographiesData) ? biographiesData : []);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Ошибка загрузки контента');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resource: string, id: number) => {
    if (!confirm('Удалить этот материал?')) return;
    try {
      const response = await fetch(`${API_URL}?resource=${resource}&id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success('Материал удален');
        loadAllContent();
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Ошибка удаления');
    }
  };

  const handleEdit = (resource: string, id: number) => {
    navigate(`/admin/${resource}/edit/${id}`);
  };

  const handleCreate = (resource: string) => {
    navigate(`/admin/${resource}/edit/new`);
  };

  const renderTable = (items: ContentItem[], resource: string, title: string) => {
    const filteredItems = items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button onClick={() => handleCreate(resource)}>
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить {title.toLowerCase()}
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Изображение</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Заголовок</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категория</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <Icon name="FileQuestion" size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>Нет материалов</p>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr key={item.id} className={`${index % 2 === 0 ? 'bg-green-50' : ''} hover:bg-blue-50 transition-colors`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.image_url && (
                            <img src={item.image_url} alt="" className="h-12 w-16 object-cover rounded" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm max-w-md">
                          <div className="line-clamp-2">{item.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.time_label}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.category_label || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(resource, item.id!)}
                            >
                              <Icon name="Edit" size={18} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => window.open(`/${resource}/${item.id}`, '_blank')}
                            >
                              <Icon name="Eye" size={18} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(resource, item.id!)}
                            >
                              <Icon name="Trash2" size={18} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1">
        <header className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Управление контентом</h1>
            <div className="flex gap-2">
              <Input
                placeholder="Поиск по заголовку..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
        </header>

        <main className="p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Icon name="Newspaper" size={16} />
                Новости ({news.length})
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <Icon name="FileText" size={16} />
                Статьи ({articles.length})
              </TabsTrigger>
              <TabsTrigger value="press" className="flex items-center gap-2">
                <Icon name="Megaphone" size={16} />
                Пресс-релизы ({pressReleases.length})
              </TabsTrigger>
              <TabsTrigger value="horoscopes" className="flex items-center gap-2">
                <Icon name="Star" size={16} />
                Гороскопы ({horoscopes.length})
              </TabsTrigger>
              <TabsTrigger value="blogs" className="flex items-center gap-2">
                <Icon name="BookOpen" size={16} />
                Блоги ({blogs.length})
              </TabsTrigger>
              <TabsTrigger value="biographies" className="flex items-center gap-2">
                <Icon name="User" size={16} />
                Биографии ({biographies.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="news">
              {renderTable(news, 'news', 'Новости')}
            </TabsContent>

            <TabsContent value="articles">
              {renderTable(articles, 'articles', 'Статьи')}
            </TabsContent>

            <TabsContent value="press">
              {renderTable(pressReleases, 'press-releases', 'Пресс-релизы')}
            </TabsContent>

            <TabsContent value="horoscopes">
              {renderTable(horoscopes, 'horoscopes', 'Гороскопы')}
            </TabsContent>

            <TabsContent value="blogs">
              {renderTable(blogs, 'blogs', 'Блоги')}
            </TabsContent>

            <TabsContent value="biographies">
              {renderTable(biographies, 'biographies', 'Биографии')}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminContent;