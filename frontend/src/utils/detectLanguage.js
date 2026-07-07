export function detectLanguage(code, filename) {
  if (filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'js' || ext === 'jsx') return 'javascript';
    if (ext === 'ts' || ext === 'tsx') return 'typescript';
    if (ext === 'html') return 'html';
    if (ext === 'css') return 'css';
    if (ext === 'json') return 'json';
    if (ext === 'py') return 'python';
  }
  
  if (!code) return 'javascript';
  
  // Fallback by content detection
  const trimmed = code.trim();
  if (trimmed.startsWith('<') || trimmed.includes('<!DOCTYPE') || trimmed.includes('<html')) {
    return 'html';
  }
  if (trimmed.includes('import ') || trimmed.includes('const ') || trimmed.includes('function ')) {
    return 'javascript';
  }
  return 'javascript';
}
