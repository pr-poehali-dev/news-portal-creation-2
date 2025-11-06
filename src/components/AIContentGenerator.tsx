import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface AIContentGeneratorProps {
  onContentGenerated: (content: { title: string; description: string; content: string; image_url?: string }) => void;
}

const AIContentGenerator = ({ onContentGenerated }: AIContentGeneratorProps) => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('news');
  const [generating, setGenerating] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

  const contentTypeLabels: Record<string, string> = {
    news: 'Новость',
    article: 'Статья',
    biography: 'Биография',
    'press-release': 'Пресс-релиз',
    blog: 'Блог',
    horoscope: 'Гороскоп'
  };

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error('Введите описание для генерации');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('https://functions.poehali.dev/ai-content-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          contentType
        })
      });

      if (!response.ok) throw new Error('Ошибка генерации');

      const data = await response.json();
      
      onContentGenerated({
        title: data.title || '',
        description: data.description || '',
        content: data.content || '',
        image_url: data.image_url
      });

      toast.success('Контент сгенерирован успешно!');
      setOpen(false);
      setPrompt('');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Ошибка генерации контента');
    } finally {
      setGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Введите описание для генерации изображения');
      return;
    }

    setGeneratingImage(true);
    try {
      const response = await fetch('https://functions.poehali.dev/ai-content-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, generateImageOnly: true })
      });

      if (!response.ok) throw new Error('Ошибка генерации изображения');

      const data = await response.json();
      
      onContentGenerated({
        title: '',
        description: '',
        content: '',
        image_url: data.image_url
      });

      toast.success('Изображение сгенерировано!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Ошибка генерации изображения');
    } finally {
      setGeneratingImage(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Icon name="Sparkles" size={18} />
          Создать с ИИ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Wand2" size={24} className="text-primary" />
            Генератор контента с ИИ
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Тип контента</label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(contentTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Описание контента</label>
            <Textarea
              placeholder="Например: Напиши новость о запуске новой ракеты Роскосмоса"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              💡 Чем подробнее описание, тем лучше результат
            </p>
          </div>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Icon name="Info" size={16} />
                Что будет создано?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>✅ Заголовок материала</p>
              <p>✅ Описание (лид)</p>
              <p>✅ Полный текст с форматированием</p>
              <p>✅ Изображение (опционально)</p>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              onClick={generateContent} 
              disabled={generating || generatingImage}
              className="flex-1"
            >
              {generating ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                  Генерация...
                </>
              ) : (
                <>
                  <Icon name="FileText" size={18} className="mr-2" />
                  Создать контент
                </>
              )}
            </Button>
            
            <Button 
              onClick={generateImage} 
              disabled={generating || generatingImage}
              variant="outline"
            >
              {generatingImage ? (
                <>
                  <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                  Генерация...
                </>
              ) : (
                <>
                  <Icon name="Image" size={18} className="mr-2" />
                  Только изображение
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIContentGenerator;