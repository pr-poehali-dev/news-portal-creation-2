import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeatherWidget from './WeatherWidget';

const Sidebar = () => {
  const zodiacSigns = [
    { name: 'Овен', icon: '♈' }, { name: 'Телец', icon: '♉' },
    { name: 'Близнецы', icon: '♊' }, { name: 'Рак', icon: '♋' },
    { name: 'Лев', icon: '♌' }, { name: 'Дева', icon: '♍' },
    { name: 'Весы', icon: '♎' }, { name: 'Скорпион', icon: '♏' },
    { name: 'Стрелец', icon: '♐' }, { name: 'Козерог', icon: '♑' },
    { name: 'Водолей', icon: '♒' }, { name: 'Рыбы', icon: '♓' },
  ];

  return (
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

      <WeatherWidget />

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
  );
};

export default Sidebar;
