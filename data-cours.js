/* ==========================================================================
   data-cours.js — Contenu intégral et exhaustif des Polycopiés 1, 2, 3,
   Redistribution, Dépannage, Commandes IOS, Glossaire & Anti-Pièges.
   ========================================================================== */
window.SAE33 = window.SAE33 || {};

window.SAE33.COURS = {
  internet: {
    id: "internet",
    eyebrow: "Module 1 · Polycopié 1 (Diapos 1 à 24)",
    title: "Le Réseau Internet, Gouvernance, Acteurs & Systèmes Autonomes",
    lead: "Comprendre comment le « réseau des réseaux » est gouverné, structuré physiquement et économiquement (Transit, Peering, Tier 1/2/3, RENATER), et découpé en Systèmes Autonomes (AS).",
    toc: [
      { id: "gov", label: "Gouvernance & RFC" },
      { id: "acteurs", label: "Niveaux physiques & Acteurs" },
      { id: "transit-peering", label: "Transit, Peering, IXP & PoP" },
      { id: "tiers", label: "Opérateurs Tier 1 / 2 / 3 & RENATER" },
      { id: "as-routing", label: "Systèmes Autonomes, RIR/LIR & Catégories" },
      { id: "igp-egp", label: "Routage Intra vs Inter-domaine" }
    ],
    html: `
      <section class="section-block" id="gov">
        <h2>🏛️ 1. Gouvernance d'Internet et documents de référence (RFC)</h2>
        <p>Internet n'appartient à aucun État ni aucune entreprise unique. Son évolution technique et l'attribution de ses ressources mondiales (IP, ASN, noms de domaine) reposent sur un écosystème d'organismes complémentaires :</p>

        <div class="diagram-card">
          <svg viewBox="0 0 760 280" role="img" aria-label="Organigramme hiérarchique de la gouvernance d'Internet : ISOC, ICANN/IANA, IAB, IESG/IETF, IRSG/IRTF">
            <defs>
              <marker id="arr1" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,1 L9,5 L0,9 z" fill="currentColor"/>
              </marker>
            </defs>
            <g font-family="system-ui, sans-serif" text-anchor="middle" fill="currentColor">
              <!-- ISOC -->
              <rect x="255" y="12" width="250" height="48" rx="10" fill="#2563eb" fill-opacity="0.16" stroke="#2563eb" stroke-width="2"/>
              <text x="380" y="33" font-weight="800" font-size="14">ISOC (Internet Society)</text>
              <text x="380" y="50" font-size="11" opacity="0.8">Superstructure · Développement ouvert</text>

              <!-- Lines -->
              <path d="M310 60 L155 102" stroke="currentColor" stroke-width="1.6" opacity="0.55" marker-end="url(#arr1)"/>
              <path d="M450 60 L545 102" stroke="currentColor" stroke-width="1.6" opacity="0.55" marker-end="url(#arr1)"/>

              <!-- ICANN -->
              <rect x="30" y="106" width="250" height="58" rx="10" fill="#7c3aed" fill-opacity="0.14" stroke="#7c3aed" stroke-width="2"/>
              <text x="155" y="127" font-weight="800" font-size="13.5">ICANN</text>
              <text x="155" y="143" font-size="11" opacity="0.85">Noms de domaine, IP, ports</text>
              <text x="155" y="157" font-size="10.5" opacity="0.8">Droit californien · Englobe l'IANA</text>

              <!-- IANA -->
              <path d="M155 164 L155 198" stroke="currentColor" stroke-width="1.6" opacity="0.55" marker-end="url(#arr1)"/>
              <rect x="45" y="202" width="220" height="56" rx="10" fill="#059669" fill-opacity="0.14" stroke="#059669" stroke-width="2"/>
              <text x="155" y="224" font-weight="800" font-size="13">IANA</text>
              <text x="155" y="240" font-size="11" opacity="0.85">Registres IPv4/IPv6, ASN, ports</text>
              <text x="155" y="253" font-size="10.5" opacity="0.8">Délègue aux RIR (ex : RIPE NCC)</text>

              <!-- IAB -->
              <rect x="415" y="106" width="260" height="52" rx="10" fill="#0284c7" fill-opacity="0.14" stroke="#0284c7" stroke-width="2"/>
              <text x="545" y="127" font-weight="800" font-size="13.5">IAB (Architecture Board)</text>
              <text x="545" y="144" font-size="11" opacity="0.85">Surveillance &amp; architecture · Désigné par ISOC</text>

              <path d="M490 158 L430 198" stroke="currentColor" stroke-width="1.6" opacity="0.55" marker-end="url(#arr1)"/>
              <path d="M600 158 L650 198" stroke="currentColor" stroke-width="1.6" opacity="0.55" marker-end="url(#arr1)"/>

              <!-- IETF -->
              <rect x="325" y="202" width="205" height="62" rx="10" fill="#d97706" fill-opacity="0.14" stroke="#d97706" stroke-width="2"/>
              <text x="427" y="222" font-weight="800" font-size="13">IETF (supervisé par IESG)</text>
              <text x="427" y="238" font-size="11" opacity="0.85">Normes &amp; standards (RFC)</text>
              <text x="427" y="253" font-size="10.5" opacity="0.8">1res implantations (OSPF, BGP...)</text>

              <!-- IRTF -->
              <rect x="548" y="202" width="195" height="62" rx="10" fill="#dc2626" fill-opacity="0.12" stroke="#dc2626" stroke-width="2"/>
              <text x="645" y="222" font-weight="800" font-size="13">IRTF (supervisé par IRSG)</text>
              <text x="645" y="238" font-size="11" opacity="0.85">Recherche long terme</text>
              <text x="645" y="253" font-size="10.5" opacity="0.8">Prépare les travaux de l'IETF</text>
            </g>
          </svg>
          <p class="diagram-caption">Architecture de la gouvernance mondiale d'Internet (Polycopié 1, diapos 4–5).</p>
        </div>

        <div class="grid-2">
          <div class="card">
            <h4>Les organismes clés (à connaître pour le DS)</h4>
            <ul>
              <li><strong>ISOC</strong> (Internet Society) : association internationale à but non lucratif fondée par les pionniers d'Internet. Agit comme <em>superstructure</em> morale et technique pour un Internet ouvert.</li>
              <li><strong>ICANN</strong> : association californienne d'utilité publique qui coordonne l'espace d'adressage IP, les noms de domaine (DNS), les numéros de ports et a englobé l'<strong>IANA</strong> (Internet Assigned Numbers Authority).</li>
              <li><strong>IAB</strong> (Internet Architecture Board) : comité désigné par l'ISOC chargé de la surveillance et du développement architectural, organisé en <em>task forces</em>.</li>
              <li><strong>IETF</strong> (supervisé par l'<strong>IESG</strong>) : ingénierie court/moyen terme, rédige les normes et standards d'Internet (<strong>RFC</strong>) et réalise les premières implantations.</li>
              <li><strong>IRTF</strong> (supervisé par l'<strong>IRSG</strong>) : recherche sur le long terme, anticipe l'évolution des protocoles et prépare les futurs travaux de l'IETF.</li>
            </ul>
          </div>
          <div class="card">
            <h4>Les RFC (Request For Comments)</h4>
            <p>Série numérotée de documents publiés par l'IETF décrivant les spécifications techniques d'Internet (protocoles, équipements). Rédigées par des experts puis revues par la communauté.</p>
            <div class="callout callout-warn">
              <strong class="callout-title">⚠️ Piège DS classique :</strong>
              Toutes les RFC publiées par l'IETF ne sont <strong>pas</strong> des normes ! Beaucoup sont informatives ou expérimentales. Seule une partie est en <em>Standard-track</em>.
            </div>
            <p><strong>Les 3 statuts Standard-track du cours (diapo 6) :</strong></p>
            <ol>
              <li><strong>Proposed Standard</strong> : proposition retenue par l'IESG (pas d'implémentation requise).</li>
              <li><strong>Draft Standard</strong> : au moins 2 implémentations indépendantes et interopérables réussies <em>(note moderne : ce stade intermédiaire a été fusionné depuis la RFC 6410, mais retenez bien les 3 stades du polycopié pour le DS !)</em>.</li>
              <li><strong>Internet Standard</strong> : norme officielle, multiples implémentations réussies et éprouvées.</li>
            </ol>
          </div>
        </div>
      </section>

      <section class="section-block" id="acteurs">
        <h2>🧱 2. Structuration physique et acteurs fonctionnels d'Internet</h2>
        <div class="grid-2">
          <div class="card-white">
            <h4>Les 3 niveaux physiques (diapo 7)</h4>
            <ol>
              <li><strong>Équipements d'extrémité</strong> : PC, smartphones, serveurs chez le particulier ou en entreprise (génèrent et consomment les données).</li>
              <li><strong>Réseaux d'accès</strong> : boucle locale (fibre FTTH, xDSL, 4G/5G), répartiteurs qui relient l'usager ou l'entreprise au réseau de transport.</li>
              <li><strong>Réseau cœur (Backbone / Dorsales)</strong> : routeurs haute capacité et liaisons terrestres, sous-marines (<em>submarinecablemap.com</em>) ou satellitaires très haut débit acheminant les paquets entre zones géographiques.</li>
            </ol>
          </div>
          <div class="card-white">
            <h4>Les 4 niveaux fonctionnels / acteurs (diapo 8)</h4>
            <ol>
              <li><strong>Les services</strong> : web, messagerie, téléphonie, transfert de fichiers et leurs protocoles applicatifs.</li>
              <li><strong>Le client et ses outils</strong> : logiciels clients (navigateur, client mail) ou outils de développement.</li>
              <li><strong>Les FAI / ISP</strong> (Fournisseurs d'Accès à Internet) : collectent les données des abonnés pour leur fournir l'accès à Internet.</li>
              <li><strong>Les opérateurs du réseau</strong> :
                <ul>
                  <li><em>Opérateurs de transport</em> : acheminent le trafic de leurs abonnés ET potentiellement celui d'autres opérateurs.</li>
                  <li><em>Opérateurs de câblage</em> : construisent et maintiennent l'infrastructure physique (fibres, fourreaux, câbles sous-marins).</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section class="section-block" id="transit-peering">
        <h2>🤝 3. Transit, Peering (Privé / Public), IXP et PoP</h2>
        <div tabindex="0" role="region" aria-labelledby="cap-transit-peering" class="table-wrapper stack-mobile">
          <table>
            <caption id="cap-transit-peering">Comparatif Transit vs Peering vs PoP (Polycopié 1, diapos 9–10)</caption>
            <thead>
              <tr>
                <th>Notion</th>
                <th>Définition précise</th>
                <th>Modèle économique</th>
                <th>Mise en œuvre physique</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Transit IP</th>
                <td data-label="Définition">Un opérateur achète à un opérateur amont le droit de faire passer son trafic vers l'ensemble d'Internet (routes mondiales).</td>
                <td data-label="Modèle économique"><strong>Payant à la consommation</strong> (bande passante réelle avec seuil minimal engagé).</td>
                <td data-label="Mise en œuvre">Liaison dédiée vers un ISP de niveau supérieur (ex : Tier 3 → Tier 2 → Tier 1).</td>
              </tr>
              <tr>
                <th scope="row">Peering Privé (Appairage)</th>
                <td data-label="Définition">Accord entre deux opérateurs de trafic comparable pour échanger directement <em>leurs propres routes</em> (et celles de leurs clients, pas le reste d'Internet).</td>
                <td data-label="Modèle économique">Généralement <strong>gratuit</strong> (ou au <strong>forfait</strong>, jamais à la consommation).</td>
                <td data-label="Mise en œuvre">Liaison physique directe point-à-point entre les deux acteurs (souvent non contractuel / handshake).</td>
              </tr>
              <tr>
                <th scope="row">Peering Public (IXP / GIX)</th>
                <td data-label="Définition">Échange mutuel de trafic entre de nombreux FAI / CDN via une infrastructure commutée partagée.</td>
                <td data-label="Modèle économique">Coût du port sur l'IXP ; échanges de peering gratuits ou forfaitaires.</td>
                <td data-label="Mise en œuvre">Switch géant dans un <strong>IXP</strong> (<em>Internet eXchange Point</em>, ex-NAP aux US) ou <strong>GIX</strong> (ex : FranceIX, SFINX, AuvernIX).</td>
              </tr>
              <tr>
                <th scope="row">PoP (Point de Présence)</th>
                <td data-label="Définition">Point de collecte régional où un opérateur dispose d'équipements actifs/passifs pour recueillir et transmettre des flux locaux.</td>
                <td data-label="Modèle économique">Infrastructure propre ou colocalisée en datacenter.</td>
                <td data-label="Mise en œuvre">Ex. AuvernIX : POP Gravanches 3, Datacenter La Citadelle (LADD1), O2switch.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="section-block" id="tiers">
        <h2>📶 4. Hiérarchie des Opérateurs (Tier 1, 2, 3) & Réseaux RENATER / GÉANT</h2>
        <div class="grid-3">
          <div class="card">
            <span class="badge badge-blue">Niveau 1 · Tier 1</span>
            <h4>Dorsale mondiale (Backbone)</h4>
            <ul>
              <li><strong>N'achètent AUCUN transit</strong>.</li>
              <li>Voient 100 % d'Internet grâce au <strong>peering direct avec TOUS les autres Tier 1</strong> + leurs clients transit.</li>
              <li>Couverture internationale, routeurs très haut débit.</li>
              <li><em>Exemples du cours :</em> Orange (FR), AT&amp;T, Lumen Technologies, Verizon (US), Deutsche Telekom (DE), Tata Communications (IN), NTT (JP).</li>
            </ul>
          </div>
          <div class="card">
            <span class="badge badge-purple">Niveau 2 · Tier 2</span>
            <h4>Opérateurs régionaux / nationaux</h4>
            <ul>
              <li><strong>Achètent du transit</strong> (aux Tier 1) pour atteindre le reste du monde.</li>
              <li>Disposent d'<strong>accords de peering</strong> (privés ou via IXP) avec d'autres réseaux pour réduire leurs coûts et leur latence.</li>
              <li><em>Exemple clé du cours :</em> <strong>RENATER</strong> est un ISP de <strong>niveau 2</strong> !</li>
            </ul>
          </div>
          <div class="card">
            <span class="badge badge-warn">Niveau 3 · Tier 3</span>
            <h4>Opérateurs locaux / d'accès</h4>
            <ul>
              <li><strong>Dépendent uniquement d'une offre de transit</strong> (achetée à des Tier 2 ou Tier 1).</li>
              <li><strong>Aucun peering</strong>.</li>
              <li>Raccordent principalement les entreprises locales et particuliers.</li>
            </ul>
          </div>
        </div>

        <div class="callout callout-success">
          <strong class="callout-title">🎓 Focus Examen : RENATER et GÉANT (diapos 15–16)</strong>
          <ul>
            <li><strong>RENATER</strong> (<em>REseau NAtional de Télécommunications pour la technologie, l'Enseignement et la Recherche</em>) : créé en <strong>1993</strong>, relie universités et centres de recherche (métropole + DOM).</li>
            <li>Depuis <strong>2015</strong>, mutualise son infrastructure pour la <strong>DINSIC</strong> et opère le <strong>RIE</strong> (Réseau Interministériel de l'État).</li>
            <li>Connecté à Internet en France via l'IXP <strong>SFINX</strong>, et à l'international via deux liaisons IP Transit à <strong>Paris et Marseille</strong> → classé <strong>Tier 2</strong>.</li>
            <li>Connecté au réseau pan-européen de recherche <strong>GÉANT</strong> (interconnexion des NREN européennes).</li>
          </ul>
        </div>
      </section>

      <section class="section-block" id="as-routing">
        <h2>🗺️ 5. Systèmes Autonomes (AS), Délégation IANA → RIR → LIR & 4 Catégories d'AS</h2>
        <p>Pour éviter que chaque routeur du monde ne gère la topologie détaillée de toute la planète, Internet est découpé en domaines administratifs appelés <strong>Systèmes Autonomes (AS — Autonomous Systems)</strong> :</p>
        <ul>
          <li>Ensemble de réseaux gérés par <strong>une même autorité administrative</strong> appliquant une <strong>stratégie de routage interne unique</strong> (~64 000 AS en 2019, >75 000 aujourd'hui).</li>
          <li>Identifié par un numéro unique <strong>ASN codé sur 32 bits</strong> (16 bits avant 2007). Certaines plages sont réservées (usage privé 64512–65534, documentation).</li>
          <li><strong>Chaîne de délégation des ASN et préfixes IP :</strong> <strong>IANA</strong> → 5 <strong>RIR</strong> régionaux (<strong>RIPE NCC</strong> pour l'Europe, ARIN, APNIC, AFRINIC, LACNIC) → <strong>LIR</strong> (<em>Local Internet Registry</em> : toute organisation payant sa souscription, qui distribue/revend aux clients finaux. Exemples France : Orange, Free, SFR, Bouygues, OVH, RENATER, ADISTA, NEYRIAL...). Les RIR ne traitent <em>jamais</em> directement avec les clients finaux.</li>
        </ul>

        <h3>Les 4 catégories d'AS (diapos 20–21)</h3>
        <div class="grid-4">
          <div class="card">
            <span class="badge badge-blue">1. Singlehomed (Stub)</span>
            <h4>AS en impasse</h4>
            <p class="small">Connecté à <strong>un seul autre AS</strong>. Une route par défaut vers cet unique voisin suffit souvent. <em>(Ne pas confondre avec une « aire stub » OSPF !)</em></p>
          </div>
          <div class="card">
            <span class="badge badge-green">2. Multihomed</span>
            <h4>Multi-connecté sans transit</h4>
            <p class="small">Connecté à <strong>plusieurs AS</strong> (redondance/performance), mais <strong>interdit au trafic tiers de le traverser</strong> vers un autre AS.</p>
          </div>
          <div class="card">
            <span class="badge badge-purple">3. Transit</span>
            <h4>AS de transit (Opérateur)</h4>
            <p class="small">Fournit de la connectivité <strong>à travers lui-même</strong> entre d'autres AS (ex : AS200 dans le TD3 qui transporte le trafic entre AS100 et AS300).</p>
          </div>
          <div class="card">
            <span class="badge badge-warn">4. IXP</span>
            <h4>Point d'échange Internet</h4>
            <p class="small">Infrastructure physique où FAI/CDN échangent du trafic. Ex : <strong>AuvernIX (AS 201376)</strong> relié à FranceIX Lyon et EquinIX Paris.</p>
          </div>
        </div>
      </section>

      <section class="section-block" id="igp-egp">
        <h2>🧭 6. Routage Intra-domaine (IGP) vs Inter-domaine (EGP)</h2>
        <div tabindex="0" role="region" aria-labelledby="cap-igp-egp" class="table-wrapper stack-mobile">
          <table>
            <caption id="cap-igp-egp">Comparaison IGP (OSPF) vs EGP (BGP) (Polycopié 1, diapos 22–24)</caption>
            <thead>
              <tr>
                <th>Critère</th>
                <th>Routage Intra-domaine (IGP)</th>
                <th>Routage Inter-domaine (EGP)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Périmètre</th>
                <td data-label="IGP">À l'intérieur d'<strong>un seul AS</strong> (une même autorité administrative).</td>
                <td data-label="EGP">Entre <strong>plusieurs AS distincts</strong> (entités administratives différentes).</td>
              </tr>
              <tr>
                <th scope="row">Protocoles</th>
                <td data-label="IGP"><strong>OSPF</strong>, IS-IS, RIP, EIGRP <em>(note : EIGRP utilise un numéro d'AS local en interne, mais reste un IGP)</em>.</td>
                <td data-label="EGP"><strong>BGP-4</strong> (eBGP entre AS, et iBGP pour relayer les routes BGP dans un AS).</td>
              </tr>
              <tr>
                <th scope="row">Objectif principal</th>
                <td data-label="IGP">Trouver le chemin <strong>le plus rapide / le plus court</strong> (métrique technique : coût, bande passante).</td>
                <td data-label="EGP">Appliquer une <strong>politique de routage</strong> (économique, contractuelle, peering, transit, sécurité) tout en masquant la topologie interne.</td>
              </tr>
              <tr>
                <th scope="row">Visibilité topologique</th>
                <td data-label="IGP">Connaissance fine de la topologie de son aire (LSDB OSPF).</td>
                <td data-label="EGP">Ne connaît que les <strong>préfixes accessibles</strong> et la liste d'AS traversés (<code>AS_PATH</code>).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    `
  },

  ospf: {
    id: "ospf",
    eyebrow: "Module 2 · Polycopié 2 (Diapos 25 à 39) + TP1 + TP3 + CR OSPF",
    title: "Le Protocole OSPF (Open Shortest Path First)",
    lead: "Maîtrisez intégralement OSPF : état de liens, protocole IP 89, flooding, LSDB, algorithme de Dijkstra (SPF), 5 types de paquets, LSA 1 à 7, multi-aires (ABR/ASBR), Stub/NSSA, élection DR/BDR et authentification MD5.",
    toc: [
      { id: "ospf-intro", label: "Identité & Encapsulation" },
      { id: "ospf-steps", label: "4 Étapes & 7 États" },
      { id: "ospf-packets", label: "5 Paquets & En-tête" },
      { id: "ospf-lsa", label: "LSA Types 1 à 7" },
      { id: "ospf-areas", label: "Aires, Rôles & Stub/NSSA" },
      { id: "ospf-metric", label: "Métrique, Coût & Préférence" },
      { id: "ospf-dr", label: "Router-ID & Élection DR/BDR" },
      { id: "ospf-auth", label: "Authentification MD5" }
    ],
    html: `
      <section class="section-block" id="ospf-intro">
        <h2>⚙️ 1. Historique, caractéristiques et encapsulation</h2>
        <div class="grid-4">
          <div class="kpi-card">
            <span class="kpi-label">Norme IETF</span>
            <span class="kpi-value">RFC 2328</span>
            <span class="kpi-sub">OSPFv2 (1997, IPv4) · OSPFv3 RFC 5340 (IPv6)</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Encapsulation</span>
            <span class="kpi-value">IP proto 89</span>
            <span class="kpi-sub">0x59 · Directement dans IP (ni TCP ni UDP !)</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Adresses Multicast</span>
            <span class="kpi-value">224.0.0.5 / .6</span>
            <span class="kpi-sub">.5 AllSPFRouters · .6 AllDRouters · TTL = 1</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Distance Admin.</span>
            <span class="kpi-value">AD = 110</span>
            <span class="kpi-sub">Algorithme Dijkstra (SPF) · Max ~200 routeurs</span>
          </div>
        </div>
        <p>Développé par l'IETF dès 1987 et recommandé par l'IAB pour remplacer RIP, <strong>OSPF</strong> est un protocole <strong>ouvert</strong> à <strong>état de liens (Link-State)</strong> : chaque routeur diffuse par inondation (<em>flooding</em>) l'état de ses interfaces afin que tous les routeurs d'une même aire possèdent une <strong>LSDB (Link-State Database) strictement identique</strong>, puis calculent indépendamment l'arbre des plus courts chemins avec <strong>Dijkstra (SPF)</strong>.</p>
        <div class="grid-2">
          <div class="callout callout-success">
            <strong class="callout-title">✅ Avantages d'OSPF (diapo 39)</strong>
            Calcul indépendant sur base commune, <strong>absence de boucles</strong>, convergence rapide, messages d'état compacts (ne dépendent pas du nombre total de réseaux), répartition de charge (<strong>ECMP</strong>) sur routes de coût égal.
          </div>
          <div class="callout callout-warn">
            <strong class="callout-title">⚠️ Inconvénients d'OSPF (diapo 39)</strong>
            Consomme davantage de <strong>CPU et RAM</strong> (LSDB + calculs SPF), grande réactivité pouvant engendrer une <strong>instabilité</strong> si un lien bat (<em>flapping</em>), plus <strong>complexe</strong> à configurer que RIP.
          </div>
        </div>
      </section>

      <section class="section-block" id="ospf-steps">
        <h2>🔄 2. Les 4 étapes de fonctionnement & les 7 états d'adjacence</h2>
        <div class="grid-4">
          <div class="card">
            <span class="badge badge-blue">Étape 1</span>
            <h4>Découverte & Adjacence</h4>
            <p class="small">Envoi périodique de paquets <strong>Hello</strong> (toutes les <strong>10 s</strong> sur Ethernet, Dead = <strong>40 s</strong>) vers <code>224.0.0.5</code> (MAC <code>0100.5E00.0005</code>).</p>
          </div>
          <div class="card">
            <span class="badge badge-purple">Étape 2</span>
            <h4>Échange des LSA</h4>
            <p class="small">Chaque routeur diffuse ses liens via des <strong>LSA</strong> (Link-State Advertisements) propagées par inondation (<em>flooding</em>) à toute son aire.</p>
          </div>
          <div class="card">
            <span class="badge badge-green">Étape 3</span>
            <h4>Construction LSDB</h4>
            <p class="small">L'ensemble des LSA forme la <strong>LSDB</strong>, <strong>identique</strong> sur tous les routeurs d'une même aire (base topologique complète).</p>
          </div>
          <div class="card">
            <span class="badge badge-warn">Étape 4</span>
            <h4>Calcul SPF (Dijkstra)</h4>
            <p class="small">Chaque routeur exécute <strong>Dijkstra</strong> sur la LSDB pour élire la meilleure route vers chaque préfixe et l'installer dans la RIB (<code>show ip route</code>).</p>
          </div>
        </div>

        <h3>Machine à états d'une adjacence OSPF (cliquez sur un état)</h3>
        <div class="stepper" data-stepper="ospf-states">
          <button type="button" class="step-node active" data-step="0">1. DOWN</button><span class="step-arrow">→</span>
          <button type="button" class="step-node" data-step="1">2. INIT</button><span class="step-arrow">→</span>
          <button type="button" class="step-node" data-step="2">3. 2-WAY</button><span class="step-arrow">→</span>
          <button type="button" class="step-node" data-step="3">4. EXSTART</button><span class="step-arrow">→</span>
          <button type="button" class="step-node" data-step="4">5. EXCHANGE</button><span class="step-arrow">→</span>
          <button type="button" class="step-node" data-step="5">6. LOADING</button><span class="step-arrow">→</span>
          <button type="button" class="step-node" data-step="6">7. FULL</button>
        </div>
        <div class="sim-result-box" id="stepper-ospf-states-out">
          <strong>DOWN :</strong> Aucun paquet Hello reçu du voisin. Le routeur envoie ses propres Hello sur <code>224.0.0.5</code>. Si bloqué ici : vérifier câble, <code>no shutdown</code>, <code>network</code>, <code>passive-interface</code> ou incompatibilité d'aire/timers/MD5.
        </div>

        <div class="callout">
          <strong class="callout-title">🔑 Conditions obligatoires pour devenir voisins OSPF (vérifiées dans les Hello) :</strong>
          1) Même <strong>Area ID</strong> · 2) Même <strong>masque de sous-réseau</strong> (sur Ethernet) · 3) Mêmes <strong>Hello Interval</strong> (10 s) et <strong>Dead Interval</strong> (40 s) · 4) Même <strong>drapeau Stub / NSSA</strong> (bits E / N) · 5) Même <strong>authentification</strong> (type + clé MD5) · 6) <strong>Router-ID distincts</strong>. <em>Attention : le Process ID (<code>router ospf 1</code> vs <code>100</code>) est purement local et peut différer !</em>
        </div>
      </section>

      <section class="section-block" id="ospf-packets">
        <h2>📦 3. Les 5 types de paquets OSPF et le format de l'en-tête</h2>
        <div tabindex="0" role="region" aria-labelledby="cap-ospf-pkts" class="table-wrapper stack-mobile">
          <table>
            <caption id="cap-ospf-pkts">Les 5 types de paquets OSPF (Polycopié 2, diapo 33 + Wireshark TP1)</caption>
            <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Rôle précis</th>
                <th>Champs clés à repérer dans Wireshark / Packet Tracer</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Type 1</th>
                <td data-label="Nom"><strong>Hello</strong></td>
                <td data-label="Rôle">Découverte des voisins, vérification des paramètres, élection DR/BDR et maintien de lien.</td>
                <td data-label="Champs">Network Mask, Hello (10 s), Dead (40 s), Options (bit E/N), Priority, DR, BDR, Active Neighbors.</td>
              </tr>
              <tr>
                <th scope="row">Type 2</th>
                <td data-label="Nom"><strong>DBD</strong> (Database Description)</td>
                <td data-label="Rôle">Initie la synchronisation en envoyant un <em>résumé</em> (en-têtes uniquement) des LSA de la LSDB.</td>
                <td data-label="Champs">Flags <strong>I / M / MS</strong> (Init, More, Master/Slave), DD Sequence Number, liste d'en-têtes LSA.</td>
              </tr>
              <tr>
                <th scope="row">Type 3</th>
                <td data-label="Nom"><strong>LSR</strong> (Link State Request)</td>
                <td data-label="Rôle">Demande les LSA manquantes ou plus récentes repérées grâce au DBD reçu.</td>
                <td data-label="Champs">Triplets (LS Type, Link State ID, Advertising Router) des LSA réclamées.</td>
              </tr>
              <tr>
                <th scope="row">Type 4</th>
                <td data-label="Nom"><strong>LSU</strong> (Link State Update)</td>
                <td data-label="Rôle">Réponse aux LSR ou inondation lors d'un changement : transporte une ou plusieurs <strong>LSA complètes</strong>.</td>
                <td data-label="Champs">Number of LSAs + corps complet de chaque LSA (Type 1, 2, 3, 4, 5 ou 7).</td>
              </tr>
              <tr>
                <th scope="row">Type 5</th>
                <td data-label="Nom"><strong>LSAck</strong> (Link State Ack)</td>
                <td data-label="Rôle">Accusé de réception fiable des LSA reçues dans les LSU (OSPF n'utilisant pas TCP).</td>
                <td data-label="Champs">En-têtes des LSA acquittées (Link ID, Seq#, Checksum).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Format de l'en-tête commun OSPF (24 octets — diapo 38)</h3>
        <div class="pdu-grid" aria-label="Structure de l'en-tête commun OSPFv2 de 24 octets">
          <div class="pdu-cell"><strong>Version (8 bits)</strong> = 2<small>OSPFv2 (IPv4)</small></div>
          <div class="pdu-cell"><strong>Type (8 bits)</strong> = 1..5<small>Hello, DBD, LSR, LSU, LSAck</small></div>
          <div class="pdu-cell pdu-span-2"><strong>Packet Length (16 bits)</strong><small>Longueur totale du paquet OSPF en octets</small></div>
          <div class="pdu-cell pdu-span-4"><strong>Router ID (32 bits)</strong> — Adresse IP identifiant le routeur émetteur (ex : <code>5.5.5.5</code>)</div>
          <div class="pdu-cell pdu-span-4"><strong>Area ID (32 bits)</strong> — Numéro de l'aire en notation IP (ex : Aire 50 = <code>0.0.0.50</code>, Backbone = <code>0.0.0.0</code>)</div>
          <div class="pdu-cell pdu-span-2"><strong>Checksum (16 bits)</strong><small>Total de contrôle sur le message hors authentification</small></div>
          <div class="pdu-cell pdu-span-2"><strong>AuType (16 bits)</strong><small>0 = Aucune · 1 = Clair · 2 = MD5 (Cryptographic)</small></div>
          <div class="pdu-cell pdu-span-4"><strong>Authentication (64 bits = 8 octets)</strong> — Mot de passe (type 1) ou Key ID + Auth Data Length (16) + Crypto Sequence Number anti-rejeu (type 2, hash MD5 16 o. ajouté en fin de paquet)</div>
        </div>
      </section>

      <section class="section-block" id="ospf-lsa">
        <h2>📜 4. Les Types de LSA (transportés dans les paquets LSU de type 4)</h2>
        <div class="callout callout-danger">
          <strong class="callout-title">🚨 PIÈGE N°1 AUX EXAMENS : Paquet OSPF ≠ Type de LSA !</strong>
          Un <strong>paquet de type 5</strong> est un <code>LSAck</code> (accusé de réception), alors qu'une <strong>LSA de type 5</strong> est une annonce de route externe (<code>AS-External</code>) transportée à l'intérieur d'un <strong>paquet de type 4 (LSU)</strong> !
        </div>
        <div tabindex="0" role="region" aria-labelledby="cap-lsa" class="table-wrapper stack-mobile">
          <table>
            <caption id="cap-lsa">Catalogue des LSA OSPF et codes correspondants dans show ip route (Polycopié 2, diapo 34)</caption>
            <thead>
              <tr>
                <th>LSA</th>
                <th>Nom &amp; Section LSDB</th>
                <th>Générée par</th>
                <th>Portée</th>
                <th>Code RIB</th>
                <th>Rôle exact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Type 1</th>
                <td data-label="Nom">Router LSA (<em>Router Link States</em>)</td>
                <td data-label="Générée par">Chaque routeur</td>
                <td data-label="Portée">Intra-aire uniquement</td>
                <td data-label="Code RIB"><code>O</code></td>
                <td data-label="Rôle">Décrit l'état et le coût des interfaces d'un routeur dans son aire. Ne franchit jamais un ABR.</td>
              </tr>
              <tr>
                <th scope="row">Type 2</th>
                <td data-label="Nom">Network LSA (<em>Net Link States</em>)</td>
                <td data-label="Générée par">Le <strong>DR</strong></td>
                <td data-label="Portée">Intra-aire uniquement</td>
                <td data-label="Code RIB"><code>O</code></td>
                <td data-label="Rôle">Décrit un segment multi-accès (broadcast) et la liste des routeurs qui y sont attachés (Link ID = IP du DR).</td>
              </tr>
              <tr>
                <th scope="row">Type 3</th>
                <td data-label="Nom">Summary LSA (<em>Summary Net Link States</em>)</td>
                <td data-label="Générée par">Un <strong>ABR</strong></td>
                <td data-label="Portée">Inter-aires</td>
                <td data-label="Code RIB"><code>O IA</code> / <code>O*IA</code></td>
                <td data-label="Rôle">Annonce les réseaux d'une aire vers les autres aires (et la route par défaut <code>0.0.0.0/0</code> en stub/totally stub/totally NSSA).</td>
              </tr>
              <tr>
                <th scope="row">Type 4</th>
                <td data-label="Nom">ASBR Summary (<em>Summary ASB Link States</em>)</td>
                <td data-label="Générée par">Un <strong>ABR</strong></td>
                <td data-label="Portée">Inter-aires</td>
                <td data-label="Code RIB">— (calcul)</td>
                <td data-label="Rôle">Indique aux autres aires comment joindre un <strong>ASBR</strong> situé dans une aire distante.</td>
              </tr>
              <tr>
                <th scope="row">Type 5</th>
                <td data-label="Nom">AS-External (<em>Type-5 AS External</em>)</td>
                <td data-label="Générée par">Un <strong>ASBR</strong></td>
                <td data-label="Portée">Tout l'AS (sauf Stub/NSSA)</td>
                <td data-label="Code RIB"><code>O E1</code> / <code>O E2</code></td>
                <td data-label="Rôle">Annonce une route externe redistribuée (statique, connected, BGP). Subdivisée en E1 (coût cumulé) et E2 (coût fixe).</td>
              </tr>
              <tr>
                <th scope="row">Type 7</th>
                <td data-label="Nom">NSSA External (<em>Type-7 AS External</em>)</td>
                <td data-label="Générée par">ASBR dans une <strong>NSSA</strong></td>
                <td data-label="Portée">Aire NSSA uniquement</td>
                <td data-label="Code RIB"><code>O N1</code> / <code>O N2</code></td>
                <td data-label="Rôle">Permet d'injecter des routes externes dans une aire NSSA. L'ABR <strong>traduit les LSA 7 en LSA 5</strong> vers l'aire 0 et le reste de l'AS.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="small muted"><strong>Colonnes de <code>show ip ospf database</code> :</strong> <code>Age</code> (secondes depuis création, rafraîchie toutes les 30 min, MaxAge = 3600 s pour retrait), <code>Seq#</code> (commence à <code>0x80000001</code>, plus grand = plus récent), <code>Checksum</code> (intégrité).</p>
      </section>

      <section class="section-block" id="ospf-areas">
        <h2>🗺️ 5. Multi-aires, Rôles des Routeurs et Types d'Aires (Stub / NSSA)</h2>
        <div class="diagram-card">
          <svg viewBox="0 0 760 225" role="img" aria-label="Architecture OSPF multi-aires avec Aire 0 Backbone, ABR, IAR, ASBR et BGP vers AS2">
            <g font-family="system-ui, sans-serif" fill="currentColor">
              <!-- Aire 10 -->
              <rect x="14" y="24" width="185" height="175" rx="14" fill="#0284c7" fill-opacity="0.1" stroke="#0284c7" stroke-width="2" stroke-dasharray="6 4"/>
              <text x="106" y="46" text-anchor="middle" font-weight="800" font-size="13" fill="#0284c7">Aire 10 (Stub / Totally Stub)</text>
              <!-- Aire 0 -->
              <rect x="218" y="24" width="235" height="175" rx="14" fill="#2563eb" fill-opacity="0.13" stroke="#2563eb" stroke-width="2.5"/>
              <text x="335" y="46" text-anchor="middle" font-weight="800" font-size="13" fill="#2563eb">Aire 0 (Backbone)</text>
              <!-- Aire 20 -->
              <rect x="472" y="24" width="150" height="175" rx="14" fill="#059669" fill-opacity="0.1" stroke="#059669" stroke-width="2" stroke-dasharray="6 4"/>
              <text x="547" y="46" text-anchor="middle" font-weight="800" font-size="13" fill="#059669">Aire 20 (NSSA)</text>
              <!-- AS2 -->
              <rect x="640" y="55" width="108" height="115" rx="14" fill="#7c3aed" fill-opacity="0.12" stroke="#7c3aed" stroke-width="2"/>
              <text x="694" y="78" text-anchor="middle" font-weight="800" font-size="12.5" fill="#7c3aed">AS Externe</text>

              <!-- Links -->
              <line x1="92" y1="115" x2="218" y2="115" stroke="currentColor" stroke-width="2.5"/>
              <line x1="218" y1="115" x2="335" y2="115" stroke="currentColor" stroke-width="2.5"/>
              <line x1="335" y1="115" x2="472" y2="115" stroke="currentColor" stroke-width="2.5"/>
              <line x1="472" y1="115" x2="565" y2="115" stroke="currentColor" stroke-width="2.5"/>
              <line x1="335" y1="145" x2="335" y2="176" stroke="currentColor" stroke-width="2"/>
              <path d="M368 176 L640 120" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="5 3" fill="none"/>
              <text x="515" y="172" font-size="11" font-weight="700" fill="#7c3aed">eBGP (TCP 179)</text>

              <!-- Nodes -->
              <circle cx="80" cy="115" r="24" fill="#1e293b" stroke="#0284c7" stroke-width="2.5"/>
              <text x="80" y="119" text-anchor="middle" fill="#fff" font-weight="700" font-size="12">IAR</text>
              <text x="80" y="156" text-anchor="middle" font-size="10.5">1 seule aire</text>

              <circle cx="218" cy="115" r="26" fill="#1e293b" stroke="#2563eb" stroke-width="3"/>
              <text x="218" y="119" text-anchor="middle" fill="#fff" font-weight="800" font-size="12">ABR</text>
              <text x="218" y="156" text-anchor="middle" font-size="10.5">LSA 3 · 2 LSDB</text>

              <circle cx="335" cy="115" r="24" fill="#1e293b" stroke="#2563eb" stroke-width="2.5"/>
              <text x="335" y="119" text-anchor="middle" fill="#fff" font-weight="700" font-size="11">Backb.</text>

              <circle cx="335" cy="176" r="22" fill="#1e293b" stroke="#7c3aed" stroke-width="3"/>
              <text x="335" y="180" text-anchor="middle" fill="#fff" font-weight="800" font-size="11">ASBR</text>

              <circle cx="472" cy="115" r="26" fill="#1e293b" stroke="#059669" stroke-width="3"/>
              <text x="472" y="119" text-anchor="middle" fill="#fff" font-weight="800" font-size="12">ABR</text>
              <text x="472" y="156" text-anchor="middle" font-size="10.5">LSA 7 → 5</text>

              <circle cx="565" cy="115" r="24" fill="#1e293b" stroke="#059669" stroke-width="2.5"/>
              <text x="565" y="119" text-anchor="middle" fill="#fff" font-weight="700" font-size="10.5">ASBR</text>
              <text x="565" y="156" text-anchor="middle" font-size="10.5">LSA 7 (N2)</text>

              <circle cx="694" cy="120" r="24" fill="#1e293b" stroke="#7c3aed" stroke-width="2.5"/>
              <text x="694" y="124" text-anchor="middle" fill="#fff" font-weight="700" font-size="12">BGP</text>
            </g>
          </svg>
          <p class="diagram-caption">Topologie OSPF multi-aires : toute aire non-backbone doit être connectée à l'Aire 0 via un ABR (ou un <em>virtual-link</em> à travers une aire de transit normale).</p>
        </div>

        <div class="grid-3">
          <div class="card">
            <h4>IAR (Intra-Area Router)</h4>
            <p class="small">Toutes ses interfaces sont dans <strong>une seule aire</strong> (hors aire 0). Maintient une seule LSDB. <strong>Ne peut ni filtrer ni résumer les routes</strong> (cohérence SPF obligatoire).</p>
          </div>
          <div class="card">
            <h4>ABR (Area Border Router)</h4>
            <p class="small">Possède au moins une interface dans l'<strong>aire 0</strong> et une dans une autre aire. Maintient <strong>une LSDB par aire</strong>, génère les LSA 3/4, et <strong>peut agréger/résumer les routes</strong>.</p>
          </div>
          <div class="card">
            <h4>ASBR (AS Boundary Router)</h4>
            <p class="small">Situé à la frontière avec un autre protocole/AS (BGP, statique, connected). Injecte les routes externes via <strong>LSA 5</strong> (ou LSA 7 en NSSA) avec <code>redistribute</code>.</p>
          </div>
        </div>

        <h3>Matrice complète des types d'aires OSPF (Poly 2 diapo 35 + TP3)</h3>
        <div tabindex="0" role="region" aria-labelledby="cap-areas" class="table-wrapper stack-mobile">
          <table>
            <caption id="cap-areas">Tableau récapitulatif des aires OSPF — À SAVOIR PAR CŒUR POUR LE DS & DSTP</caption>
            <thead>
              <tr>
                <th>Type d'aire</th>
                <th>LSA 1 &amp; 2</th>
                <th>LSA 3 (O IA)</th>
                <th>LSA 4 &amp; 5 (O E1/E2)</th>
                <th>LSA 7 (O N1/N2)</th>
                <th>Route défaut auto ?</th>
                <th>Commandes IOS exactes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Normale / Backbone (0)</th>
                <td data-label="LSA 1-2">✅ Oui</td>
                <td data-label="LSA 3">✅ Oui</td>
                <td data-label="LSA 4-5">✅ Oui</td>
                <td data-label="LSA 7">❌ Non</td>
                <td data-label="Défaut">❌ Non</td>
                <td data-label="Commandes"><em>Par défaut</em></td>
              </tr>
              <tr>
                <th scope="row">Stub (Confinée)</th>
                <td data-label="LSA 1-2">✅ Oui</td>
                <td data-label="LSA 3">✅ Oui</td>
                <td data-label="LSA 4-5">🚫 Bloquées</td>
                <td data-label="LSA 7">❌ Non (pas d'ASBR)</td>
                <td data-label="Défaut">✅ <code>O*IA 0.0.0.0/0</code></td>
                <td data-label="Commandes"><strong>Tous les routeurs :</strong> <code>area X stub</code></td>
              </tr>
              <tr>
                <th scope="row">Totally Stub (Cisco)</th>
                <td data-label="LSA 1-2">✅ Oui</td>
                <td data-label="LSA 3">🚫 Bloquées (sauf défaut)</td>
                <td data-label="LSA 4-5">🚫 Bloquées</td>
                <td data-label="LSA 7">❌ Non</td>
                <td data-label="Défaut">✅ <code>O*IA 0.0.0.0/0</code></td>
                <td data-label="Commandes"><strong>ABR seul :</strong> <code>area X stub no-summary</code><br><strong>IAR :</strong> <code>area X stub</code></td>
              </tr>
              <tr>
                <th scope="row">NSSA (Not-So-Stubby)</th>
                <td data-label="LSA 1-2">✅ Oui</td>
                <td data-label="LSA 3">✅ Oui</td>
                <td data-label="LSA 4-5">🚫 Bloquées</td>
                <td data-label="LSA 7">✅ Oui (ASBR local)</td>
                <td data-label="Défaut">⚠️ Manuel (<code>default-information-originate</code>)</td>
                <td data-label="Commandes"><strong>Tous :</strong> <code>area X nssa</code></td>
              </tr>
              <tr>
                <th scope="row">Totally NSSA (Cisco)</th>
                <td data-label="LSA 1-2">✅ Oui</td>
                <td data-label="LSA 3">🚫 Bloquées (sauf défaut)</td>
                <td data-label="LSA 4-5">🚫 Bloquées</td>
                <td data-label="LSA 7">✅ Oui (ASBR local)</td>
                <td data-label="Défaut">✅ <code>O*IA 0.0.0.0/0</code></td>
                <td data-label="Commandes"><strong>ABR seul :</strong> <code>area X nssa no-summary</code><br><strong>IAR :</strong> <code>area X nssa</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="small muted">⚠️ <strong>Règles d'or :</strong> 1) Impossible de créer un <em>virtual-link</em> à travers une aire Stub ou NSSA, ni d'avoir un ASBR interne dans une Stub. 2) Le <strong>bit E</strong> (Stub) ou <strong>bit N</strong> (NSSA) est vérifié dans chaque Hello : tous les routeurs de l'aire doivent avoir <code>stub</code> ou <code>nssa</code>, sinon l'adjacence tombe !</p>
      </section>

      <section class="section-block" id="ospf-metric">
        <h2>📏 6. Métrique, Coût, E1 vs E2 et Ordre de préférence des routes</h2>
        <div class="grid-2">
          <div class="card">
            <h4>Calcul du coût OSPF (1 à 65535)</h4>
            <p>Formule Cisco par défaut : <code>Coût = 10⁸ / Bande passante (bit/s)</code> (soit <code>100 Mbit/s / BW</code>), arrondi à l'entier avec <strong>minimum = 1</strong>.</p>
            <ul>
              <li>Lien 10 Mbit/s → Coût = <strong>10</strong></li>
              <li>FastEthernet 100 Mbit/s → Coût = <strong>1</strong></li>
              <li>GigabitEthernet 1 Gbit/s → Coût = <strong>1</strong> (d'où l'intérêt de <code>auto-cost reference-bandwidth</code> ou <code>ip ospf cost &lt;val&gt;</code>)</li>
              <li>Le coût d'un chemin = <strong>somme des coûts des interfaces de sortie</strong> jusqu'à la destination (ex : TP1 coût 100 par lien → 2 liens = 200).</li>
            </ul>
          </div>
          <div class="card">
            <h4>Ordre strict de préférence OSPF (AVANT le coût !)</h4>
            <p>Indépendamment de la métrique, OSPF préfère toujours les types de routes dans cet ordre absolu :</p>
            <ol>
              <li><strong><code>O</code></strong> — Route intra-aire</li>
              <li><strong><code>O IA</code></strong> — Route inter-aires</li>
              <li><strong><code>O E1</code></strong> (et <code>N1</code>) — Route externe de type 1 : <em>coût interne vers l'ASBR + coût externe</em>.</li>
              <li><strong><code>O E2</code></strong> (et <code>N2</code>) — Route externe de type 2 (défaut Cisco) : <em>coût externe fixe</em> (20 par défaut, <strong>1</strong> si redistribué depuis BGP) qui n'augmente pas dans l'AS !</li>
            </ol>
            <p class="small">Si plusieurs chemins de même type ont une <strong>métrique strictement égale</strong>, OSPF fait de l'équilibrage de charge (<strong>ECMP</strong>).</p>
          </div>
        </div>
      </section>

      <section class="section-block" id="ospf-dr">
        <h2>👑 7. Router-ID, Types de réseaux et Élection DR / BDR</h2>
        <div class="grid-2">
          <div class="card-white">
            <h4>Détermination du Router-ID (32 bits)</h4>
            <ol>
              <li>Commande explicite <code>router-id X.X.X.X</code> (prioritaire).</li>
              <li>Sinon, plus haute IP d'une interface <strong>Loopback</strong> active.</li>
              <li>Sinon, plus haute IP d'une interface <strong>physique</strong> active (<code>up/up</code>).</li>
            </ol>
            <p class="small muted">Fixé au démarrage du processus OSPF : persiste même si l'interface change, jusqu'à un <code>clear ip ospf process</code>.</p>
          </div>
          <div class="card-white">
            <h4>Les 4 types de réseaux OSPF (diapo 36)</h4>
            <ul>
              <li><strong>Point-to-point</strong> : lien direct 2 routeurs → <em>pas de DR/BDR</em>.</li>
              <li><strong>Broadcast multiaccess</strong> (Ethernet + switch) : <strong>élection DR / BDR</strong>.</li>
              <li><strong>Point-to-multipoint</strong> : routeur central + branches → traité comme collection de P2P (pas de DR).</li>
              <li><strong>NBMA</strong> (Non-Broadcast Multiaccess) : réplique les LSA aux voisins → <strong>élection DR / BDR</strong>.</li>
            </ul>
          </div>
        </div>
        <div class="callout">
          <strong class="callout-title">⚡ Pourquoi un DR (Designated Router) et un BDR (Backup DR) ?</strong>
          Sur un switch reliant <em>n</em> routeurs, sans DR il faudrait <strong>n(n − 1) / 2</strong> adjacences (ex : 10 routeurs = 45 adjacences !). Avec un DR et un BDR, chaque <code>DROTHER</code> n'établit d'adjacence <code>FULL</code> qu'avec le DR et le BDR (les DROTHER restent en <code>2WAY/DROTHER</code> entre eux, ce qui est <strong>normal</strong> !). Les mises à jour des DROTHER partent sur <code>224.0.0.6</code> (AllDRouters) et le DR les rediffuse sur <code>224.0.0.5</code>.<br>
          <strong>Règles d'élection :</strong> 1) Plus haute <strong>Priority</strong> (0 à 255, défaut = 1 ; <strong>0 = ne participe pas</strong>) → 2) En cas d'égalité, plus haut <strong>Router-ID</strong>. L'élection est <strong>NON PRÉEMPTIVE</strong> (un routeur plus prioritaire ajouté après ne prend pas la place tant qu'on ne fait pas <code>clear ip ospf process</code>).
        </div>
      </section>

      <section class="section-block" id="ospf-auth">
        <h2>🔐 8. Authentification OSPF (Type 0, 1 et 2 — MD5)</h2>
        <p><strong>Intérêt :</strong> empêcher un routeur pirate ou mal branché d'établir une adjacence et d'injecter de fausses routes (détournement / trou noir). <strong>Attention :</strong> l'authentification assure l'<em>authenticité</em> et l'<em>intégrité</em> des paquets OSPF, mais <strong>ne chiffre PAS</strong> les paquets ni les données utilisateur !</p>
        <div class="grid-3">
          <div class="card"><span class="badge badge-danger">Type 0</span><h4>Aucune (Null)</h4><p class="small">Mode par défaut. Aucun contrôle sur les paquets OSPF.</p></div>
          <div class="card"><span class="badge badge-warn">Type 1</span><h4>Texte en clair</h4><p class="small">Mot de passe visible en clair dans Wireshark. Sécurité très faible.</p></div>
          <div class="card"><span class="badge badge-green">Type 2</span><h4>MD5 (Cryptographic)</h4><p class="small">Empreinte MD5 (16 octets) calculée sur le paquet + clé partagée + <em>Crypto Sequence Number</em> (anti-rejeu). La clé ne circule jamais sur le réseau.</p></div>
        </div>
        <div class="code-block">
          <div class="code-header"><span>Configuration Authentification MD5 OSPF sur une interface (TP1)</span><button type="button" class="copy-btn">Copier</button></div>
          <pre><code>interface GigabitEthernet0/0
 ip ospf authentication message-digest
 ip ospf message-digest-key 1 md5 SecretRT40
! Vérification : show ip ospf interface GigabitEthernet0/0</code></pre>
        </div>
      </section>
    `
  },

  bgp: {
    id: "bgp",
    eyebrow: "Module 3 · Polycopié 3 (Diapos 40 à 58) + TP2 + TD3 + CR BGP",
    title: "Le Protocole BGP (Border Gateway Protocol — BGP-4)",
    lead: "Tout sur le protocole qui fait tourner Internet : vecteur de chemins, routage politique, TCP 179, eBGP vs iBGP, 6 états, 5 messages, les 4 catégories d'attributs, les 10 règles de sélection du meilleur chemin, AS_PATH, Communities, Route Reflectors et next-hop-self.",
    toc: [
      { id: "bgp-intro", label: "Principes & Transport TCP 179" },
      { id: "bgp-ebgp-ibgp", label: "eBGP vs iBGP & Loopbacks" },
      { id: "bgp-states", label: "6 États & 5 Messages" },
      { id: "bgp-attrs", label: "Les 4 Types d'Attributs" },
      { id: "bgp-bestpath", label: "Choix du Meilleur Chemin (10 règles)" },
      { id: "bgp-aspath", label: "AS_PATH, Communities & MED" },
      { id: "bgp-scale", label: "Full-Mesh, RR, Confédérations & Next-Hop-Self" },
      { id: "bgp-vs-ospf", label: "Piège : network OSPF vs BGP" }
    ],
    html: `
      <section class="section-block" id="bgp-intro">
        <h2>🌍 1. Pourquoi BGP ? Historique et principes fondamentaux</h2>
        <div class="grid-4">
          <div class="kpi-card">
            <span class="kpi-label">Norme</span>
            <span class="kpi-value">RFC 4271</span>
            <span class="kpi-sub">BGP-4 (1994, CIDR) · MP-BGP RFC 2858 · IPv6 RFC 2545</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Type de protocole</span>
            <span class="kpi-value">Path-Vector</span>
            <span class="kpi-sub">Vecteur de chemins · Routage politique</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Transport</span>
            <span class="kpi-value">TCP / 179</span>
            <span class="kpi-sub">Connexion fiable · Voisins déclarés à la main</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Distances Admin.</span>
            <span class="kpi-value">20 / 200</span>
            <span class="kpi-sub">eBGP = 20 · iBGP = 200</span>
          </div>
        </div>
        <p>Né d'une collaboration Cisco/IBM pour remplacer EGP, <strong>BGP</strong> est le standard mondial d'interconnexion entre opérateurs. Un protocole à vecteur de distance (RIP) ne protège pas assez contre les boucles sur des topologies arbitraires, et un protocole à état de liens (OSPF) est irréaliste à l'échelle d'Internet (volume colossal + refus des opérateurs d'exposer leur topologie interne).</p>
        <p>BGP fonctionne en <strong>routage politique</strong> : pas de métrique simple comme le nombre de sauts ou la bande passante, mais une décision guidée par la liste des AS traversés (<code>AS_PATH</code>) et des règles commerciales/techniques configurées par l'administrateur.</p>
        <div class="callout callout-warn">
          <strong class="callout-title">⏱️ Nuance Timers BGP (Cours vs Cisco IOS) :</strong>
          Le <strong>Polycopié 3 (diapo 57)</strong> indique : <strong>Keepalive = 30 s</strong> et <strong>Hold Time = 90 s</strong> (fermeture si rien reçu en 90 s). Sur les routeurs <strong>Cisco IOS / Packet Tracer</strong>, les valeurs par défaut négociées sont souvent <strong>Keepalive = 60 s</strong> et <strong>Hold Time = 180 s</strong> (le plus petit Hold Time des deux pairs l'emporte lors du message OPEN). Retenez les deux !
        </div>
      </section>

      <section class="section-block" id="bgp-ebgp-ibgp">
        <h2>🔀 2. eBGP (Exterior BGP) vs iBGP (Interior BGP)</h2>
        <div tabindex="0" role="region" aria-labelledby="cap-ebgp-ibgp" class="table-wrapper stack-mobile">
          <table>
            <caption id="cap-ebgp-ibgp">Différences fondamentales entre eBGP et iBGP</caption>
            <thead>
              <tr>
                <th>Caractéristique</th>
                <th>eBGP (Exterior BGP)</th>
                <th>iBGP (Interior BGP)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Numéros d'AS</th>
                <td data-label="eBGP"><strong>AS différents</strong> (<code>remote-as</code> ≠ AS local)</td>
                <td data-label="iBGP"><strong>Même AS</strong> (<code>remote-as</code> = AS local)</td>
              </tr>
              <tr>
                <th scope="row">Distance Administrative</th>
                <td data-label="eBGP"><strong>20</strong></td>
                <td data-label="iBGP"><strong>200</strong></td>
              </tr>
              <tr>
                <th scope="row">TTL par défaut</th>
                <td data-label="eBGP"><strong>TTL = 1</strong> (voisins directement connectés, sauf <code>ebgp-multihop</code>)</td>
                <td data-label="iBGP">TTL = 255 (peut traverser plusieurs routeurs internes via IGP)</td>
              </tr>
              <tr>
                <th scope="row">Adresses de session</th>
                <td data-label="eBGP">IP d'interfaces physiques directes (lien P2P ou IXP) : si le lien tombe, la session tombe immédiatement.</td>
                <td data-label="iBGP">Généralement adresses <strong>Loopback</strong> + <code>update-source Loopback0</code> : survit à une panne de lien s'il existe un chemin alternatif dans l'IGP !</td>
              </tr>
              <tr>
                <th scope="row">Modification d'AS_PATH</th>
                <td data-label="eBGP"><strong>Oui</strong> : ajoute son propre ASN à gauche de l'<code>AS_PATH</code>.</td>
                <td data-label="iBGP"><strong>Non</strong> : <code>AS_PATH</code> reste inchangé.</td>
              </tr>
              <tr>
                <th scope="row">Modification du NEXT_HOP</th>
                <td data-label="eBGP"><strong>Oui</strong> : remplace par sa propre IP.</td>
                <td data-label="iBGP"><strong>Non</strong> par défaut ! D'où la nécessité de <code>next-hop-self</code> sur le routeur de bordure.</td>
              </tr>
              <tr>
                <th scope="row">Transitivité</th>
                <td data-label="eBGP">Réannonce vers eBGP et iBGP.</td>
                <td data-label="iBGP"><strong>Non transitif</strong> (règle split-horizon iBGP) : une route apprise en iBGP n'est <em>jamais</em> réannoncée à un autre voisin iBGP !</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="section-block" id="bgp-states">
        <h2>📡 3. Les 6 états d'une session BGP & les 5 types de messages</h2>
        <h3>Machine à états BGP (cliquez pour inspecter chaque état)</h3>
        <div class="stepper" data-stepper="bgp-states">
          <button type="button" class="step-node active" data-step="0">1. Idle</button><span class="step-arrow">→</span>
          <button type="button" class="step-node" data-step="1">2. Connect</button><span class="step-arrow">→</span>
          <button type="button" class="step-node" data-step="2">3. Active</button><span class="step-arrow">→</span>
          <button type="button" class="step-node" data-step="3">4. OpenSent</button><span class="step-arrow">→</span>
          <button type="button" class="step-node" data-step="4">5. OpenConfirm</button><span class="step-arrow">→</span>
          <button type="button" class="step-node" data-step="5">6. Established</button>
        </div>
        <div class="sim-result-box" id="stepper-bgp-states-out">
          <strong>Idle :</strong> État initial. BGP refuse les connexions entrantes et attend le déclenchement pour initier TCP vers le pair (ou session administrativement arrêtée / en attente après erreur).
        </div>

        <div tabindex="0" role="region" aria-labelledby="cap-bgp-msg" class="table-wrapper stack-mobile">
          <table>
            <caption id="cap-bgp-msg">Les 5 types de messages BGP (Polycopié 3, diapos 57–58)</caption>
            <thead>
              <tr>
                <th>Type</th>
                <th>Message</th>
                <th>Rôle détaillé</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td data-label="Message"><strong>OPEN</strong></td>
                <td data-label="Rôle">Envoyé juste après le 3-way handshake TCP (port 179). Échange la version (4), le n° d'AS (<code>My AS</code>), le <code>Hold Time</code>, le <code>BGP Identifier</code> (Router-ID) et négocie les capacités (MP-BGP, Route-Refresh).</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td data-label="Message"><strong>UPDATE</strong></td>
                <td data-label="Rôle">Cœur du routage : annonce de nouveaux préfixes (<strong>NLRI</strong> + attributs de chemin) et/ou <strong>retrait</strong> de routes devenues inaccessibles (<em>Withdrawn Routes</em>).</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td data-label="Message"><strong>NOTIFICATION</strong></td>
                <td data-label="Rôle">Signale une erreur critique (ex : mauvais <code>remote-as</code>, Hold Timer expiré, erreur d'en-tête) et <strong>ferme immédiatement la session BGP</strong>.</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td data-label="Message"><strong>KEEPALIVE</strong></td>
                <td data-label="Rôle">Message court de 19 octets (en-tête seul). Confirme l'acceptation d'un OPEN puis maintient la session active périodiquement (30 s cours / 60 s IOS).</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td data-label="Message"><strong>ROUTE-REFRESH</strong></td>
                <td data-label="Rôle">Demande au voisin de réannoncer dynamiquement ses routes après un changement de politique de filtrage, sans couper la session (négocié dans OPEN).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Format de l'en-tête commun BGP (19 octets minimum — diapo 58)</h3>
        <div class="pdu-grid">
          <div class="pdu-cell pdu-span-4"><strong>Marker (16 octets = 128 bits)</strong> — Toujours rempli à <code>FF...FF</code> (utilisé historiquement pour la synchronisation / sécurité)</div>
          <div class="pdu-cell pdu-span-2"><strong>Length (2 octets)</strong><small>Taille totale (19 à 4096 octets)</small></div>
          <div class="pdu-cell pdu-span-2"><strong>Type (1 octet)</strong><small>1=OPEN · 2=UPDATE · 3=NOTIF · 4=KEEPALIVE · 5=REFRESH</small></div>
          <div class="pdu-cell pdu-span-4"><strong>Données / Payload (0 à 4077 octets)</strong> — Absent pour KEEPALIVE ; contient NLRI + Path Attributes pour UPDATE</div>
        </div>
      </section>

      <section class="section-block" id="bgp-attrs">
        <h2>🏷️ 4. Classification des Attributs BGP (Polycopié 3, diapos 46–48)</h2>
        <div class="grid-2">
          <div class="card">
            <span class="badge badge-danger">1. Well-Known Mandatory (WM)</span>
            <h4>Obligatoirement reconnus ET propagés</h4>
            <ul>
              <li><strong>AS_PATH</strong> : liste ordonnée des AS traversés (anti-boucle + choix de chemin).</li>
              <li><strong>NEXT_HOP</strong> : adresse IP du prochain routeur vers le préfixe.</li>
              <li><strong>ORIGIN</strong> : origine de la route : <code>i</code> (IGP, via <code>network</code>) &lt; <code>e</code> (EGP, obsolète) &lt; <code>?</code> (Incomplete, via <code>redistribute</code>).</li>
            </ul>
          </div>
          <div class="card">
            <span class="badge badge-blue">2. Well-Known Discretionary (WD)</span>
            <h4>Reconnus par tous, propagation optionnelle</h4>
            <ul>
              <li><strong>LOCAL_PREF</strong> : préférence interne à l'AS (propagée en iBGP uniquement, défaut <strong>100</strong>, <em>la plus haute gagne</em>).</li>
              <li><strong>ATOMIC_AGGREGATE</strong> : signale qu'une agrégation a supprimé des détails d'AS_PATH.</li>
            </ul>
          </div>
          <div class="card">
            <span class="badge badge-purple">3. Optional Transitive (OT)</span>
            <h4>Pas forcément compris, mais propagés quand même</h4>
            <ul>
              <li><strong>COMMUNITY</strong> : étiquette de marquage pour appliquer des politiques/filtrages.</li>
              <li><strong>AGGREGATOR</strong> : ASN + Router-ID du routeur ayant effectué une agrégation.</li>
            </ul>
          </div>
          <div class="card">
            <span class="badge badge-warn">4. Optional Nontransitive (ON)</span>
            <h4>Peuvent être ignorés et NON propagés hors AS</h4>
            <ul>
              <li><strong>MED</strong> (<em>Multi-Exit Discriminator</em>) : métrique 32 bits (défaut 0, <em>plus basse gagne</em>) suggérant à un AS voisin par quel lien entrer.</li>
              <li><strong>ORIGINATOR_ID</strong> &amp; <strong>CLUSTER_ID</strong> : anti-boucle pour les Route Reflectors.</li>
              <li><strong>Weight</strong> <em>(extension propriétaire Cisco)</em> : purement local au routeur, jamais transmis ! (Défaut 0 pour reçues, <strong>32768</strong> pour locales).</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section-block" id="bgp-bestpath">
        <h2>🏆 5. Algorithme de Sélection du Meilleur Chemin BGP (Diapo 54)</h2>
        <p><strong>Prérequis absolu (Étape 0) :</strong> Le <code>NEXT_HOP</code> doit être <strong>accessible</strong> dans la table de routage (sinon la route n'est pas valide <code>*</code> et est ignorée). Ensuite, BGP compare les chemins candidats dans cet ordre strict — dès qu'un critère départage, l'algorithme s'arrête !</p>
        <div tabindex="0" role="region" aria-labelledby="cap-bestpath" class="table-wrapper stack-mobile">
          <table>
            <caption id="cap-bestpath">Les 10 critères de sélection BGP dans l'ordre exact (Polycopié 3, diapo 54)</caption>
            <thead>
              <tr>
                <th>Ordre</th>
                <th>Attribut / Critère</th>
                <th>Règle gagnante</th>
                <th>Portée / Astuce mémo</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">1</th><td data-label="Critère"><strong>Weight</strong> (Cisco)</td><td data-label="Règle"><strong>Le plus GRAND</strong></td><td data-label="Portée">Local au routeur (32768 local, 0 reçu)</td></tr>
              <tr><th scope="row">2</th><td data-label="Critère"><strong>LOCAL_PREF</strong></td><td data-label="Règle"><strong>La plus GRANDE</strong></td><td data-label="Portée">Propagé en iBGP (choisit la <em>sortie</em> de l'AS, défaut 100)</td></tr>
              <tr><th scope="row">3</th><td data-label="Critère"><strong>Self-originated</strong></td><td data-label="Règle"><strong>Route locale</strong> (next-hop <code>0.0.0.0</code>)</td><td data-label="Portée">Préfère les routes injectées par ce routeur</td></tr>
              <tr><th scope="row">4</th><td data-label="Critère"><strong>AS_PATH</strong></td><td data-label="Règle"><strong>Le plus COURT</strong> (moins d'AS)</td><td data-label="Portée">Critère classique entre AS (ex : <code>200</code> bat <code>300 200</code>)</td></tr>
              <tr><th scope="row">5</th><td data-label="Critère"><strong>ORIGIN</strong></td><td data-label="Règle"><strong><code>i</code> (IGP) &lt; <code>e</code> (EGP) &lt; <code>?</code> (Incomplete)</strong></td><td data-label="Portée"><code>network</code> bat <code>redistribute</code></td></tr>
              <tr><th scope="row">6</th><td data-label="Critère"><strong>MED</strong></td><td data-label="Règle"><strong>Le plus PETIT</strong></td><td data-label="Portée">Comparé seulement si même AS voisin (choisit l'<em>entrée</em>)</td></tr>
              <tr><th scope="row">7</th><td data-label="Critère"><strong>External vs Internal</strong></td><td data-label="Règle"><strong>eBGP avant iBGP</strong></td><td data-label="Portée">Sortir de l'AS au plus tôt (<em>hot potato</em>)</td></tr>
              <tr><th scope="row">8</th><td data-label="Critère"><strong>IGP Cost</strong></td><td data-label="Règle"><strong>Plus faible coût IGP</strong> vers Next-Hop</td><td data-label="Portée">Prochain saut le plus proche en OSPF/IS-IS</td></tr>
              <tr><th scope="row">9</th><td data-label="Critère"><strong>eBGP Stabilité</strong></td><td data-label="Règle"><strong>Route la plus ancienne</strong></td><td data-label="Portée">Évite les bascules inutiles (flapping)</td></tr>
              <tr><th scope="row">10</th><td data-label="Critère"><strong>Router-ID</strong></td><td data-label="Règle"><strong>Le plus PETIT</strong> Router-ID</td><td data-label="Portée">Départage ultime déterministe (<em>attention : inverse d'OSPF DR !</em>)</td></tr>
            </tbody>
          </table>
        </div>
        <p class="small">💡 <strong>Moyen mnémotechnique :</strong> « <em><strong>W</strong>e <strong>L</strong>ove <strong>S</strong>hort <strong>A</strong>S, <strong>O</strong>rigin <strong>M</strong>ED <strong>E</strong>xternal, <strong>I</strong>GP <strong>O</strong>ld <strong>R</strong>outer</em> » → Testez cet algorithme en direct dans le <strong>Module 6 (Simulateur BGP)</strong> !</p>
      </section>

      <section class="section-block" id="bgp-aspath">
        <h2>🛡️ 6. AS_PATH (Anti-boucle), Communities et MED vs Local_Pref</h2>
        <div class="diagram-card">
          <svg viewBox="0 0 740 210" role="img" aria-label="Mécanisme AS_PATH entre AS1, AS2, AS3, AS4 et AS5">
            <g font-family="system-ui, sans-serif" fill="currentColor" text-anchor="middle">
              <line x1="95" y1="105" x2="260" y2="50" stroke="currentColor" stroke-width="2" opacity="0.6"/>
              <line x1="260" y1="50" x2="465" y2="50" stroke="currentColor" stroke-width="2" opacity="0.6"/>
              <line x1="465" y1="50" x2="640" y2="105" stroke="currentColor" stroke-width="2" opacity="0.6"/>
              <line x1="95" y1="105" x2="365" y2="165" stroke="#059669" stroke-width="3"/>
              <line x1="365" y1="165" x2="640" y2="105" stroke="#059669" stroke-width="3"/>

              <circle cx="95" cy="105" r="28" fill="#2563eb" fill-opacity="0.18" stroke="#2563eb" stroke-width="2.5"/>
              <text x="95" y="109" font-weight="800" font-size="13">AS1</text>
              <text x="95" y="148" font-size="11" font-weight="700">192.0.128.0/22</text>

              <circle cx="260" cy="50" r="24" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
              <text x="260" y="54" fill="#fff" font-weight="700" font-size="12">AS2</text>
              <text x="170" y="65" font-size="11" font-family="monospace">PATH=(1)</text>

              <circle cx="465" cy="50" r="24" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
              <text x="465" y="54" fill="#fff" font-weight="700" font-size="12">AS4</text>
              <text x="362" y="38" font-size="11" font-family="monospace">PATH=(2, 1)</text>
              <text x="572" y="64" font-size="11" font-family="monospace" fill="#dc2626">PATH=(4, 2, 1)</text>

              <circle cx="365" cy="165" r="26" fill="#059669" fill-opacity="0.2" stroke="#059669" stroke-width="2.5"/>
              <text x="365" y="169" font-weight="800" font-size="13">AS3</text>
              <text x="200" y="155" font-size="11" font-family="monospace" fill="#059669">PATH=(1)</text>
              <text x="530" y="155" font-size="11" font-family="monospace" font-weight="700" fill="#059669">PATH=(3, 1) ✅ ÉLU</text>

              <circle cx="640" cy="105" r="28" fill="#7c3aed" fill-opacity="0.18" stroke="#7c3aed" stroke-width="2.5"/>
              <text x="640" y="109" font-weight="800" font-size="13">AS5</text>
            </g>
          </svg>
          <p class="diagram-caption">Exemple du Polycopié 3 (diapo 50) : AS5 choisit AS3 car <code>AS_PATH = (3, 1)</code> (2 AS) est plus court que <code>(4, 2, 1)</code> (3 AS). Si une annonce revient à AS1 avec <code>1</code> déjà dedans, AS1 la détruit (anti-boucle).</p>
        </div>

        <div class="grid-2">
          <div class="card">
            <h4>Les 3 familles de Communities (diapos 51–52)</h4>
            <ul>
              <li><strong>Standard Community</strong> (RFC 1997/1998) : 32 bits notés <code>x:y</code> (ASN 16 bits + code interne).</li>
              <li><strong>Extended Community</strong> (RFC 4360/7153) : 8 octets (1–2 o. type + 6–7 o. valeur), compatible AS 32 bits et VPN MPLS.</li>
              <li><strong>Large Community</strong> (RFC 8092/8195) : 12 octets divisés en 3×4 octets <code>AS:fonction:paramètre</code> (résout les ASN 32 bits).</li>
            </ul>
          </div>
          <div class="card">
            <h4>MED vs Local_Pref vs Weight</h4>
            <ul>
              <li><strong>Weight (haut)</strong> : agit sur <em>un seul routeur</em> Cisco (sortie locale).</li>
              <li><strong>Local_Pref (haut)</strong> : agit sur <em>tout notre AS</em> (choisit le routeur de <strong>sortie</strong> vers l'extérieur).</li>
              <li><strong>MED (bas)</strong> : envoyé à un <em>AS voisin</em> pour lui suggérer le point d'<strong>entrée</strong> dans notre AS (n'est pas propagé au-delà de l'AS voisin).</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section-block" id="bgp-scale">
        <h2>🕸️ 7. iBGP : Full-Mesh, Route Reflectors, Confédérations et Next-Hop-Self</h2>
        <div class="grid-2">
          <div class="card-white">
            <h4>Le problème du maillage complet iBGP (diapos 55–56)</h4>
            <p class="small">En iBGP, l'<code>AS_PATH</code> n'étant pas modifié, BGP interdit de réannoncer une route apprise en iBGP à un autre voisin iBGP (pour éviter les boucles internes). Conséquence : tous les routeurs iBGP doivent s'appairer deux à deux en <strong>Full-Mesh</strong>, soit <strong>n(n − 1) / 2</strong> sessions TCP (ex : 10 routeurs = 45 sessions ; 100 routeurs = 4 950 sessions !).</p>
            <p class="small"><strong>Deux solutions pour passer à l'échelle :</strong></p>
            <ul class="small">
              <li><strong>Réflecteurs de routes — Route Reflectors (RFC 4456)</strong> : un (ou deux pour redondance) routeur central reflète les routes à ses <em>clients</em>. Anti-boucle assuré par <code>Cluster_ID</code> et <code>Originator_ID</code>.</li>
              <li><strong>Confédérations (RFC 5065)</strong> : découpe un grand AS en sous-AS internes reliés en eBGP (masqués lors de l'annonce hors de l'AS principal).</li>
            </ul>
          </div>
          <div class="card-white">
            <h4>Le piège classique : <code>neighbor &lt;IP&gt; next-hop-self</code></h4>
            <p class="small">Quand un routeur de bordure (ex : R_bordure d'AS300 dans le TP2) apprend une route d'AS200 via <code>10.0.0.2</code> (eBGP) et la transmet à son routeur interne R_gauche en iBGP, <strong>BGP conserve <code>NEXT_HOP = 10.0.0.2</code></strong> ! Or R_gauche ne connaît pas le segment IXP <code>10.0.0.0/24</code> → la route est marquée inutilisable !</p>
            <div class="code-block">
              <div class="code-header"><span>Solution sur le routeur de bordure (TP2)</span><button type="button" class="copy-btn">Copier</button></div>
              <pre><code>router bgp 300
 neighbor 10.0.30.1 remote-as 300
 neighbor 10.0.30.1 next-hop-self</code></pre>
            </div>
            <p class="small muted">Avec <code>next-hop-self</code>, le routeur de bordure remplace le next-hop par sa propre IP (<code>10.0.30.2</code>), connue de R_gauche !</p>
          </div>
        </div>
      </section>

      <section class="section-block" id="bgp-vs-ospf">
        <h2>⚖️ 8. Différence capitale : commande <code>network</code> en OSPF vs BGP</h2>
        <div tabindex="0" role="region" aria-labelledby="cap-net-diff" class="table-wrapper stack-mobile">
          <table>
            <caption id="cap-net-diff">Ne jamais confondre network OSPF et network BGP au DSTP !</caption>
            <thead>
              <tr>
                <th>Aspect</th>
                <th>OSPF : <code>network 192.168.10.0 0.0.0.255 area 10</code></th>
                <th>BGP : <code>network 192.168.10.0 mask 255.255.255.0</code></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Type de masque</th>
                <td data-label="OSPF"><strong>Masque générique (Wildcard)</strong> = <code>255.255.255.255 − masque</code> (ex : <code>0.0.0.255</code> ou <code>0.0.0.3</code>).</td>
                <td data-label="BGP">Mot-clé <strong><code>mask</code> + masque normal</strong> (ex : <code>255.255.255.0</code>).</td>
              </tr>
              <tr>
                <th scope="row">Effet réel</th>
                <td data-label="OSPF"><strong>Active OSPF sur les interfaces locales</strong> dont l'IP matche (envoi de Hello + annonce du réseau dans l'aire).</td>
                <td data-label="BGP">N'active <em>pas</em> de voisinage ! Cherche une <strong>route EXACTEMENT identique</strong> (réseau + masque) dans la table de routage (RIB) et l'injecte en BGP (origine <code>i</code>).</td>
              </tr>
              <tr>
                <th scope="row">Erreur classique</th>
                <td data-label="OSPF">Mettre un masque normal <code>255.255.255.0</code> ou se tromper d'aire sur le lien partagé.</td>
                <td data-label="BGP">Oublier <code>mask</code> (BGP suppose alors le masque classful /8, /16 ou /24 !) ou annoncer un préfixe absent de <code>show ip route</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    `
  },

  redistribution: {
    id: "redistribution",
    eyebrow: "Module 4 · TP3 + TD2 + TD3 + CR Interconnexion + Notes Packet Tracer",
    title: "Interconnexion OSPF ↔ BGP, Redistribution & Spécificités Packet Tracer",
    lead: "Comment relier proprement un AS interne sous OSPF à d'autres AS en eBGP : redistribution dans les deux sens, mot-clé subnets, piège match internal external 1 external 2, variante route par défaut et subtilités Packet Tracer.",
    toc: [
      { id: "red-why", label: "Pourquoi les 2 sens ?" },
      { id: "red-bgp-ospf", label: "BGP → OSPF (LSA 5)" },
      { id: "red-ospf-bgp", label: "OSPF → BGP (et Transit TD3)" },
      { id: "red-default", label: "Variante Production (Route par défaut)" },
      { id: "red-pt", label: "Packet Tracer vs Vrai Matériel" }
    ],
    html: `
      <section class="section-block" id="red-why">
        <h2>🔗 1. Pourquoi la redistribution doit-elle être bidirectionnelle ?</h2>
        <p>Sur un routeur de bordure (<strong>ASBR</strong>) exécutant à la fois OSPF côté interne et eBGP côté externe, <strong>les deux processus sont totalement étanches par défaut</strong> : le routeur de bordure connaît les deux mondes (routes <code>O</code> et routes <code>B</code> dans sa propre RIB), mais les routeurs internes OSPF ignorent les préfixes BGP et les AS externes ignorent les réseaux OSPF.</p>
        <div class="callout callout-danger">
          <strong class="callout-title">⚠️ Règle absolue Aller + Retour :</strong>
          Un ping entre un PC interne (OSPF) et un PC externe (autre AS BGP) exige :
          <ul>
            <li><strong>Trajet ALLER (BGP → OSPF)</strong> : les routeurs internes OSPF doivent savoir sortir vers l'ASBR (via <code>redistribute bgp ... subnets</code> ou via une route par défaut <code>default-information originate always</code>).</li>
            <li><strong>Trajet RETOUR (OSPF → BGP)</strong> : les AS externes doivent connaître les LAN de notre AS (via <code>redistribute ospf &lt;PID&gt;</code> ou via des commandes <code>network ... mask ...</code> explicites dans BGP).</li>
          </ul>
          <em>Une session BGP « Established » seule ne prouve JAMAIS que le ping PC ↔ PC fonctionne !</em>
        </div>
      </section>

      <section class="section-block" id="red-bgp-ospf">
        <h2>➡️ 2. Sens 1 : Redistribuer BGP (ou Statique/Connecté) dans OSPF</h2>
        <div class="code-block">
          <div class="code-header"><span>Sur l'ASBR — Injection des routes BGP dans OSPF</span><button type="button" class="copy-btn">Copier</button></div>
          <pre><code>router ospf 1
 redistribute bgp 400 subnets
! Pour des routes statiques (TP1) :
 redistribute static subnets
! Pour des réseaux connectés / Loopback (TP3 NSSA, CR OSPF) :
 redistribute connected subnets</code></pre>
        </div>
        <ul>
          <li><strong>Pourquoi le mot-clé <code>subnets</code> est indispensable ?</strong> Sans <code>subnets</code>, Cisco IOS ne redistribue <em>que</em> les réseaux classful purs (/8, /16, /24 de classe C) et ignore silencieusement tous les sous-réseaux (/24 dans <code>172.16.0.0</code>, /30 dans <code>10.0.0.0</code>...) !</li>
          <li><strong>Effet dans OSPF :</strong> l'ASBR inonde une <strong>LSA de type 5</strong> (ou Type 7 dans une NSSA). Les autres routeurs installent la route en <strong><code>O E2</code></strong> :
            <ul>
              <li>Métrique par défaut = <strong>1</strong> pour les routes venant de BGP (avec <strong>External Route Tag = n° d'AS d'origine</strong>, ex : Tag 200).</li>
              <li>Métrique par défaut = <strong>20</strong> pour les routes venant de <code>static</code> ou <code>connected</code>.</li>
              <li>En type <code>E2</code>, ce coût reste <strong>constant</strong> quel que soit le nombre de sauts traversés dans l'AS.</li>
            </ul>
          </li>
        </ul>
      </section>

      <section class="section-block" id="red-ospf-bgp">
        <h2>⬅️ 3. Sens 2 : Redistribuer OSPF dans BGP (et le piège du TD3 !)</h2>
        <div class="code-block">
          <div class="code-header"><span>Sur l'ASBR — Injection des routes OSPF dans BGP</span><button type="button" class="copy-btn">Copier</button></div>
          <pre><code>! Cas classique (1 seul ASBR : TP3, TD2, CR Interconnexion) :
router bgp 400
 redistribute ospf 1

! Cas d'un AS de TRANSIT sans iBGP (TD3 : AS100 — AS200(OSPF) — AS300) :
router bgp 200
 redistribute ospf 1 match internal external 1 external 2</code></pre>
        </div>
        <div class="grid-2">
          <div class="card">
            <h4>Ce qu'on observe côté voisin BGP</h4>
            <ul>
              <li>L'attribut <strong>ORIGIN vaut <code>?</code> (incomplete)</strong> car la route provient d'une redistribution et non d'une commande <code>network</code> (<code>i</code>).</li>
              <li>Le <strong>MED</strong> envoyé au voisin eBGP reprend automatiquement le <strong>coût OSPF</strong> calculé par l'ASBR (ex : coût OSPF 3 → <code>[20/3]</code> chez le voisin).</li>
            </ul>
          </div>
          <div class="card">
            <h4>🚨 Le piège du TD3 : <code>match internal external 1 external 2</code></h4>
            <p class="small">Par défaut, <code>redistribute ospf 1</code> dans BGP ne redistribue <strong>que les routes internes (<code>O</code> et <code>O IA</code>)</strong> ! Dans le TD3 (AS200 en transit OSPF sans iBGP), la route de l'AS100 arrive sur Router4 sous forme <strong><code>O E2</code></strong> : sans <code>match external 1 external 2</code>, Router4 ne l'annonce pas à l'AS300 !</p>
            <p class="small muted"><em>Limite conceptuelle à mentionner au DS :</em> faire transiter BGP dans OSPF efface l'<code>AS_PATH</code> d'origine (AS300 voit <code>200 ?</code> au lieu de <code>200 100 i</code>), d'où la supériorité d'<strong>iBGP</strong> en production.</p>
          </div>
        </div>
      </section>

      <section class="section-block" id="red-default">
        <h2>🌐 4. Variante Production : Route par défaut au lieu de redistribuer BGP</h2>
        <p>En production, la table BGP d'Internet dépasse 900 000 préfixes : injecter tout BGP dans OSPF ferait immédiatement saturer la RAM et le CPU des routeurs internes ! La bonne pratique consiste à injecter <strong>une seule route par défaut</strong> depuis l'ASBR :</p>
        <div class="code-block">
          <div class="code-header"><span>Variante Route par défaut (CR Interconnexion, partie 4)</span><button type="button" class="copy-btn">Copier</button></div>
          <pre><code>router ospf 1
 no redistribute bgp 100 subnets
 default-information originate always</code></pre>
        </div>
        <ul>
          <li>Le mot-clé <strong><code>always</code></strong> force l'ASBR à annoncer <code>0.0.0.0/0</code> même s'il ne possède pas lui-même de route par défaut dans sa table.</li>
          <li>Les routeurs internes installent <strong><code>O*E2 0.0.0.0/0 [110/1] via &lt;ASBR&gt;</code></strong> (<code>Gateway of last resort is ...</code>) et envoient tout le trafic externe à l'ASBR qui route avec sa table BGP.</li>
          <li>La redistribution OSPF → BGP (ou les <code>network</code> BGP) reste obligatoire pour le <strong>trajet retour</strong> !</li>
        </ul>
      </section>

      <section class="section-block" id="red-pt">
        <h2>💻 5. Ce qui marche pareil vs ce qui change dans Packet Tracer (Notes terrain)</h2>
        <div class="grid-2">
          <div class="card">
            <span class="badge badge-green">Identique dans Packet Tracer</span>
            <ul>
              <li>Adressage : <code>ip address</code>, <code>no shutdown</code>.</li>
              <li>OSPF : <code>router ospf</code>, <code>network ... area</code>, <code>ip ospf cost</code>, <code>ip ospf priority</code>, <code>router-id</code>, <code>passive-interface</code>, <code>clear ip ospf process</code>.</li>
              <li>MD5 : <code>ip ospf authentication message-digest</code>, <code>ip ospf message-digest-key</code>.</li>
              <li>Aires : <code>area X stub</code>, <code>stub no-summary</code>, <code>redistribute static subnets</code>.</li>
              <li>BGP : <code>router bgp</code>, <code>neighbor ... remote-as</code>, <code>network ... mask</code>, <code>next-hop-self</code>, <code>update-source</code>.</li>
              <li>Show : <code>show ip route</code>, <code>show ip ospf neighbor/database</code>, <code>show ip bgp</code>, <code>show ip bgp summary</code>.</li>
            </ul>
          </div>
          <div class="card">
            <span class="badge badge-warn">Différences &amp; Limites Packet Tracer</span>
            <ul>
              <li><strong>Noms d'interfaces :</strong> vrais ISR 4xxx = <code>Gi0/0/0</code> ; Packet Tracer 2901/2911 = <code>Gi0/0</code>, <code>Gi0/1</code>, <code>Gi0/2</code>. Toujours faire <code>show ip interface brief</code> d'abord !</li>
              <li><strong>Captures &amp; WebUI :</strong> <code>monitor capture</code>, <code>ip http secure-server</code> et Wireshark n'existent pas dans PT → passer en <strong>mode Simulation</strong>, filtrer OSPF/BGP/TCP/ICMP et cliquer sur les enveloppes (Inbound/Outbound PDU Details).</li>
              <li><strong>PC :</strong> pas de commandes Linux <code>ip a add</code> → utiliser <em>Desktop → IP Configuration</em> puis <code>ping</code> / <code>tracert</code>.</li>
              <li><strong>Commandes parfois limitées selon version PT :</strong> <code>iBGP</code> (TD3), <code>area X nssa no-summary</code>, <code>match internal external 1 external 2</code>, <code>show ip ospf database nssa-external</code>. Toujours vérifier avec <code>?</code> !</li>
            </ul>
          </div>
        </div>
      </section>
    `
  },

  troubleshooting: {
    id: "troubleshooting",
    eyebrow: "Module 7 · Dépannage systématique & Référentiel IOS",
    title: "Guide Ultime de Dépannage (Troubleshooting) & Commandes IOS",
    lead: "Cliquez sur un symptôme pour obtenir l'arbre de diagnostic exact, puis consultez le catalogue des commandes show, des distances administratives Cisco et des commandes Linux/Windows.",
    symptoms: [
      {
        id: "sym-no-ospf-nbr",
        tag: "OSPF",
        title: "Aucun voisin OSPF (show ip ospf neighbor vide)",
        causes: [
          "Interfaces non actives (administratively down ou down/down) ou ping direct impossible.",
          "L'interface de transit n'est pas couverte par une instruction network (erreur de wildcard !).",
          "Incompatibilité entre les deux bouts du lien : Area ID différent, masque différent sur Ethernet, timers Hello/Dead différents, ou option stub/NSSA (bit E/N) différente.",
          "Authentification MD5 activée d'un seul côté ou clé/Key ID différente.",
          "passive-interface activé par erreur sur le lien inter-routeurs !",
          "Même Router-ID configuré sur les deux routeurs."
        ],
        checks: "show ip interface brief\nping <IP_voisin_direct>\nshow ip ospf interface g0/0\nshow ip protocols\nshow running-config | section ospf",
        fix: "router ospf 1\n no passive-interface g0/0\n ! Vérifier même area, même clé MD5, même area X stub/nssa des 2 côtés"
      },
      {
        id: "sym-ospf-full-no-route",
        tag: "OSPF",
        title: "Voisin OSPF FULL mais le LAN distant n'apparaît pas",
        causes: [
          "Le réseau LAN derrière le voisin n'a pas été déclaré par une commande network OSPF (ou a un mauvais wildcard).",
          "L'interface LAN du voisin est down (câble PC débranché ou no shutdown oublié).",
          "Si le routeur est dans une aire Totally Stub / Totally NSSA, les routes détaillées O IA / O E2 sont volontairement remplacées par O*IA 0.0.0.0/0 !",
          "L'aire n'est pas raccordée à l'aire 0 (backbone obligatoire pour le routage inter-aires)."
        ],
        checks: "show ip route connected\nshow ip ospf database\nshow ip route ospf",
        fix: "! Sur le routeur qui porte le LAN :\nrouter ospf 1\n network 192.168.20.0 0.0.0.255 area 20\n passive-interface g0/1"
      },
      {
        id: "sym-ospf-2way",
        tag: "OSPF",
        title: "État bloqué en 2WAY/DROTHER ou EXSTART",
        causes: [
          "2WAY/DROTHER entre deux routeurs sur un switch : C'EST NORMAL ! Deux DROTHER ne forment pas d'adjacence FULL entre eux, seulement avec le DR et le BDR.",
          "EXSTART / EXCHANGE bloqué : incompatibilité de MTU entre les deux interfaces, ou Router-ID dupliqué."
        ],
        checks: "show ip ospf neighbor\nshow interfaces g0/0 | include MTU",
        fix: "! Si 2WAY/DROTHER : vérifier qu'il existe bien un FULL/DR et FULL/BDR.\n! Si EXSTART MTU : interface g0/0 -> ip ospf mtu-ignore"
      },
      {
        id: "sym-ospf-dr",
        tag: "OSPF",
        title: "DR / BDR ne change pas malgré une priorité supérieure",
        causes: [
          "L'élection DR/BDR est NON PRÉEMPTIVE ! Modifier ip ospf priority ou router-id ne déloge pas le DR existant."
        ],
        checks: "show ip ospf interface g0/0\nshow ip ospf neighbor",
        fix: "interface g0/0\n ip ospf priority 200\nend\nclear ip ospf process\n! (Répondre yes sur les routeurs du segment)"
      },
      {
        id: "sym-bgp-idle",
        tag: "BGP",
        title: "Session BGP bloquée en Idle ou Active",
        causes: [
          "L'IP du voisin n'est pas joignable (pas de route vers le neighbor, ou interface down).",
          "Mauvais numéro d'AS dans neighbor <IP> remote-as <AS> (ou oubli de déclarer le voisin en miroir de l'autre côté).",
          "En iBGP via Loopback : oubli de neighbor <IP> update-source Loopback0 ou absence de route IGP vers les loopbacks.",
          "En eBGP non directement connecté (multihop) : TTL=1 bloque les paquets TCP 179 (besoin de ebgp-multihop)."
        ],
        checks: "ping <IP_voisin>\nshow ip bgp summary\nshow ip bgp neighbors\nshow running-config | section bgp",
        fix: "router bgp 300\n neighbor 10.0.0.1 remote-as 100\n! Si Loopback iBGP :\n neighbor 2.2.2.2 update-source Loopback0"
      },
      {
        id: "sym-bgp-zero-pfx",
        tag: "BGP",
        title: "BGP Established mais State/PfxRcd = 0 (aucun préfixe reçu)",
        causes: [
          "Côté émetteur, la commande network <réseau> mask <masque> ne correspond pas EXACTEMENT (préfixe + masque) à une entrée présente dans show ip route.",
          "Oubli du mot-clé mask (BGP applique le masque classful /8, /16 ou /24).",
          "Oubli de redistribute ospf 1 (ou de match internal external 1 external 2 pour les routes O E2 en transit).",
          "Règle de non-transitivité iBGP→iBGP (besoin de full-mesh ou Route Reflector)."
        ],
        checks: "show ip route\nshow ip bgp\nshow ip bgp summary",
        fix: "! Sur l'émetteur, vérifier la route exacte puis :\nrouter bgp 200\n network 192.168.200.0 mask 255.255.255.0"
      },
      {
        id: "sym-bgp-nexthop",
        tag: "BGP",
        title: "Route présente dans show ip bgp mais absente de show ip route (pas de >)",
        causes: [
          "NEXT_HOP inaccessible ! Cas classique en iBGP : le routeur de bordure a propagé une route eBGP sans modifier son next-hop (IP de l'IXP/voisin externe inconnue à l'intérieur de l'AS).",
          "Ou une autre source avec une meilleure Distance Administrative (ex : OSPF 110 < iBGP 200, ou Statique 1 < eBGP 20) a gagné la RIB (statut r RIB-failure)."
        ],
        checks: "show ip bgp\nshow ip route <IP_next_hop>\nshow ip route",
        fix: "! Sur le routeur de bordure vers son voisin iBGP :\nrouter bgp 300\n neighbor 10.0.30.1 next-hop-self"
      },
      {
        id: "sym-ping-pc",
        tag: "Général",
        title: "Les routeurs se pingent entre eux, mais le ping PC ↔ PC échoue",
        causes: [
          "Passerelle par défaut (Default Gateway) absente ou erronée sur un des PC.",
          "Trajet aller OK mais PAS DE ROUTE RETOUR vers le LAN du PC source (le routeur distant connaît le lien de transit utilisé par un ping routeur, mais pas le LAN !).",
          "Redistribution faite dans un seul sens (ex : BGP→OSPF ok, mais OSPF→BGP oublié)."
        ],
        checks: "! Sur les PC :\nipconfig\nping <passerelle>\ntracert <PC_distant>\n! Sur chaque routeur traversé :\nshow ip route <LAN_source>\nshow ip route <LAN_dest>",
        fix: "! Vérifier les 2 sens : annoncer les LAN OSPF dans BGP (network ou redistribute ospf) ET redistribuer BGP dans OSPF (redistribute bgp <AS> subnets)."
      },
      {
        id: "sym-nssa-default",
        tag: "OSPF",
        title: "Route par défaut absente dans une aire NSSA normale",
        causes: [
          "Contrairement à une aire Stub ou Totally NSSA, une aire NSSA simple N'INJECTE PAS automatiquement de route par défaut vers l'extérieur !"
        ],
        checks: "show ip route\nshow ip ospf database nssa-external",
        fix: "! Sur l'ABR de l'aire NSSA :\nrouter ospf 1\n area 20 nssa default-information-originate\n! Ou passer en Totally NSSA :\n area 20 nssa no-summary"
      },
      {
        id: "sym-pt-cmd",
        tag: "Packet Tracer",
        title: "Commande IOS refusée (^ Invalid input) dans Packet Tracer",
        causes: [
          "Vous n'êtes pas dans le bon mode CLI (ex : show tapé en mode config sans do, ou network tapé hors router ospf/bgp).",
          "Nom d'interface incorrect (Gi0/0 sur 2911 au lieu de Gi0/0/0 des ISR 4xxx).",
          "Fonction non implémentée dans cette version de Packet Tracer (ex : monitor capture, ip http secure-server, ou match internal external 1 external 2)."
        ],
        checks: "end\nshow ip interface brief\n! Utiliser ? dans le mode voulu",
        fix: "! Si match external est refusé en TD3 : utiliser redistribute ospf 1 + commandes network <LAN> mask 255.255.255.0 sur les routeurs de bordure."
      }
    ],
    adTable: [
      { source: "Interface directement connectée (C)", ad: "0", note: "Toujours prioritaire" },
      { source: "Route statique (S / S*)", ad: "1", note: "Surcharge tout routage dynamique (sauf route flottante > 1)" },
      { source: "eBGP (B externe)", ad: "20", note: "Très prioritaire : attention si redistribution !" },
      { source: "EIGRP interne (D)", ad: "90", note: "Propriétaire Cisco (pour culture)" },
      { source: "OSPF (O, O IA, O E1/E2, O N1/N2)", ad: "110", note: "Intra > Inter > E1 > E2 à AD égale" },
      { source: "IS-IS (i)", ad: "115", note: "Autre IGP à état de liens" },
      { source: "RIP (R)", ad: "120", note: "Vecteur de distance (remplacé par OSPF)" },
      { source: "iBGP (B interne)", ad: "200", note: "Moins prioritaire qu'OSPF (110)" }
    ],
    commands: [
      { cat: "Vérification", cmd: "show ip interface brief", desc: "Liste toutes les interfaces, leurs IP, et leur état Status/Protocol (doit être up/up)." },
      { cat: "Vérification", cmd: "show ip route [ospf | bgp | static | connected]", desc: "Affiche la table de routage (RIB) réellement utilisée pour transférer les paquets." },
      { cat: "Vérification", cmd: "show ip protocols", desc: "Affiche les processus de routage actifs, Router-ID, réseaux annoncés, AD et redistributions." },
      { cat: "OSPF", cmd: "show ip ospf neighbor", desc: "Voisins OSPF, priorité, état (FULL/DR, FULL/BDR, 2WAY/DROTHER), Dead Time et interface." },
      { cat: "OSPF", cmd: "show ip ospf database [summary | external | nssa-external]", desc: "Affiche la LSDB complète (LSA 1, 2, 3, 4, 5, 7) par aire avec Age, Seq# et Checksum." },
      { cat: "OSPF", cmd: "show ip ospf interface [g0/0 | brief]", desc: "Aire, coût, type de réseau, timers Hello/Dead, DR/BDR et état de l'authentification MD5." },
      { cat: "OSPF", cmd: "clear ip ospf process", desc: "Redémarre OSPF pour appliquer un nouveau Router-ID ou forcer une réélection DR/BDR." },
      { cat: "BGP", cmd: "show ip bgp summary", desc: "Vue synthétique des voisins BGP : AS, messages échangés, durée, State/PfxRcd (un nombre = Established)." },
      { cat: "BGP", cmd: "show ip bgp", desc: "Table BGP complète : tous les chemins candidats (* valid, > best, i internal), Next-Hop, MED, LocPrf, Weight, AS_PATH, Origin." },
      { cat: "BGP", cmd: "show ip bgp neighbors [IP]", desc: "Détails de la session TCP (port 179), timers négociés (Hold/Keepalive), capacités, compteurs OPEN/UPDATE/KEEPALIVE." },
      { cat: "BGP", cmd: "clear ip bgp * [soft]", desc: "Réinitialise les sessions BGP (ou soft pour ROUTE-REFRESH sans couper TCP)." },
      { cat: "Config", cmd: "passive-interface GigabitEthernet0/1", desc: "Annonce le réseau LAN dans OSPF sans envoyer de paquets Hello vers un segment sans routeur." },
      { cat: "Config", cmd: "copy running-config startup-config (ou wr)", desc: "Sauvegarde la configuration active en NVRAM." },
      { cat: "Linux (TP)", cmd: "sudo ip a add 192.168.40.2/24 dev enp2s0", desc: "Configure l'adresse IPv4 sur un PC Linux en salle de TP." },
      { cat: "Linux (TP)", cmd: "sudo ip r add default via 192.168.40.1", desc: "Ajoute la passerelle par défaut sur un PC Linux (attention : ne pas oublier 'default via' !)." },
      { cat: "Capture (TP)", cmd: "monitor capture CAP interface Gi0/0/0 both", desc: "Embedded Packet Capture (EPC) sur vrai routeur IOS XE (puis match any, start, stop, export flash:cap.pcap)." }
    ]
  },

  glossary: {
    id: "glossary",
    eyebrow: "Module 9 · Référentiel & Pièges classiques",
    title: "Glossaire Complet (60+ Termes) & Top 15 des Anti-Pièges Examen",
    lead: "Toutes les définitions rigoureuses du cours et la liste impitoyable des pièges qui font perdre des points en DS et DSTP.",
    traps: [
      { title: "1. Paquet OSPF type 5 ≠ LSA type 5", desc: "Le paquet OSPF type 5 est un LSAck (accusé de réception). La LSA de type 5 (AS-External) est transportée dans un paquet de type 4 (LSU) !" },
      { title: "2. Wildcard OSPF ≠ Masque normal BGP", desc: "OSPF utilise le masque générique inversé (0.0.0.255 pour /24, 0.0.0.3 pour /30). BGP utilise le mot-clé 'mask' suivi du masque normal (255.255.255.0) et exige une correspondance EXACTE dans la RIB." },
      { title: "3. no-summary se met UNIQUEMENT sur l'ABR", desc: "Pour Totally Stub (area X stub no-summary) ou Totally NSSA (area X nssa no-summary), seul l'ABR reçoit no-summary. Tous les routeurs internes de l'aire gardent simplement area X stub ou area X nssa." },
      { title: "4. Oublier le mot-clé 'subnets' dans redistribute", desc: "Sans 'subnets' dans 'redistribute bgp/static/connected subnets', OSPF ignore tous les sous-réseaux non-classful (comme 172.16.40.0/24 ou 10.0.0.0/30) !" },
      { title: "5. Oublier 'match internal external 1 external 2' en transit (TD3)", desc: "Par défaut, 'redistribute ospf 1' dans BGP n'exporte pas les routes O E2. Dans un AS de transit OSPF sans iBGP, les routes externes sont perdues sans ce mot-clé." },
      { title: "6. Oublier 'next-hop-self' sur le routeur de bordure iBGP", desc: "iBGP ne modifie pas le NEXT_HOP appris en eBGP : les routeurs internes reçoivent l'IP du lien externe qu'ils ne connaissent pas, et ignorent la route BGP." },
      { title: "7. Confondre 'i' (statut iBGP) et 'i' (origine IGP)", desc: "Dans 'show ip bgp', le 'i' à GAUCHE (*>i) signifie appris en iBGP ; le 'i' tout à DROITE (fin de la colonne Path) signifie ORIGIN = IGP (injecté via network)." },
      { title: "8. AS Stub (Singlehomed) ≠ Aire Stub OSPF", desc: "Un AS stub (singlehomed) est connecté à un seul autre AS en BGP. Une aire stub OSPF est une zone interne qui bloque les LSA de type 5." },
      { title: "9. Élection DR/BDR non préemptive + Router-ID opposé à BGP", desc: "OSPF choisit le PLUS GRAND Router-ID pour DR (non préemptif → clear ip ospf process). À l'inverse, le critère 10 de BGP départage par le PLUS PETIT Router-ID !" },
      { title: "10. 2WAY/DROTHER n'est PAS une panne", desc: "Sur un switch Ethernet à 4 routeurs, deux DROTHER restent volontairement en 2WAY entre eux. Seules les adjacences avec le DR et le BDR passent en FULL." },
      { title: "11. MD5 authentifie mais NE CHIFFRE PAS", desc: "L'authentification OSPF type 2 (MD5) garantit l'identité du voisin et l'intégrité du paquet (hash 16 octets + anti-rejeu), mais les LSA restent lisibles en clair dans Wireshark." },
      { title: "12. Length = 110 dans Wireshark ≠ Distance Administrative 110", desc: "Erreur réelle corrigée du CR TP1 ! La colonne Length de Wireshark donne la taille de la trame en octets. L'AD 110 est une constante interne Cisco visible dans 'show ip route' [110/cost]." },
      { title: "13. Timers BGP : 30/90 s (cours) vs 60/180 s (Cisco IOS)", desc: "Le polycopié 3 cite Keepalive 30 s / Hold 90 s. Sur Cisco IOS et Packet Tracer, les valeurs par défaut sont 60 s / 180 s. Citez le cours et vérifiez 'show ip bgp neighbors' en TP." },
      { title: "14. Process ID OSPF local ≠ Numéro d'Aire ≠ Numéro d'AS", desc: "Le PID OSPF (router ospf 1 vs 100) peut être différent entre voisins. En revanche, l'Area ID sur un lien partagé doit être identique, et le numéro d'AS BGP doit correspondre exactement au remote-as." },
      { title: "15. Une session BGP Established ne garantit pas le ping PC ↔ PC", desc: "Il faut en plus que les préfixes LAN soient annoncés dans les DEUX sens (aller + retour), installés dans la RIB, et que chaque PC ait sa bonne passerelle par défaut !" }
    ],
    terms: [
      { t: "ABR (Area Border Router)", c: "OSPF", d: "Routeur reliant l'aire 0 (backbone) à une ou plusieurs autres aires. Maintient une LSDB par aire et génère les LSA de type 3 et 4." },
      { t: "AD (Distance Administrative)", c: "Routage", d: "Indice de fiabilité d'une source de routage chez Cisco (plus basse = prioritaire) : Connecté 0, Statique 1, eBGP 20, OSPF 110, RIP 120, iBGP 200." },
      { t: "Aire 0 (Backbone Area)", c: "OSPF", d: "Aire dorsale obligatoire (0.0.0.0) d'un domaine OSPF multi-aires par laquelle doit transiter tout trafic inter-aires." },
      { t: "AS (Autonomous System)", c: "Internet", d: "Ensemble de réseaux gérés par une même autorité administrative appliquant une politique de routage interne cohérente." },
      { t: "ASBR (AS Boundary Router)", c: "OSPF", d: "Routeur situé à la périphérie d'OSPF qui redistribue des routes externes (BGP, statique, connecté) sous forme de LSA type 5 (ou 7 en NSSA)." },
      { t: "ASN (Autonomous System Number)", c: "Internet", d: "Identifiant unique mondial d'un AS, codé sur 32 bits (16 bits avant 2007), attribué par IANA → RIR → LIR." },
      { t: "AS_PATH", c: "BGP", d: "Attribut Well-Known Mandatory listant les ASN traversés par une annonce. Prévient les boucles (rejet si son propre ASN y figure) et sert au choix de chemin (plus court préféré)." },
      { t: "Atomic Aggregate", c: "BGP", d: "Attribut Well-Known Discretionary signalant qu'une agrégation de préfixes a réduit l'information de chemin." },
      { t: "AuvernIX", c: "Internet", d: "Point d'échange Internet (IXP) d'Auvergne (AS 201376), interconnecté avec FranceIX Lyon et EquinIX Paris." },
      { t: "BDR (Backup Designated Router)", c: "OSPF", d: "Routeur de secours élu sur un segment multi-accès qui prend instantanément le relais si le DR tombe en panne." },
      { t: "BGP (Border Gateway Protocol)", c: "BGP", d: "Protocole EGP à vecteur de chemins (RFC 4271, BGP-4) fonctionnant sur TCP port 179 pour le routage politique inter-AS." },
      { t: "CIDR", c: "Routage", d: "Classless Inter-Domain Routing : routage sans classe utilisant des masques de longueur variable (/24, /30...) et permettant l'agrégation de routes." },
      { t: "Cluster_ID / Originator_ID", c: "BGP", d: "Attributs Optional Nontransitive utilisés avec les Route Reflectors iBGP pour empêcher les boucles de routage." },
      { t: "Community", c: "BGP", d: "Attribut Optional Transitive permettant de marquer des routes (Standard x:y 32 bits, Extended 8 o., Large 12 o.) pour appliquer des politiques de routage." },
      { t: "Confédération BGP", c: "BGP", d: "Subdivision d'un grand AS en sous-AS internes reliés en eBGP (RFC 5065) pour éviter le full-mesh iBGP." },
      { t: "DBD (Database Description)", c: "OSPF", d: "Paquet OSPF de type 2 contenant un résumé (en-têtes) des LSA pour synchroniser deux LSDB (flags I, M, MS)." },
      { t: "Dead Interval", c: "OSPF", d: "Délai (40 s par défaut sur Ethernet = 4×Hello) au bout duquel un voisin silencieux est déclaré mort." },
      { t: "Dijkstra (SPF)", c: "OSPF", d: "Algorithme du plus court chemin (Shortest Path First) exécuté localement par chaque routeur OSPF sur sa LSDB." },
      { t: "DR (Designated Router)", c: "OSPF", d: "Routeur élu sur un segment broadcast/NBMA pour centraliser les adjacences et générer les LSA de type 2, réduisant le trafic LSA." },
      { t: "E1 / E2 (External Type 1 / 2)", c: "OSPF", d: "Sous-types de routes externes LSA 5 : E1 additionne le coût interne au coût externe ; E2 (défaut) garde un coût fixe (20, ou 1 depuis BGP)." },
      { t: "eBGP (Exterior BGP)", c: "BGP", d: "Session BGP entre deux AS différents. AD = 20, TTL = 1 par défaut, modifie AS_PATH et NEXT_HOP." },
      { t: "ECMP", c: "OSPF", d: "Equal-Cost Multi-Path : répartition de charge sur plusieurs liens ayant une métrique OSPF strictement identique." },
      { t: "EGP", c: "Internet", d: "Exterior Gateway Protocol : famille de protocoles inter-AS (aujourd'hui BGP, qui a remplacé l'ancien protocole EGP)." },
      { t: "Flooding (Inondation)", c: "OSPF", d: "Mécanisme de diffusion de proche en proche des LSA à tous les routeurs d'une aire." },
      { t: "Full-Mesh iBGP", c: "BGP", d: "Maillage complet de n(n-1)/2 sessions iBGP requis par la non-transitivité iBGP en l'absence de Route Reflector ou Confédération." },
      { t: "GÉANT", c: "Internet", d: "Réseau pan-européen très haut débit interconnectant les réseaux nationaux de recherche et d'enseignement (dont RENATER)." },
      { t: "Hello (Paquet OSPF Type 1)", c: "OSPF", d: "Paquet envoyé toutes les 10 s sur 224.0.0.5 (IP proto 89) pour découvrir les voisins, vérifier les paramètres et élire DR/BDR." },
      { t: "Hold Time", c: "BGP", d: "Durée maximale sans recevoir de KEEPALIVE ni d'UPDATE avant fermeture de session BGP (90 s dans le cours, 180 s par défaut Cisco IOS)." },
      { t: "IAB", c: "Internet", d: "Internet Architecture Board : comité désigné par l'ISOC supervisant l'architecture et les task forces (IETF, IRTF)." },
      { t: "IANA", c: "Internet", d: "Internet Assigned Numbers Authority (englobée par ICANN) : gère les registres mondiaux d'adresses IP, ASN et ports." },
      { t: "IAR (Intra-Area Router)", c: "OSPF", d: "Routeur OSPF dont toutes les interfaces appartiennent à une seule aire (hors aire 0). Ne peut ni filtrer ni agréger." },
      { t: "iBGP (Interior BGP)", c: "BGP", d: "Session BGP au sein d'un même AS. AD = 200, non transitif, ne modifie ni AS_PATH ni NEXT_HOP par défaut, souvent sur Loopbacks." },
      { t: "ICANN", c: "Internet", d: "Internet Corporation for Assigned Names and Numbers : association à but non lucratif coordonnant IP, DNS, ports et IANA." },
      { t: "IETF / IESG", c: "Internet", d: "Internet Engineering Task Force (supervisée par l'IESG) : élabore les standards techniques d'Internet (RFC)." },
      { t: "IGP", c: "Internet", d: "Interior Gateway Protocol : protocole de routage intra-AS (OSPF, IS-IS, RIP, EIGRP)." },
      { t: "IRTF / IRSG", c: "Internet", d: "Internet Research Task Force (supervisée par l'IRSG) : recherche à long terme préparant les futurs travaux de l'IETF." },
      { t: "ISOC", c: "Internet", d: "Internet Society : superstructure à but non lucratif fondée par les pionniers d'Internet pour son développement ouvert." },
      { t: "IXP / GIX", c: "Internet", d: "Internet eXchange Point (ou Global Internet eXchange) : point d'échange physique public où s'interconnectent plusieurs opérateurs en peering." },
      { t: "KEEPALIVE", c: "BGP", d: "Message BGP de type 4 (19 octets) confirmant l'OPEN et maintenant la session active (30 s cours / 60 s IOS)." },
      { t: "LIR (Local Internet Registry)", c: "Internet", d: "Organisation membre d'un RIR qui obtient des IP/ASN et les distribue/revend aux clients finaux (ex : Orange, Free, OVH, RENATER)." },
      { t: "LOCAL_PREF", c: "BGP", d: "Attribut Well-Known Discretionary (défaut 100, propagé en iBGP). La valeur la plus ÉLEVÉE détermine le point de sortie préféré de l'AS." },
      { t: "Loopback", c: "Routage", d: "Interface logique virtuelle toujours active (up/up). Utilisée pour stabiliser le Router-ID OSPF/BGP et les sessions iBGP (update-source)." },
      { t: "LSA (Link-State Advertisement)", c: "OSPF", d: "Unité d'information topologique OSPF (Type 1 Router, 2 Network, 3 Summary, 4 ASBR Summary, 5 AS-External, 7 NSSA)." },
      { t: "LSAck / LSR / LSU", c: "OSPF", d: "Paquets OSPF de types 5 (acquittement), 3 (requête de LSA manquante) et 4 (envoi de LSA complètes)." },
      { t: "LSDB (Link-State Database)", c: "OSPF", d: "Base de données topologique OSPF regroupant toutes les LSA d'une aire ; identique sur tous les routeurs de l'aire." },
      { t: "MED (Multi-Exit Discriminator)", c: "BGP", d: "Attribut Optional Nontransitive (défaut 0, plus BAS gagne) suggérant à un AS voisin quel lien d'entrée privilégier." },
      { t: "MP-BGP", c: "BGP", d: "Multi-Protocol BGP (RFC 2858) : étend BGP au transport d'autres familles d'adresses (IPv6, VPN MPLS...)." },
      { t: "Multihomed AS", c: "Internet", d: "AS connecté à plusieurs autres AS pour la redondance mais qui ne transporte pas de trafic de transit entre eux." },
      { t: "NBMA", c: "OSPF", d: "Non-Broadcast Multiaccess : réseau multi-accès sans broadcast natif où OSPF émule le broadcast et élit un DR/BDR." },
      { t: "NEXT_HOP / next-hop-self", c: "BGP", d: "Attribut WM indiquant l'IP du prochain routeur. En iBGP, next-hop-self force le routeur de bordure à se mettre lui-même comme next-hop." },
      { t: "NLRI", c: "BGP", d: "Network Layer Reachability Information : liste des préfixes IP/masque annoncés dans un message BGP UPDATE." },
      { t: "NOTIFICATION", c: "BGP", d: "Message BGP de type 3 signalant une erreur et provoquant la fermeture immédiate de la session." },
      { t: "NSSA / Totally NSSA", c: "OSPF", d: "Not-So-Stubby Area : aire stub autorisant un ASBR interne via LSA type 7 (traduites en type 5 par l'ABR). Totally NSSA bloque aussi les LSA 3 détaillées." },
      { t: "ORIGIN", c: "BGP", d: "Attribut WM indiquant l'origine d'une route BGP : i (IGP/network) < e (EGP) < ? (Incomplete/redistribute)." },
      { t: "Passive-Interface", c: "OSPF", d: "Empêche l'envoi de paquets Hello sur une interface LAN tout en continuant d'annoncer son préfixe dans OSPF." },
      { t: "Peering (Privé / Public)", c: "Internet", d: "Accord d'échange direct de routes entre deux opérateurs (gratuit ou forfaitaire), via liaison directe (privé) ou IXP (public)." },
      { t: "PoP (Point of Presence)", c: "Internet", d: "Point de collecte régional disposant d'équipements télécoms pour agréger les flux locaux d'un opérateur." },
      { t: "RENATER", c: "Internet", d: "Réseau français de l'Enseignement et de la Recherche (créé en 1993), opérateur du RIE depuis 2015, ISP Tier 2 connecté au SFINX et à GÉANT." },
      { t: "RFC (Request For Comments)", c: "Internet", d: "Documents techniques numérotés publiés par l'IETF (Proposed Standard, Draft Standard, Internet Standard pour les Standard-tracks)." },
      { t: "RIR (Regional Internet Registry)", c: "Internet", d: "Registre régional délégataire de l'IANA (RIPE NCC pour l'Europe, ARIN, APNIC, AFRINIC, LACNIC)." },
      { t: "Route Reflector (RR)", c: "BGP", d: "Routeur iBGP central (RFC 4456) autorisé à réannoncer les routes iBGP à ses clients, évitant le full-mesh." },
      { t: "Router-ID", c: "Routage", d: "Identifiant 32 bits unique d'un routeur OSPF ou BGP (commande router-id > plus haute Loopback > plus haute IP physique)." },
      { t: "Singlehomed (AS Stub)", c: "Internet", d: "AS raccordé à un seul autre AS." },
      { t: "Stub / Totally Stub", c: "OSPF", d: "Aire OSPF bloquant les LSA 4/5 (+ LSA 3 détaillées en Totally Stub avec no-summary sur l'ABR), remplacées par O*IA 0.0.0.0/0." },
      { t: "Tier 1 / 2 / 3", c: "Internet", d: "Hiérarchie des FAI : Tier 1 sans transit (peering mondial), Tier 2 transit + peering, Tier 3 transit seul." },
      { t: "Transit IP", c: "Internet", d: "Service payant (à la bande passante) permettant à un opérateur d'atteindre tout Internet via un opérateur amont." },
      { t: "Virtual-Link", c: "OSPF", d: "Lien logique appartenant à l'aire 0 permettant de raccorder un ABR isolé au backbone via une aire de transit normale (jamais stub/NSSA)." },
      { t: "Weight", c: "BGP", d: "Paramètre propriétaire Cisco (critère n°1 BGP, plus grand gagne, 32768 local / 0 reçu), purement local au routeur." },
      { t: "Wildcard Mask", c: "OSPF", d: "Masque inversé (255.255.255.255 − masque) utilisé par la commande network d'OSPF (ex : /30 → 0.0.0.3, /24 → 0.0.0.255)." }
    ]
  }
};
