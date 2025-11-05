import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Canvas from './Canvas';

export interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      console.log('Document saved!');
    }, 1000);
  };

  const handleExport = () => {
    console.log('Export document');
  };

  const handleSettings = () => {
    console.log('Open settings');
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          documentTitle="Untitled Document"
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
