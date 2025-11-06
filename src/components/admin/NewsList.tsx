import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { NewsItem, Category } from '@/pages/Admin';

interface NewsListProps {
  news: NewsItem[];
  categories: Category[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const NewsList = ({ news, categories, onEdit, onDelete }: NewsListProps) => {
  const getCategoryLabel = (code: string) => {
    return categories.find(c => c.code === code)?.label || code;
  };

  return (
    <div className="space-y-4">
      {news.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Нет новостей. Создайте первую новость!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Изображение</th>
                <th className="text-left py-3 px-4">Заголовок</th>
                <th className="text-left py-3 px-4">Категория</th>
                <th className="text-left py-3 px-4">Дата</th>
                <th className="text-left py-3 px-4">Модерация</th>
                <th className="text-left py-3 px-4">Просмотры</th>
                <th className="text-left py-3 px-4">Действия</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 text-sm text-muted-foreground">{item.id}</td>
                  <td className="py-3 px-4">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-16 h-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      {getCategoryLabel(item.category_code)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {item.time_label}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      item.moderation_status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.moderation_status === 'published' ? 'Опубликовано' : 'Модерация'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {item.views || 0}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => item.id && onEdit(item.id)}
                      >
                        <Icon name="Pencil" size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => item.id && onDelete(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NewsList;
