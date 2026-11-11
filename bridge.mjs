import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';

const defaultPath = join(homedir(), 'AppData', 'LocalLow', 'Questing Goose Studio', 'Probably Stolen',
  'ModConfigs', 'local.game-mcp.connection.json');
const discovery = process.argv[2] ?? defaultPath;
const endpoint = 'http://127.0.0.1:28739/mcp';
let version;
const lines = createInterface({ input: process.stdin, crlfDelay: Infinity });

function write(message) {
  process.stdout.write(JSON.stringify(message) + '\n');
}

for await (const line of lines) {
  if (!line.trim()) continue;
  let request;
  try {
    request = JSON.parse(line);
  } catch {
    write({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Invalid JSON' } });
    continue;
  }
  try {
    const connection = JSON.parse(await readFile(discovery, 'utf8'));
    if (connection.url !== endpoint || typeof connection.token !== 'string' ||
        !/^[a-f0-9]{64}$/.test(connection.token)) {
      throw new Error('Invalid local Game MCP connection file.');
    }
    const headers = {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
      authorization: `Bearer ${connection.token}`
    };
    if (version && request?.method !== 'initialize') headers['mcp-protocol-version'] = version;
    const response = await fetch(endpoint, {
      method: 'POST', headers, body: line, redirect: 'error',
      signal: AbortSignal.timeout(24000)
    });
    if (response.status === 202) continue;
    if (!response.ok) throw new Error(`Game MCP returned HTTP ${response.status}.`);
    const message = await response.json();
    if (request?.method === 'initialize') version = message.result?.protocolVersion;
    write(message);
  } catch (error) {
    if (request && Object.hasOwn(request, 'id')) {
      const message = error.code === 'ENOENT'
        ? 'Start the game with the Game MCP mod enabled, then reconnect.'
        : error.message;
      write({ jsonrpc: '2.0', id: request.id, error: { code: -32000, message } });
    }
  }
}
