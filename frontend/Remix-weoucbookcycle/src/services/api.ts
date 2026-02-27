/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {}; // 让这个文件成为一个模块// src/services/api.ts
/// <reference types="vite/client" />
import { User, BookItem, ChatSession, ChatMessage } from '../data/mockData';

// 通过全局声明文件（src/env.d.ts）提高类型安全
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export {}; // 保证这是一个模块，以便上面的 reference 生效

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // ====== 认证相关 ======
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  register: async (email: string, password: string, name: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return res.json();
  },

  logout: async () => {
    localStorage.removeItem('token');
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // ====== 初始化数据 ======
  init: async () => {
    const res = await fetch(`${API_BASE}/init`, {
      headers: getAuthHeader(),
    });
    return res.json() as Promise<{
      users: Record<string, User>;
      books: BookItem[];
      chats: ChatSession[];
      messages: Record<string, ChatMessage[]>;
    }>;
  },

  // ====== 书籍相关 ======
  getBooks: async () => {
    const res = await fetch(`${API_BASE}/books`, {
      headers: getAuthHeader(),
    });
    return res.json() as Promise<BookItem[]>;
  },

  getBook: async (id: string) => {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      headers: getAuthHeader(),
    });
    return res.json() as Promise<BookItem>;
  },

  postBook: async (book: Partial<BookItem>) => {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(book),
    });
    return res.json() as Promise<BookItem>;
  },

  // ====== 聊天相关 ======
  getChats: async () => {
    const res = await fetch(`${API_BASE}/chats`, {
      headers: getAuthHeader(),
    });
    return res.json() as Promise<ChatSession[]>;
  },

  getChatMessages: async (chatId: string) => {
    const res = await fetch(`${API_BASE}/chats/${chatId}/messages`, {
      headers: getAuthHeader(),
    });
    return res.json() as Promise<ChatMessage[]>;
  },

  startChat: async (sellerId: string) => {
    const res = await fetch(`${API_BASE}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ sellerId }),
    });
    return res.json() as Promise<ChatSession>;
  },

  sendMessage: async (chatId: string, text: string) => {
    const res = await fetch(`${API_BASE}/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ text }),
    });
    return res.json() as Promise<ChatMessage>;
  },

  // ====== 评价相关 ======
  evaluateUser: async (sellerId: string, isGood: boolean) => {
    const res = await fetch(`${API_BASE}/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ sellerId, isGood }),
    });
    return res.json() as Promise<User>;
  },

  // ====== 心愿单相关 ======
  toggleWishlist: async (bookId: string) => {
    const res = await fetch(`${API_BASE}/wishlist/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ bookId }),
    });
    return res.json() as Promise<string[]>;
  },
};