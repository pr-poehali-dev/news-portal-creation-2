import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

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

interface SeoTabProps {
  form: NewsForm;
  setForm: (form: NewsForm) => void;
}

const SeoTab = ({ form, setForm }: SeoTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO настройки</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Краткое описание</Label>
          <textarea
            className="w-full px-3 py-2 border rounded-md min-h-[100px]"
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            maxLength={500}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SeoTab;
