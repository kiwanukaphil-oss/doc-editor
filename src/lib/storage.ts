/**
 * LocalStorage Utilities
 *
 * Functions for persisting documents to browser localStorage.
 * This provides offline-first functionality for the MVP.
 */

import { Document, DocumentSummary, createDocumentSummary } from '@/types/document';

const STORAGE_PREFIX = 'doc_editor_';
const DOCUMENTS_KEY = `${STORAGE_PREFIX}documents`;
const DOCUMENT_KEY_PREFIX = `${STORAGE_PREFIX}doc_`;

/**
 * Storage utility class
 */
export class DocumentStorage {
  /**
   * Get all document summaries
   */
  static getAllDocuments(): DocumentSummary[] {
    try {
      const documentsJson = localStorage.getItem(DOCUMENTS_KEY);
      if (!documentsJson) return [];

      const documents = JSON.parse(documentsJson);

      // Parse dates
      return documents.map((doc: any) => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
        updatedAt: new Date(doc.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading documents:', error);
      return [];
    }
  }

  /**
   * Get a single document by ID
   */
  static getDocument(id: string): Document | null {
    try {
      const documentJson = localStorage.getItem(`${DOCUMENT_KEY_PREFIX}${id}`);
      if (!documentJson) return null;

      const document = JSON.parse(documentJson);

      // Parse dates
      return {
        ...document,
        metadata: {
          ...document.metadata,
          createdAt: new Date(document.metadata.createdAt),
          updatedAt: new Date(document.metadata.updatedAt),
        },
        blocks: document.blocks.map((block: any) => ({
          ...block,
          createdAt: new Date(block.createdAt),
          updatedAt: new Date(block.updatedAt),
        })),
      };
    } catch (error) {
      console.error('Error loading document:', error);
      return null;
    }
  }

  /**
   * Save a document
   */
  static saveDocument(document: Document): boolean {
    try {
      // Update the updatedAt timestamp
      const updatedDocument = {
        ...document,
        metadata: {
          ...document.metadata,
          updatedAt: new Date(),
        },
      };

      // Save the full document
      localStorage.setItem(
        `${DOCUMENT_KEY_PREFIX}${document.id}`,
        JSON.stringify(updatedDocument)
      );

      // Update the documents list with summary
      this.updateDocumentsList(updatedDocument);

      return true;
    } catch (error) {
      console.error('Error saving document:', error);
      return false;
    }
  }

  /**
   * Create a new document
   */
  static createDocument(document: Document): boolean {
    try {
      // Save the full document
      localStorage.setItem(
        `${DOCUMENT_KEY_PREFIX}${document.id}`,
        JSON.stringify(document)
      );

      // Update the documents list
      this.updateDocumentsList(document);

      return true;
    } catch (error) {
      console.error('Error creating document:', error);
      return false;
    }
  }

  /**
   * Delete a document
   */
  static deleteDocument(id: string): boolean {
    try {
      // Remove the document
      localStorage.removeItem(`${DOCUMENT_KEY_PREFIX}${id}`);

      // Update the documents list
      const documents = this.getAllDocuments();
      const updatedDocuments = documents.filter(doc => doc.id !== id);
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(updatedDocuments));

      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  /**
   * Update the documents list with a document summary
   */
  private static updateDocumentsList(document: Document): void {
    const documents = this.getAllDocuments();
    const summary = createDocumentSummary(document);

    // Find existing document or add new one
    const existingIndex = documents.findIndex(doc => doc.id === document.id);

    if (existingIndex >= 0) {
      documents[existingIndex] = summary;
    } else {
      documents.unshift(summary); // Add to beginning
    }

    // Sort by updatedAt (most recent first)
    documents.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
  }

  /**
   * Clear all documents (use with caution!)
   */
  static clearAllDocuments(): boolean {
    try {
      const documents = this.getAllDocuments();

      // Remove each document
      documents.forEach(doc => {
        localStorage.removeItem(`${DOCUMENT_KEY_PREFIX}${doc.id}`);
      });

      // Clear the documents list
      localStorage.removeItem(DOCUMENTS_KEY);

      return true;
    } catch (error) {
      console.error('Error clearing documents:', error);
      return false;
    }
  }

  /**
   * Export all documents as JSON
   */
  static exportAllDocuments(): string {
    const documents = this.getAllDocuments();
    const fullDocuments = documents
      .map(summary => this.getDocument(summary.id))
      .filter(doc => doc !== null);

    return JSON.stringify(fullDocuments, null, 2);
  }

  /**
   * Import documents from JSON
   */
  static importDocuments(jsonData: string): { success: number; failed: number } {
    let success = 0;
    let failed = 0;

    try {
      const documents: Document[] = JSON.parse(jsonData);

      documents.forEach(doc => {
        if (this.saveDocument(doc)) {
          success++;
        } else {
          failed++;
        }
      });
    } catch (error) {
      console.error('Error importing documents:', error);
      failed++;
    }

    return { success, failed };
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): {
    used: number;
    available: number;
    documentCount: number;
  } {
    let used = 0;

    // Calculate used storage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const value = localStorage.getItem(key);
        if (value) {
          used += value.length * 2; // UTF-16 uses 2 bytes per char
        }
      }
    }

    const documentCount = this.getAllDocuments().length;

    // Most browsers support 5-10MB localStorage
    const available = 10 * 1024 * 1024; // 10MB estimate

    return {
      used,
      available,
      documentCount,
    };
  }
}

// Export convenience functions
export const getAllDocuments = () => DocumentStorage.getAllDocuments();
export const getDocument = (id: string) => DocumentStorage.getDocument(id);
export const saveDocument = (document: Document) => DocumentStorage.saveDocument(document);
export const createDocument = (document: Document) => DocumentStorage.createDocument(document);
export const deleteDocument = (id: string) => DocumentStorage.deleteDocument(id);
export const clearAllDocuments = () => DocumentStorage.clearAllDocuments();
export const exportAllDocuments = () => DocumentStorage.exportAllDocuments();
export const importDocuments = (jsonData: string) => DocumentStorage.importDocuments(jsonData);
export const getStorageInfo = () => DocumentStorage.getStorageInfo();
