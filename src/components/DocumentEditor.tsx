import { useEffect } from 'react';
import { useDocumentStore } from '@/stores/documentStore';
import { Card, CardContent } from './ui';
import { EditorWithToolbar } from './editor';
import { EditableTable } from './table';
import type { ParagraphContent, TableContent } from '@/types/document';

export default function DocumentEditor() {
  const currentDocument = useDocumentStore(state => state.currentDocument);
  const saveCurrentDocument = useDocumentStore(state => state.saveCurrentDocument);
  const updateDocumentTitle = useDocumentStore(state => state.updateDocumentTitle);
  const updateBlock = useDocumentStore(state => state.updateBlock);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!currentDocument) return;

    const interval = setInterval(() => {
      saveCurrentDocument();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [currentDocument, saveCurrentDocument]);

  if (!currentDocument) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card variant="elevated" className="max-w-md">
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Document Open
            </h3>
            <p className="text-gray-600">
              Select a document from the sidebar or create a new one to start editing.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Document Title */}
      <div>
        <input
          type="text"
          value={currentDocument.title}
          onChange={(e) => updateDocumentTitle(e.target.value)}
          onBlur={saveCurrentDocument}
          className="text-4xl font-bold text-gray-900 bg-transparent border-none outline-none w-full focus:bg-gray-50 px-2 py-1 rounded transition-colors"
          placeholder="Untitled Document"
        />
        <div className="text-sm text-gray-500 mt-2 px-2">
          Last updated: {currentDocument.metadata.updatedAt.toLocaleString()}
        </div>
      </div>

      {/* Document Content */}
      <div className="space-y-4">
        {currentDocument.blocks.map((block) => (
          <Card key={block.id} variant="default" padding="md">
            <div>
              <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                {block.type} block
              </div>

              {block.type === 'paragraph' && block.content && (
                <EditorWithToolbar
                  content={(block.content as ParagraphContent).html || (block.content as ParagraphContent).text || ''}
                  onChange={(html) => {
                    updateBlock(block.id, {
                      content: {
                        text: html.replace(/<[^>]*>/g, ''), // Strip HTML for text
                        html,
                      } as ParagraphContent,
                    });
                  }}
                  placeholder="Start typing..."
                />
              )}

              {block.type === 'heading' && block.content && (
                <input
                  type="text"
                  defaultValue={(block.content as any).text || ''}
                  placeholder="Heading"
                  className="w-full text-2xl font-bold text-gray-900 bg-transparent border-none outline-none"
                  onBlur={(e) => {
                    // TODO: Update block content
                    console.log('Heading updated:', e.target.value);
                  }}
                />
              )}

              {block.type === 'table' && block.content && (
                <EditableTable
                  data={block.content as TableContent}
                  onChange={(tableData) => {
                    updateBlock(block.id, {
                      content: tableData,
                    });
                  }}
                />
              )}

              {!['paragraph', 'heading', 'table'].includes(block.type) && (
                <div className="text-gray-600">
                  {block.type} block (to be implemented)
                </div>
              )}
            </div>
          </Card>
        ))}

        {/* Add Block Button */}
        <button
          onClick={() => {
            // TODO: Add new block
            console.log('Add new block');
          }}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors"
        >
          + Add Block
        </button>
      </div>

      {/* Document Stats */}
      <Card variant="default" padding="sm">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            {currentDocument.blocks.length} {currentDocument.blocks.length === 1 ? 'block' : 'blocks'}
          </div>
          <div>
            Created: {currentDocument.metadata.createdAt.toLocaleDateString()}
          </div>
          <div>
            Version: {currentDocument.metadata.version}
          </div>
        </div>
      </Card>
    </div>
  );
}
