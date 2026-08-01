export const SEED_WORLDS = [
  {
    slug: "aethelgard",
    name: "Aethelgard: The Shattered Realm",
    tagline: "High-fantasy world of floating archipelagoes, ancient aetheric magic, and fallen empires.",
    description: "Aethelgard was once a unified continent governed by the celestial arcanists. After the great Sundering in the Era of Eclipse, the world fractured into hundreds of gravity-defying sky islands orbiting the radiant Aether Core.",
    themeColor: "#6366f1",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    icon: "Shield",
  },
  {
    slug: "neo-kyoto-2099",
    name: "Neo-Kyoto 2099",
    tagline: "Cyberpunk megacity governed by AI conglomerates, neon ronin, and synthetic consciousness.",
    description: "Built upon the submerged ruins of ancient Kyoto, Neo-Kyoto rises 150 vertical tiers into the polluted stratospheric smog, powered by quantum neural relays and hyper-corporate feudalism.",
    themeColor: "#ec4899",
    bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    icon: "Cpu",
    iconEmoji: "🌆",
  },
  {
    slug: "notebook",
    name: "Notebook",
    tagline: "Notes créatives, idées d'app & brouillons du wiki.",
    description: "Le carnet personnel du wiki : idées de modification, todo-list et expérimentations.",
    themeColor: "#ffc500",
    bannerUrl: null,
    icon: "Notebook",
    iconEmoji: "📝",
  },
  {
    slug: "grimoire-battle",
    name: "Grimoire Battle",
    tagline: "Bestiaire, sorts & jeu de cartes fantasy.",
    description: "Univers de jeu de cartes : créatures, grimoires et arcanes de bataille.",
    themeColor: "#7c3aed",
    bannerUrl: null,
    icon: "Book",
    iconEmoji: "📕",
  },
  {
    slug: "prompt-engineering",
    name: "Prompt Engineering",
    tagline: "Bibliothèque de prompts & guides IA.",
    description: "Guides analytiques, master prompts et comparatifs d'outils de worldbuilding IA.",
    themeColor: "#06b6d4",
    bannerUrl: null,
    icon: "Cpu",
    iconEmoji: "🤖",
  },
  {
    slug: "pixai",
    name: "PixAI",
    tagline: "Galerie d'illustrations & fiches personnages.",
    description: "Collections visuelles générées : portraits, concepts et références artistiques.",
    themeColor: "#ec4899",
    bannerUrl: null,
    icon: "Palette",
    iconEmoji: "🎨",
  },
];

