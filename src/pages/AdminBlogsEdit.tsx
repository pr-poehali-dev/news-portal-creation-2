import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import MainTab from '@/components/admin-news-edit/MainTab';
import SeoTab from '@/components/admin-news-edit/SeoTab';
import ImagesTab from '@/components/admin-news-edit/ImagesTab';
import ExtraTab from '@/components/admin-news-edit/ExtraTab';
import NewsPreviewDialog from '@/components/admin-news-edit/NewsPreviewDialog';

const API_URL = 'https://functions.poehali.dev/d0b4ea43-ed3e-4e1c-9d9f-851adbff0718';

interface BlogForm {
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

const AdminBlogsEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [form, setForm] = useState<BlogForm>({
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
    category: 'Блоги',
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
      loadBlog();
    }
  }, [navigate, isNew, id]);

  const loadBlog = async () => {
    try {
      const response = await fetch(`${API_URL}?resource=blogs&id=${id}`);
      const data = await response.json();
      setForm({
        ...form,
        title: data.title || '',
        text: data.description || '',
        sourceImage: data.image_url || ''
      });
    } catch (error) {
      console.error('Error loading blog:', error);
      toast.error('Ошибка загрузки блога');
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
        ? `${API_URL}?resource=blogs`
        : `${API_URL}?resource=blogs&id=${id}`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.text,
          image_url: form.sourceImage,
          category_code: 'blogs',
          time_label: 'Только что'
        })
      });

      if (response.ok) {
        toast.success(isNew ? 'Блог создан' : 'Блог обновлен');
        navigate('/admin/blogs');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
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
              <Button variant="ghost" onClick={() => navigate('/admin/blogs')}>
                <Icon name="ArrowLeft" size={18} className="mr-2" />
                Назад
              </Button>
              <h1 className="text-2xl font-bold">
                {isNew ? 'Добавить блог' : 'Редактировать блог'}
              </h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setPreviewOpen(true)}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Icon name="Eye" size={18} className="mr-2" />
                Предпросмотр
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить
              </Button>
            </div>
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
              <MainTab form={form} setForm={setForm} />
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <SeoTab form={form} setForm={setForm} />
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <ImagesTab 
                form={form} 
                setForm={setForm}
                addImage={addImage}
                removeImage={removeImage}
                updateImage={updateImage}
              />
            </TabsContent>

            <TabsContent value="extra" className="space-y-6">
              <ExtraTab 
                form={form}
                addLink={addLink}
                removeLink={removeLink}
                updateLink={updateLink}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setPreviewOpen(true)}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Icon name="Eye" size={18} className="mr-2" />
              Предпросмотр
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/blogs')}>
              Отменить
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Icon name="Save" size={18} className="mr-2" />
              Обновить
            </Button>
          </div>
        </main>
      </div>
      
      <NewsPreviewDialog 
        open={previewOpen} 
        onOpenChange={setPreviewOpen} 
        form={form}
      />
    </div>
  );
};

export default AdminBlogsEdit;
