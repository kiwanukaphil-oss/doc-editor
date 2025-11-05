import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Canvas from './Canvas';
import { useDocumentStore } from '@/stores/documentStore';

export interface AppLayoutProps {
  children: ReactNode;
  activeView: 'list' | 'editor';
  onViewChange: (view: 'list' | 'editor') => void;
}

export default function AppLayout({ children, activeView, onViewChange }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const currentDocument = useDocumentStore(state => state.currentDocument);
  const isSaving = useDocumentStore(state => state.isSaving);
  const saveCurrentDocument = useDocumentStore(state => state.saveCurrentDocument);

  const handleSave = () => {
    saveCurrentDocument();
  };

  const handleExport = () => {
    console.log('Export document');
    // TODO: Implement export functionality in Sprint 11-12
  };

  const handleSettings = () => {
    console.log('Open settings');
    // TODO: Implement settings in future sprint
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeView={activeView}
        onViewChange={onViewChange}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          documentTitle={currentDocument?.title || 'Document Editor'}
          onSave={handleSave}
          onExport={handleExport}
          onSettings={handleSettings}
          isSaving={isSaving}
        />

        <Canvas>{children}</Canvas>
      </div>
    </div>
  );
}
