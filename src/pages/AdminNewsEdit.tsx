import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const API_URL = 'https://functions.poehali.dev/d0b4ea43-ed3e-4e1c-9d9f-851adbff0718';

interface NewsForm {
  title: string;
  text: string;
  shortDescription: string;
  videoUrl: string;
  sourceUrl: string;
  sourceImage: string;
  podcastUrl: string;
  priority: string;
  errorCount: string;
  htmlContent: string;
  instagramCode: string;
  images: string[];
  links: { title: string; url: string }[];
  tags: string[];
  author: string;
  category: string;
  isFederal: boolean;
  isUnique: boolean;
  isAlwaysFirst: boolean;
  canComment: boolean;
  isPublished: boolean;
  isPriorityModeration: boolean;
  sendEmail: boolean;
  createDraft: boolean;
}

const AdminNewsEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [form, setForm] = useState<NewsForm>({
    title: '',
    text: '',
    shortDescription: '',
    videoUrl: '',
    sourceUrl: '',
    sourceImage: '',
    podcastUrl: '',
    priority: '75091',
    errorCount: '0',
    htmlContent: '',
    instagramCode: '',
    images: [''],
    links: [],
    tags: [],
    author: '',
    category: 'Экономика',
    isFederal: false,
    isUnique: false,
    isAlwaysFirst: false,
    canComment: false,
    isPublished: false,
    isPriorityModeration: false,
    sendEmail: false,
    createDraft: false
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isNew) {
      loadNews();
    }
  }, [navigate, isNew, id]);

  const loadNews = async () => {
    try {
      const response = await fetch(`${API_URL}?resource=news&id=${id}`);
      const data = await response.json();
      setForm({
        ...form,
        title: data.title || '',
        text: data.description || '',
        sourceImage: data.image_url || ''
      });
    } catch (error) {
      console.error('Error loading news:', error);
      toast.error('Ошибка загрузки новости');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Введите заголовок');
      return;
    }

    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew 
        ? `${API_URL}?resource=news`
        : `${API_URL}?resource=news&id=${id}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.text,
          image_url: form.sourceImage,
          category_code: 'politics',
          time_label: 'Только что'
        })
      });

      if (response.ok) {
        toast.success(isNew ? 'Новость создана' : 'Новость обновлена');
        navigate('/admin/news');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('Ошибка сохранения');
    }
  };

  const addImage = () => {
    if (form.images.length < 20) {
      setForm({ ...form, images: [...form.images, ''] });
    }
  };

  const removeImage = (index: number) => {
    const newImages = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: newImages });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm({ ...form, images: newImages });
  };

  const addLink = () => {
    if (form.links.length < 10) {
      setForm({ ...form, links: [...form.links, { title: '', url: '' }] });
    }
  };

  const removeLink = (index: number) => {
    const newLinks = form.links.filter((_, i) => i !== index);
    setForm({ ...form, links: newLinks });
  };

  const updateLink = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...form.links];
    newLinks[index][field] = value;
    setForm({ ...form, links: newLinks });
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
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/admin/news')}>
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Назад
              </Button>
              <h1 className="text-2xl font-bold">
                {isNew ? 'Добавить новость' : 'Редактировать новость'}
              </h1>
            </div>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить
            </Button>
          </div>
        </header>

        <main className="p-8">
          <Tabs defaultValue="main" className="space-y-6">
            <TabsList>
              <TabsTrigger value="main">Основное</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="images">Изображения</TabsTrigger>
              <TabsTrigger value="extra">Дополнительно</TabsTrigger>
            </TabsList>

            <TabsContent value="main" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Заголовок</Label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Введите заголовок новости"
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <Label>Текст (до 10000 символов, до 20 картинок)</Label>
                    <RichTextEditor
                      value={form.text}
                      onChange={(value) => setForm({ ...form, text: value })}
                      placeholder="Введите текст новости..."
                      maxLength={10000}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Ссылка на видео</Label>
                      <Input
                        value={form.videoUrl}
                        onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <Label>Ссылка на подкаст</Label>
                      <Input
                        value={form.podcastUrl}
                        onChange={(e) => setForm({ ...form, podcastUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Приоритет</Label>
                      <Input
                        value={form.priority}
                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Количество просмотров</Label>
                      <Input
                        value={form.errorCount}
                        onChange={(e) => setForm({ ...form, errorCount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Произвольный html</Label>
                    <Input
                      value={form.htmlContent}
                      onChange={(e) => setForm({ ...form, htmlContent: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Код Instagram</Label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                      value={form.instagramCode}
                      onChange={(e) => setForm({ ...form, instagramCode: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Теги</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" type="button">
                        <Icon name="Plus" size={16} className="mr-1" />
                        защита от кредиторов
                      </Button>
                      <Button variant="outline" size="sm" type="button">
                        <Icon name="Plus" size={16} className="mr-1" />
                        выдача товаров
                      </Button>
                      <Button variant="outline" size="sm" type="button">
                        <Icon name="Plus" size={16} className="mr-1" />
                        самозанятые
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Дата</Label>
                      <Input
                        type="datetime-local"
                        defaultValue="2025-11-06T15:47"
                      />
                    </div>
                    <div>
                      <Label>Автор</Label>
                      <Input
                        value={form.author}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                        placeholder="Kolyainv234@yandex.ru"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Источник новости</Label>
                      <Input
                        value={form.sourceUrl}
                        onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                        placeholder="https://www.banki.ru/news/daytheme/?id=11018710"
                      />
                    </div>
                    <div>
                      <Label>Категория</Label>
                      <select
                        className="w-full px-3 py-2 border rounded-md"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                      >
                        <option>Экономика</option>
                        <option>Шоу-бизнес</option>
                        <option>Авто и Транспорт</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label>Источник изображения</Label>
                    <Input
                      value={form.sourceImage}
                      onChange={(e) => setForm({ ...form, sourceImage: e.target.value })}
                      placeholder="URL изображения"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={form.isFederal}
                        onCheckedChange={(checked) => setForm({ ...form, isFederal: !!checked })}
                      />
                      <Label>Федеральная</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={form.isUnique}
                        onCheckedChange={(checked) => setForm({ ...form, isUnique: !!checked })}
                      />
                      <Label>Уникальная</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={form.isAlwaysFirst}
                        onCheckedChange={(checked) => setForm({ ...form, isAlwaysFirst: !!checked })}
                      />
                      <Label>Всегда сверху</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={form.canComment}
                        onCheckedChange={(checked) => setForm({ ...form, canComment: !!checked })}
                      />
                      <Label>Можно комментировать</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={form.isPublished}
                        onCheckedChange={(checked) => setForm({ ...form, isPublished: !!checked })}
                      />
                      <Label>Опубликовано</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={form.isPriorityModeration}
                        onCheckedChange={(checked) => setForm({ ...form, isPriorityModeration: !!checked })}
                      />
                      <Label>Прошла модерацию</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={form.sendEmail}
                        onCheckedChange={(checked) => setForm({ ...form, sendEmail: !!checked })}
                      />
                      <Label>Послать Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={form.createDraft}
                        onCheckedChange={(checked) => setForm({ ...form, createDraft: !!checked })}
                      />
                      <Label>Сохранить и продолжить</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO настройки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Краткое описание</Label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                      value={form.shortDescription}
                      onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                      maxLength={500}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Изображения для новости (до 20)</CardTitle>
                    <Button 
                      onClick={addImage} 
                      disabled={form.images.length >= 20}
                      size="sm"
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить изображение
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.images.map((image, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1">
                        <Input
                          value={image}
                          onChange={(e) => updateImage(index, e.target.value)}
                          placeholder="URL изображения или нажмите для загрузки"
                        />
                      </div>
                      {image && (
                        <img src={image} alt="" className="h-10 w-16 object-cover rounded" />
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeImage(index)}
                      >
                        <Icon name="Trash2" size={18} />
                      </Button>
                    </div>
                  ))}
                  <p className="text-sm text-gray-500">
                    Загружено: {form.images.filter(img => img).length} / 20
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="extra" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Ссылки (до 10)</CardTitle>
                    <Button 
                      onClick={addLink} 
                      disabled={form.links.length >= 10}
                      size="sm"
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить ссылку
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.links.map((link, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <Input
                        value={link.title}
                        onChange={(e) => updateLink(index, 'title', e.target.value)}
                        placeholder="Название ссылки"
                      />
                      <div className="flex gap-2">
                        <Input
                          value={link.url}
                          onChange={(e) => updateLink(index, 'url', e.target.value)}
                          placeholder="https://..."
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeLink(index)}
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-gray-500">
                    Добавлено: {form.links.length} / 10
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex gap-3 justify-end">
            <Button variant="outline" onClick={() => navigate('/admin/news')}>
              Отменить
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Icon name="Save" size={18} className="mr-2" />
              Обновить
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminNewsEdit;
