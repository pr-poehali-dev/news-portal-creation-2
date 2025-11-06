import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const API_URL = 'https://functions.poehali.dev/2314879f-983a-4813-8c6b-2a8e19afe034';

interface BiographyItem {
  id?: number;
  title: string;
  category_code: string;
  category_label?: string;
  time_label: string;
  image_url: string;
  description?: string;
}

const AdminBiographies = () => {
  const navigate = useNavigate();
  const [biographies, setBiographies] = useState<BiographyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      loadBiographies();
    }
  }, [navigate]);

  const loadBiographies = async () => {
    try {
      const response = await fetch(`${API_URL}?resource=biographies`);
      const data = await response.json();
      setBiographies(data);
    } catch (error) {
      console.error('Error loading biographies:', error);
      toast.error('Ошибка загрузки биографий');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить эту биографию?')) return;
    try {
      const response = await fetch(`${API_URL}?resource=biographies&id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        toast.success('Биография удалена');
        loadBiographies();
      }
    } catch (error) {
      console.error('Error deleting biography:', error);
      toast.error('Ошибка удаления биографии');
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/biographies/edit/${id}`);
  };

  const filteredBiographies = biographies.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold">Биографии</h1>
            <Button onClick={() => navigate('/admin/biographies/edit/new')}>
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить биографию
            </Button>
          </div>
        </header>

        <main className="p-8">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <Input
                placeholder="Поиск по заголовку..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Изображение</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Заголовок</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBiographies.map((item, index) => (
                      <tr key={item.id} className={`${index % 2 === 0 ? 'bg-green-50' : ''} hover:bg-blue-50 transition-colors cursor-move`}>
                        <td className="px-4 py-4 whitespace-nowrap cursor-grab active:cursor-grabbing">
                          <Icon name="GripVertical" size={18} className="text-gray-400" />
                        </td>
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
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminBiographies;