'use client';

import { useRef, useState } from 'react';
import {
  ComposableMap, Geographies, Geography,
  Marker, ZoomableGroup,
} from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/* ── Portfolio exposure: only these countries are colored ────────────────── */

const EXPOSURE: Record<string, string> = {
  '250': 'europe',   // France  — Euronext Paris
  '276': 'europe',   // Germany — XETRA
  '840': 'americas', // USA     — NYSE / NASDAQ / OTC
  '392': 'asia', '156': 'asia', '410': 'asia', '158': 'asia',
  '356': 'asia', '702': 'asia', '360': 'asia', '458': 'asia',
  '764': 'asia', '608': 'asia', '36':  'asia',
};

/* ── Broad zone sets (tooltip zone label only) ───────────────────────────── */

const EUROPE = new Set([
  '8','20','40','56','70','100','112','191','196','203','208','233','246','250',
  '276','300','336','348','352','372','380','428','438','440','442','470','492',
  '498','499','528','578','616','620','642','643','674','688','703','705','724',
  '752','756','804','807','826','831','832','833',
]);
const ASIA = new Set([
  '4','31','36','50','51','64','96','104','116','144','156','158','268','275',
  '356','360','364','368','376','392','398','400','408','410','414','417','418',
  '422','458','462','496','512','524','554','586','608','634','643','682','702',
  '704','760','762','764','784','792','795','860','887',
]);
const AMERICAS = new Set([
  '28','32','44','52','60','68','76','84','124','136','152','170','188','192',
  '214','218','222','308','320','328','332','340','388','484','558','591','600',
  '604','630','659','662','670','740','780','840','858','862',
]);

function getZone(id: string): string | null {
  if (EUROPE.has(id))   return 'europe';
  if (ASIA.has(id))     return 'asia';
  if (AMERICAS.has(id)) return 'americas';
  return null;
}

/* ── Colors ──────────────────────────────────────────────────────────────── */

const ZONE_FILL: Record<string, string> = {
  europe:   '#93C5FD',
  asia:     '#6EE7B7',
  americas: '#FCD34D',
};
const ZONE_COLOR: Record<string, string> = {
  europe:   '#2563EB',
  asia:     '#0A8E62',
  americas: '#B8963A',
};
const ZONE_LABEL: Record<string, string> = {
  europe:   'Europe',
  asia:     'Asie / Pacifique',
  americas: 'Amériques',
};

/* ── Country emoji (for tooltip) ─────────────────────────────────────────── */

const COUNTRY_EMOJI: Record<string, string> = {
  '250': '🇫🇷', '276': '🇩🇪', '840': '🇺🇸',
  '392': '🇯🇵', '156': '🇨🇳', '410': '🇰🇷', '158': '🇹🇼',
  '356': '🇮🇳', '702': '🇸🇬', '360': '🇮🇩', '458': '🇲🇾',
  '764': '🇹🇭', '608': '🇵🇭', '36':  '🇦🇺',
};

/* ── Country name lookup (French) ────────────────────────────────────────── */

