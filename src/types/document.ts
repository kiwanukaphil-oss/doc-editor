/**
 * Document Type Definitions
 *
 * Core data structures for the document editor.
 * Defines Document, Block, and related types.
 */

/**
 * Block Types
 * Different types of content blocks that can exist in a document
 */
export type BlockType =
  | 'heading'      // H1-H6 headings
  | 'paragraph'    // Regular text paragraph
  | 'table'        // Data table
  | 'list'         // Bulleted or numbered list
  | 'image'        // Image block
  | 'divider'      // Horizontal divider
  | 'code'         // Code block
  | 'quote'        // Block quote
  | 'toc';         // Table of contents

/**
 * Text Alignment
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Heading Levels
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * List Types
 */
export type ListType = 'bulleted' | 'numbered' | 'checklist';

/**
 * Block Styles
 * Visual styling options for blocks
 */
export interface BlockStyles {
  textAlign?: TextAlign;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  backgroundColor?: string;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  margin?: {
    top?: number;
    bottom?: number;
  };
}

/**
 * Heading Block Content
 */
export interface HeadingContent {
  level: HeadingLevel;
  text: string;
}

/**
 * Paragraph Block Content
 */
export interface ParagraphContent {
  text: string;
  html?: string; // Rich text HTML content from TipTap
}

/**
 * Table Cell
 */
export interface TableCell {
  value: string | number | boolean | null;
  formula?: string;
  styles?: {
    fontWeight?: number;
    color?: string;
    backgroundColor?: string;
    textAlign?: TextAlign;
  };
}

/**
 * Table Column
 */
export interface TableColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'percentage';
  width: number;
  format?: string;
}

/**
 * Table Row
 */
export interface TableRow {
  id: string;
  cells: Record<string, TableCell>;
  level: 0 | 1 | 2 | 3; // Hierarchy level
  parentId?: string;
  collapsed?: boolean;
  styles?: {
    backgroundColor?: string;
    fontWeight?: number;
  };
}

/**
 * Table Block Content
 */
export interface TableContent {
  columns: TableColumn[];
  rows: TableRow[];
}

/**
 * Table Data (alias for TableContent)
 */
export type TableData = TableContent;

/**
 * List Item
 */
export interface ListItem {
  id: string;
  text: string;
  checked?: boolean; // For checklist type
  level: number; // Nesting level
}

/**
 * List Block Content
 */
export interface ListContent {
  type: ListType;
  items: ListItem[];
}

/**
 * Image Block Content
 */
export interface ImageContent {
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

/**
 * Code Block Content
 */
export interface CodeContent {
  code: string;
  language?: string;
}

/**
 * Quote Block Content
 */
export interface QuoteContent {
  text: string;
  author?: string;
}

/**
 * Block Content Union Type
 */
export type BlockContent =
  | HeadingContent
  | ParagraphContent
  | TableContent
  | ListContent
  | ImageContent
  | CodeContent
  | QuoteContent
  | null;

/**
 * Block
 * A single content block in a document
 */
export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  position: number; // Order in document
  styles?: BlockStyles;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Document Settings
 * Configuration options for the document
 */
export interface DocumentSettings {
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  headerFooter?: {
    showHeader: boolean;
    showFooter: boolean;
    showPageNumbers: boolean;
    headerText?: string;
    footerText?: string;
  };
  theme: 'light' | 'dark';
}

/**
 * Document Metadata
 */
export interface DocumentMetadata {
  createdAt: Date;
  updatedAt: Date;
  version: number;
  author?: string;
  template?: string;
  tags?: string[];
  wordCount?: number;
}

/**
 * Document
 * Main document structure
 */
export interface Document {
  id: string;
  title: string;
  blocks: Block[];
  settings: DocumentSettings;
  metadata: DocumentMetadata;
}

/**
 * Document Summary
 * Lightweight version for document lists
 */
export interface DocumentSummary {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  blockCount: number;
  wordCount?: number;
}

/**
 * Default document settings
 */
export const defaultDocumentSettings: DocumentSettings = {
  pageSize: 'A4',
  orientation: 'portrait',
  margins: {
    top: 72,    // 1 inch = 72 points
    right: 72,
    bottom: 72,
    left: 72,
  },
  headerFooter: {
    showHeader: false,
    showFooter: false,
    showPageNumbers: false,
  },
  theme: 'light',
};

/**
 * Helper function to create a new empty document
 */
export function createEmptyDocument(): Document {
  const now = new Date();

  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Untitled Document',
    blocks: [
      {
        id: `block-${Date.now()}`,
        type: 'paragraph',
        content: {
          text: '',
          html: '',
        },
        position: 0,
        createdAt: now,
        updatedAt: now,
      },
    ],
    settings: { ...defaultDocumentSettings },
    metadata: {
      createdAt: now,
      updatedAt: now,
      version: 1,
      wordCount: 0,
    },
  };
}

/**
 * Helper function to create a document summary from a full document
 */
export function createDocumentSummary(document: Document): DocumentSummary {
  return {
    id: document.id,
    title: document.title,
    createdAt: document.metadata.createdAt,
    updatedAt: document.metadata.updatedAt,
    blockCount: document.blocks.length,
    wordCount: document.metadata.wordCount,
  };
}

/**
 * Helper function to create a new block
 */
export function createBlock(type: BlockType, content: BlockContent = null): Block {
  const now = new Date();

  return {
    id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    content,
    position: 0, // Will be set when added to document
    createdAt: now,
    updatedAt: now,
  };
}
