// Gerenciador nativo de arquivos brutos via IndexedDB e Supabase Storage para materiais da plataforma Vellessa
import { supabase, isSupabaseConfigured } from "./supabase";
import {
  getDriveThumbnailUrl,
  getDriveDirectDownloadUrl,
} from "./creative-storage";

export { getDriveThumbnailUrl, getDriveDirectDownloadUrl };

// ── HELPERS UNIVERSAIS DO GOOGLE DRIVE/DOCS/SHEETS ──────────────────────────

/**
 * Extrai o ID de um arquivo do Google Drive (file/d/ID, open?id=ID, uc?id=ID).
 * Retorna null para links de pasta.
 */
export function getDriveFileId(url: string): string | null {
  const t = url.trim();
  if (/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\//.test(t)) return null;
  const m = t.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]{10,})/) ||
    t.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
  if (m) return m[1];
  const uc = t.match(/drive\.google\.com\/uc.*[?&]id=([a-zA-Z0-9_-]{10,})/);
  return uc ? uc[1] : null;
}

/** Extrai o ID de um documento Google Docs (docs.google.com/document/d/ID). */
export function getGoogleDocsId(url: string): string | null {
  const m = url.trim().match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]{10,})/);
  return m ? m[1] : null;
}

/** Extrai o ID de uma planilha Google Sheets (docs.google.com/spreadsheets/d/ID). */
export function getGoogleSheetsId(url: string): string | null {
  const m = url.trim().match(/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]{10,})/);
  return m ? m[1] : null;
}

/** Extrai o ID de uma apresentação Google Slides (docs.google.com/presentation/d/ID). */
export function getGoogleSlidesId(url: string): string | null {
  const m = url.trim().match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]{10,})/);
  return m ? m[1] : null;
}

/** Extrai o ID de pasta do Google Drive (drive/folders/ID). */
export function getDriveFolderId(url: string): string | null {
  const m = url.trim().match(/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]{10,})/);
  return m ? m[1] : null;
}

/** Verifica se é um link de pasta do Google Drive. */
export function isDriveFolderUrl(url: string): boolean {
  return /drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\//.test(url.trim());
}

/** Verifica se é um link do Google Docs. */
export function isGoogleDocsUrl(url: string): boolean {
  return /docs\.google\.com\/document\/d\//.test(url.trim());
}

/** Verifica se é um link do Google Sheets. */
export function isGoogleSheetsUrl(url: string): boolean {
  return /docs\.google\.com\/spreadsheets\/d\//.test(url.trim());
}

/** Verifica se é um link do Google Slides. */
export function isGoogleSlidesUrl(url: string): boolean {
  return /docs\.google\.com\/presentation\/d\//.test(url.trim());
}

/** Verifica se é qualquer URL suportada do ecossistema Google. */
export function isGoogleUrl(url: string): boolean {
  return (
    url.includes("drive.google.com") ||
    url.includes("docs.google.com")
  );
}

/** Gera URL de download direto do Google Drive (PDF, ZIP, Imagens etc.). */
export function buildDriveDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/** Gera URL de exportação de Google Docs como Word (.docx). */
export function buildDocsExportUrl(docId: string): string {
  return `https://docs.google.com/document/d/${docId}/export?format=docx`;
}

/** Gera URL de exportação de Google Sheets como Excel (.xlsx). */
export function buildSheetsExportUrl(sheetId: string): string {
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
}

/** Gera URL de exportação de Google Slides como PDF. */
export function buildSlidesExportUrl(slideId: string): string {
  return `https://docs.google.com/presentation/d/${slideId}/export?format=pdf`;
}

/** Gera URL de acesso direto a uma pasta do Google Drive. */
export function buildDriveFolderUrl(folderId: string): string {
  return `https://drive.google.com/drive/folders/${folderId}`;
}

// ── INTERFACE DO ITEM DE IMPORTAÇÃO ─────────────────────────────────────────

export interface DriveMaterialImportItem {
  id: string;
  originalUrl: string;
  driveFileId: string;
  directDownloadUrl: string;
  thumbnailUrl: string;
  title: string;
  /** "PDF" | "DOCX" | "XLSX" | "SLIDES" | "ZIP" | "VÍDEO" | "IMAGEM" | "PASTA" | "LINK" */
  kind: string;
  isValid: boolean;
  isFolder: boolean;
  /** Tipo de recurso para roteamento de ação pelo afiliado */
  resourceType: "drive_file" | "drive_folder" | "google_docs" | "google_sheets" | "google_slides";
}

// ── INFERIDOR DE FORMATO ─────────────────────────────────────────────────────

