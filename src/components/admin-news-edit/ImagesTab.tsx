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

interface ImagesTabProps {
  form: NewsForm;
  setForm: (form: NewsForm) => void;
  addImage: () => void;
  removeImage: (index: number) => void;
  updateImage: (index: number, value: string) => void;
}

const ImagesTab = ({ form, addImage, removeImage, updateImage }: ImagesTabProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Изображения для новости (до 20)</CardTitle>
          <Button 
            onClick={addImage} 
            disabled={form.images.length >= 20}
            size="sm"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить изображение
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {form.images.map((image, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                value={image}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder="URL изображения или нажмите для загрузки"
              />
            </div>
            {image && (
              <img src={image} alt="" className="h-10 w-16 object-cover rounded" />
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => removeImage(index)}
            >
              <Icon name="Trash2" size={18} />
            </Button>
          </div>
        ))}
        <p className="text-sm text-gray-500">
          Загружено: {form.images.filter(img => img).length} / 20
        </p>
      </CardContent>
    </Card>
  );
};

export default ImagesTab;
