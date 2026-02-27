// src/env.d.ts
// 全局的环境变量类型声明，让 TS 认识 import.meta.env

/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_WS_URL?: string;
    // 在这里继续添加其它 VITE_ 前缀的变量
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {}; // 使此文件成为一个模块
