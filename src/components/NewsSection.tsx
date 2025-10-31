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
}

interface NewsSectionProps {
  filteredNews: NewsItem[];
  articleCategories: string[];
}

const NewsSection = ({ filteredNews, articleCategories }: NewsSectionProps) => {
  return (
    <div className="lg:col-span-8 space-y-6">
      <section className="animate-fade-in">
        <div className="bg-primary/5 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold">Главные новости</h2>
            <Badge variant="default" className="text-sm">Сегодня</Badge>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredNews.map((news, idx) => (
            <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-1 h-48 md:h-auto">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{news.categoryLabel}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="Clock" size={12} />
                      {news.time}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 hover:text-primary transition-colors cursor-pointer">
                    {news.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <Button variant="link" className="p-0">
                    Читать далее <Icon name="ArrowRight" size={16} className="ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="articles" className="animate-fade-in mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="FileText" className="text-primary" />
              Статьи по темам
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {articleCategories.map((cat) => (
                <Badge 
                  key={cat} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="press" className="animate-fade-in mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Megaphone" className="text-primary" />
              Пресс-релизы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="corporate">
              <TabsList className="grid grid-cols-3 lg:grid-cols-5">
                <TabsTrigger value="corporate">Корпоративные</TabsTrigger>
                <TabsTrigger value="announcements">Объявления</TabsTrigger>
                <TabsTrigger value="events">События</TabsTrigger>
                <TabsTrigger value="products">Новинки</TabsTrigger>
                <TabsTrigger value="partners">Партнерства</TabsTrigger>
              </TabsList>
              <TabsContent value="corporate" className="mt-4">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-start p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                      <div>
                        <h4 className="font-medium">Компания объявила о запуске нового продукта</h4>
                        <p className="text-sm text-muted-foreground">31 октября 2025</p>
                      </div>
                      <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default NewsSection;
