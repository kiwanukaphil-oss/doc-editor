import { useEffect } from 'react';
import { FileText, Trash2, Clock } from 'lucide-react';
import { useDocumentStore } from '@/stores/documentStore';
import { formatDate } from '@/lib/utils';
import { Button } from './ui';
import { Card } from './ui/Card';

export default function DocumentList() {
  const documents = useDocumentStore(state => state.documents);
  const isLoading = useDocumentStore(state => state.isLoading);
  const loadDocuments = useDocumentStore(state => state.loadDocuments);
  const loadDocument = useDocumentStore(state => state.loadDocument);
  const deleteDocument = useDocumentStore(state => state.deleteDocument);

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleOpenDocument = (id: string) => {
    loadDocument(id);
  };

  const handleDeleteDocument = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteDocument(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No documents yet
        </h3>
        <p className="text-gray-600 mb-6">
          Create your first document to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Your Documents
        </h2>
        <span className="text-sm text-gray-500">
          {documents.length} {documents.length === 1 ? 'document' : 'documents'}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map(doc => (
          <Card
            key={doc.id}
            variant="elevated"
            padding="none"
            className="hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div
              onClick={() => handleOpenDocument(doc.id)}
              className="p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-900 truncate">
                    {doc.title}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDocument(doc.id, doc.title);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
                  title="Delete document"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated {formatDate(doc.updatedAt)}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span>{doc.blockCount} blocks</span>
                  {doc.wordCount !== undefined && (
                    <span>{doc.wordCount} words</span>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => handleOpenDocument(doc.id)}
              >
                Open Document
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
