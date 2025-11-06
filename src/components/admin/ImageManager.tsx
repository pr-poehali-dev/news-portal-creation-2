import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface ImageItem {
  id?: number;
  image_url: string;
  caption: string;
  position: number;
}

interface ImageManagerProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
}

const ImageManager = ({ images, onChange }: ImageManagerProps) => {
  const handleAddImage = () => {
    if (images.length >= 20) {
      alert('Максимум 20 изображений');
      return;
    }
    const newImages = [...images, { image_url: '', caption: '', position: images.length }];
    onChange(newImages);
  };

  const handleUpdateImage = (index: number, field: 'image_url' | 'caption', value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    onChange(newImages);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, position: i }));
    onChange(newImages);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    newImages.forEach((img, i) => img.position = i);
    onChange(newImages);
  };

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    newImages.forEach((img, i) => img.position = i);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {images.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="Image" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Нет изображений. Добавьте первое изображение!</p>
        </div>
      ) : (
        images.map((image, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {image.image_url && (
                  <img
                    src={image.image_url}
                    alt={image.caption || `Изображение ${index + 1}`}
                    className="w-32 h-24 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">URL изображения</label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={image.image_url}
                    onChange={(e) => handleUpdateImage(index, 'image_url', e.target.value)}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium">Подпись к изображению</label>
                  <Textarea
                    placeholder="Описание изображения"
                    value={image.caption}
                    onChange={(e) => handleUpdateImage(index, 'caption', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                >
                  <Icon name="ChevronUp" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === images.length - 1}
                >
                  <Icon name="ChevronDown" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveImage(index)}
                  className="text-destructive"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}

      {images.length < 20 && (
        <Button variant="outline" onClick={handleAddImage} className="w-full">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить изображение ({images.length}/20)
        </Button>
      )}
    </div>
  );
};

export default ImageManager;
