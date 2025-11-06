import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

const API_URL = 'https://functions.poehali.dev/2314879f-983a-4813-8c6b-2a8e19afe034';

interface ImportedNews {
  title: string;
  description: string;
  image_url: string;
  source_url: string;
  time_label: string;
  category_code: string;
  category_label: string;
  content: string;
}

const NewsImporter = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [importedNews, setImportedNews] = useState<ImportedNews[]>([]);
  const [selectedNews, setSelectedNews] = useState<Set<number>>(new Set());
  const [limit, setLimit] = useState(20);
  const [source, setSource] = useState<'html' | 'rss'>('rss');

  const handleImport = async () => {
    setLoading(true);
    try {
      const resource = source === 'rss' ? 'import-rss' : 'import-news';
      const response = await fetch(`${API_URL}?resource=${resource}&limit=${limit}`);
      if (!response.ok) throw new Error('Ошибка импорта');

      const data = await response.json();
      
      if (data.success && data.news) {
        setImportedNews(data.news);
        toast.success(`Загружено ${data.count} новостей`);
      } else {
        throw new Error(data.error || 'Ошибка загрузки');
      }
    } catch (error) {
      console.error('Error importing:', error);
      toast.error('Ошибка импорта новостей');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (index: number) => {
    const newSelected = new Set(selectedNews);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedNews(newSelected);
  };

  const toggleAll = () => {
    if (selectedNews.size === importedNews.length) {
      setSelectedNews(new Set());
    } else {
      setSelectedNews(new Set(importedNews.map((_, i) => i)));
    }
  };

  const handleSave = async () => {
    const newsToSave = importedNews.filter((_, i) => selectedNews.has(i));
    
    if (newsToSave.length === 0) {
      toast.error('Выберите хотя бы одну новость');
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const news of newsToSave) {
      try {
        const response = await fetch(`${API_URL}?resource=news`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: news.title,
            description: news.description,
            content: news.content,
            image_url: news.image_url,
            source_url: news.source_url,
            time_label: news.time_label,
            category_code: news.category_code,
            author: 'GlobalMsk.ru',
            moderation_status: 'published'
          })
        });

        if (response.ok) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch {
        errorCount++;
      }
    }

    setLoading(false);
    
    if (successCount > 0) {
      toast.success(`Импортировано новостей: ${successCount}`);
    }
    if (errorCount > 0) {
      toast.error(`Ошибок: ${errorCount}`);
    }

    if (successCount === newsToSave.length) {
      setOpen(false);
      setImportedNews([]);
      setSelectedNews(new Set());
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Icon name="Download" size={18} />
          Импорт новостей
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Globe" size={24} className="text-primary" />
            Импорт новостей с GlobalMsk.ru
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {importedNews.length === 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <Icon name="Newspaper" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Загрузите новости с портала GlobalMsk.ru
                </p>
                <div className="flex items-center gap-4 justify-center mb-4">
                  <label className="text-sm font-medium">Источник:</label>
                  <select 
                    value={source} 
                    onChange={(e) => setSource(e.target.value as 'html' | 'rss')}
                    className="border rounded px-3 py-2"
                  >
                    <option value="rss">RSS лента (dzen.php)</option>
                    <option value="html">HTML страница</option>
                  </select>
                </div>
                <div className="flex items-center gap-4 justify-center mb-4">
                  <label className="text-sm font-medium">Количество новостей:</label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={limit}
                    onChange={(e) => setLimit(parseInt(e.target.value) || 20)}
                    className="w-24"
                  />
                </div>
                <Button onClick={handleImport} disabled={loading}>
                  {loading ? (
                    <>
                      <Icon name="Loader2" className="animate-spin mr-2" size={18} />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Icon name="Download" size={18} className="mr-2" />
                      Загрузить новости
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedNews.size === importedNews.length}
                    onCheckedChange={toggleAll}
                  />
                  <span className="font-medium">
                    Выбрано: {selectedNews.size} из {importedNews.length}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setImportedNews([]);
                      setSelectedNews(new Set());
                    }}
                  >
                    <Icon name="X" size={16} className="mr-2" />
                    Отменить
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSave}
                    disabled={loading || selectedNews.size === 0}
                  >
                    {loading ? (
                      <>
                        <Icon name="Loader2" className="animate-spin mr-2" size={16} />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Icon name="Save" size={16} className="mr-2" />
                        Импортировать ({selectedNews.size})
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {importedNews.map((news, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-colors ${
                      selectedNews.has(index) ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => toggleSelection(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Checkbox
                          checked={selectedNews.has(index)}
                          onCheckedChange={() => toggleSelection(index)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        
                        {news.image_url && (
                          <img 
                            src={news.image_url} 
                            alt={news.title}
                            className="w-32 h-24 object-cover rounded flex-shrink-0"
                          />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-2 line-clamp-2">{news.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {news.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Icon name="Clock" size={12} />
                              {news.time_label}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Tag" size={12} />
                              {news.category_label}
                            </span>
                            {news.source_url && (
                              <a 
                                href={news.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Icon name="ExternalLink" size={12} />
                                Источник
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsImporter;