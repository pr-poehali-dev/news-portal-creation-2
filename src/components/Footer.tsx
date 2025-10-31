import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
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
  );
};

export default Footer;