export const SEED_ARTICLES = [
  {
    worldSlug: "aethelgard",
    slug: "kael-valerius",
    title: "Archmage Kael Valerius",
    category: "character",
    excerpt: "Grand Magister of the Sun Citadel and keeper of the primordial Sol-Blade.",
    isFeatured: true,
    views: 1420,
    tags: ["Mage", "Solar Dynasty", "Protagonist", "Sun Citadel", "Aether Adept"],
    infobox: {
      subtitle: "The Solar Vanguard • Bearer of the Dawn",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
      caption: "Kael channeling the radiant solar vortex at the zenith of Sun Citadel.",
      quote: "The light does not forgive darkness; it incinerates the shadow until only truth remains.",
      badges: ["Grand Magister", "Sunblade Bearer", "Immortal (Tier IV)"],
      sections: [
        {
          title: "Biographical Information",
          fields: [
            { label: "Species / Race", value: "High Solar Elf (Sunborn)" },
            { label: "Age", value: "342 Earth Cycles (Appears 28)" },
            { label: "Homeland", value: "Sun Citadel", isLink: true, linkSlug: "sun-citadel" },
            { label: "Affiliation", value: "Order of the Radiant Dawn", isLink: true, linkSlug: "order-of-the-radiant-dawn" },
            { label: "Title", value: "Grand Arcanist of the Seventh Spire" },
          ],
        },
        {
          title: "Combat & Magical Capabilities",
          fields: [
            { label: "Signature Weapon", value: "The Sol-Blade", isLink: true, linkSlug: "sol-blade" },
            { label: "Magic Discipline", value: "Photomancy & Gravity Weaving" },
            { label: "Power Level", value: "Cataclysmic Class" },
          ],
        },
      ],
      stats: [
        { label: "Aetheric Mana", value: 96, max: 100, color: "#eab308" },
        { label: "Combat Mastery", value: 88, max: 100, color: "#ef4444" },
        { label: "Lore & Alchemy", value: 92, max: 100, color: "#3b82f6" },
        { label: "Celestial Resonance", value: 98, max: 100, color: "#a855f7" },
      ],
    },
    markdownContent: `## Overview

**Archmage Kael Valerius** is the reigning Grand Magister of the [[sun-citadel]] and the supreme commander of the [[order-of-the-radiant-dawn]]. Widely considered the most formidable solar sorcerer of the Post-[[the-sundering]] era, he wields the ancestral [[sol-blade]] to stabilize the crumbling sky islands of the realm.

During the catastrophic [[the-sundering]], Valerius prevented the total collapse of the eastern archipelago by single-handedly anchoring the tectonic plates with refined [[aether-crystals]].

---

## Early Life & Ascension

Born in the celestial spires above the cloud sea, Kael displayed unprecedented resonance with solar radiation from the age of five. He entered the Great Academy of Luminescence where he mastered the archaic scrolls of *Aethel-Genesis*.

> "His soul does not merely reflect the sun; he is the forge in which celestial flames are struck."  
> — *High Chronicler Irene, Historical Annals vol. IX*

By age 120, following the mysterious disappearance of Patriarch Aurelius, Kael was elected Grand Magister unanimously. His first decree was the fortification of the perimeter defense surrounding the [[sun-citadel]].

---

## The Sundering & The Great Anchor

When the cataclysmic event known as [[the-sundering]] tore Aethelgard apart, dark rifts opened across the continent. Kael utilized his mastery over [[aether-crystals]] and channeled the pure energy of the [[sol-blade]] into the core of the city.

### Key Achievements:
- Bound 47 floating landmasses into the unified Solar Archipelago.
- Defeated the Shadow Behemoth *Xur'kalth* in the Battle of the Crimson Clouds.
- Established the universal [[order-of-the-radiant-dawn]] defense perimeter.

---

## Abilities & Equipment

### The Sol-Blade
A weapon forged from the heart of a dead star. When drawn, it emits a blinding corona of ultraviolet plasma capable of bisecting enchanted dragonscale. Learn more in the detailed archive: [[sol-blade]].

### Photomantic Weaving
Kael can manipulate photons into physical force shields, laser conduits, and spatial teleportation beacons across distances of up to 300 leagues.

---

## Relationships & Allegiances
- **Allies**: [[order-of-the-radiant-dawn]], The Sky Navigators Guild
- **Rivals**: The Umbral Covenant of the Void Abyss
- **Sanctuary**: [[sun-citadel]]
`,
  },
  {
    worldSlug: "aethelgard",
    slug: "sun-citadel",
    title: "The Sun Citadel",
    category: "location",
    excerpt: "The floating golden megacity anchored above the Eternal Sea of Clouds.",
    isFeatured: true,
    views: 980,
    tags: ["City", "Sky Island", "Fortress", "Capital", "Solar Dynasty"],
    infobox: {
      subtitle: "Capital of the Celestial Archipelago",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      caption: "The radiant spires of the Sun Citadel bathed in permanent golden twilight.",
      quote: "Above the storm, above the dust, we shine eternal.",
      badges: ["Sky Metropolis", "Capital", "Aether Core"],
      sections: [
        {
          title: "Geographical Data",
          fields: [
            { label: "Altitude", value: "14,500 meters above sea level" },
            { label: "Region", value: "Zenith Sky Sector" },
            { label: "Population", value: "2.4 Million (Solar Elves, Aetherborn, Humans)" },
            { label: "Ruler", value: "Archmage Kael Valerius", isLink: true, linkSlug: "kael-valerius" },
          ],
        },
        {
          title: "Defenses & Architecture",
          fields: [
            { label: "Primary Shield", value: "Aetheric Aegis Grid" },
            { label: "Main Power Source", value: "Aether Crystals Core", isLink: true, linkSlug: "aether-crystals" },
            { label: "Military Force", value: "Order of the Radiant Dawn", isLink: true, linkSlug: "order-of-the-radiant-dawn" },
          ],
        },
      ],
      stats: [
        { label: "Defensive Rating", value: 99, max: 100, color: "#3b82f6" },
        { label: "Technological Level", value: 91, max: 100, color: "#10b981" },
        { label: "Economic Wealth", value: 95, max: 100, color: "#eab308" },
      ],
    },
    markdownContent: `## Overview

The **Sun Citadel** is the jewel of Aethelgard. Suspended in perpetual equilibrium by giant anti-gravitational [[aether-crystals]], the citadel serves as the administrative, military, and spiritual epicenter of the civilized sky realms.

Governed by [[kael-valerius]], it houses the legendary repository of pre-cataclysm knowledge known as the Great Solar Library.

---

## Districts & Landmarks

### 1. The High Spire of Sol
The personal sanctum of [[kael-valerius]] and the resting altar of the [[sol-blade]]. It pierces the upper stratosphere and harnesses raw solar wind.

### 2. The Grand Dockyards of the Skyships
Where massive aether-powered dreadnoughts belonging to the [[order-of-the-radiant-dawn]] are constructed and refueled.

### 3. The Crystal Plaza
The bustling trade nexus where merchants from over fifty sky islands trade artifacts, rare minerals, and enchanted livestock.

---

## History during [[the-sundering]]

Prior to [[the-sundering]], the citadel was a mountaintop fortress. When the ground split, the arcanists initiated Protocol *Levitas*, detaching the entire 80-square-kilometer mountain mass from the earth.
`,
  },
  {
    worldSlug: "aethelgard",
    slug: "sol-blade",
    title: "The Sol-Blade",
    category: "artifact",
    excerpt: "Ancient celestial broadsword forged in the core of a dying solar star.",
    isFeatured: false,
    views: 650,
    tags: ["Weapon", "Artifact", "Solar", "Legendary"],
    infobox: {
      subtitle: "The Blade of Dawn • Star-Forged Relic",
      image: "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?auto=format&fit=crop&w=800&q=80",
      caption: "The Sol-Blade glowing with contained solar plasma.",
      quote: "It weighs nothing in the hand of the worthy, yet crushes mountains in judgment.",
      badges: ["Mythic Tier", "Sentient Relic"],
      sections: [
        {
          title: "Artifact Properties",
          fields: [
            { label: "Current Bearer", value: "Archmage Kael Valerius", isLink: true, linkSlug: "kael-valerius" },
            { label: "Origin", value: "Solar Forge of Zenith" },
            { label: "Material", value: "Star-Metal & Pure Aetherium" },
            { label: "Enchantment", value: "Solar Flare Cleave, Gravitational Tether" },
          ],
        },
      ],
      stats: [
        { label: "Damage Potential", value: 100, max: 100, color: "#ef4444" },
        { label: "Aura Radius", value: 85, max: 100, color: "#eab308" },
      ],
    },
    markdownContent: `## Overview

The **Sol-Blade** is the most revered artifact in the [[sun-citadel]]. It was forged during the First Celestial Age by the primordial titans to split void rifts.

Currently in the custody of [[kael-valerius]], it emits a continuous low hum that resonates with nearby [[aether-crystals]].

## Powers & Attributes
- **Superheated Edge**: Burns at 6,000°C without transferring thermal heat to the hilt.
- **Rift Sealer**: Capable of closing tears caused by [[the-sundering]].
- **Harmonic Resonance**: Boosts the spellcasting capability of the [[order-of-the-radiant-dawn]] within a 5-mile radius.
`,
  },
  {
    worldSlug: "aethelgard",
    slug: "the-sundering",
    title: "The Great Sundering",
    category: "event",
    excerpt: "The cataclysmic rupture of Aethelgard's tectonic foundation in the Year 0 of the Sky Era.",
    isFeatured: false,
    views: 1100,
    tags: ["Cataclysm", "History", "Founding Era", "Magic Surge"],
    infobox: {
      subtitle: "The Fracture of the World • Epoch Zero",
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      caption: "Artist depiction of the tectonic rupture breaking continents into floating islands.",
      quote: "The earth wept, the skies tore, and the sea fell into the void.",
      badges: ["Global Event", "Era Divider"],
      sections: [
        {
          title: "Historical Metadata",
          fields: [
            { label: "Date / Era", value: "Year 0, Second Dawn" },
            { label: "Cause", value: "Overload of Deep Aether Well" },
            { label: "Primary Savior", value: "Archmage Kael Valerius", isLink: true, linkSlug: "kael-valerius" },
            { label: "Resulting World", value: "Floating Archipelagoes" },
          ],
        },
      ],
      stats: [
        { label: "Destruction Index", value: 98, max: 100, color: "#dc2626" },
        { label: "Aetheric Surge", value: 100, max: 100, color: "#9333ea" },
      ],
    },
    markdownContent: `## The Cataclysm

The **Great Sundering** reshaped the entirety of Aethelgard. When deep-core mining for [[aether-crystals]] punctured the planetary mantle, the gravitational containment failed.

### The Aftermath
- Continental landmasses broke apart into floating islands.
- The founding of the [[sun-citadel]] as an airborne haven.
- Establishment of the [[order-of-the-radiant-dawn]] to guard against second ruptures.
- The heroic defense led by [[kael-valerius]] utilizing the [[sol-blade]].
`,
  },
  {
    worldSlug: "aethelgard",
    slug: "order-of-the-radiant-dawn",
    title: "Order of the Radiant Dawn",
    category: "faction",
    excerpt: "The holy knightly order and arcane navy defending the sky routes of Aethelgard.",
    isFeatured: false,
    views: 730,
    tags: ["Faction", "Knights", "Arcane Navy", "Solar"],
    infobox: {
      subtitle: "Guardians of the Horizon • Blades of the Sun",
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
      caption: "Solar Paladins on review at the Grand Sky Balcony.",
      quote: "In darkness we light the torch; in battle we bring the dawn.",
      badges: ["Arcane Military", "High Council Order"],
      sections: [
        {
          title: "Organization Details",
          fields: [
            { label: "Supreme Commander", value: "Archmage Kael Valerius", isLink: true, linkSlug: "kael-valerius" },
            { label: "Headquarters", value: "The Sun Citadel", isLink: true, linkSlug: "sun-citadel" },
            { label: "Active Troops", value: "45,000 Sky Knights & Arcanists" },
            { label: "Primary Relic", value: "The Sol-Blade", isLink: true, linkSlug: "sol-blade" },
          ],
        },
      ],
      stats: [
        { label: "Military Power", value: 94, max: 100, color: "#ef4444" },
        { label: "Fleet Capacity", value: 89, max: 100, color: "#3b82f6" },
      ],
    },
    markdownContent: `## Overview

The **Order of the Radiant Dawn** is the premier peace-keeping and military organization in the Solar Archipelago. Stationed at [[sun-citadel]], they patrol the clouds against void pirates and mutated monstrosities born from [[the-sundering]].

### Structure & Ranks
1. **Grand Magister**: [[kael-valerius]]
2. **Solar Admirals**: Fleet captains commanding skyships powered by [[aether-crystals]].
3. **Radiant Paladins**: Elite close-quarters warriors trained in swordcraft and photomancy.
`,
  },
  {
    worldSlug: "aethelgard",
    slug: "aether-crystals",
    title: "Aether Crystals",
    category: "concept",
    excerpt: "Luminescent mineral formations that exhibit anti-gravitational and energy-amplifying properties.",
    isFeatured: false,
    views: 890,
    tags: ["Magic Mineral", "Energy Source", "Levitation", "Alchemy"],
    infobox: {
      subtitle: "The Blood of the Sky World • Gravitational Matrix",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
      caption: "Raw aether crystal cluster glowing with internal cobalt luminosity.",
      quote: "Without the stone, the sky is merely empty air.",
      badges: ["Resource", "Energy Medium"],
      sections: [
        {
          title: "Mineral Properties",
          fields: [
            { label: "Classification", value: "Crystalline High-Mana Silicate" },
            { label: "Primary Use", value: "Island levitation, Skyship engines, Spell focus" },
            { label: "Key Location", value: "Sun Citadel Mines", isLink: true, linkSlug: "sun-citadel" },
          ],
        },
      ],
      stats: [
        { label: "Energy Density", value: 97, max: 100, color: "#06b6d4" },
        { label: "Instability", value: 45, max: 100, color: "#f97316" },
      ],
    },
    markdownContent: `## Overview

**Aether Crystals** are the foundation of modern civilization across Aethelgard. These self-recharging minerals emit a reverse-graviton field that allows islands like the [[sun-citadel]] to remain afloat.

When handled improperly, excessive extraction can trigger disasters similar to [[the-sundering]]. Both [[kael-valerius]] and the [[order-of-the-radiant-dawn]] strictly regulate trade in refined crystals.
`,
  },
  {
    worldSlug: "notebook",
    slug: "idee-de-modification",
    title: "Idée de modification",
    category: "inbox",
    excerpt:
      "Ajouter la possibilité d'avoir plusieurs pages de couverture qui alternent, galerie slide ou apparitions aléatoires…",
    isFeatured: true,
    views: 8,
    tags: ["idée", "app", "todo", "couverture"],
    infobox: {
      image: "/ideas-cover.jpg",
    },
    markdownContent: `Ajouter la possibilité d'avoir plusieurs page de couverture qui alterne le uns au autres, ou pouvoir Galerie slide ou aléatoire apparitions. A faire, demander de faire en sorte que lorsque qu'on tape une commande spéciale, ça nous met le truc pour ajouter une image de couverture. Changer l'épaisseur du titre.

Demande à ce que on puisse exporté une page au format PDF. Ajouter un bouton, exporté. Ajouter une fonctionnalité qui permet de partager une page en lien public, et un mode lecture plein écran sans la barre du haut.

## Pistes en vrac

- Plusieurs images de couverture avec défilement automatique.
- Commande spéciale pour ajouter une couverture depuis l'éditeur.
- Bouton **Exporter en PDF** dans le menu ⋮ de l'article.
- Lien public de partage pour les lecteurs non connectés.

Voir aussi le comparatif dans [[reponse-code-wiki]] pour choisir la stack mobile.
`,
  },
  {
    worldSlug: "prompt-engineering",
    slug: "reponse-code-wiki",
    title: "Réponse Code Wiki",
    category: "guide",
    excerpt:
      "Comparatif World Anvil vs Wiki+Obsidian : prise en main, templates, liens internes, vision macro, offline, coût…",
    isFeatured: true,
    views: 21,
    tags: ["comparatif", "world-anvil", "obsidian", "stack"],
    infobox: undefined,
    markdownContent: `Comparatif rapide entre **World Anvil** et la combinaison **Wiki + Obsidian** pour structurer un univers de fiction.

## Tableau de comparaison

- **Prise en main** : rapide mais rigide d'un côté, lente mais flexible de l'autre.
- **Templates** : prêts à l'emploi (personnage, lieu, religion…) contre à construire soi-même.
- **Liens internes** : bons contre excellents (graphe visuel d'Obsidian).
- **Vision macro** : timeline + cartes intégrées contre graphe de relations + canvas.
- **Offline** : non contre oui (Obsidian est local).
- **Propriété des données** : sur leurs serveurs contre tes fichiers, ton contrôle.
- **Coût** : freemium (fonctions clés payantes) contre gratuit ou quasi-gratuit.

## Forces distinctives

World Anvil excelle quand tu veux structurer vite sans réfléchir au système, présenter ton lore à des joueurs/lecteurs, ou travailler en équipe avec des non-techniciens.

Wiki + Obsidian excelle quand tu veux voir comment tout se connecte : le graphe est un outil de pensée, pas juste de consultation.

Note créative liée : [[idee-de-modification]].
`,
  },
];

