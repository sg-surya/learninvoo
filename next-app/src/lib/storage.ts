/**
 * Storage Utility for Learnivo
 * Uses IndexedDB for large files (PDFs, images) and localStorage for metadata
 */

const DB_NAME = 'learnivo_db';
const DB_VERSION = 1;
const STORE_PDFS = 'pdf_files';
const STORE_GENERATED = 'generated_content';

// Initialize IndexedDB
function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Store for PDF files
            if (!db.objectStoreNames.contains(STORE_PDFS)) {
                db.createObjectStore(STORE_PDFS, { keyPath: 'id' });
            }

            // Store for generated content (lesson plans, quizzes, etc.)
            if (!db.objectStoreNames.contains(STORE_GENERATED)) {
                const store = db.createObjectStore(STORE_GENERATED, { keyPath: 'id' });
                store.createIndex('type', 'type', { unique: false });
                store.createIndex('bookId', 'bookId', { unique: false });
                store.createIndex('createdAt', 'createdAt', { unique: false });
            }
        };
    });
}

// =====================
// PDF Storage Functions
// =====================

export interface StoredPDF {
    id: string;
    bookId: string;
    chapterId: string;
    fileName: string;
    fileSize: string;
    data: ArrayBuffer;
    createdAt: number;
}

/**
 * Save a PDF file to IndexedDB
 */
export async function savePDF(pdf: StoredPDF): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_PDFS], 'readwrite');
        const store = transaction.objectStore(STORE_PDFS);
        const request = store.put(pdf);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get a PDF file from IndexedDB by ID
 */
export async function getPDF(id: string): Promise<StoredPDF | null> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_PDFS], 'readonly');
        const store = transaction.objectStore(STORE_PDFS);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Delete a PDF file from IndexedDB
 */
export async function deletePDF(id: string): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_PDFS], 'readwrite');
        const store = transaction.objectStore(STORE_PDFS);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

/**
 * Convert File to ArrayBuffer for IndexedDB storage
 */
export function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

/**
 * Convert ArrayBuffer to Blob URL for PDF viewer
 */
export function arrayBufferToBlobUrl(buffer: ArrayBuffer, type: string = 'application/pdf'): string {
    const blob = new Blob([buffer], { type });
    return URL.createObjectURL(blob);
}

// =============================
// Generated Content Functions
// =============================

export interface GeneratedContent {
    id: string;
    type: 'lesson-plan' | 'quiz' | 'visual' | 'story' | 'hyper-local' | 'rubric' | 'simulation' | 'other';
    title: string;
    description?: string;
    content: string;
    contentType: 'text' | 'image' | 'ocr-preview';
    imageUrl?: string;
    bookId?: string;
    bookTitle?: string;
    chapterInfo?: string;
    toolId: string;
    formData: Record<string, any>;
    createdAt: number;
    updatedAt?: number;
}

/**
 * Save generated content to IndexedDB
 */
export async function saveGeneratedContent(content: GeneratedContent): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_GENERATED], 'readwrite');
        const store = transaction.objectStore(STORE_GENERATED);
        const request = store.put(content);

        request.onsuccess = () => {
            // Also update the workspace summary in localStorage for quick access
            updateWorkspaceSummary(content);
            resolve();
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get all generated content from IndexedDB
 */
export async function getAllGeneratedContent(): Promise<GeneratedContent[]> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_GENERATED], 'readonly');
        const store = transaction.objectStore(STORE_GENERATED);
        const request = store.getAll();

        request.onsuccess = () => {
            const results = request.result || [];
            // Sort by createdAt descending (newest first)
            results.sort((a, b) => b.createdAt - a.createdAt);
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get generated content by type
 */
export async function getGeneratedContentByType(type: GeneratedContent['type']): Promise<GeneratedContent[]> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_GENERATED], 'readonly');
        const store = transaction.objectStore(STORE_GENERATED);
        const index = store.index('type');
        const request = index.getAll(type);

        request.onsuccess = () => {
            const results = request.result || [];
            results.sort((a, b) => b.createdAt - a.createdAt);
            resolve(results);
        };
        request.onerror = () => reject(request.error);
    });
}