const NAMES: Record<string, string> = {
  '8':'Albanie','20':'Andorre','40':'Autriche','56':'Belgique','70':'Bosnie',
  '100':'Bulgarie','112':'Biélorussie','191':'Croatie','196':'Chypre',
  '203':'Tchéquie','208':'Danemark','233':'Estonie','246':'Finlande',
  '250':'France','276':'Allemagne','300':'Grèce','336':'Vatican','348':'Hongrie',
  '352':'Islande','372':'Irlande','380':'Italie','428':'Lettonie',
  '438':'Liechtenstein','440':'Lituanie','442':'Luxembourg','470':'Malte',
  '492':'Monaco','498':'Moldavie','499':'Monténégro','528':'Pays-Bas',
  '578':'Norvège','616':'Pologne','620':'Portugal','642':'Roumanie',
  '643':'Russie','674':'Saint-Marin','688':'Serbie','703':'Slovaquie',
  '705':'Slovénie','724':'Espagne','752':'Suède','756':'Suisse',
  '804':'Ukraine','807':'Macédoine du Nord','826':'Royaume-Uni',
  '4':'Afghanistan','31':'Azerbaïdjan','36':'Australie','50':'Bangladesh',
  '51':'Arménie','64':'Bhoutan','96':'Brunéi','104':'Myanmar','116':'Cambodge',
  '144':'Sri Lanka','156':'Chine','158':'Taïwan','268':'Géorgie','275':'Palestine',
  '356':'Inde','360':'Indonésie','364':'Iran','368':'Irak','376':'Israël',
  '392':'Japon','398':'Kazakhstan','400':'Jordanie','408':'Corée du Nord',
  '410':'Corée du Sud','414':'Koweït','417':'Kirghizistan','418':'Laos',
  '422':'Liban','458':'Malaisie','462':'Maldives','496':'Mongolie','512':'Oman',
  '524':'Népal','554':'Nouvelle-Zélande','586':'Pakistan','608':'Philippines',
  '634':'Qatar','682':'Arabie saoudite','702':'Singapour','704':'Viêt Nam',
  '760':'Syrie','762':'Tadjikistan','764':'Thaïlande','784':'Émirats arabes unis',
  '792':'Turquie','795':'Turkménistan','860':'Ouzbékistan','887':'Yémen',
  '32':'Argentine','68':'Bolivie','76':'Brésil','84':'Belize','124':'Canada',
  '152':'Chili','170':'Colombie','188':'Costa Rica','192':'Cuba',
  '214':'Rép. dominicaine','218':'Équateur','222':'El Salvador',
  '320':'Guatemala','328':'Guyana','332':'Haïti','340':'Honduras',
  '388':'Jamaïque','484':'Mexique','558':'Nicaragua','591':'Panama',
  '600':'Paraguay','604':'Pérou','740':'Suriname','780':'Trinité-et-Tobago',
  '840':'États-Unis','858':'Uruguay','862':'Venezuela',
  '12':'Algérie','288':'Ghana','404':'Kenya','504':'Maroc',
  '566':'Nigéria','710':'Afrique du Sud','788':'Tunisie','818':'Égypte',
};

/* ── City markers ────────────────────────────────────────────────────────── */

interface CityMarker {
  name: string; emoji: string;
  coords: [number, number]; zone: string;
  exchange: string; tickers: string[];
}

const CITY_MARKERS: CityMarker[] = [
  // ── Direct listings ────────────────────────────────────────────────────
  { name:'Paris',        emoji:'🗼', coords:[2.35,   48.86],  zone:'europe',   exchange:'Euronext Paris', tickers:['SGO.PA','EL.PA','VIE.PA','PAASI.PA'] },
  { name:'Francfort',    emoji:'🇩🇪', coords:[8.68,   50.11],  zone:'europe',   exchange:'XETRA',          tickers:['SAP.DE'] },
  { name:'New York',     emoji:'🗽', coords:[-74.01, 40.71],  zone:'americas', exchange:'NYSE · NASDAQ',  tickers:['IONQ','ASTS','KRKNF','GC=F'] },
  // ── PAASI.PA underlying markets ────────────────────────────────────────
  { name:'Tokyo',        emoji:'🇯🇵', coords:[139.69, 35.69],  zone:'asia', exchange:'TSE',       tickers:['PAASI.PA'] },
  { name:'Séoul',        emoji:'🇰🇷', coords:[126.978,37.566], zone:'asia', exchange:'KRX',       tickers:['PAASI.PA'] },
  { name:'Hong Kong',    emoji:'🇭🇰', coords:[114.16, 22.29],  zone:'asia', exchange:'HKEX',      tickers:['PAASI.PA'] },
  { name:'Shanghai',     emoji:'🇨🇳', coords:[121.47, 31.23],  zone:'asia', exchange:'SSE',       tickers:['PAASI.PA'] },
  { name:'Mumbai',       emoji:'🇮🇳', coords:[72.88,  19.08],  zone:'asia', exchange:'NSE · BSE', tickers:['PAASI.PA'] },
  { name:'Taipei',       emoji:'🇹🇼', coords:[121.60, 25.10],  zone:'asia', exchange:'TWSE',      tickers:['PAASI.PA'] },
  { name:'Singapour',    emoji:'🇸🇬', coords:[103.82,  1.35],  zone:'asia', exchange:'SGX',       tickers:['PAASI.PA'] },
  { name:'Jakarta',      emoji:'🇮🇩', coords:[106.85, -6.21],  zone:'asia', exchange:'IDX',       tickers:['PAASI.PA'] },
  { name:'Kuala Lumpur', emoji:'🇲🇾', coords:[101.69,  3.15],  zone:'asia', exchange:'Bursa',     tickers:['PAASI.PA'] },
  { name:'Bangkok',      emoji:'🇹🇭', coords:[100.52, 13.74],  zone:'asia', exchange:'SET',       tickers:['PAASI.PA'] },
  { name:'Manille',      emoji:'🇵🇭', coords:[120.98, 14.60],  zone:'asia', exchange:'PSEi',      tickers:['PAASI.PA'] },
  { name:'Sydney',       emoji:'🇦🇺', coords:[151.21,-33.87],  zone:'asia', exchange:'ASX',       tickers:['PAASI.PA'] },
];

