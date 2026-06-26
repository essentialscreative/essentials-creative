/**
 * data-back-data.js — the re-feedable dataset for the "Land Back · Water Back ·
 * Data Back" living-rhizome piece. This is the SINGLE SOURCE OF TRUTH: the graph,
 * the spine figures, the source list and the refused list all render from it.
 *
 * Swap this array and the whole piece re-renders — no positions or ids are
 * hardcoded in the renderer (it reads only the generic fields below).
 *
 * NODE SCHEMA
 *   id          unique string (referenced by edges only)
 *   label       full text shown on the node + in lists
 *   shortLabel  terse label used on small screens
 *   value       number | [min, max] (a range) | null (qualitative)
 *   unit        string | null
 *   type        land | water | power | data | project   (drives hue)
 *   status      verified | projection | range | advocacy | contested  (drives treatment)
 *   year        number | null
 *   county      string | null
 *   source      who the figure is attributed to, BY NAME (required)
 *   attribution one-line "X says…" statement (required — renderer warns if missing)
 *   caveat      the honest qualifier (range, preliminary, advocacy…) | null
 *   group       which spine section first reveals it: growth|power|water|transparency|returns
 *
 * ATTRIBUTION RULES baked into the data (see ~/Research/2026-06-09-data-center-corridor):
 *   - every number is attributed by name and shown as projection/range, never as bare fact
 *   - "one of the fastest-growing", never "the fastest" (Dallas is #1)
 *   - ERCOT 368k is always status:contested → renders "PRELIMINARY"
 *   - the aquifer figure is status:advocacy, not measured drawdown
 *   - refuted figures live ONLY in `refuted[]` — never as nodes
 *
 * ETHICS: this visualizes extraction data only. It generates no Indigenous voice
 * or imagery; the three returns link out to the physical installation.
 */
