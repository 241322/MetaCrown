export const normalizeTag = (tag) =>
  ('#' + String(tag || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase()).slice(0, 10); // "#" + up to 9 chars

export async function getPlayer(tag) {
  const clean = String(tag || '').replace(/^#+/, '');
  const res = await fetch(`http://localhost:6969/api/cr/player/${clean}`);
  if (!res.ok) throw new Error(`Player fetch failed (${res.status})`);
  return res.json();
}

export async function getPlayerBattles(tag) {
  const clean = String(tag || '').replace(/^#+/, '');
  const res = await fetch(`http://localhost:6969/api/cr/player/${clean}/battles`);
  if (!res.ok) throw new Error('Battlelog fetch failed');
  return res.json();
}