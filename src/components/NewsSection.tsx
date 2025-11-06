import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NewsItem {
  id: number;
  title: string;
  category: string;
  categoryLabel: string;
  time: string;
  image: string;
  source_url?: string;
  description?: string;
}

interface NewsSectionProps {
  filteredNews: NewsItem[];
  articleCategories: string[];
  articles: any[];
  pressReleases: any[];
  horoscopes: any[];
  blogs: any[];
  biographies: any[];
}

const NewsSection = ({ filteredNews, articleCategories, articles = [], pressReleases = [], horoscopes = [], blogs = [], biographies = [] }: NewsSectionProps) => {
  return (
    <div className="space-y-6">
      <section className="animate-fade-in">
        <div className="bg-primary/5 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">Главные новости</h2>
            <Badge variant="default" className="text-sm">Сегодня</Badge>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredNews.map((news, idx) => (
            <Link key={news.id} to={`/news/${news.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1 h-48 md:h-auto">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-2 p-6">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary">{news.categoryLabel}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon name="Clock" size={12} />
                        {news.time}
                      </span>
                      {news.source_url && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Icon name="Globe" size={12} />
                          {news.source_url.includes('globalmsk.ru') ? 'GlobalMsk.ru' : 'Источник'}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {news.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
                    </p>
                    <Button variant="link" className="p-0">
                      Читать далее <Icon name="ArrowRight" size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section id="articles" className="animate-fade-in mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="FileText" className="text-primary" />
                Статьи
              </div>
              <Badge variant="secondary">{articles.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {articles.slice(0, 5).map((article) => (
                <Link key={article.id} to={`/articles/${article.id}`} target="_blank" rel="noopener noreferrer">
                  <div className="flex gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                    {article.image_url && (
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium hover:text-primary transition-colors">{article.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{article.time_label}</p>
                    </div>
                    <Icon name="ExternalLink" size={20} className="text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="press" className="animate-fade-in mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Megaphone" className="text-primary" />
                Пресс-релизы
              </div>
              <Badge variant="secondary">{pressReleases.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pressReleases.slice(0, 5).map((press) => (
                <Link key={press.id} to={`/press-releases/${press.id}`} target="_blank" rel="noopener noreferrer">
                  <div className="flex gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                    {press.image_url && (
                      <img 
                        src={press.image_url} 
                        alt={press.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium hover:text-primary transition-colors">{press.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{press.time_label}</p>
                    </div>
                    <Icon name="ExternalLink" size={20} className="text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="horoscopes" className="animate-fade-in mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Star" className="text-primary" />
                Гороскопы
              </div>
              <Badge variant="secondary">{horoscopes.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {horoscopes.slice(0, 5).map((horoscope) => (
                <Link key={horoscope.id} to={`/horoscopes/${horoscope.id}`} target="_blank" rel="noopener noreferrer">
                  <div className="flex gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                    {horoscope.image_url && (
                      <img 
                        src={horoscope.image_url} 
                        alt={horoscope.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium hover:text-primary transition-colors">{horoscope.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{horoscope.time_label}</p>
                    </div>
                    <Icon name="ExternalLink" size={20} className="text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="blogs" className="animate-fade-in mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="BookOpen" className="text-primary" />
                Блоги
              </div>
              <Badge variant="secondary">{blogs.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blogs.slice(0, 5).map((blog) => (
                <Link key={blog.id} to={`/blogs/${blog.id}`} target="_blank" rel="noopener noreferrer">
                  <div className="flex gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                    {blog.image_url && (
                      <img 
                        src={blog.image_url} 
                        alt={blog.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium hover:text-primary transition-colors">{blog.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{blog.time_label}</p>
                    </div>
                    <Icon name="ExternalLink" size={20} className="text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="biographies" className="animate-fade-in mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="Users" className="text-primary" />
                Биографии
              </div>
              <Badge variant="secondary">{biographies.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {biographies.slice(0, 5).map((biography) => (
                <Link key={biography.id} to={`/biographies/${biography.id}`} target="_blank" rel="noopener noreferrer">
                  <div className="flex gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                    {biography.image_url && (
                      <img 
                        src={biography.image_url} 
                        alt={biography.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium hover:text-primary transition-colors">{biography.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{biography.time_label}</p>
                    </div>
                    <Icon name="ExternalLink" size={20} className="text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default NewsSection;