window.DATA_BACK = {
  meta: {
    title: 'Land Back · Water Back · Data Back',
    corridor: 'Austin–San Antonio (I-35)',
    compiled: '2026-06',
    // The ONLY phrasing the headline may use:
    framing: 'one of the fastest-growing data-center corridors in the country',
    installationUrl: 'installations.html'
  },

  nodes: [
    /* ---- growth ------------------------------------------------------------ */
    {
      id: 'construction-surge',
      label: '88 → 466.5 MW under construction',
      shortLabel: '88→466 MW built',
      value: 466.5, unit: 'MW', type: 'power', status: 'verified', year: 2024, county: null,
      source: 'CBRE',
      attribution: 'CBRE: under-construction capacity rose from 88 MW (H2 2023) to 466.5 MW (H2 2024) — roughly 5×.',
      caveat: null,
      group: 'growth'
    },
    {
      id: 'tract-caldwell',
      label: 'Tract — Caldwell Valley',
      shortLabel: 'Tract Caldwell',
      value: 4, unit: 'GW+', type: 'project', status: 'projection', year: 2026, county: 'Caldwell',
      source: 'public filings',
      attribution: 'Tract’s Caldwell Valley park: ~3,000 acres on I-35, announced to support 4+ GW.',
      caveat: 'Announced scale, not built or operating.',
      group: 'growth'
    },
    {
      id: 'skybox-hutto',
      label: 'Skybox / Prologis — Hutto',
      shortLabel: 'Skybox Hutto',
      value: 600, unit: 'MW', type: 'project', status: 'projection', year: 2026, county: 'Williamson',
      source: 'public filings',
      attribution: 'Skybox/Prologis Hutto campus: ~600 MW, ~$10B, under construction in Williamson County.',
      caveat: 'Under construction; capacity is planned.',
      group: 'growth'
    },
    {
      id: 'blueprint-taylor',
      label: 'Blueprint — Taylor',
      shortLabel: 'Blueprint Taylor',
      value: 60, unit: 'MW', type: 'project', status: 'projection', year: 2026, county: 'Williamson',
      source: 'public filings',
      attribution: 'Blueprint Taylor: ~60 MW announced, Williamson County.',
      caveat: 'Announced capacity.',
      group: 'growth'
    },
    {
      id: 'blueprint-georgetown',
      label: 'Blueprint — Georgetown',
      shortLabel: 'Blueprint G\'town',
      value: 25, unit: 'MW', type: 'project', status: 'projection', year: 2026, county: 'Williamson',
      source: 'public filings',
      attribution: 'Blueprint Georgetown: ~25 MW announced, Williamson County.',
      caveat: 'Announced capacity.',
      group: 'growth'
    },
    {
      id: 'sabey-roundrock',
      label: 'Sabey / SDC — Round Rock',
      shortLabel: 'Sabey Round Rock',
      value: 84, unit: 'MW', type: 'project', status: 'projection', year: 2026, county: 'Williamson',
      source: 'public filings',
      attribution: 'Sabey/SDC Round Rock: ~84 MW announced, Williamson County.',
      caveat: 'Announced capacity.',
      group: 'growth'
    },

    /* ---- power ------------------------------------------------------------- */
    {
      id: 'pipeline-planned',
      label: '7,823 MW planned vs ~1,154 MW operating',
      shortLabel: '7,823 MW planned',
      value: 7823, unit: 'MW', type: 'power', status: 'projection', year: 2026, county: null,
      source: 'Cushman & Wakefield 2026',
      attribution: 'Cushman & Wakefield (2026): ~7,823 MW of planned corridor capacity against ~1,154 MW operating.',
      caveat: 'Pipeline ≠ built. Much may be the same load queued by multiple developers.',
      group: 'power'
    },
    {
      id: 'grid-queue',
      label: 'ERCOT large-load queue: ~226 GW → ~410 GW',
      shortLabel: 'Queue 226→410 GW',
      value: 410, unit: 'GW', type: 'power', status: 'projection', year: 2026, county: null,
      source: 'ERCOT',
      attribution: 'ERCOT: ~226 GW of large-load requests (Nov 2025, ~73% data centers) rising to ~410 GW (Mar 2026, ~87%).',
      caveat: 'Interconnection requests, not commitments. Date every figure — the field moves monthly.',
      group: 'power'
    },
    {
      id: 'ercot-2032',
      label: 'up to ~368,000 MW statewide by 2032',
      shortLabel: '~368,000 MW by \'32',
      value: 368000, unit: 'MW', type: 'power', status: 'contested', year: 2032, county: null,
      source: 'ERCOT',
      attribution: 'ERCOT preliminary forecast: up to ~368,000 MW statewide demand by 2032.',
      caveat: 'PRELIMINARY and CONTESTED. Compare the 85,508 MW all-time record peak (Aug 2023).',
      group: 'power'
    },

    /* ---- water ------------------------------------------------------------- */
    {
      id: 'water-now',
      label: '~25 billion gal/yr today',
      shortLabel: '~25B gal/yr now',
      value: 25, unit: 'billion gal/yr', type: 'water', status: 'projection', year: 2026, county: null,
      source: 'HARC',
      attribution: 'HARC (2026): Texas data centers consume an estimated ~25 billion gallons/year.',
      caveat: 'An estimate, not a metered total.',
      group: 'water'
    },
    {
      id: 'water-2030-range',
      label: '29–161 billion gal/yr by 2030',
      shortLabel: '29–161B by \'30',
      value: [29, 161], unit: 'billion gal/yr', type: 'water', status: 'range', year: 2030, county: null,
      source: 'HARC',
      attribution: 'HARC projects 29–161 billion gal/yr by 2030 — up to ~2.7% of state water.',
      caveat: 'Always cite the full range, never the 161B headline alone.',
      group: 'water'
    },
    {
      id: 'water-2040-share',
      label: '3–9% of Texas water by 2040',
      shortLabel: '3–9% by \'40',
      value: [3, 9], unit: '% of state water', type: 'water', status: 'range', year: 2040, county: null,
      source: 'UT Austin',
      attribution: 'UT Austin (Jackson School) projects 3–9% of Texas’ water by 2040, up from <1% now.',
      caveat: 'A modeled range, not a measured share.',
      group: 'water'
    },
    {
      id: 'aquifer-geaa',
      label: '~494,091 acre-feet by 2030',
      shortLabel: '~494k acre-ft',
      value: 494091, unit: 'acre-feet', type: 'water', status: 'advocacy', year: 2030, county: null,
      source: 'GEAA',
      attribution: 'GEAA (advocacy) estimates Texas data centers could use ~494,091 acre-feet by 2030.',
      caveat: 'Advocacy framing — not measured per-facility aquifer drawdown. No verified Edwards/Trinity site data exists yet.',
      group: 'water'
    },

    /* ---- transparency / Data Back ----------------------------------------- */
    {
      id: 'transparency-gap',
      label: 'Facility-level water use is undisclosed',
      shortLabel: 'Undisclosed',
      value: null, unit: null, type: 'data', status: 'verified', year: 2026, county: null,
      source: 'Privette et al., AGU Advances 2026',
      attribution: 'Privette et al. (AGU Advances, 2026): facility-level water use is largely undisclosed — NDAs, aggregate-only reporting.',
      caveat: 'A national finding. This gap is exactly what “Data Back” answers.',
      group: 'transparency'
    }
  ],

  // Peer links — no parent/child, no hierarchy. The rhizome has no center.
  edges: [
    { source: 'construction-surge', target: 'pipeline-planned', rel: 'grows-into' },
    { source: 'tract-caldwell', target: 'pipeline-planned', rel: 'part-of' },
    { source: 'skybox-hutto', target: 'pipeline-planned', rel: 'part-of' },
    { source: 'blueprint-taylor', target: 'pipeline-planned', rel: 'part-of' },
    { source: 'blueprint-georgetown', target: 'pipeline-planned', rel: 'part-of' },
    { source: 'sabey-roundrock', target: 'pipeline-planned', rel: 'part-of' },
    { source: 'pipeline-planned', target: 'grid-queue', rel: 'feeds' },
    { source: 'grid-queue', target: 'ercot-2032', rel: 'projects-to' },
    { source: 'ercot-2032', target: 'water-now', rel: 'drives' },
    { source: 'water-now', target: 'water-2030-range', rel: 'grows-into' },
    { source: 'water-2030-range', target: 'water-2040-share', rel: 'grows-into' },
    { source: 'water-2030-range', target: 'aquifer-geaa', rel: 'feared-impact' },
    { source: 'transparency-gap', target: 'water-2030-range', rel: 'obscures' },
    { source: 'transparency-gap', target: 'aquifer-geaa', rel: 'obscures' }
  ],

  // What we refuse to say — shown struck-through in the sources section, never as a node.
  refuted: [
    { claim: '463 million gallons used by two San Antonio data centers', source: 'Texas Monthly', reason: 'Could not be reproduced under adversarial verification (0 of 3 confirmed).' },
    { claim: '49 billion gallons in 2025 — "more than Austin’s residents use"', source: 'Texas Monthly', reason: 'Refuted (0 of 3 confirmed).' },
    { claim: '22 million MWh in 2023 = 4.6% of state electricity', source: 'Hello Georgetown', reason: 'Refuted (0 of 3 confirmed).' },
    { claim: '"More than 9,500 MW already required"', source: '(mis-stated HARC demand)', reason: 'Mis-statement of the source figure.' },
    { claim: '"Texas must double 2024 energy production by 2031"', source: 'Texas Monthly', reason: 'Not supportable as stated.' },
    { claim: 'AGU drought examples cited as Texas-specific', source: '(geographic misattribution)', reason: 'Those examples are Nevada/Arizona, not Texas.' }
  ]
};