/* ── Zoom button ─────────────────────────────────────────────────────────── */

function ZoomBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold"
      style={{
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid rgba(26,37,64,0.10)',
        color: '#1A2540',
        boxShadow: '0 1px 4px rgba(26,37,64,0.08)',
        cursor: 'pointer',
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      {children}
    </button>
  );
}

/* ── Types ───────────────────────────────────────────────────────────────── */

interface Tip {
  id: string; name: string;
  exposedZone: string | undefined;
  tooltipZone: string | null;
  x: number; y: number;
}
interface Props { hoveredZone: string | null; onHoverZone: (z: string | null) => void }

/* ── Component ───────────────────────────────────────────────────────────── */

export default function MapChart({ hoveredZone, onHoverZone }: Props) {
  const mapRef  = useRef<HTMLDivElement>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [tip,  setTip]   = useState<Tip | null>(null);
  const [zoom, setZoom]  = useState(1);
  const [center, setCenter] = useState<[number, number]>([15, 8]);

  const zoomIn  = () => setZoom(z => Math.min(+(z * 1.7).toFixed(2), 10));
  const zoomOut = () => setZoom(z => Math.max(+(z / 1.7).toFixed(2), 1));
  const reset   = () => { setZoom(1); setCenter([15, 8]); };

  const s = 1 / zoom;

  return (
    <div
      ref={mapRef}
      className="relative w-full select-none overflow-hidden"
      style={{ background: '#E8EFF9', borderRadius: 12 }}
      onMouseLeave={() => setTip(null)}
    >
      {/* ── Zoom controls ──────────────────────────── */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
        <ZoomBtn onClick={zoomIn}>+</ZoomBtn>
        <ZoomBtn onClick={zoomOut}>−</ZoomBtn>
        {zoom > 1.05 && <ZoomBtn onClick={reset}>↺</ZoomBtn>}
      </div>

      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 145, center: [15, 8] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <defs>
          <radialGradient id="ocean" cx="50%" cy="40%" r="70%">
            <stop offset="0%"   stopColor="#C4DCED" />
            <stop offset="100%" stopColor="#A8C8E0" />
          </radialGradient>
        </defs>

        <rect width="800" height="490" fill="url(#ocean)" />

        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ coordinates, zoom: z }: any) => {
            setCenter(coordinates);
            setZoom(+(z.toFixed(2)));
          }}
        >
          {/* ── Countries ──────────────────────────── */}
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const id          = String(geo.id);
                const exposedZone = EXPOSURE[id];
                const fill        = exposedZone ? ZONE_FILL[exposedZone] : '#CDD0D4';
                const dimmed      = hoveredZone !== null
                  && exposedZone !== undefined
                  && exposedZone !== hoveredZone;
                const opacity     = exposedZone ? (dimmed ? 0.12 : 0.90) : 0.92;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    fillOpacity={opacity}
                    stroke="#FFFFFF"
                    strokeWidth={0.4 * s}
                    style={{
                      default: { outline: 'none', transition: 'fill-opacity 0.2s ease' },
                      hover:   {
                        outline: 'none',
                        fill: exposedZone ? ZONE_FILL[exposedZone] : '#BEC2C7',
                        fillOpacity: exposedZone ? 1 : 0.95,
                        cursor: exposedZone ? 'pointer' : 'default',
                      },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={() => exposedZone && onHoverZone(exposedZone)}
                    onMouseMove={(evt: any) => {
                      if (!mapRef.current) return;
                      const r = mapRef.current.getBoundingClientRect();
                      setTip({
                        id,
                        name: NAMES[id] ?? '',
                        exposedZone,
                        tooltipZone: getZone(id),
                        x: evt.clientX - r.left,
                        y: evt.clientY - r.top,
                      });
                    }}
                    onMouseLeave={() => { onHoverZone(null); setTip(null); }}
                  />
                );
              })
            }
          </Geographies>

          {/* ── City markers ───────────────────────── */}
          {CITY_MARKERS.map((m) => {
            const color    = ZONE_COLOR[m.zone];
            const isActive = activeMarker === m.name;
            const isDirect = m.tickers.some(t => t !== 'PAASI.PA');
            const cw = 122 * s;
            const ch = 64  * s;
            const cx2 = -cw / 2;
            const showAbove = m.coords[1] > 20;
            const cy2 = showAbove ? -(ch + 18 * s) : 18 * s;

            return (
              <Marker
                key={m.name}
                coordinates={m.coords}
                onMouseEnter={() => { setActiveMarker(m.name); onHoverZone(m.zone); setTip(null); }}
                onMouseLeave={() => { setActiveMarker(null); onHoverZone(null); }}
              >
                {/* Outer pulse ring */}
                {isActive && (
                  <circle r={15 * s} fill={color} fillOpacity={0.08}
                    stroke={color} strokeWidth={s} strokeOpacity={0.18} />
                )}

                {/* Marker dot */}
                <circle
                  r={(isActive ? 5.5 : isDirect ? 4 : 3) * s}
                  fill="white" stroke={color} strokeWidth={1.8 * s}
                  style={{ cursor: 'pointer', filter: `drop-shadow(0 1px 4px ${color}55)` }}
                />
                <circle r={(isActive ? 2.5 : isDirect ? 1.8 : 1.2) * s} fill={color}
                  style={{ pointerEvents: 'none' }} />

                {/* Tooltip card on hover */}
                {isActive && (
                  <g style={{ pointerEvents: 'none' }}>
                    {/* Shadow + background */}
                    <rect x={cx2} y={cy2} width={cw} height={ch} rx={8 * s}
                      fill="white"
                      style={{ filter: 'drop-shadow(0 6px 20px rgba(26,37,64,0.20))' }} />
                    {/* Border */}
                    <rect x={cx2} y={cy2} width={cw} height={ch} rx={8 * s}
                      fill="none" stroke={color} strokeWidth={0.9 * s} strokeOpacity={0.22} />
                    {/* Accent bar top */}
                    <rect x={cx2} y={cy2} width={cw} height={4.5 * s} rx={8 * s}
                      fill={color} fillOpacity={0.75} />

                    {/* Emoji icon */}
                    <text
                      x={cx2 + 14 * s} y={cy2 + 24 * s}
                      style={{ fontSize: `${16 * s}px`, fontFamily: 'system-ui,-apple-system,sans-serif', dominantBaseline: 'auto' }}>
                      {m.emoji}
                    </text>

                    {/* City name */}
                    <text x={cx2 + 38 * s} y={cy2 + 22 * s}
                      style={{ fontSize: `${8.5 * s}px`, fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fill: '#1A2540' }}>
                      {m.name}
                    </text>
                    {/* Exchange */}
                    <text x={cx2 + 38 * s} y={cy2 + 33 * s}
                      style={{ fontSize: `${6.5 * s}px`, fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fill: color }}>
                      {m.exchange}
                    </text>

                    {/* Separator */}
                    <line x1={cx2 + 8 * s} y1={cy2 + 40 * s} x2={cx2 + cw - 8 * s} y2={cy2 + 40 * s}
                      stroke="rgba(26,37,64,0.07)" strokeWidth={0.8 * s} />

                    {/* Tickers */}
                    <text textAnchor="middle" y={cy2 + 54 * s}
                      style={{ fontSize: `${6.5 * s}px`, fontFamily: '"JetBrains Mono",monospace', fill: '#5C6E8A', fontWeight: 600 }}>
                      {m.tickers.join(' · ')}
                    </text>

                    {/* Arrow toward dot */}
                    <polygon
                      points={showAbove
                        ? `${-5 * s},${-16 * s} ${5 * s},${-16 * s} 0,${-2 * s}`
                        : `${-5 * s},${16 * s} ${5 * s},${16 * s} 0,${2 * s}`}
                      fill="white" stroke={color} strokeWidth={0.9 * s} strokeOpacity={0.22}
                    />
                  </g>
                )}

                {/* At-rest label — emoji for direct-stock markers only */}
                {!isActive && isDirect && (
                  <text
                    textAnchor="middle" y={-8 * s}
                    style={{
                      fontSize: `${10 * s}px`,
                      fontFamily: 'system-ui,-apple-system,sans-serif',
                      pointerEvents: 'none',
                    }}>
                    {m.emoji}
                  </text>
                )}
              </Marker>
            );
          })}

        </ZoomableGroup>
      </ComposableMap>

      {/* ── Country hover tooltip ──────────────────── */}
      {tip && tip.name && (
        <div
          className="absolute pointer-events-none z-20 rounded-xl px-3 py-2"
          style={{
            left: Math.min(tip.x + 14, (mapRef.current?.clientWidth ?? 600) - 175),
            top:  Math.max(6, tip.y - 52),
            background: 'rgba(255,255,255,0.97)',
            border: `1px solid ${tip.exposedZone ? ZONE_COLOR[tip.exposedZone] + '40' : 'rgba(26,37,64,0.09)'}`,
            boxShadow: '0 4px 16px rgba(26,37,64,0.12)',
          }}
        >
          <div className="flex items-center gap-2">
            {COUNTRY_EMOJI[tip.id] ? (
              <span className="text-sm leading-none">{COUNTRY_EMOJI[tip.id]}</span>
            ) : tip.exposedZone ? (
              <span className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: ZONE_COLOR[tip.exposedZone] }} />
            ) : null}
            <span className="text-xs font-semibold" style={{ color: '#1A2540' }}>
              {tip.name}
            </span>
            {tip.exposedZone && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: ZONE_COLOR[tip.exposedZone] + '16', color: ZONE_COLOR[tip.exposedZone] }}>
                Exposé
              </span>
            )}
          </div>
          {(tip.exposedZone || tip.tooltipZone) && (
            <p className="text-[10px] mt-0.5 font-medium"
              style={{
                color: tip.exposedZone ? ZONE_COLOR[tip.exposedZone] : '#8496B2',
                paddingLeft: COUNTRY_EMOJI[tip.id] ? '22px' : tip.exposedZone ? '14px' : '0',
              }}>
              {tip.exposedZone
                ? ZONE_LABEL[tip.exposedZone]
                : tip.tooltipZone ? ZONE_LABEL[tip.tooltipZone] : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