export function inferMaterialKind(url: string, title = ""): string {
  const lc = (url + " " + title).toLowerCase();
  // Google Docs => DOCX
  if (isGoogleDocsUrl(url)) return "DOCX";
  // Google Sheets => XLSX
  if (isGoogleSheetsUrl(url)) return "XLSX";
  // Google Slides => SLIDES
  if (isGoogleSlidesUrl(url)) return "SLIDES";
  // Pasta do Drive => PASTA
  if (isDriveFolderUrl(url)) return "PASTA";
  // Arquivos comuns pelo padrão de extensão / palavras-chave
  if (/\.pdf($|\?)/.test(lc) || /pdf|manual|apostila|documento|guia|anvisa|laudo/.test(lc)) return "PDF";
  if (/\.(zip|rar|7z|tar|gz)($|\?)/.test(lc) || /zip|rar|pacote|pack/.test(lc)) return "ZIP";
  if (/\.(docx?|odt|rtf)($|\?)/.test(lc) || /docx|texto|copy|roteiro|script/.test(lc)) return "DOCX";
  if (/\.(xlsx?|csv|ods)($|\?)/.test(lc) || /planilha|sheet|excel|tabela/.test(lc)) return "XLSX";
  if (/\.(mp4|mov|webm|avi|mkv)($|\?)/.test(lc) || /video|vídeo|reels|aula/.test(lc)) return "VÍDEO";
  if (/\.(png|jpe?g|webp|gif|svg)($|\?)/.test(lc) || /imagem|foto|banner|mockup/.test(lc)) return "IMAGEM";
  return "PDF";
}

// ── PARSER UNIVERSAL DE LINKS DO GOOGLE ─────────────────────────────────────

/**
 * Analisa um bloco de texto com múltiplos links do ecossistema Google
 * (Drive, Docs, Sheets, Slides) e retorna uma lista de itens prontos
 * para publicação, todos com isValid = true.
 */
export function parseDriveMaterialLinks(raw: string): DriveMaterialImportItem[] {
  const rawLinks = raw
    .split(/[\n,;]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 10 && isGoogleUrl(l));

  const seen = new Set<string>();
  const items: DriveMaterialImportItem[] = [];

  rawLinks.forEach((url, idx) => {
    if (seen.has(url)) return;
    seen.add(url);

    const uid = `drive-mat-import-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`;

    // ── Google Docs ──────────────────────────────────────────────────────────
    if (isGoogleDocsUrl(url)) {
      const docId = getGoogleDocsId(url)!;
      items.push({
        id: uid,
        originalUrl: url,
        driveFileId: docId,
        directDownloadUrl: buildDocsExportUrl(docId),
        thumbnailUrl: "",
        title: `Documento ${items.length + 1}`,
        kind: "DOCX",
        isValid: true,
        isFolder: false,
        resourceType: "google_docs",
      });
      return;
    }

    // ── Google Sheets ────────────────────────────────────────────────────────
    if (isGoogleSheetsUrl(url)) {
      const sheetId = getGoogleSheetsId(url)!;
      items.push({
        id: uid,
        originalUrl: url,
        driveFileId: sheetId,
        directDownloadUrl: buildSheetsExportUrl(sheetId),
        thumbnailUrl: "",
        title: `Planilha ${items.length + 1}`,
        kind: "XLSX",
        isValid: true,
        isFolder: false,
        resourceType: "google_sheets",
      });
      return;
    }

    // ── Google Slides ────────────────────────────────────────────────────────
    if (isGoogleSlidesUrl(url)) {
      const slideId = getGoogleSlidesId(url)!;
      items.push({
        id: uid,
        originalUrl: url,
        driveFileId: slideId,
        directDownloadUrl: buildSlidesExportUrl(slideId),
        thumbnailUrl: "",
        title: `Apresentação ${items.length + 1}`,
        kind: "SLIDES",
        isValid: true,
        isFolder: false,
        resourceType: "google_slides",
      });
      return;
    }

    // ── Pasta do Google Drive ────────────────────────────────────────────────
    if (isDriveFolderUrl(url)) {
      const folderId = getDriveFolderId(url) || "";
      items.push({
        id: uid,
        originalUrl: url,
        driveFileId: folderId,
        directDownloadUrl: url, // Link da pasta diretamente
        thumbnailUrl: "",
        title: `Pasta do Drive ${items.length + 1}`,
        kind: "PASTA",
        isValid: true,   // ✅ PASTA AGORA É VÁLIDA
        isFolder: true,
        resourceType: "drive_folder",
      });
      return;
    }

    // ── Arquivo comum do Google Drive ────────────────────────────────────────
    const fileId = getDriveFileId(url);
    if (fileId) {
      const kind = inferMaterialKind(url, "");
      items.push({
        id: uid,
        originalUrl: url,
        driveFileId: fileId,
        directDownloadUrl: buildDriveDownloadUrl(fileId),
        thumbnailUrl: getDriveThumbnailUrl(fileId, 400),
        title: `Material ${items.length + 1}`,
        kind,
        isValid: true,
        isFolder: false,
        resourceType: "drive_file",
      });
    }
  });

  return items;
}

