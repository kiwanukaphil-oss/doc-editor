import { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import DocumentList from './components/DocumentList';
import DocumentEditor from './components/DocumentEditor';

function App() {
  const [activeView, setActiveView] = useState<'list' | 'editor'>('list');

  return (
    <AppLayout activeView={activeView} onViewChange={setActiveView}>
      {activeView === 'list' ? <DocumentList /> : <DocumentEditor />}
    </AppLayout>
  );
}

export default App;
