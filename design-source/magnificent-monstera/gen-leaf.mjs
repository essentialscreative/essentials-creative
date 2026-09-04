// Monstera deliciosa leaf geometry: blade outline, fenestration cuts, venation.
// Cuts ride an SVG <mask>, so a split's mouth can open past the margin
// without painting anything outside the blade.
const MID = 300;
const RAD = Math.PI / 180;

// Broad cordate blade: widest just above centre, deep basal sinus at the petiole.
const blade = [
  'M 300 44',
  'C 398 96 512 200 566 336',
  'C 604 424 602 530 562 614',
  'C 524 694 448 744 372 772',
  'C 348 780 322 768 308 714',
  'C 305 700 295 700 292 714',
  'C 278 768 252 780 228 772',
  'C 152 744 76 694 38 614',
  'C -2 530 -4 424 34 336',
  'C 88 200 202 96 300 44',
  'Z',
].join(' ');

// Marginal splits, fanning off the midrib. `inset` pushes alternate splits
// short of the midrib so they don't all bite to the same depth.
const splits = [
  { y: 148, deg: -44, inset: 52, len: 430, tipHalf: 5, outHalf: 19 },
  { y: 252, deg: -27, inset: 92, len: 440, tipHalf: 6, outHalf: 22 },
  { y: 356, deg: -10, inset: 50, len: 450, tipHalf: 6, outHalf: 23 },
  { y: 458, deg:   7, inset: 94, len: 450, tipHalf: 6, outHalf: 22 },
  { y: 556, deg:  25, inset: 52, len: 430, tipHalf: 5, outHalf: 20 },
  { y: 632, deg:  42, inset: 96, len: 370, tipHalf: 5, outHalf: 17 },
];

// Free windows: the fenestrations proper, riding between the splits.
const windows = [
  { c: [346, 206], r: [12, 30], rot: -46 },
  { c: [352, 300], r: [15, 42], rot: -30 },
  { c: [344, 402], r: [13, 34], rot: -12 },
  { c: [356, 500], r: [16, 45], rot:   9 },
  { c: [346, 596], r: [13, 33], rot:  27 },
];

const mirror = (x) => 2 * MID - x;

function wedge(s, flip) {
  const dir = (flip ? 180 - s.deg : s.deg) * RAD;
  const tx = flip ? mirror(MID + s.inset) : MID + s.inset;
  const ty = s.y;
  const ux = Math.cos(dir), uy = Math.sin(dir);
  const px = -uy, py = ux;
  const ox = tx + ux * s.len, oy = ty + uy * s.len;
  const p = (x, y, h) => `${(x + px * h).toFixed(1)} ${(y + py * h).toFixed(1)}`;
  // Slight bow toward the apex-side flank keeps the slit from reading as a bar.
  const bow = flip ? -6 : 6;
  const mx = (tx + ox) / 2 + px * bow, my = (ty + oy) / 2 + py * bow;
  return [
    `M ${p(ox, oy, s.outHalf)}`,
    `Q ${(mx + px * s.outHalf * 0.6).toFixed(1)} ${(my + py * s.outHalf * 0.6).toFixed(1)} ${p(tx, ty, s.tipHalf)}`,
    `Q ${(tx - ux * s.tipHalf * 1.7).toFixed(1)} ${(ty - uy * s.tipHalf * 1.7).toFixed(1)} ${p(tx, ty, -s.tipHalf)}`,
    `Q ${(mx - px * s.outHalf * 0.6).toFixed(1)} ${(my - py * s.outHalf * 0.6).toFixed(1)} ${p(ox, oy, -s.outHalf)}`,
    'Z',
  ].join(' ');
}

function oval({ c, r, rot }, flip) {
  const cx = flip ? mirror(c[0]) : c[0];
  const deg = flip ? -rot : rot;
  const a = deg * RAD, [rx, ry] = r;
  const cos = Math.cos(a), sin = Math.sin(a);
  const pt = (u, v) => `${(cx + u * cos - v * sin).toFixed(1)} ${(c[1] + u * sin + v * cos).toFixed(1)}`;
  return `M ${pt(0, -ry)} A ${rx} ${ry} ${deg.toFixed(1)} 1 1 ${pt(0, ry)} A ${rx} ${ry} ${deg.toFixed(1)} 1 1 ${pt(0, -ry)} Z`;
}

const cuts = [false, true].flatMap((f) => [
  ...splits.map((s) => wedge(s, f)),
  ...windows.map((w) => oval(w, f)),
]).join(' ');

// Midrib, plus one primary vein per lobe running out between the splits.
const midrib = 'M 300 66 C 303 300 303 520 300 700';
const laterals = [];
for (const flip of [false, true]) {
  splits.forEach((s, i) => {
    const next = splits[i + 1];
    const deg = next ? (s.deg + next.deg) / 2 + 4 : s.deg + 20;
    const dir = (flip ? 180 - deg : deg) * RAD;
    const y = next ? (s.y + next.y) / 2 : s.y + 30;
    const len = next ? s.len * 0.62 : 230;
    const ex = MID + Math.cos(dir) * len, ey = y + Math.sin(dir) * len;
    laterals.push(`M ${MID} ${y} Q ${(MID + (ex - MID) * 0.5).toFixed(1)} ${(y + (ey - y) * 0.32).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`);
  });
}

const petiole = 'M 300 700 C 296 782 288 860 280 942 C 274 1004 286 1052 312 1088';

console.log(JSON.stringify({ blade, cuts, veins: [midrib, ...laterals].join(' '), petiole }, null, 1));
