import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { NewsItem, Category } from '@/pages/Admin';
import RichTextEditor from './RichTextEditor';
import ImageManager from './ImageManager';

interface NewsEditorProps {
  news: NewsItem;
  categories: Category[];
  isCreating: boolean;
  onSave: (news: NewsItem) => void;
  onCancel: () => void;
}

const NewsEditor = ({ news, categories, isCreating, onSave, onCancel }: NewsEditorProps) => {
  const [formData, setFormData] = useState<NewsItem>(news);

  const handleSave = () => {
    onSave(formData);
  };

  const handleAddLink = () => {
    const newLinks = [...(formData.links || []), { title: '', url: '', position: formData.links?.length || 0 }];
    setFormData({ ...formData, links: newLinks });
  };

  const handleUpdateLink = (index: number, field: 'title' | 'url', value: string) => {
    const newLinks = [...(formData.links || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, links: newLinks });
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = (formData.links || []).filter((_, i) => i !== index);
    setFormData({ ...formData, links: newLinks });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {isCreating ? 'Создать новость' : 'Редактировать новость'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <Icon name="X" size={18} className="mr-2" />
            Отменить
          </Button>
          <Button onClick={handleSave}>
            <Icon name="Save" size={18} className="mr-2" />
            Сохранить
          </Button>
        </div>
      </div>

      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="main">Основное</TabsTrigger>
          <TabsTrigger value="content">Текст</TabsTrigger>
          <TabsTrigger value="images">Изображения</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Заголовок</Label>
                <Input
                  placeholder="Заголовок новости"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Категория</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.category_code}
                    onChange={(e) => setFormData({ ...formData, category_code: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat.code} value={cat.code}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Статус</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.moderation_status || 'published'}
                    onChange={(e) => setFormData({ ...formData, moderation_status: e.target.value })}
                  >
                    <option value="published">Опубликовано</option>
                    <option value="draft">Черновик</option>
                    <option value="moderation">На модерации</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Время публикации</Label>
                  <Input
                    placeholder="Например: 2 часа назад"
                    value={formData.time_label}
                    onChange={(e) => setFormData({ ...formData, time_label: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Приоритет</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.priority || 0}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Главное изображение (URL)</Label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Краткое описание</Label>
                <Textarea
                  placeholder="Краткое описание новости"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Автор</Label>
                <Input
                  placeholder="Имя автора"
                  value={formData.author || ''}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Источник (URL)</Label>
                <Input
                  placeholder="https://source.com/article"
                  value={formData.source_url || ''}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Видео (URL)</Label>
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.video_url || ''}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Ссылки (до 10 штук)</Label>
                {(formData.links || []).map((link, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Название ссылки"
                      value={link.title}
                      onChange={(e) => handleUpdateLink(index, 'title', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => handleUpdateLink(index, 'url', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLink(index)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                ))}
                {(formData.links || []).length < 10 && (
                  <Button variant="outline" onClick={handleAddLink} className="w-full">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить ссылку
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Полный текст новости (до 10 000 символов)</CardTitle>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                value={formData.content || ''}
                onChange={(value) => setFormData({ ...formData, content: value })}
              />
              <div className="mt-2 text-sm text-muted-foreground text-right">
                {(formData.content || '').length} / 10000 символов
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Изображения в статье (до 20 штук)</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageManager
                images={formData.images || []}
                onChange={(images) => setFormData({ ...formData, images })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>SEO заголовок</Label>
                <Input
                  placeholder="Заголовок для поисковых систем"
                  value={formData.seo_title || ''}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>SEO описание</Label>
                <Textarea
                  placeholder="Описание для поисковых систем"
                  value={formData.seo_description || ''}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Ключевые слова (через запятую)</Label>
                <Input
                  placeholder="новости, политика, экономика"
                  value={formData.seo_keywords || ''}
                  onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsEditor;
