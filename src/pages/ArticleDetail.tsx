import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const API_URL = 'https://functions.poehali.dev/2314879f-983a-4813-8c6b-2a8e19afe034';

interface ArticleDetail {
  id: number;
  title: string;
  category_code: string;
  category_label: string;
  time_label: string;
  image_url: string;
  description?: string;
  content?: string;
  author?: string;
  source_url?: string;
  video_url?: string;
  podcast_url?: string;
  views?: number;
  published_date?: string;
  images?: Array<{ image_url: string; caption: string }>;
  links?: Array<{ title: string; url: string }>;
  tags?: string[];
}

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      const response = await fetch(`${API_URL}?resource=articles&id=${id}`);
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
        <Header newsCategories={[]} activeCategory="all" setActiveCategory={() => {}} />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <Icon name="FileQuestion" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-2">Статья не найдена</h1>
              <Link to="/" className="text-primary hover:underline">
                Вернуться на главную
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <Header newsCategories={[]} activeCategory="all" setActiveCategory={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
          <Icon name="ArrowLeft" size={18} className="mr-2" />
          Вернуться на главную
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {article.image_url && (
            <div className="relative h-[400px]">
              <img 
                src={article.image_url} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Badge variant="default">{article.category_label}</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Icon name="Clock" size={14} />
                {article.time_label}
              </span>
              {article.views && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Icon name="Eye" size={14} />
                  {article.views} просмотров
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-6">{article.title}</h1>

            {article.author && (
              <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                <Icon name="User" size={16} />
                <span className="text-sm">Автор: {article.author}</span>
              </div>
            )}

            {article.description && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {article.description}
              </p>
            )}

            {article.video_url && (
              <div className="mb-8">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <a 
                    href={article.video_url} 
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

            {article.podcast_url && (
              <div className="mb-8">
                <div className="bg-muted rounded-lg p-6 flex items-center justify-center">
                  <a 
                    href={article.podcast_url} 
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

            {article.content && (
              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            )}

            {article.images && article.images.length > 0 && (
              <div className="mb-8 space-y-6">
                <h2 className="text-2xl font-bold">Фотогалерея</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {article.images.map((img, index) => (
                    <div key={index} className="space-y-2">
                      <img 
                        src={img.image_url} 
                        alt={img.caption || `Изображение ${index + 1}`}
                        className="w-full rounded-lg"
                      />
                      {img.caption && (
                        <p className="text-sm text-muted-foreground">{img.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {article.links && article.links.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Полезные ссылки</h2>
                <div className="space-y-2">
                  {article.links.map((link, index) => (
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

            {article.tags && article.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Теги:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {article.source_url && (
              <div className="border-t pt-6 text-sm text-muted-foreground">
                <a 
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <Icon name="Link" size={16} />
                  Источник: {article.source_url}
                </a>
              </div>
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetail;
