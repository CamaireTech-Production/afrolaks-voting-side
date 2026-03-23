/**
 * Firestore Data Types & Interfaces
 * Used throughout frontend and admin for type safety
 *
 * Sync with Firebase Firestore schema (see CLAUDE.md)
 */

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Nominee {
  id: string;
  name: string;
  bio: string;
  image: string;
  categoryId: string;
  voteCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  isActive: boolean;
}

export interface Vote {
  id: string;
  nomineeId: string;
  categoryId: string;
  voteCount: number;
  amountXAF: number;
  transactionId: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  userEmail?: string;
  timestamp: string | Date;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
  };
}

export interface Podcast {
  id: string;
  episodeNumber: number;
  title: string;
  guest: string;
  duration: string;
  description?: string;
  audioUrl?: string;
  spotifyLink?: string;
  order: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  category?: string;
  createdAt: string | Date;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: 'voting' | 'partnership' | 'media' | 'general' | 'feedback';
  message: string;
  timestamp: string | Date;
  status: 'new' | 'read' | 'replied';
  response?: string;
}

/**
 * Vote creation payload (what frontend sends)
 */
export interface VotePayload {
  nomineeId: string;
  categoryId: string;
  voteCount: number; // User wants to buy N votes
  // Additional fields for payment will be added in Phase 2
}

/**
 * Contact form submission payload
 */
export interface ContactPayload {
  name: string;
  email: string;
  subject: ContactSubmission['subject'];
  message: string;
}

/**
 * Admin CRUD responses
 */
export interface CRUDResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Pagination for lists
 */
export interface PaginationOptions {
  pageSize: number;
  pageNumber: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Query response with pagination
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  pageNumber: number;
  pageSize: number;
  hasNextPage: boolean;
}
