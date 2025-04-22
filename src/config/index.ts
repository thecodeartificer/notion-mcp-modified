import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
config();

// Configuration
export const CONFIG = {
  serverName: "notion-mcp-server",
  serverVersion: "1.0.1",
  notion: {
    token: process.env.NOTION_TOKEN || '',
    pageId: process.env.NOTION_PAGE_ID || '',
  },
};

// Validate required environment variables
if (!CONFIG.notion.token) {
  console.warn('WARNING: NOTION_TOKEN environment variable is not set');
}

if (!CONFIG.notion.pageId) {
  console.warn('WARNING: NOTION_PAGE_ID environment variable is not set');
}
