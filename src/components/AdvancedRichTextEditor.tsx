import { useRef, useMemo, useCallback } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Size = Quill.import('attributors/style/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '42px', '48px'];
Quill.register(Size, true);

const Font = Quill.import('attributors/style/font');
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida', 'times-new-roman', 'verdana'];
Quill.register(Font, true);

interface AdvancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  onImageUpload?: (file: File) => Promise<string>;
  onVideoUpload?: (file: File) => Promise<string>;
}

const UPLOAD_API_URL = 'https://functions.poehali.dev/eb4eaea8-d7b8-47e4-9ac5-573cada5771d';

const AdvancedRichTextEditor = ({ 
  value, 
  onChange, 
  placeholder, 
  maxLength = 20000,
  onImageUpload,
  onVideoUpload
}: AdvancedRichTextEditorProps) => {
  const quillRef = useRef<ReactQuill>(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        try {
          if (onImageUpload) {
            const url = await onImageUpload(file);
            const quill = quillRef.current?.getEditor();
            if (quill) {
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'image', url);
              quill.setSelection(range.index + 1, 0);
            }
          } else {
            const response = await fetch(UPLOAD_API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ file: base64, type: 'image' })
            });
            
            const data = await response.json();
            const quill = quillRef.current?.getEditor();
            if (quill && data.url) {
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'image', data.url);
              quill.setSelection(range.index + 1, 0);
            }
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Ошибка загрузки изображения');
        }
      };
      reader.readAsDataURL(file);
    };
  }, [onImageUpload]);

  const videoHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'video/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        try {
          if (onVideoUpload) {
            const url = await onVideoUpload(file);
            const quill = quillRef.current?.getEditor();
            if (quill) {
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'video', url);
              quill.setSelection(range.index + 1, 0);
            }
          } else {
            const response = await fetch(UPLOAD_API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ file: base64, type: 'video' })
            });
            
            const data = await response.json();
            const quill = quillRef.current?.getEditor();
            if (quill && data.url) {
              const range = quill.getSelection(true);
              quill.insertEmbed(range.index, 'video', data.url);
              quill.setSelection(range.index + 1, 0);
            }
          }
        } catch (error) {
          console.error('Error uploading video:', error);
          alert('Ошибка загрузки видео');
        }
      };
      reader.readAsDataURL(file);
    };
  }, [onVideoUpload]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'size': ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '42px', '48px'] }],
        [{ 'font': ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida', 'times-new-roman', 'verdana'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['blockquote', 'code-block'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
        video: videoHandler
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), [imageHandler, videoHandler]);

  const formats = [
    'header', 'size', 'font',
    'bold', 'italic', 'underline', 'strike',
    'script',
    'blockquote', 'code-block',
    'color', 'background',
    'align',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  const handleChange = (content: string) => {
    if (content.length <= maxLength) {
      onChange(content);
    }
  };

  return (
    <div className="relative">
      <style>{`
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=arial]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=arial]::before {
          content: 'Arial';
          font-family: Arial, sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=comic-sans]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=comic-sans]::before {
          content: 'Comic Sans';
          font-family: 'Comic Sans MS', cursive;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=courier-new]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=courier-new]::before {
          content: 'Courier New';
          font-family: 'Courier New', monospace;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=georgia]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=georgia]::before {
          content: 'Georgia';
          font-family: Georgia, serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=helvetica]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=helvetica]::before {
          content: 'Helvetica';
          font-family: Helvetica, sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=lucida]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=lucida]::before {
          content: 'Lucida';
          font-family: 'Lucida Sans Unicode', sans-serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=times-new-roman]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=times-new-roman]::before {
          content: 'Times New Roman';
          font-family: 'Times New Roman', serif;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=verdana]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=verdana]::before {
          content: 'Verdana';
          font-family: Verdana, sans-serif;
        }
        
        .ql-font-arial { font-family: Arial, sans-serif; }
        .ql-font-comic-sans { font-family: 'Comic Sans MS', cursive; }
        .ql-font-courier-new { font-family: 'Courier New', monospace; }
        .ql-font-georgia { font-family: Georgia, serif; }
        .ql-font-helvetica { font-family: Helvetica, sans-serif; }
        .ql-font-lucida { font-family: 'Lucida Sans Unicode', sans-serif; }
        .ql-font-times-new-roman { font-family: 'Times New Roman', serif; }
        .ql-font-verdana { font-family: Verdana, sans-serif; }
        
        .ql-editor {
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
        }
        
        .ql-toolbar {
          background: #f8f9fa;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        
        .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white"
      />
      <div className="text-xs text-gray-500 mt-2 flex justify-between">
        <span>Поддерживается загрузка изображений и видео с компьютера</span>
        <span>{value.length} / {maxLength} символов</span>
      </div>
    </div>
  );
};

export default AdvancedRichTextEditor;
