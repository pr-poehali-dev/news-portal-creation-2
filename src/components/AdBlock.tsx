import { useEffect, useRef } from 'react';

interface AdBlockProps {
  blockId: string;
  format?: 'top' | 'sidebar-left' | 'sidebar-right';
  className?: string;
}

const AdBlock = ({ blockId, format = 'top', className = '' }: AdBlockProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && window.Ya && window.Ya.Context) {
      window.Ya.Context.AdvManager.render({
        blockId: blockId,
        renderTo: adRef.current,
        async: true
      });
    }
  }, [blockId]);

  const getFormatStyles = () => {
    switch (format) {
      case 'top':
        return 'w-[970px] h-[200px] mx-auto';
      case 'sidebar-left':
        return 'w-[150px] min-h-[600px] sticky top-4';
      case 'sidebar-right':
        return 'w-[150px] min-h-[600px] sticky top-4';
      default:
        return '';
    }
  };

  return (
    <div 
      ref={adRef}
      className={`${getFormatStyles()} ${className} bg-gray-100 rounded flex items-center justify-center text-gray-400 text-sm`}
      data-block-id={blockId}
    >
      {!window.Ya && 'Реклама'}
    </div>
  );
};

declare global {
  interface Window {
    Ya?: {
      Context?: {
        AdvManager?: {
          render: (config: { blockId: string; renderTo: HTMLElement; async: boolean }) => void;
        };
      };
    };
  }
}

export default AdBlock;
