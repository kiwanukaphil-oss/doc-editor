/**
 * Document Store (Zustand)
 *
 * Global state management for documents.
 * Handles document CRUD operations and syncs with localStorage.
 */

import { create } from 'zustand';
import { Document, DocumentSummary, Block, createEmptyDocument } from '@/types/document';
import * as storage from '@/lib/storage';

interface DocumentStore {
  // State
  documents: DocumentSummary[];
  currentDocument: Document | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Actions
  loadDocuments: () => void;
  loadDocument: (id: string) => void;
  createNewDocument: () => void;
  saveCurrentDocument: () => void;
  updateDocument: (updates: Partial<Document>) => void;
  updateDocumentTitle: (title: string) => void;
  deleteDocument: (id: string) => void;
  closeCurrentDocument: () => void;

  // Block operations
  addBlock: (block: Block) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;

  // Utility
  clearError: () => void;
  getDocumentById: (id: string) => DocumentSummary | undefined;
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  // Initial state
  documents: [],
  currentDocument: null,
  isLoading: false,
  isSaving: false,
  error: null,

  // Load all document summaries
  loadDocuments: () => {
    set({ isLoading: true, error: null });

    try {
      const documents = storage.getAllDocuments();
      set({ documents, isLoading: false });
    } catch (error) {
      set({
        error: 'Failed to load documents',
        isLoading: false,
      });
    }
  },

  // Load a specific document
  loadDocument: (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const document = storage.getDocument(id);

      if (document) {
        set({ currentDocument: document, isLoading: false });
      } else {
        set({
          error: 'Document not found',
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: 'Failed to load document',
        isLoading: false,
      });
    }
  },

  // Create a new document
  createNewDocument: () => {
    try {
      const newDocument = createEmptyDocument();

      // Save to localStorage
      storage.createDocument(newDocument);

      // Update state
      set({
        currentDocument: newDocument,
        documents: [
          {
            id: newDocument.id,
            title: newDocument.title,
            createdAt: newDocument.metadata.createdAt,
            updatedAt: newDocument.metadata.updatedAt,
            blockCount: newDocument.blocks.length,
            wordCount: 0,
          },
          ...get().documents,
        ],
      });
    } catch (error) {
      set({ error: 'Failed to create document' });
    }
  },

  // Save the current document
  saveCurrentDocument: () => {
    const { currentDocument } = get();

    if (!currentDocument) {
      set({ error: 'No document to save' });
      return;
    }

    set({ isSaving: true, error: null });

    try {
      storage.saveDocument(currentDocument);

      // Update documents list
      const documents = storage.getAllDocuments();

      set({
        documents,
        isSaving: false,
      });
    } catch (error) {
      set({
        error: 'Failed to save document',
        isSaving: false,
      });
    }
  },

  // Update the current document
  updateDocument: (updates: Partial<Document>) => {
    const { currentDocument } = get();

    if (!currentDocument) return;

    set({
      currentDocument: {
        ...currentDocument,
        ...updates,
        metadata: {
          ...currentDocument.metadata,
          updatedAt: new Date(),
        },
      },
    });
  },

  // Update document title
  updateDocumentTitle: (title: string) => {
    const { currentDocument, updateDocument } = get();

    if (!currentDocument) return;

    updateDocument({ title });
  },

  // Delete a document
  deleteDocument: (id: string) => {
    try {
      storage.deleteDocument(id);

      set({
        documents: get().documents.filter(doc => doc.id !== id),
        currentDocument:
          get().currentDocument?.id === id ? null : get().currentDocument,
      });
    } catch (error) {
      set({ error: 'Failed to delete document' });
    }
  },

  // Close the current document
  closeCurrentDocument: () => {
    const { saveCurrentDocument } = get();

    // Auto-save before closing
    saveCurrentDocument();

    set({ currentDocument: null });
  },

  // Add a new block
  addBlock: (block: Block) => {
    const { currentDocument } = get();

    if (!currentDocument) return;

    const blocks = [...currentDocument.blocks, block];

    // Update positions
    blocks.forEach((b, index) => {
      b.position = index;
    });

    set({
      currentDocument: {
        ...currentDocument,
        blocks,
        metadata: {
          ...currentDocument.metadata,
          updatedAt: new Date(),
        },
      },
    });
  },

  // Update a block
  updateBlock: (blockId: string, updates: Partial<Block>) => {
    const { currentDocument } = get();

    if (!currentDocument) return;

    const blocks = currentDocument.blocks.map(block =>
      block.id === blockId
        ? {
            ...block,
            ...updates,
            updatedAt: new Date(),
          }
        : block
    );

    set({
      currentDocument: {
        ...currentDocument,
        blocks,
        metadata: {
          ...currentDocument.metadata,
          updatedAt: new Date(),
        },
      },
    });
  },

  // Delete a block
  deleteBlock: (blockId: string) => {
    const { currentDocument } = get();

    if (!currentDocument) return;

    const blocks = currentDocument.blocks
      .filter(block => block.id !== blockId)
      .map((block, index) => ({
        ...block,
        position: index,
      }));

    set({
      currentDocument: {
        ...currentDocument,
        blocks,
        metadata: {
          ...currentDocument.metadata,
          updatedAt: new Date(),
        },
      },
    });
  },

  // Reorder blocks (for drag-and-drop)
  reorderBlocks: (startIndex: number, endIndex: number) => {
    const { currentDocument } = get();

    if (!currentDocument) return;

    const blocks = [...currentDocument.blocks];
    const [removed] = blocks.splice(startIndex, 1);
    blocks.splice(endIndex, 0, removed);

    // Update positions
    blocks.forEach((block, index) => {
      block.position = index;
    });

    set({
      currentDocument: {
        ...currentDocument,
        blocks,
        metadata: {
          ...currentDocument.metadata,
          updatedAt: new Date(),
        },
      },
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Get document by ID
  getDocumentById: (id: string) => {
    return get().documents.find(doc => doc.id === id);
  },
}));

// Selectors for optimized access
export const useDocuments = () => useDocumentStore(state => state.documents);
export const useCurrentDocument = () => useDocumentStore(state => state.currentDocument);
export const useIsLoading = () => useDocumentStore(state => state.isLoading);
export const useIsSaving = () => useDocumentStore(state => state.isSaving);
export const useDocumentError = () => useDocumentStore(state => state.error);
