import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ADMIN_API_URL = 'https://functions.poehali.dev/2314879f-983a-4813-8c6b-2a8e19afe034';
const MEDIA_UPLOAD_URL = 'https://functions.poehali.dev/44eb5e1c-5dbc-4dbe-86ff-32aa75b1bde3';

interface Banner {
  id?: number;
  placement: string;
  title: string;
  media_type: 'image' | 'video' | 'rsy';
  media_url?: string;
  link_url?: string;
  rsy_code?: string;
  is_active: boolean;
  priority: number;
}

const PLACEMENTS = [
  { value: 'header', label: 'Шапка сайта' },
  { value: 'sidebar-top', label: 'Сайдбар (верх)' },
  { value: 'sidebar-middle', label: 'Сайдбар (середина)' },
  { value: 'sidebar-bottom', label: 'Сайдбар (низ)' },
  { value: 'article-top', label: 'Над статьей' },
  { value: 'article-middle', label: 'В середине статьи' },
  { value: 'article-bottom', label: 'Под статьей' },
  { value: 'between-news', label: 'Между новостями' },
  { value: 'footer', label: 'Подвал сайта' },
];

const AdminAds = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Banner>({
    placement: 'header',
    title: '',
    media_type: 'image',
    is_active: true,
    priority: 0,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await fetch(`${ADMIN_API_URL}?resource=banners`);
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Error loading banners:', error);
      toast({ title: 'Ошибка загрузки баннеров', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(MEDIA_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.url) {
        setCurrentBanner({ ...currentBanner, media_url: data.url });
        toast({ title: 'Файл загружен успешно' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: 'Ошибка загрузки файла', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const method = currentBanner.id ? 'PUT' : 'POST';
      const url = currentBanner.id 
        ? `${ADMIN_API_URL}?resource=banner&id=${currentBanner.id}`
        : `${ADMIN_API_URL}?resource=banner`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentBanner),
      });

      const data = await response.json();
      
      if (data.success || data.id) {
        toast({ title: currentBanner.id ? 'Баннер обновлён' : 'Баннер создан' });
        setEditDialog(false);
        loadBanners();
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить баннер?')) return;

    try {
      await fetch(`${ADMIN_API_URL}?resource=banner&id=${id}`, { method: 'DELETE' });
      toast({ title: 'Баннер удалён' });
      loadBanners();
    } catch (error) {
      console.error('Delete error:', error);
      toast({ title: 'Ошибка удаления', variant: 'destructive' });
    }
  };

  const openEditDialog = (banner?: Banner) => {
    setCurrentBanner(banner || {
      placement: 'header',
      title: '',
      media_type: 'image',
      is_active: true,
      priority: 0,
    });
    setEditDialog(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              Назад
            </Button>
            <h1 className="text-3xl font-bold">Управление рекламой</h1>
          </div>
          <Button onClick={() => openEditDialog()}>
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить баннер
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Загрузка...</div>
        ) : (
          <div className="grid gap-4">
            {PLACEMENTS.map(placement => {
              const placementBanners = banners.filter(b => b.placement === placement.value);
              
              return (
                <Card key={placement.value}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{placement.label}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {placementBanners.length} баннер(ов)
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {placementBanners.length === 0 ? (
                      <p className="text-muted-foreground text-sm">Нет баннеров</p>
                    ) : (
                      <div className="space-y-3">
                        {placementBanners.map(banner => (
                          <div key={banner.id} className="flex items-center gap-4 p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{banner.title}</span>
                                {!banner.is_active && (
                                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                    Неактивен
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Тип: {banner.media_type === 'image' ? 'Изображение' : banner.media_type === 'video' ? 'Видео' : 'РСЯ'}
                                {banner.media_type !== 'rsy' && banner.link_url && ` • Ссылка: ${banner.link_url}`}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => openEditDialog(banner)}>
                                <Icon name="Pencil" size={16} />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDelete(banner.id!)}>
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentBanner.id ? 'Редактировать баннер' : 'Новый баннер'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Название баннера</Label>
              <Input
                value={currentBanner.title}
                onChange={(e) => setCurrentBanner({ ...currentBanner, title: e.target.value })}
                placeholder="Например: Баннер партнёра"
              />
            </div>

            <div>
              <Label>Место размещения</Label>
              <Select value={currentBanner.placement} onValueChange={(v) => setCurrentBanner({ ...currentBanner, placement: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLACEMENTS.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Тип баннера</Label>
              <Select value={currentBanner.media_type} onValueChange={(v: any) => setCurrentBanner({ ...currentBanner, media_type: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Изображение</SelectItem>
                  <SelectItem value="video">Видео</SelectItem>
                  <SelectItem value="rsy">РСЯ (код)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currentBanner.media_type === 'rsy' ? (
              <div>
                <Label>Код РСЯ</Label>
                <Textarea
                  value={currentBanner.rsy_code || ''}
                  onChange={(e) => setCurrentBanner({ ...currentBanner, rsy_code: e.target.value })}
                  placeholder="Вставьте код РСЯ"
                  rows={6}
                />
              </div>
            ) : (
              <>
                <div>
                  <Label>Загрузить {currentBanner.media_type === 'image' ? 'изображение' : 'видео'}</Label>
                  <Input
                    type="file"
                    accept={currentBanner.media_type === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  {uploading && <p className="text-sm text-muted-foreground mt-2">Загрузка...</p>}
                  {currentBanner.media_url && (
                    <div className="mt-2">
                      {currentBanner.media_type === 'image' ? (
                        <img src={currentBanner.media_url} alt="Preview" className="max-h-32 rounded" />
                      ) : (
                        <video src={currentBanner.media_url} className="max-h-32 rounded" controls />
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Ссылка при клике</Label>
                  <Input
                    value={currentBanner.link_url || ''}
                    onChange={(e) => setCurrentBanner({ ...currentBanner, link_url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </>
            )}

            <div>
              <Label>Приоритет (чем выше, тем выше в списке)</Label>
              <Input
                type="number"
                value={currentBanner.priority}
                onChange={(e) => setCurrentBanner({ ...currentBanner, priority: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={currentBanner.is_active}
                onCheckedChange={(checked) => setCurrentBanner({ ...currentBanner, is_active: checked })}
              />
              <Label>Баннер активен</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditDialog(false)}>
                Отмена
              </Button>
              <Button onClick={handleSave}>
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAds;
