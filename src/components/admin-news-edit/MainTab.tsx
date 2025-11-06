import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import AdvancedRichTextEditor from '@/components/AdvancedRichTextEditor';
import Icon from '@/components/ui/icon';

interface NewsForm {
  title: string;
  text: string;
  shortDescription: string;
  videoUrl: string;
  sourceUrl: string;
  sourceImage: string;
  podcastUrl: string;
  priority: string;
  errorCount: string;
  htmlContent: string;
  instagramCode: string;
  images: string[];
  links: { title: string; url: string }[];
  tags: string[];
  author: string;
  category: string;
  isFederal: boolean;
  isUnique: boolean;
  isAlwaysFirst: boolean;
  canComment: boolean;
  isPublished: boolean;
  isPriorityModeration: boolean;
  sendEmail: boolean;
  createDraft: boolean;
}

interface MainTabProps {
  form: NewsForm;
  setForm: (form: NewsForm) => void;
}

const MainTab = ({ form, setForm }: MainTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Основная информация</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Заголовок</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Введите заголовок новости"
            maxLength={200}
          />
        </div>

        <div>
          <Label>Расширенное описание новости (до 20000 символов)</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Доступно: разные шрифты и размеры, цвета текста и фона, заголовки, подзаголовки, 
            жирный, курсив, подчеркнутый, зачеркнутый, подстрочный текст, кавычки, отступы, 
            загрузка изображений и видео с компьютера
          </p>
          <AdvancedRichTextEditor
            value={form.text}
            onChange={(value) => setForm({ ...form, text: value })}
            placeholder="Введите подробное описание новости с форматированием..."
            maxLength={20000}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Ссылка на видео</Label>
            <Input
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Ссылка на подкаст</Label>
            <Input
              value={form.podcastUrl}
              onChange={(e) => setForm({ ...form, podcastUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Приоритет</Label>
            <Input
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            />
          </div>
          <div>
            <Label>Количество просмотров</Label>
            <Input
              value={form.errorCount}
              onChange={(e) => setForm({ ...form, errorCount: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label>Произвольный html</Label>
          <Input
            value={form.htmlContent}
            onChange={(e) => setForm({ ...form, htmlContent: e.target.value })}
          />
        </div>

        <div>
          <Label>Код Instagram</Label>
          <textarea
            className="w-full px-3 py-2 border rounded-md min-h-[100px]"
            value={form.instagramCode}
            onChange={(e) => setForm({ ...form, instagramCode: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <Label>Теги</Label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" type="button">
              <Icon name="Plus" size={16} className="mr-1" />
              защита от кредиторов
            </Button>
            <Button variant="outline" size="sm" type="button">
              <Icon name="Plus" size={16} className="mr-1" />
              выдача товаров
            </Button>
            <Button variant="outline" size="sm" type="button">
              <Icon name="Plus" size={16} className="mr-1" />
              самозанятые
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Дата</Label>
            <Input
              type="datetime-local"
              defaultValue="2025-11-06T15:47"
            />
          </div>
          <div>
            <Label>Автор</Label>
            <Input
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              placeholder="Kolyainv234@yandex.ru"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Источник новости</Label>
            <Input
              value={form.sourceUrl}
              onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
              placeholder="https://www.banki.ru/news/daytheme/?id=11018710"
            />
          </div>
          <div>
            <Label>Категория</Label>
            <select
              className="w-full px-3 py-2 border rounded-md"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Экономика</option>
              <option>Шоу-бизнес</option>
              <option>Авто и Транспорт</option>
            </select>
          </div>
        </div>

        <div>
          <Label>Источник изображения</Label>
          <Input
            value={form.sourceImage}
            onChange={(e) => setForm({ ...form, sourceImage: e.target.value })}
            placeholder="URL изображения"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.isFederal}
              onCheckedChange={(checked) => setForm({ ...form, isFederal: !!checked })}
            />
            <Label>Федеральная</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.isUnique}
              onCheckedChange={(checked) => setForm({ ...form, isUnique: !!checked })}
            />
            <Label>Уникальная</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.isAlwaysFirst}
              onCheckedChange={(checked) => setForm({ ...form, isAlwaysFirst: !!checked })}
            />
            <Label>Всегда сверху</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.canComment}
              onCheckedChange={(checked) => setForm({ ...form, canComment: !!checked })}
            />
            <Label>Можно комментировать</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.isPublished}
              onCheckedChange={(checked) => setForm({ ...form, isPublished: !!checked })}
            />
            <Label>Опубликовано</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.isPriorityModeration}
              onCheckedChange={(checked) => setForm({ ...form, isPriorityModeration: !!checked })}
            />
            <Label>Прошла модерацию</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.sendEmail}
              onCheckedChange={(checked) => setForm({ ...form, sendEmail: !!checked })}
            />
            <Label>Послать Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={form.createDraft}
              onCheckedChange={(checked) => setForm({ ...form, createDraft: !!checked })}
            />
            <Label>Сохранить и продолжить</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MainTab;