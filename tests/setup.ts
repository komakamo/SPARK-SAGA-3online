import { beforeAll, vi } from 'vitest';
import { loadGameData } from '../src/data-loader';
import fs from 'fs/promises';
import path from 'path';

// @ts-ignore
global.fetch = vi.fn(async (url: string) => {
  const projectRoot = process.cwd();
  // Map URL path to public directory
  const relativePath = url.startsWith('/') ? url.slice(1) : url;
  const filePath = path.resolve(projectRoot, 'public', relativePath);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return {
      ok: true,
      json: async () => JSON.parse(fileContent),
      statusText: 'OK',
    };
  } catch (error) {
    return {
      ok: false,
      statusText: `Failed to fetch: ${url}`,
    };
  }
});

beforeAll(async () => {
  await loadGameData();
});
