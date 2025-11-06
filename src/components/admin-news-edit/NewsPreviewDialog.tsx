import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface NewsPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: NewsForm;
}

const NewsPreviewDialog = ({ open, onOpenChange, form }: NewsPreviewDialogProps) => {
  const validImages = form.images.filter(img => img && img.trim() !== '');
  const validLinks = form.links.filter(link => link.title && link.url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Eye" size={20} />
            Предпросмотр статьи
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-100px)]">
          <article className="bg-white rounded-lg overflow-hidden p-6">
            {form.sourceImage && (
              <div className="relative h-[400px] mb-6 rounded-lg overflow-hidden">
                <img 
                  src={form.sourceImage} 
                  alt={form.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <Badge variant="default">{form.category}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Icon name="Clock" size={14} />
                  Только что
                </span>
                {form.errorCount && form.errorCount !== '0' && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Icon name="Eye" size={14} />
                    {form.errorCount} просмотров
                  </span>
                )}
                {form.isFederal && (
                  <Badge variant="outline">Федеральная</Badge>
                )}
                {form.isUnique && (
                  <Badge variant="outline">Уникальная</Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-6">{form.title || 'Заголовок новости'}</h1>

              {form.author && (
                <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                  <Icon name="User" size={16} />
                  <span className="text-sm">Автор: {form.author}</span>
                </div>
              )}

              {form.shortDescription && (
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {form.shortDescription}
                </p>
              )}

              {form.videoUrl && (
                <div className="mb-8">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <a 
                      href={form.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Icon name="Play" size={24} />
                      Смотреть видео
                    </a>
                  </div>
                </div>
              )}

              {form.podcastUrl && (
                <div className="mb-8">
                  <div className="bg-muted rounded-lg p-6 flex items-center justify-center">
                    <a 
                      href={form.podcastUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <Icon name="Mic" size={24} />
                      Слушать подкаст
                    </a>
                  </div>
                </div>
              )}

              {form.text && (
                <div 
                  className="prose prose-lg max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: form.text }}
                />
              )}

              {form.htmlContent && (
                <div 
                  className="mb-8"
                  dangerouslySetInnerHTML={{ __html: form.htmlContent }}
                />
              )}

              {form.instagramCode && (
                <div className="mb-8 border rounded-lg p-4 bg-muted">
                  <p className="text-sm text-muted-foreground mb-2">Instagram код:</p>
                  <code className="text-xs">{form.instagramCode}</code>
                </div>
              )}

              {validImages.length > 0 && (
                <div className="mb-8 space-y-6">
                  <h2 className="text-2xl font-bold">Фотогалерея</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {validImages.map((img, index) => (
                      <div key={index} className="space-y-2">
                        <img 
                          src={img} 
                          alt={`Изображение ${index + 1}`}
                          className="w-full rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {validLinks.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Полезные ссылки</h2>
                  <div className="space-y-2">
                    {validLinks.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <Icon name="ExternalLink" size={16} />
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {form.tags && form.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold mb-3">Теги:</h3>
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {form.sourceUrl && (
                <div className="border-t pt-6 text-sm text-muted-foreground">
                  <a 
                    href={form.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <Icon name="Link" size={16} />
                    Источник: {form.sourceUrl}
                  </a>
                </div>
              )}
            </div>
          </article>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NewsPreviewDialog;
