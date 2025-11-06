import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const API_URL = 'https://functions.poehali.dev/2314879f-983a-4813-8c6b-2a8e19afe034';

interface NewsItem {
  id?: number;
  title: string;
  category_code: string;
  category_label?: string;
  time_label: string;
  image_url: string;
  description?: string;
}

const AdminNews = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [statusFilter, setStatusFilter] = useState('Все');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      loadNews();
    }
  }, [navigate]);

  const loadNews = async () => {
    try {
      const response = await fetch(`${API_URL}?resource=news`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error loading news:', error);
      toast.error('Ошибка загрузки новостей');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту новость?')) return;
    try {
      const response = await fetch(`${API_URL}?resource=news&id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success('Новость удалена');
        loadNews();
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Ошибка удаления новости');
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/news/edit/${id}`);
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все' || item.category_label === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <h1 className="text-2xl font-bold">Новости</h1>
            <Button onClick={() => navigate('/admin/news/edit/new')}>
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить новость
            </Button>
          </div>
        </header>

        <main className="p-8">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Заголовок"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select 
                  className="px-3 py-2 border rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option>Все</option>
                  <option>Экономика</option>
                  <option>Шоу-бизнес</option>
                  <option>Авто и Транспорт</option>
                </select>
                <select 
                  className="px-3 py-2 border rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>Все</option>
                  <option>Найдено</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline">Добавить новость</Button>
                <Button variant="outline">Импорт из RSS</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                        <Icon name="GripVertical" size={16} className="text-gray-400" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Приоритет</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Изображение</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Заголовок</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Категория</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Модерация</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Уникальность</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Начислено</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredNews.map((item, index) => (
                      <tr key={item.id} className={`${index % 2 === 0 ? 'bg-green-50' : ''} hover:bg-blue-50 transition-colors cursor-move`}>
                        <td className="px-4 py-4 whitespace-nowrap cursor-grab active:cursor-grabbing">
                          <Icon name="GripVertical" size={18} className="text-gray-400" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">70102</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.image_url && (
                            <img src={item.image_url} alt="" className="h-12 w-16 object-cover rounded" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm max-w-md">
                          <div className="line-clamp-2">{item.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">10.45 05.11.2025</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.category_label || 'Экономика'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Да</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">73%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">0</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex gap-2 justify-end">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(item.id!)}
                            >
                              <Icon name="Edit" size={18} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => window.open(`/`, '_blank')}
                            >
                              <Icon name="Eye" size={18} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => window.open(`/`, '_blank')}
                            >
                              <Icon name="ExternalLink" size={18} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => window.open(`/`, '_blank')}
                            >
                              <Icon name="Copy" size={18} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(item.id!)}
                            >
                              <Icon name="Trash2" size={18} className="text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  На странице: 50
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Предыдущая</Button>
                  <Button variant="outline" size="sm">Следующая</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminNews;