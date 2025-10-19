// Generate a local placeholder image as a data URL to avoid external hosts
// Example: getPlaceholderImage('Box', 80, 80, '#4facfe', '#ffffff')
export function getPlaceholderImage(text = 'Item', width = 80, height = 80, bg = '#e2e8f0', fg = '#475569') {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Text
    ctx.fillStyle = fg;
    ctx.font = `bold ${Math.max(12, Math.floor(width / 5))}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const label = String(text || 'Item').slice(0, 10);
    ctx.fillText(label, width / 2, height / 2);

    return canvas.toDataURL('image/png');
  } catch {
    // Fallback: inline SVG data URL
    const label = encodeURIComponent(String(text || 'Item').slice(0, 10));
    const svg = `<?xml version='1.0' encoding='UTF-8'?>
      <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>
        <rect width='100%' height='100%' fill='${bg}'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='${fg}' font-family='Arial, sans-serif' font-size='${Math.max(12, Math.floor(width / 5))}' font-weight='700'>${label}</text>
      </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }
}
