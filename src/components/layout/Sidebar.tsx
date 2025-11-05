import { useState } from 'react';
import { FileText, Plus, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';

export interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const [activeItem, setActiveItem] = useState<string | null>('all-documents');

  const navItems = [
    { id: 'all-documents', label: 'All Documents', icon: FolderOpen },
    { id: 'recent', label: 'Recent', icon: FileText },
  ];

  return (
    <aside
      className={cn(
        'h-screen bg-gray-50 border-r border-gray-200',
        'transition-all duration-300 ease-in-out',
        'flex flex-col',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold text-gray-900">Documents</h1>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:bg-gray-200 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* New Document Button */}
      <div className="p-3">
        <Button
          variant="primary"
          size="md"
          fullWidth
          className="justify-start gap-2"
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span>New Document</span>}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                'transition-colors duration-150',
                'text-sm font-medium',
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-200',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>Document Editor v0.1</p>
          </div>
        </div>
      )}
    </aside>
  );
}
