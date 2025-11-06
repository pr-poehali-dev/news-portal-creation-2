import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface ExtraTabProps {
  form: NewsForm;
  addLink: () => void;
  removeLink: (index: number) => void;
  updateLink: (index: number, field: 'title' | 'url', value: string) => void;
}

const ExtraTab = ({ form, addLink, removeLink, updateLink }: ExtraTabProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Ссылки (до 10)</CardTitle>
          <Button 
            onClick={addLink} 
            disabled={form.links.length >= 10}
            size="sm"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить ссылку
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {form.links.map((link, index) => (
          <div key={index} className="grid grid-cols-2 gap-2">
            <Input
              value={link.title}
              onChange={(e) => updateLink(index, 'title', e.target.value)}
              placeholder="Название ссылки"
            />
            <div className="flex gap-2">
              <Input
                value={link.url}
                onChange={(e) => updateLink(index, 'url', e.target.value)}
                placeholder="https://..."
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeLink(index)}
              >
                <Icon name="Trash2" size={18} />
              </Button>
            </div>
          </div>
        ))}
        <p className="text-sm text-gray-500">
          Добавлено: {form.links.length} / 10
        </p>
      </CardContent>
    </Card>
  );
};

export default ExtraTab;
