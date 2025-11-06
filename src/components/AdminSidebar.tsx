import { Link, useLocation } from 'react-router-dom';
import Icon from './ui/icon';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'profile',
    label: 'Перейти на сайт',
    icon: 'Home',
    path: '/'
  },
  {
    id: 'references',
    label: 'Справочники',
    icon: 'BookOpen',
    path: '/admin/references',
    children: [
      { id: 'academy', label: 'Академия', icon: 'GraduationCap', path: '/admin/academy' },
      { id: 'news', label: 'Новости', icon: 'Newspaper', path: '/admin/news' },
      { id: 'press', label: 'Пресс-релизы', icon: 'FileText', path: '/admin/press' },
      { id: 'organizations', label: 'Организации', icon: 'Building2', path: '/admin/organizations' },
      { id: 'persons', label: 'Персоналии', icon: 'Users', path: '/admin/persons' },
      { id: 'vacancies', label: 'Вакансии', icon: 'Briefcase', path: '/admin/vacancies' },
      { id: 'regions', label: 'Регионы', icon: 'MapPin', path: '/admin/regions' },
      { id: 'advertising', label: 'Реклама', icon: 'Megaphone', path: '/admin/advertising' },
      { id: 'horoscopes', label: 'Гороскопы', icon: 'Star', path: '/admin/horoscopes' },
      { id: 'centers', label: 'Центры', icon: 'Building', path: '/admin/centers' },
      { id: 'podcasts', label: 'Подкасты', icon: 'Mic', path: '/admin/podcasts' },
      { id: 'promotions', label: 'Промокоды', icon: 'Ticket', path: '/admin/promotions' },
      { id: 'users', label: 'Пользователи', icon: 'UserCircle', path: '/admin/users' },
      { id: 'journalists', label: 'Журналисты', icon: 'PenTool', path: '/admin/journalists' },
      { id: 'residents', label: 'Населения', icon: 'Users2', path: '/admin/residents' }
    ]
  },
  {
    id: 'analytics',
    label: 'Выпуски',
    icon: 'BarChart3',
    path: '/admin/analytics'
  },
  {
    id: 'settings',
    label: 'Настройки',
    icon: 'Settings',
    path: '/admin/settings'
  },
  {
    id: 'media',
    label: 'Медиа',
    icon: 'Image',
    path: '/admin/media'
  },
  {
    id: 'monitoring',
    label: 'Мониторинг',
    icon: 'Activity',
    path: '/admin/monitoring'
  },
  {
    id: 'state',
    label: 'Состояние',
    icon: 'Info',
    path: '/admin/state'
  },
  {
    id: 'logs',
    label: 'Логи',
    icon: 'FileText',
    path: '/admin/logs'
  },
  {
    id: 'videos',
    label: 'Видео',
    icon: 'Video',
    path: '/admin/videos'
  }
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold text-gray-800">Режим администратора</h2>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <div key={item.id}>
            <Link
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm transition-colors hover:bg-gray-100",
                location.pathname === item.path ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" : "text-gray-700"
              )}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </Link>
            {item.children && (
              <div className="ml-4">
                {item.children.map((child) => (
                  <Link
                    key={child.id}
                    to={child.path}
                    className={cn(
                      "flex items-center gap-3 px-6 py-2 text-sm transition-colors hover:bg-gray-100",
                      location.pathname === child.path ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600" : "text-gray-600"
                    )}
                  >
                    <Icon name={child.icon} size={16} />
                    <span>{child.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
