import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/d0b4ea43-ed3e-4e1c-9d9f-851adbff0718';

interface NewsItem {
  id?: number;
  title: string;
  category_code: string;
  time_label: string;
  image_url: string;
  description?: string;
}

interface Category {
  id?: number;
  code: string;
  label: string;
  icon: string;
}

const Admin = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [newNews, setNewNews] = useState<NewsItem>({
    title: '',
    category_code: 'politics',
    time_label: 'Только что',
    image_url: '',
    description: ''
  });

  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  const [newCategory, setNewCategory] = useState<Category>({
    code: '',
    label: '',
    icon: 'Star'
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

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
      setNews(newsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNews = async () => {
    try {
      const response = await fetch(`${API_URL}?resource=news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNews)
      });
      if (response.ok) {
        await loadData();
        setNewNews({
          title: '',
          category_code: 'politics',
          time_label: 'Только что',
          image_url: '',
          description: ''
        });
      }
    } catch (error) {
      console.error('Error adding news:', error);
    }
  };

  const handleUpdateNews = async () => {
    if (!editingNews || !editingNews.id) return;
    try {
      const response = await fetch(`${API_URL}?resource=news&id=${editingNews.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingNews)
      });
      if (response.ok) {
        await loadData();
        setEditingNews(null);
      }
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm('Удалить эту новость?')) return;
    try {
      const response = await fetch(`${API_URL}?resource=news&id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await fetch(`${API_URL}?resource=categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });
      if (response.ok) {
        await loadData();
        setNewCategory({ code: '', label: '', icon: 'Star' });
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.id) return;
    try {
      const response = await fetch(`${API_URL}?resource=categories&id=${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory)
      });
      if (response.ok) {
        await loadData();
        setEditingCategory(null);
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Удалить эту категорию?')) return;
    try {
      const response = await fetch(`${API_URL}?resource=categories&id=${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
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
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Админ-панель NewsHub</h1>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Icon name="Home" size={18} className="mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="news">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="news">Управление новостями</TabsTrigger>
            <TabsTrigger value="categories">Управление категориями</TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Добавить новость</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Заголовок новости"
                    value={newNews.title}
                    onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                  />
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newNews.category_code}
                    onChange={(e) => setNewNews({ ...newNews, category_code: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat.code} value={cat.code}>{cat.label}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Время (например: 2 часа назад)"
                    value={newNews.time_label}
                    onChange={(e) => setNewNews({ ...newNews, time_label: e.target.value })}
                  />
                  <Input
                    placeholder="URL изображения"
                    value={newNews.image_url}
                    onChange={(e) => setNewNews({ ...newNews, image_url: e.target.value })}
                  />
                  <Input
                    placeholder="Описание (необязательно)"
                    value={newNews.description}
                    onChange={(e) => setNewNews({ ...newNews, description: e.target.value })}
                  />
                  <Button onClick={handleAddNews} className="w-full">
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить новость
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Список новостей ({news.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {news.map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        {editingNews?.id === item.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editingNews.title}
                              onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                            />
                            <select
                              className="w-full p-2 border rounded-md"
                              value={editingNews.category_code}
                              onChange={(e) => setEditingNews({ ...editingNews, category_code: e.target.value })}
                            >
                              {categories.map(cat => (
                                <option key={cat.code} value={cat.code}>{cat.label}</option>
                              ))}
                            </select>
                            <Input
                              value={editingNews.time_label}
                              onChange={(e) => setEditingNews({ ...editingNews, time_label: e.target.value })}
                            />
                            <Input
                              value={editingNews.image_url}
                              onChange={(e) => setEditingNews({ ...editingNews, image_url: e.target.value })}
                            />
                            <div className="flex gap-2">
                              <Button onClick={handleUpdateNews} size="sm">Сохранить</Button>
                              <Button onClick={() => setEditingNews(null)} variant="outline" size="sm">Отмена</Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Категория: {categories.find(c => c.code === item.category_code)?.label} • {item.time_label}
                            </p>
                            <div className="flex gap-2">
                              <Button onClick={() => setEditingNews(item)} size="sm" variant="outline">
                                <Icon name="Edit" size={16} />
                              </Button>
                              <Button onClick={() => handleDeleteNews(item.id!)} size="sm" variant="destructive">
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Добавить категорию</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Код категории (английский, например: tech)"
                    value={newCategory.code}
                    onChange={(e) => setNewCategory({ ...newCategory, code: e.target.value })}
                  />
                  <Input
                    placeholder="Название категории (русский)"
                    value={newCategory.label}
                    onChange={(e) => setNewCategory({ ...newCategory, label: e.target.value })}
                  />
                  <Input
                    placeholder="Иконка (например: Star, Laptop)"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  />
                  <Button onClick={handleAddCategory} className="w-full">
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить категорию
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Список категорий ({categories.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        {editingCategory?.id === item.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editingCategory.label}
                              onChange={(e) => setEditingCategory({ ...editingCategory, label: e.target.value })}
                            />
                            <Input
                              value={editingCategory.icon}
                              onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                            />
                            <div className="flex gap-2">
                              <Button onClick={handleUpdateCategory} size="sm">Сохранить</Button>
                              <Button onClick={() => setEditingCategory(null)} variant="outline" size="sm">Отмена</Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-3 mb-3">
                              <Icon name={item.icon as any} size={24} />
                              <div>
                                <h3 className="font-semibold">{item.label}</h3>
                                <p className="text-sm text-muted-foreground">Код: {item.code}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => setEditingCategory(item)} size="sm" variant="outline">
                                <Icon name="Edit" size={16} />
                              </Button>
                              <Button onClick={() => handleDeleteCategory(item.id!)} size="sm" variant="destructive">
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
