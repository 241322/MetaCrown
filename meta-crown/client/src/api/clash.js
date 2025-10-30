const API_BASE = 'https://metacrown.co.za';

export const normalizeTag = (tag) =>
  ('#' + String(tag || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()).slice(0, 10); // "#" + up to 9 chars

export async function getPlayer(tag) {
  // Ensure tag starts with # and URL encode it
  let cleanTag = String(tag || '').replace(/^#+/, '').toUpperCase();
  const encodedTag = encodeURIComponent('#' + cleanTag);
  const res = await fetch(`${API_BASE}/api/cr/player/${encodedTag}`);
  if (!res.ok) throw new Error(`Player fetch failed (${res.status})`);
  return res.json();
}

export async function getPlayerBattles(tagOrWithHash) {
  // Ensure tag starts with # and URL encode it
  let cleanTag = String(tagOrWithHash || '').replace(/^#+/, '').toUpperCase();
  const encodedTag = encodeURIComponent('#' + cleanTag);
  const res = await fetch(`${API_BASE}/api/cr/player/${encodedTag}/battles`);
  if (!res.ok) throw new Error("Failed to fetch battlelog");
  
  const data = await res.json();
  // Ensure we always return an array for battles
  return Array.isArray(data) ? data : [];
}