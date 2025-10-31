import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  newsCategories: Array<{ id: string; label: string; icon: string }>;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const Header = ({ newsCategories, activeCategory, setActiveCategory }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
            <Button 
              size="icon" 
              variant="ghost" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <a href="#news" className="text-sm font-medium hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Новости</a>
            <a href="#articles" className="text-sm font-medium hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Статьи</a>
            <a href="#press" className="text-sm font-medium hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Пресс-релизы</a>
            <a href="#horoscope" className="text-sm font-medium hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Гороскопы</a>
            <a href="#weather" className="text-sm font-medium hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Погода</a>
            <a href="#blogs" className="text-sm font-medium hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Блоги</a>
            <a href="#bio" className="text-sm font-medium hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Биографии</a>
            <div className="relative pt-2">
              <Input 
                placeholder="Поиск новостей..." 
                className="w-full pl-10"
              />
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            </div>
          </nav>
        </div>
      )}

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
  );
};

export default Header;