const DB_NAME = "vellessa_materials_db";
const STORE_NAME = "materials_files";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB não está disponível neste navegador."));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function storeRawFile(id: string, file: Blob | File): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(file, id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.error("Erro ao salvar arquivo bruto no IndexedDB:", error);
    throw error;
  }
}

export async function getRawFile(id: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.error("Erro ao recuperar arquivo do IndexedDB:", error);
    return null;
  }
}

export async function deleteRawFile(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    console.error("Erro ao excluir arquivo do IndexedDB:", error);
  }
}

export async function deleteRawFiles(ids: string[]): Promise<void> {
  if (!ids || ids.length === 0) return;
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      ids.forEach((id) => {
        store.delete(id);
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.error("Erro ao excluir múltiplos arquivos do IndexedDB:", error);
  }
}

/**
 * Envia arquivo bruto para o bucket "materiais" no Supabase Storage.
 * Retorna a URL pública de acesso CDN ou null em caso de falha.
 */
export async function uploadMaterialToSupabase(
  id: string,
  file: Blob | File,
  originalName?: string
): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const fileName = originalName || (file instanceof File ? file.name : `material_${id}`);
    const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `files/${id}_${cleanName}`;

    const { data, error } = await supabase.storage
      .from("materiais")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (!error && data) {
      const { data: pubData } = supabase.storage
        .from("materiais")
        .getPublicUrl(path);

      return pubData.publicUrl;
    } else if (error) {
      console.warn(`[FileStorage] Supabase storage upload warning (${error.message})`);
    }
  } catch (err) {
    console.warn("[FileStorage] Exceção ao enviar para Supabase Storage:", err);
  }
  return null;
}

/**
 * Remove arquivo do bucket "materiais" no Supabase Storage caso exista.
 */
export async function deleteMaterialFromSupabase(paths: string[]): Promise<void> {
  if (!isSupabaseConfigured || !supabase || !paths || paths.length === 0) return;
  try {
    await supabase.storage.from("materiais").remove(paths);
  } catch (err) {
    console.warn("[FileStorage] Falha ao remover arquivos do Supabase Storage:", err);
  }
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${val.toString().replace(".", ",")} ${sizes[i]}`;
}

/**
 * Gera uma miniatura leve (dataURL) para imagens usando Canvas API.
 */
export async function generateImageThumbnail(file: File | Blob, maxWidth = 320, maxHeight = 320): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("");
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      try {
        const dataUrl = canvas.toDataURL("image/webp", 0.8);
        resolve(dataUrl);
      } catch {
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("");
    };
    img.src = url;
  });
}

/**
 * Gera uma miniatura leve do primeiro frame de um vídeo HTML5.
 */
export async function generateVideoThumbnail(file: File | Blob): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    let hasResolved = false;
    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.remove();
    };

    const timeout = setTimeout(() => {
      if (!hasResolved) {
        hasResolved = true;
        cleanup();
        resolve(null);
      }
    }, 4000);

    video.onloadeddata = () => {
      video.currentTime = Math.min(1.0, video.duration > 0 ? video.duration / 4 : 0.5);
    };

    video.onseeked = () => {
      if (hasResolved) return;
      hasResolved = true;
      clearTimeout(timeout);
      try {
        const canvas = document.createElement("canvas");
        const maxW = 320;
        const maxH = 320;
        let w = video.videoWidth || 320;
        let h = video.videoHeight || 180;
        if (w > h) {
          if (w > maxW) {
            h = Math.round((h * maxW) / w);
            w = maxW;
          }
        } else {
          if (h > maxH) {
            w = Math.round((w * maxH) / h);
            h = maxH;
          }
        }
        canvas.width = Math.max(1, w);
        canvas.height = Math.max(1, h);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, w, h);
          try {
            const dataUrl = canvas.toDataURL("image/webp", 0.75);
            cleanup();
            resolve(dataUrl);
            return;
          } catch {
            const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
            cleanup();
            resolve(dataUrl);
            return;
          }
        }
      } catch (e) {
        console.warn("Falha ao gerar frame de vídeo:", e);
      }
      cleanup();
      resolve(null);
    };

    video.onerror = () => {
      if (!hasResolved) {
        hasResolved = true;
        clearTimeout(timeout);
        cleanup();
        resolve(null);
      }
    };

    video.src = url;
  });
}
