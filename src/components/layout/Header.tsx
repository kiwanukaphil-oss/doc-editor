import { Save, Download, Settings, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';

export interface HeaderProps {
  documentTitle?: string;
  onSave?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  isSaving?: boolean;
  className?: string;
}

export default function Header({
  documentTitle = 'Untitled Document',
  onSave,
  onExport,
  onSettings,
  isSaving = false,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'h-16 bg-white border-b border-gray-200',
        'flex items-center justify-between px-6',
        'sticky top-0 z-10',
        className
      )}
    >
      {/* Document Title */}
      <div className="flex items-center gap-3 flex-1">
        <input
          type="text"
          defaultValue={documentTitle}
          className={cn(
            'text-lg font-semibold text-gray-900',
            'bg-transparent border-none outline-none',
            'focus:bg-gray-50 rounded px-2 py-1',
            'transition-colors'
          )}
          placeholder="Untitled Document"
        />
        {isSaving && (
          <span className="text-sm text-gray-500 italic">Saving...</span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
          title="Save document"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          title="Export document"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onSettings}
          title="Document settings"
        >
          <Settings className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          title="More options"
        >
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
