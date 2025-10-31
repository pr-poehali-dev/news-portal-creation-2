import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const newsCategories = [
    { id: 'politics', label: 'Политика', icon: 'Landmark' },
    { id: 'economy', label: 'Экономика', icon: 'TrendingUp' },
    { id: 'business', label: 'Бизнес', icon: 'Briefcase' },
    { id: 'beauty', label: 'Красота', icon: 'Sparkles' },
    { id: 'fashion', label: 'Мода', icon: 'Shirt' },
    { id: 'sale', label: 'Продажа', icon: 'ShoppingBag' },
  ];

  const articleCategories = [
    'Банки', 'Связь', 'ИТ', 'Маркетинг', 'Финансы', 'Технологии', 
    'Стартапы', 'Недвижимость', 'Туризм', 'Образование', 'Здоровье',
    'Авто', 'Инвестиции', 'Развлечения', 'Медицина', 'Производство',
    'Энергетика', 'Медиа', 'Лайфстайл'
  ];

  const zodiacSigns = [
    { name: 'Овен', icon: '♈' }, { name: 'Телец', icon: '♉' },
    { name: 'Близнецы', icon: '♊' }, { name: 'Рак', icon: '♋' },
    { name: 'Лев', icon: '♌' }, { name: 'Дева', icon: '♍' },
    { name: 'Весы', icon: '♎' }, { name: 'Скорпион', icon: '♏' },
    { name: 'Стрелец', icon: '♐' }, { name: 'Козерог', icon: '♑' },
    { name: 'Водолей', icon: '♒' }, { name: 'Рыбы', icon: '♓' },
  ];

  const topNews = [
    {
      id: 1,
      title: 'Президент подписал важный закон о развитии экономики',
      category: 'Политика',
      time: '2 часа назад',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
    },
    {
      id: 2,
      title: 'Центробанк снизил ключевую ставку: что это значит для экономики',
      category: 'Экономика',
      time: '4 часа назад',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
    },
    {
      id: 3,
      title: 'Российские стартапы привлекли рекордные инвестиции',
      category: 'Бизнес',
      time: '6 часов назад',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Icon name="Newspaper" className="text-primary" size={32} />
              <h1 className="text-2xl font-bold text-secondary">NewsHub</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#news" className="text-sm font-medium hover:text-primary transition-colors">Новости</a>
              <a href="#articles" className="text-sm font-medium hover:text-primary transition-colors">Статьи</a>
              <a href="#press" className="text-sm font-medium hover:text-primary transition-colors">Пресс-релизы</a>
              <a href="#horoscope" className="text-sm font-medium hover:text-primary transition-colors">Гороскопы</a>
              <a href="#weather" className="text-sm font-medium hover:text-primary transition-colors">Погода</a>
              <a href="#blogs" className="text-sm font-medium hover:text-primary transition-colors">Блоги</a>
              <a href="#bio" className="text-sm font-medium hover:text-primary transition-colors">Биографии</a>
            </nav>

            <div className="flex items-center gap-3">
              <div className="relative hidden lg:block">
                <Input 
                  placeholder="Поиск новостей..." 
                  className="w-64 pl-10"
                />
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
              <Button size="icon" variant="ghost" className="md:hidden">
                <Icon name="Menu" size={24} />
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 border-t">
          <div className="container mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {newsCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                  className="whitespace-nowrap"
                >
                  <Icon name={cat.icon as any} size={16} className="mr-1" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <section className="animate-fade-in">
              <div className="bg-primary/5 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold">Главные новости</h2>
                  <Badge variant="default" className="text-sm">Сегодня</Badge>
                </div>
              </div>

              <div className="grid gap-6">
                {topNews.map((news, idx) => (
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
                          <Badge variant="secondary">{news.category}</Badge>
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

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg p-6 text-white animate-fade-in">
              <h3 className="text-lg font-semibold mb-2">Баннер 728x90</h3>
              <p className="text-sm opacity-90">Рекламное место</p>
            </div>

            <Card id="horoscope" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🔮</span>
                  Гороскоп на сегодня
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {zodiacSigns.map((sign) => (
                    <Button
                      key={sign.name}
                      variant="outline"
                      className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <span className="text-2xl">{sign.icon}</span>
                      <span className="text-xs">{sign.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card id="weather" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="CloudSun" className="text-primary" />
                  Погода
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Москва</h4>
                      <p className="text-sm text-muted-foreground">Облачно</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">+8°</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-3 border-t">
                    {['Пн', 'Вт', 'Ср', 'Чт'].map((day, i) => (
                      <div key={day} className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">{day}</p>
                        <Icon name="Cloud" size={20} className="mx-auto text-muted-foreground" />
                        <p className="text-sm font-medium mt-1">+{7 + i}°</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white animate-fade-in">
              <h3 className="text-lg font-semibold mb-2">Баннер 300x250</h3>
              <p className="text-sm opacity-90">Рекламное место</p>
            </div>

            <Card id="blogs" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Users" className="text-primary" />
                  Популярные блогеры
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Алексей Иванов', topic: 'Технологии', followers: '125K' },
                    { name: 'Мария Петрова', topic: 'Лайфстайл', followers: '98K' },
                    { name: 'Дмитрий Сидоров', topic: 'Финансы', followers: '87K' }
                  ].map((blogger, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full" />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{blogger.name}</h4>
                        <p className="text-xs text-muted-foreground">{blogger.topic}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">{blogger.followers}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card id="bio" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BookOpen" className="text-primary" />
                  Биографии
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="politics">
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="politics">Политики</TabsTrigger>
                    <TabsTrigger value="business">Бизнесмены</TabsTrigger>
                  </TabsList>
                  <TabsContent value="politics" className="mt-4">
                    <div className="space-y-2">
                      {['Иванов И.И.', 'Петров П.П.', 'Сидоров С.С.'].map((name, i) => (
                        <div key={i} className="p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors flex items-center justify-between">
                          <span className="text-sm">{name}</span>
                          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="business" className="mt-4">
                    <div className="space-y-2">
                      {['Смирнов А.А.', 'Кузнецов К.К.', 'Попов П.П.'].map((name, i) => (
                        <div key={i} className="p-2 hover:bg-muted/50 rounded cursor-pointer transition-colors flex items-center justify-between">
                          <span className="text-sm">{name}</span>
                          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </aside>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-8 text-white animate-fade-in">
            <h3 className="text-xl font-semibold mb-2">Баннер 468x60</h3>
            <p className="text-sm opacity-90">Горизонтальный баннер</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-lg p-8 text-white animate-fade-in">
            <h3 className="text-xl font-semibold mb-2">Баннер 468x60</h3>
            <p className="text-sm opacity-90">Горизонтальный баннер</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg p-8 text-white animate-fade-in">
            <h3 className="text-xl font-semibold mb-2">Баннер 468x60</h3>
            <p className="text-sm opacity-90">Горизонтальный баннер</p>
          </div>
        </div>
      </main>

      <footer className="bg-secondary text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Newspaper" size={28} />
                <h3 className="text-xl font-bold">NewsHub</h3>
              </div>
              <p className="text-sm text-white/80">
                Ваш главный источник актуальных новостей и аналитики
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Разделы</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#news" className="hover:text-white transition-colors">Новости</a></li>
                <li><a href="#articles" className="hover:text-white transition-colors">Статьи</a></li>
                <li><a href="#press" className="hover:text-white transition-colors">Пресс-релизы</a></li>
                <li><a href="#blogs" className="hover:text-white transition-colors">Блоги</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">О проекте</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Реклама</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Правила</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Подписка</h4>
              <p className="text-sm text-white/80 mb-3">Получайте новости первыми</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Email" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button variant="secondary">
                  <Icon name="Send" size={18} />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
            © 2025 NewsHub. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