export const SEED_MAP_MARKERS = [
  {
    worldSlug: "aethelgard",
    title: "The Sun Citadel",
    type: "capital",
    x: 48,
    y: 35,
    articleSlug: "sun-citadel",
    description: "The golden floating capital governed by Archmage Kael Valerius.",
  },
  {
    worldSlug: "aethelgard",
    title: "The Sundering Chasm",
    type: "landmark",
    x: 72,
    y: 65,
    articleSlug: "the-sundering",
    description: "The abyssal rift from which void energy spills into the lower atmosphere.",
  },
  {
    worldSlug: "aethelgard",
    title: "Aetherium Deep Mines",
    type: "resource",
    x: 25,
    y: 55,
    articleSlug: "aether-crystals",
    description: "The crystal quarry that fuels the skyships of the Radiant Dawn.",
  },
  {
    worldSlug: "aethelgard",
    title: "Radiant Fleet Bastion",
    type: "fortress",
    x: 62,
    y: 22,
    articleSlug: "order-of-the-radiant-dawn",
    description: "Naval fortress housing 120 heavy aether-cruisers.",
  },
];

export const SEED_TIMELINES = [
  {
    worldSlug: "aethelgard",
    year: "Epoch -500",
    era: "Age of Solid Earth",
    title: "Discovery of the Aether Well",
    description: "First recorded harvest of levitating blue crystals in the northern mountains.",
    articleSlug: "aether-crystals",
    orderIndex: 1,
  },
  {
    worldSlug: "aethelgard",
    year: "Year 0",
    era: "The Cataclysm",
    title: "The Great Sundering",
    description: "Tectonic collapse tears the continent into floating sky islands.",
    articleSlug: "the-sundering",
    orderIndex: 2,
  },
  {
    worldSlug: "aethelgard",
    year: "Year 120 SD",
    era: "Era of Reconstruction",
    title: "Ascension of Kael Valerius",
    description: "Kael Valerius becomes Grand Magister and forges the Sol-Blade.",
    articleSlug: "kael-valerius",
    orderIndex: 3,
  },
  {
    worldSlug: "aethelgard",
    year: "Year 240 SD",
    era: "Era of the Golden Spire",
    title: "Founding of the Order of Radiant Dawn",
    description: "Military unification of the eastern sky archipelago.",
    articleSlug: "order-of-the-radiant-dawn",
    orderIndex: 4,
  },
];