/**
 * Get a single generated content by ID
 */
export async function getGeneratedContent(id: string): Promise<GeneratedContent | null> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_GENERATED], 'readonly');
        const store = transaction.objectStore(STORE_GENERATED);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Delete generated content from IndexedDB
 */
export async function deleteGeneratedContent(id: string): Promise<void> {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_GENERATED], 'readwrite');
        const store = transaction.objectStore(STORE_GENERATED);
        const request = store.delete(id);

        request.onsuccess = () => {
            // Also remove from workspace summary
            removeFromWorkspaceSummary(id);
            resolve();
        };
        request.onerror = () => reject(request.error);
    });
}

// =============================
// Workspace Summary (localStorage)
// =============================

export interface WorkspaceItem {
    id: string;
    type: GeneratedContent['type'];
    title: string;
    toolId: string;
    createdAt: number;
    bookTitle?: string;
}

const WORKSPACE_KEY = 'workspace_items';

function updateWorkspaceSummary(content: GeneratedContent): void {
    try {
        const saved = localStorage.getItem(WORKSPACE_KEY);
        const items: WorkspaceItem[] = saved ? JSON.parse(saved) : [];

        // Remove existing item with same ID if exists
        const filtered = items.filter(item => item.id !== content.id);

        // Add new item at the beginning
        filtered.unshift({
            id: content.id,
            type: content.type,
            title: content.title,
            toolId: content.toolId,
            createdAt: content.createdAt,
            bookTitle: content.bookTitle,
        });

        // Keep only last 100 items
        const trimmed = filtered.slice(0, 100);
        localStorage.setItem(WORKSPACE_KEY, JSON.stringify(trimmed));
    } catch (error) {
        console.error('Error updating workspace summary:', error);
    }
}

function removeFromWorkspaceSummary(id: string): void {
    try {
        const saved = localStorage.getItem(WORKSPACE_KEY);
        if (saved) {
            const items: WorkspaceItem[] = JSON.parse(saved);
            const filtered = items.filter(item => item.id !== id);
            localStorage.setItem(WORKSPACE_KEY, JSON.stringify(filtered));
        }
    } catch (error) {
        console.error('Error removing from workspace summary:', error);
    }
}

/**
 * Get workspace summary from localStorage (quick access)
 */
export function getWorkspaceSummary(): WorkspaceItem[] {
    try {
        const saved = localStorage.getItem(WORKSPACE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error getting workspace summary:', error);
        return [];
    }
}

// =============================
// Utility Functions
// =============================

/**
 * Generate unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Get tool display name from toolId
 */
export function getToolDisplayName(toolId: string): string {
    const names: Record<string, string> = {
        'lesson-planner': 'Lesson Planner',
        'quiz-exam-generator': 'Quiz Generator',
        'visual-generator': 'Visual Generator',
        'story-generator': 'Story Generator',
        'hyper-local-content': 'Hyper Local Content',
        'paper-digitizer': 'Paper Digitizer',
        'simulation-generator': 'Simulation Generator',
        'rubric-generator': 'Rubric Generator',
    };
    return names[toolId] || toolId;
}

/**
 * Get content type icon color
 */
export function getTypeColor(type: GeneratedContent['type']): { bg: string; text: string } {
    const colors: Record<string, { bg: string; text: string }> = {
        'lesson-plan': { bg: 'bg-lime-100', text: 'text-lime-600' },
        'quiz': { bg: 'bg-purple-100', text: 'text-purple-600' },
        'visual': { bg: 'bg-sky-100', text: 'text-sky-600' },
        'story': { bg: 'bg-orange-100', text: 'text-orange-600' },
        'hyper-local': { bg: 'bg-rose-100', text: 'text-rose-600' },
        'rubric': { bg: 'bg-cyan-100', text: 'text-cyan-600' },
        'simulation': { bg: 'bg-emerald-100', text: 'text-emerald-600' },
        'other': { bg: 'bg-gray-100', text: 'text-gray-600' },
    };
    return colors[type] || colors['other'];
}
