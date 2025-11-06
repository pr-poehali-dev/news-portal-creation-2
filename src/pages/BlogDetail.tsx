import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const API_URL = 'https://functions.poehali.dev/2314879f-983a-4813-8c6b-2a8e19afe034';

interface BlogDetail {
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

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      const response = await fetch(`${API_URL}?resource=blogs&id=${id}`);
      const data = await response.json();
      setBlog(data);
    } catch (error) {
      console.error('Error loading blog:', error);
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

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
        <Header newsCategories={[]} activeCategory="all" setActiveCategory={() => {}} />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <Icon name="FileQuestion" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-2xl font-bold mb-2">Блог не найден</h1>
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
          {blog.image_url && (
            <div className="relative h-[400px]">
              <img 
                src={blog.image_url} 
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Badge variant="default">{blog.category_label}</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Icon name="Clock" size={14} />
                {blog.time_label}
              </span>
              {blog.views && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Icon name="Eye" size={14} />
                  {blog.views} просмотров
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>

            {blog.author && (
              <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                <Icon name="User" size={16} />
                <span className="text-sm">Автор: {blog.author}</span>
              </div>
            )}

            {blog.description && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {blog.description}
              </p>
            )}

            {blog.video_url && (
              <div className="mb-8">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <a 
                    href={blog.video_url} 
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

            {blog.podcast_url && (
              <div className="mb-8">
                <div className="bg-muted rounded-lg p-6 flex items-center justify-center">
                  <a 
                    href={blog.podcast_url} 
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

            {blog.content && (
              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            )}

            {blog.images && blog.images.length > 0 && (
              <div className="mb-8 space-y-6">
                <h2 className="text-2xl font-bold">Фотогалерея</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blog.images.map((img, index) => (
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

            {blog.links && blog.links.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Полезные ссылки</h2>
                <div className="space-y-2">
                  {blog.links.map((link, index) => (
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

            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Теги:</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {blog.source_url && (
              <div className="border-t pt-6 text-sm text-muted-foreground">
                <a 
                  href={blog.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary"
                >
                  <Icon name="Link" size={16} />
                  Источник: {blog.source_url}
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

export default BlogDetail;