export const SEED_PROMPTS = [
  {
    category: "Full Master App Blueprint",
    framework: "React Native (Expo SDK 52) + SQLite / Drizzle ORM",
    title: "Full Mobile App Blueprint: Fandom Wiki UI + Obsidian Vault + World Anvil Lore Engine",
    description: "The complete end-to-end prompt to develop the mobile app combining Fandom UI, Obsidian bidirectional markdown linking & graph view, and World Anvil interactive maps and timelines.",
    tags: ["React Native", "Expo", "Local-First", "Markdown", "Graph View", "World Anvil", "Fandom"],
    prompt: `You are an elite Mobile & Fullstack Architect specializing in React Native, Local-First SQLite storage, Markdown parsing, and Interactive Data Visualizations.

Build a production-ready Mobile Application (React Native / Expo SDK 52 with TypeScript & NativeWind/Tailwind) called "LOREFORGE" (A hybrid of Fandom Wiki UI + Obsidian Knowledge Vault + World Anvil Worldbuilding Tools).

### 1. CORE ARCHITECTURAL REQUIREMENTS:
- **Local-First Storage**: Store all articles, links, metadata, and maps in local SQLite (via \`expo-sqlite\` or \`op-sqlite\`) with optional syncing to local Markdown \`.md\` files in the user's mobile file system (Obsidian Vault compatible with YAML Frontmatter).
- **Markdown & WikiLink Parser Engine**:
  - Parse standard CommonMark + GFM.
  - Native support for \`[[Page Title]]\` and \`[[Page Title|Display Alias]]\` links.
  - Tapping a wikilink navigates instantly with a smooth native transition to that article.
  - Auto-generate bidirectional backlinks list ("Mentioned in X articles") at the bottom of every article.
  - Auto-detect unlinked mentions.
- **Fandom Wiki UI / UX Design System**:
  - Hero Header with blurred backdrop banner, title badge, category tag, and quick-action bar (Bookmark, Edit, Share, Graph View, Map Pin).
  - Dynamic Fandom Infobox Component:
    - Sticky / collapsible sidebar or top card with portrait image, subtitle, and badges.
    - Grouped accordion sections (Biographical info, Physical attributes, Combat stats, Affiliations).
    - Interactive stat bars (Power, Mana, Wealth with customized color thresholds).
    - Clickable internal links inside infobox fields.
  - Sticky floating Table of Contents drawer.
  - Dark Fantasy / Sci-Fi / Cyberpunk / Clean Parchment theme toggle.
- **Obsidian Graph View Module**:
  - Interactive Force-Directed 2D Graph (using \`react-native-skia\` or \`react-native-svg\` with D3-force simulation).
  - Nodes represent Articles (colored by category: Characters, Factions, Locations, Artifacts, Events).
  - Edges represent bidirectional \`[[wikilinks]]\`.
  - Pinch-to-zoom, pan, search filtering by tag/category, and tap node to open article preview sheet.
- **World Anvil Interactive Modules**:
  - **Interactive World Atlas**: Pinch-and-zoom custom high-res fantasy/sci-fi maps with categorized pin markers (Capitals, Dungeons, Relics, Ports). Tapping a pin opens a Wiki preview modal with navigation link.
  - **Chronological Timeline**: Vertical interactive timeline with era grouping, expandable lore cards, and year badges linked to historical event articles.
  - **Family & Faction Relationship Trees**: Interactive node hierarchy showing genealogical trees, political allegiances, and rivals.
  - **Statblocks & Secrets**: GM / Creator spoiler toggles and RPG statblocks (D&D 5e / Pathfinder / Custom Lore stats).

### 2. FILE STRUCTURE TO GENERATE:
\`\`\`
/src
  /components
    /wiki
      Infobox.tsx
      WikiMarkdownRenderer.tsx
      BacklinksList.tsx
      TableOfContents.tsx
      CategoryBadge.tsx
    /graph
      ObsidianGraphView.tsx
      GraphFilterModal.tsx
    /worldanvil
      InteractiveMap.tsx
      TimelineView.tsx
      RelationshipTree.tsx
      StatBlock.tsx
    /editor
      MarkdownEditor.tsx
      InfoboxBuilderModal.tsx
      WikiLinkAutocomplete.tsx
  /db
    schema.ts
    database.ts
    vaultSync.ts
  /hooks
    useWikiLinks.ts
    useGraphData.ts
    useWorldAnvilMap.ts
  /navigation
    RootNavigator.tsx
    WorldTabNavigator.tsx
  /screens
    ArticleViewScreen.tsx
    ArticleEditScreen.tsx
    WorldAtlasScreen.tsx
    WorldTimelineScreen.tsx
    GraphViewScreen.tsx
    WorldExplorerScreen.tsx
\`\`\`

Provide complete, fully typed TypeScript code for all core modules, navigation, parsers, and UI components without placeholders.`,
  },
  {
    category: "Markdown & WikiLink Engine",
    framework: "TypeScript + Regex / Unified.js",
    title: "Obsidian [[WikiLink]] Parser & Backlink Graph Indexer for React Native",
    description: "Precise parser that converts markdown with [[wikilinks]] into interactive React Native elements, extracts outgoing links, and maintains a real-time SQLite backlink graph.",
    tags: ["WikiLinks", "Markdown", "Backlinks", "Graph", "Parser"],
    prompt: `Write a robust TypeScript module for React Native that parses Markdown containing Obsidian-style [[WikiLinks]] (e.g. [[TargetArticle]] or [[TargetArticle|Custom Label]]) and turns them into clickable Native chips/links, while extracting metadata for backlink indexing.

Include:
1. Regex & AST parser for [[Target]] and [[Target|Label]].
2. Auto-indexing hook: when an article is saved, update an SQLite 'article_links' table with (source_slug, target_slug).
3. Backlink query hook: \`useBacklinks(currentSlug)\` that returns all articles linking to this one.
4. Auto-complete suggester hook \`useWikiLinkSuggestions(textQuery)\` for the markdown editor when typing \`[[\`.
5. High-performance rendering in React Native using standard components and styling.`,
  },
  {
    category: "Fandom Infobox Engine",
    framework: "React Native / NativeWind",
    title: "Modular Dynamic Fandom Infobox Component with JSON/YAML Schema",
    description: "A mobile-first modular Infobox component matching Fandom's rich visual style with collapsible sections, responsive layout, stat bars, and embedded wiki navigation.",
    tags: ["Fandom", "Infobox", "UI Design", "Tailwind", "Mobile Wiki"],
    prompt: `Create a modular, highly customizable Fandom-style Infobox component for React Native (Expo + NativeWind v4/Tailwind).

Features required:
1. Header with title banner, subtitle, and badges (e.g., "Grand Magister", "Immortal").
2. Hero portrait with zoom modal and optional caption.
3. Quick quote callout box.
4. Dynamic collapsible accordion sections (e.g., "Biographical Information", "Combat Capabilities", "Family Lineage").
5. Key-value data rows with support for clickable internal [[WikiLinks]].
6. Visual stat meters (health, mana, threat level) with animated progress bars and customizable color gradients.
7. Support both dark mode (Fantasy/Obsidian dark slate) and light mode (Parchment/Fandom clean).
8. Infobox editor modal where users can visually add fields, sections, and stats without writing raw YAML.`,
  },
  {
    category: "World Anvil Map & Timeline",
    framework: "React Native Gesture Handler + Reanimated",
    title: "World Anvil Interactive Map Atlas & Interactive Timeline for Mobile",
    description: "Pinch-to-zoom interactive fantasy map with categorized pins and an animated historical timeline with era filtering.",
    tags: ["World Anvil", "Map Atlas", "Timeline", "Gestures", "Reanimated"],
    prompt: `Build an interactive World Anvil-style Map and Timeline module for a React Native mobile application:

1. **Interactive World Map**:
   - High performance pinch-to-zoom and pan container using \`react-native-gesture-handler\` and \`react-native-reanimated\`.
   - Dynamic pin markers with custom icons (Capitals, Ruin, Fortress, Relic).
   - Filter pins by category/layer.
   - Tapping a pin highlights it and opens a sliding bottom sheet with article excerpt, image, and "Read Full Lore" button.

2. **Chronological Timeline View**:
   - Vertical timeline line with glowing nodes.
   - Grouping by Eras/Ages (e.g. "Age of Solid Earth", "The Cataclysm", "Era of Reconstruction").
   - Search & year filter slider.
   - Cards linking directly to corresponding Wiki articles.`,
  },
];
