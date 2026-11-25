/* ==========================================================================
   data-quiz.js — 56 QCM détaillés, 54 Flashcards recto-verso et 16 Exercices
   pratiques corrigés couvrant 100 % des Polycopiés 1-3, TP1-3 et TD2-3.
   ========================================================================== */
window.SAE33 = window.SAE33 || {};

window.SAE33.QUIZ = [
  // === INTERNET & AS (12 questions) ===
  {
    cat: "internet",
    q: "Quel organisme coordonne l'espace d'adressage IP, les noms de domaine et a englobé l'IANA ?",
    opts: ["IETF", "ICANN", "IRTF", "RIPE NCC"],
    ans: 1,
    exp: "L'ICANN (association de droit californien) gère les ressources partagées de numérotation d'Internet (IP, DNS, ports) et a englobé l'IANA. L'IETF rédige les normes (RFC) et le RIPE NCC est le RIR européen."
  },
  {
    cat: "internet",
    q: "Parmi ces affirmations sur les RFC publiées par l'IETF, laquelle est VRAIE ?",
    opts: [
      "Toute RFC publiée par l'IETF est automatiquement une norme officielle d'Internet.",
      "Les RFC ne concernent que les protocoles de routage.",
      "Seul un petit nombre de RFC sont des normes officielles (Standard-tracks).",
      "Les RFC sont rédigées uniquement par l'ICANN."
    ],
    ans: 2,
    exp: "Tous les documents publiés par l'IETF (normes, conseils, informations) sont des RFC, mais seul un petit nombre est en Standard-track (Proposed, Draft, Internet Standard)."
  },
  {
    cat: "internet",
    q: "Quel comité réalise la recherche sur l'évolution à long terme d'Internet et prépare les futurs travaux de l'IETF ?",
    opts: ["IESG", "IRTF (supervisé par l'IRSG)", "ISOC", "IANA"],
    ans: 1,
    exp: "L'IRTF (Internet Research Task Force, supervisé par l'IRSG) travaille sur la recherche à long terme et prépare les futurs travaux d'ingénierie de l'IETF."
  },
  {
    cat: "internet",
    q: "Quelle est la principale différence économique entre le Transit IP et le Peering ?",
    opts: [
      "Le transit est toujours gratuit ; le peering est facturé au gigaoctet.",
      "Le transit est facturé à la consommation réelle en bande passante ; le peering est généralement gratuit ou au forfait.",
      "Le peering donne accès à 100 % d'Internet ; le transit ne relie que deux opérateurs.",
      "Il n'y a aucune différence, les deux termes sont synonymes."
    ],
    ans: 1,
    exp: "Le transit IP est payant à la consommation (avec seuil minimal) et ouvre vers tout Internet. Le peering échange les routes de deux opérateurs comparables gratuitement ou au forfait."
  },
  {
    cat: "internet",
    q: "Qu'est-ce qui caractérise un opérateur de Niveau 1 (Tier 1) ?",
    opts: [
      "Il achète du transit à un seul grand opérateur et n'a aucun peering.",
      "Il n'achète aucun transit et atteint la totalité d'Internet par peering avec tous les autres Tier 1 (+ ses clients transit).",
      "Il opère uniquement des réseaux d'accès locaux (boucle locale).",
      "RENATER est un opérateur Tier 1."
    ],
    ans: 1,
    exp: "Un Tier 1 (Orange, AT&T, Lumen, Verizon, Deutsche Telekom, Tata, NTT) n'achète aucun transit et est en peering direct avec tous les autres Tier 1. RENATER est un Tier 2 !"
  },
  {
    cat: "internet",
    q: "À quel niveau d'opérateur appartient le réseau RENATER (et via quel IXP français se connecte-t-il à Internet) ?",
    opts: ["Tier 1 via EquinIX", "Tier 2 via le SFINX (et transit Paris/Marseille)", "Tier 3 via AuvernIX", "Tier 1 via GÉANT"],
    ans: 1,
    exp: "RENATER (créé en 1993, opérateur du RIE depuis 2015) est un ISP de niveau 2 (Tier 2), connecté en France au point d'échange SFINX, à l'international par 2 transits (Paris/Marseille), et relié à GÉANT."
  },
  {
    cat: "internet",
    q: "Quelle est la chaîne exacte de délégation pour obtenir un numéro d'AS (ASN) en Europe ?",
    opts: [
      "IETF → ICANN → Client final",
      "IANA → RIR (RIPE NCC) → LIR → Client final",
      "ISOC → LIR → RIR → Client final",
      "RIPE NCC traite directement avec chaque entreprise finale"
    ],
    ans: 1,
    exp: "L'IANA délègue aux 5 RIR (dont RIPE NCC en Europe). Les RIR ne traitent jamais directement avec les clients finaux : ils passent par un deuxième niveau, les LIR (Local Internet Registry)."
  },
  {
    cat: "internet",
    q: "Sur combien de bits sont codés les numéros d'AS (ASN) depuis 2007 ?",
    opts: ["8 bits", "16 bits", "32 bits", "128 bits"],
    ans: 2,
    exp: "Les ASN étaient codés sur 16 bits avant 2007 et sont aujourd'hui codés sur 32 bits pour faire face à la croissance du nombre de Systèmes Autonomes."
  },
  {
    cat: "internet",
    q: "Un AS connecté à deux opérateurs différents pour la redondance, mais qui interdit au trafic tiers de le traverser, est un AS :",
    opts: ["Singlehomed (stub)", "Multihomed", "Transit", "IXP"],
    ans: 1,
    exp: "Un AS multihomed maintient des connexions vers plus d'un AS mais n'autorise pas le transit de trafic d'un autre AS à travers son réseau."
  },
  {
    cat: "internet",
    q: "Qu'est-ce qu'un peering public ?",
    opts: [
      "Un câble fibre direct privé entre deux opérateurs.",
      "Un échange de trafic via un point d'échange partagé (IXP / GIX) où sont connectés plusieurs opérateurs.",
      "L'accès Wi-Fi gratuit dans un lieu public.",
      "Un contrat de transit payé au gouvernement."
    ],
    ans: 1,
    exp: "Le peering privé utilise une liaison physique directe ; le peering public passe par un IXP (Internet eXchange Point, anciennement NAP aux US) ou GIX."
  },
  {
    cat: "internet",
    q: "Qu'est-ce qu'un PoP (Point of Presence) ?",
    opts: [
      "Un protocole de messagerie électronique uniquement.",
      "Un point de collecte régional où un opérateur dispose d'équipements pour recueillir et transmettre des flux locaux.",
      "Un algorithme de calcul du plus court chemin.",
      "Le routeur désigné d'une aire OSPF."
    ],
    ans: 1,
    exp: "Un Point de Présence (PoP) est un site régional équipé d'actifs/passifs télécoms permettant à un opérateur de collecter et transmettre les flux locaux."
  },
  {
    cat: "internet",
    q: "Quel protocole de routage interne (IGP) mentionné dans le polycopié 1 utilise pourtant un numéro d'AS pour former ses adjacences ?",
    opts: ["OSPF", "RIP", "EIGRP", "IS-IS"],
    ans: 2,
    exp: "Diapo 24 : en général l'ASN n'apparaît pas dans les IGP, sauf EIGRP qui n'établit d'adjacence qu'avec les routeurs annonçant le même numéro de système autonome local."
  },

  // === OSPF (18 questions) ===
  {
    cat: "ospf",
    q: "Comment sont encapsulés les paquets OSPFv2 ?",
    opts: [
      "Dans TCP port 89",
      "Dans UDP port 520",
      "Directement dans IP, champ protocole = 89 (0x59), sans TCP ni UDP",
      "Dans TCP port 179"
    ],
    ans: 2,
    exp: "OSPF est encapsulé directement dans IP avec le numéro de protocole 89 (0x59 en hexadécimal). Il gère lui-même sa fiabilité grâce aux paquets LSAck."
  },
  {
    cat: "ospf",
    q: "Quelles adresses multicast IPv4 utilise OSPF ?",
    opts: [
      "224.0.0.9 (tous) et 224.0.0.10 (DR)",
      "224.0.0.5 (AllSPFRouters) et 224.0.0.6 (AllDRouters)",
      "255.255.255.255 uniquement",
      "239.0.0.5 et 239.0.0.6"
    ],
    ans: 1,
    exp: "224.0.0.5 (MAC 0100.5E00.0005) cible tous les routeurs OSPF ; 224.0.0.6 cible uniquement le DR et le BDR sur un segment multi-accès."
  },
  {
    cat: "ospf",
    q: "Quel algorithme OSPF utilise-t-il sur sa LSDB pour calculer les meilleurs chemins ?",
    opts: ["Bellman-Ford", "Dijkstra (Shortest Path First — SPF)", "Diffusing Update Algorithm (DUAL)", "Spanning Tree (STP)"],
    ans: 1,
    exp: "Chaque routeur OSPF possède la même LSDB dans son aire et exécute l'algorithme de Dijkstra (SPF) pour déterminer l'arbre des plus courts chemins."
  },
  {
    cat: "ospf",
    q: "Quel est le rôle du paquet OSPF de type 5 (LSAck) ? Attention au piège !",
    opts: [
      "Transporter une route externe redistribuée depuis BGP",
      "Résumer la base de données au démarrage",
      "Acquitter la réception des LSA reçues dans un paquet LSU",
      "Découvrir les voisins OSPF toutes les 10 secondes"
    ],
    ans: 2,
    exp: "Piège classique ! Paquet OSPF type 5 = LSAck (acquittement). Une LSA de type 5 (route externe) est transportée dans un paquet de type 4 (LSU) !"
  },
  {
    cat: "ospf",
    q: "Quelle LSA est générée par un ABR pour annoncer les préfixes d'une aire vers une autre aire ?",
    opts: ["LSA Type 1 (Router)", "LSA Type 2 (Network)", "LSA Type 3 (Summary Net)", "LSA Type 5 (AS-External)"],
    ans: 2,
    exp: "Les LSA Type 1 et 2 restent confinées à leur aire. L'ABR résume les réseaux d'une aire et les annonce dans les autres aires via des LSA de type 3 (apparaissent en O IA)."
  },
  {
    cat: "ospf",
    q: "Quel est le rôle spécifique d'une LSA de type 4 ?",
    opts: [
      "Décrire les routeurs connectés à un switch Ethernet",
      "Indiquer aux autres aires le chemin vers un ASBR distant (générée par un ABR)",
      "Annoncer une route externe dans une aire NSSA",
      "Synchroniser les numéros de séquence MD5"
    ],
    ans: 1,
    exp: "La LSA Type 4 (ASBR Summary) est générée par un ABR pour annoncer aux autres aires comment joindre un ASBR situé dans une autre aire."
  },
  {
    cat: "ospf",
    q: "Dans quel ordre STRICT OSPF préfère-t-il les types de routes, indépendamment de leur coût ?",
    opts: [
      "O E1 > O E2 > O > O IA",
      "O (intra-aire) > O IA (inter-aires) > O E1 > O E2",
      "O IA > O > O E2 > O E1",
      "Toujours le plus petit coût, peu importe le type de route"
    ],
    ans: 1,
    exp: "Diapo 31 : indépendamment de la métrique, OSPF préfère toujours : routes intra-aires (O) > inter-aires (O IA) > externes E1 > externes E2."
  },
  {
    cat: "ospf",
    q: "Quelle est la différence entre une route externe OSPF E1 et une route E2 ?",
    opts: [
      "E1 est pour IPv4 et E2 pour IPv6",
      "E1 additionne le coût interne jusqu'à l'ASBR au coût externe ; E2 garde un coût externe fixe",
      "E2 est toujours préférée à E1",
      "E2 ne peut pas traverser l'aire 0"
    ],
    ans: 1,
    exp: "En E2 (type par défaut Cisco), la métrique affichée reste fixe (20 par défaut, ou 1 depuis BGP) quel que soit le nombre de liens traversés. En E1, le coût interne vers l'ASBR est ajouté."
  },
  {
    cat: "ospf",
    q: "Sur un réseau Ethernet multi-accès, deux routeurs R1 (priorité 1, ID 1.1.1.1) et R2 (priorité 1, ID 2.2.2.2) sont déjà convergés. On ajoute R3 (priorité 200, ID 9.9.9.9). Qui est le DR ?",
    opts: [
      "R3 devient immédiatement DR car sa priorité est 200",
      "R2 reste DR car l'élection OSPF est NON PRÉEMPTIVE",
      "R1 devient DR",
      "Les trois deviennent DR en même temps"
    ],
    ans: 1,
    exp: "L'élection DR/BDR est non préemptive ! R2 (qui avait le plus grand Router-ID à priorité égale) reste DR tant que son processus OSPF n'est pas redémarré (clear ip ospf process) ou qu'il ne tombe pas."
  },
  {
    cat: "ospf",
    q: "Sur un switch Aire 0, un routeur affiche '2WAY/DROTHER' pour un voisin dans 'show ip ospf neighbor'. Que faut-il faire ?",
    opts: [
      "C'est une panne grave de MTU, il faut redémarrer le routeur",
      "Rien : c'est l'état parfaitement NORMAL entre deux routeurs DROTHER sur un segment multi-accès",
      "Désactiver MD5 immédiatement",
      "Passer l'aire en Stub"
    ],
    ans: 1,
    exp: "Pour éviter n(n-1)/2 adjacences, les DROTHER ne montent une adjacence FULL qu'avec le DR et le BDR. Entre deux DROTHER, l'état stable normal est 2WAY/DROTHER."
  },
  {
    cat: "ospf",
    q: "Quelle priorité OSPF empêche totalement un routeur de devenir DR ou BDR sur une interface ?",
    opts: ["255", "1", "0", "110"],
    ans: 2,
    exp: "Une priorité configurée à 0 (ip ospf priority 0) exclut l'interface de la participation à l'élection DR/BDR."
  },
  {
    cat: "ospf",
    q: "Dans 'show ip route', que signifie la ligne : O 192.168.40.0/24 [110/200] via 10.0.40.1 ?",
    opts: [
      "Route externe, coût 110, distance administrative 200",
      "Route OSPF intra-aire, Distance Administrative 110, coût cumulé 200, prochain saut 10.0.40.1",
      "Route inter-aire, 110 sauts, 200 ms de latence",
      "Route BGP, AS 110, MED 200"
    ],
    ans: 1,
    exp: "O = OSPF intra-aire. Entre crochets [AD/Métrique] : 110 est la Distance Administrative d'OSPF, et 200 est le coût total (ex : 100 + 100 dans le TP1)."
  },
  {
    cat: "ospf",
    q: "Quelles LSA sont bloquées à l'entrée d'une aire TOTALLY STUB ?",
    opts: [
      "Uniquement les LSA de type 1 et 2",
      "Uniquement les LSA de type 5",
      "Les LSA de type 4, 5 ET les LSA de type 3 détaillées (seule la LSA 3 de la route par défaut 0.0.0.0/0 passe)",
      "Aucune LSA, tout passe normalement"
    ],
    ans: 2,
    exp: "Une aire Stub bloque les LSA 4 et 5. Une aire Totally Stub (area X stub no-summary sur l'ABR) bloque en plus les LSA 3 spécifiques et ne laisse passer que la route par défaut O*IA 0.0.0.0/0."
  },
  {
    cat: "ospf",
    q: "Où doit-on configurer le mot-clé 'no-summary' pour passer une aire 40 en Totally Stub ?",
    opts: [
      "Uniquement sur les routeurs internes (IAR)",
      "Sur tous les routeurs de l'aire 40 sans exception",
      "Uniquement sur l'ABR (les IAR gardent simplement 'area 40 stub')",
      "Uniquement sur l'ASBR"
    ],
    ans: 2,
    exp: "Seul l'ABR génère les LSA de type 3 : c'est donc uniquement sur l'ABR qu'on tape 'area 40 stub no-summary'. Tous les routeurs de l'aire doivent cependant avoir 'area 40 stub' (bit E des Hello)."
  },
  {
    cat: "ospf",
    q: "Quelle est l'utilité d'une aire NSSA (Not-So-Stubby Area) ?",
    opts: [
      "Permettre d'avoir un ASBR qui injecte des routes externes (via LSA 7) dans une aire qui refuse les LSA 5",
      "Remplacer l'aire 0 quand elle est en panne",
      "Chiffrer les paquets OSPF en AES-256",
      "Augmenter le nombre maximum de routeurs à 10 000"
    ],
    ans: 0,
    exp: "Une aire Stub interdit tout ASBR interne. La NSSA contourne cette limite : l'ASBR interne injecte des LSA Type 7 (O N1/N2), que l'ABR convertit en LSA Type 5 (O E1/E2) vers l'aire 0."
  },
  {
    cat: "ospf",
    q: "Que fait exactement l'authentification OSPF MD5 (type 2) ?",
    opts: [
      "Elle chiffre l'intégralité du trafic utilisateur transitant par le routeur.",
      "Elle envoie le mot de passe en clair dans chaque paquet Hello.",
      "Elle signe chaque paquet OSPF avec un hash MD5 (clé partagée + Crypto Sequence Number) pour authentifier le voisin et vérifier l'intégrité, sans chiffrer le paquet.",
      "Elle désactive les paquets Hello."
    ],
    ans: 2,
    exp: "MD5 (Auth Type 2) garantit l'authentification et l'intégrité (+ anti-rejeu via Crypto Sequence Number), sans jamais envoyer la clé sur le réseau — mais les LSA restent lisibles en clair."
  },
  {
    cat: "ospf",
    q: "Peut-on établir un voisinage OSPF entre R1 configuré en 'router ospf 1' et R2 configuré en 'router ospf 100' ?",
    opts: [
      "Non, le Process ID doit être identique dans tout l'AS",
      "Oui, le Process ID est purement local au routeur (tant que l'Area ID, le masque, les timers et l'auth concordent)",
      "Seulement en mode Stub",
      "Seulement si les Router-ID sont identiques"
    ],
    ans: 1,
    exp: "Le Process ID (PID) OSPF n'est jamais envoyé dans les paquets OSPF : il est purement local au routeur ! En revanche, l'Area ID doit être identique aux deux bouts du lien."
  },
  {
    cat: "ospf",
    q: "Quel est le masque générique (wildcard) OSPF correspondant à un lien point-à-point /30 (255.255.255.252) ?",
    opts: ["0.0.0.255", "0.0.0.3", "0.0.0.4", "255.255.255.252"],
    ans: 1,
    exp: "Wildcard = 255.255.255.255 − 255.255.255.252 = 0.0.0.3."
  },

  // === BGP (16 questions) ===
  {
    cat: "bgp",
    q: "Sur quel protocole de transport et quel numéro de port repose BGP ?",
    opts: ["UDP port 179", "IP protocole 89", "TCP port 179", "UDP port 520"],
    ans: 2,
    exp: "BGP s'appuie sur TCP port 179 pour bénéficier d'un transport fiable, orienté connexion (handshake SYN, SYN-ACK, ACK avant le message OPEN)."
  },
  {
    cat: "bgp",
    q: "Quels sont les trois attributs BGP de type Well-Known Mandatory (obligatoires dans toute annonce UPDATE) ?",
    opts: [
      "WEIGHT, LOCAL_PREF, MED",
      "AS_PATH, NEXT_HOP, ORIGIN",
      "COMMUNITY, AGGREGATOR, CLUSTER_ID",
      "AS_PATH, MED, LOCAL_PREF"
    ],
    ans: 1,
    exp: "Les 3 attributs Well-Known Mandatory (diapo 47) sont AS_PATH, NEXT_HOP et ORIGIN. Ils doivent impérativement être reconnus et inclus dans chaque mise à jour de route."
  },
  {
    cat: "bgp",
    q: "Comment BGP empêche-t-il les boucles de routage entre Systèmes Autonomes ?",
    opts: [
      "En limitant le nombre de sauts à 15 comme RIP",
      "En exécutant l'algorithme de Dijkstra sur toute la planète",
      "Si un routeur reçoit une annonce dont l'AS_PATH contient déjà son propre ASN, il la rejette automatiquement",
      "En mettant le TTL des paquets de données à 1"
    ],
    ans: 2,
    exp: "Chaque AS ajoute son propre numéro à gauche de l'AS_PATH lors d'un envoi eBGP. À la réception, si son propre ASN figure dans l'AS_PATH, le routeur rejette la route."
  },
  {
    cat: "bgp",
    q: "Dans l'algorithme de choix du meilleur chemin BGP, deux routes ont le même Weight (0), mais Route A a Local_Pref = 150 (AS_PATH = 300 400 100) et Route B a Local_Pref = 100 (AS_PATH = 200 100). Laquelle gagne ?",
    opts: [
      "Route B car son AS_PATH est plus court",
      "Route A car LOCAL_PREF (critère n°2, plus grande gagne) est évalué AVANT AS_PATH (critère n°4)",
      "Les deux en équilibrage de charge automatique",
      "Aucune, la session se ferme par NOTIFICATION"
    ],
    ans: 1,
    exp: "L'ordre BGP est strict : 1. Weight → 2. LOCAL_PREF (plus grande gagne) → 3. Self-originated → 4. AS_PATH. Local_Pref = 150 bat immédiatement 100 avant même de regarder l'AS_PATH !"
  },
  {
    cat: "bgp",
    q: "À quoi sert l'attribut BGP MED (Multi-Exit Discriminator) ?",
    opts: [
      "À choisir la sortie au sein de notre propre AS (plus grand gagne)",
      "À suggérer à un AS voisin par quel lien entrer chez nous (plus PETIT gagne, comparé entre liens vers le même AS voisin)",
      "À remplacer TCP par UDP",
      "À empêcher les boucles dans les Route Reflectors"
    ],
    ans: 1,
    exp: "MED (Optional Nontransitive, défaut 0) est une métrique 32 bits envoyée à un AS voisin : à critères supérieurs égaux, le MED le plus FAIBLE est préféré."
  },
  {
    cat: "bgp",
    q: "Quelle est la portée de l'attribut Cisco 'Weight' ?",
    opts: [
      "Il est propagé à tout Internet via eBGP",
      "Il est propagé à tous les routeurs de l'AS via iBGP",
      "Il est strictement LOCAL au routeur et n'est JAMAIS transmis aux voisins (défaut 32768 pour les routes locales)",
      "Il ne s'applique qu'à OSPF"
    ],
    ans: 2,
    exp: "Weight est une extension propriétaire Cisco évaluée en tout premier (critère n°1, plus grand gagne). Il reste purement local au routeur et n'apparaît jamais dans les paquets UPDATE."
  },
  {
    cat: "bgp",
    q: "Quel est l'ordre de préférence de l'attribut ORIGIN (critère n°5) ?",
    opts: [
      "? (Incomplete) > e (EGP) > i (IGP)",
      "i (IGP) > e (EGP) > ? (Incomplete)",
      "e (EGP) > i (IGP) > ? (Incomplete)",
      "ORIGIN n'intervient pas dans le choix de chemin"
    ],
    ans: 1,
    exp: "BGP préfère i (IGP, annoncé via network) devant e (EGP, historique) devant ? (Incomplete, issu d'une redistribution)."
  },
  {
    cat: "bgp",
    q: "Pourquoi a-t-on besoin de 'neighbor <IP> next-hop-self' sur un routeur de bordure vers ses voisins iBGP ?",
    opts: [
      "Parce qu'iBGP ne modifie pas le NEXT_HOP des routes apprises en eBGP, le laissant sur une IP externe souvent inconnue des routeurs internes",
      "Pour passer le TTL de 1 à 255",
      "Pour activer l'authentification MD5",
      "Pour annoncer les réseaux connectés automatiquement"
    ],
    ans: 0,
    exp: "Un routeur de bordure qui relaye une route eBGP vers un voisin iBGP conserve le NEXT_HOP du voisin externe (ex : 10.0.0.2 sur l'IXP). Avec next-hop-self, il met sa propre IP interne."
  },
  {
    cat: "bgp",
    q: "Dans un AS contenant 6 routeurs iBGP sans Route Reflector ni Confédération, combien de sessions iBGP faut-il pour un maillage complet (full-mesh) ?",
    opts: ["6 sessions", "12 sessions", "15 sessions", "30 sessions"],
    ans: 2,
    exp: "Formule du maillage complet : n(n − 1) / 2 = 6 × 5 / 2 = 15 sessions iBGP."
  },
  {
    cat: "bgp",
    q: "Quels deux attributs spécifiques assurent l'anti-boucle avec les Réflecteurs de Routes (Route Reflectors, RFC 4456) ?",
    opts: [
      "WEIGHT et MED",
      "CLUSTER_ID et ORIGINATOR_ID",
      "AS_PATH et NEXT_HOP",
      "COMMUNITY et AGGREGATOR"
    ],
    ans: 1,
    exp: "Polycopié 3 (diapos 48 & 56) : Originator_ID (Router-ID du routeur d'origine dans l'AS) et Cluster_ID/Cluster_List empêchent les boucles entre réflecteurs de routes."
  },
  {
    cat: "bgp",
    q: "Que signifie un nombre entier (ex : '2') dans la colonne 'State/PfxRcd' de 'show ip bgp summary' ?",
    opts: [
      "La session est en erreur code 2 (NOTIFICATION)",
      "La session est ESTABLISHED et le routeur a reçu 2 préfixes de ce voisin",
      "Il reste 2 secondes avant expiration du Hold Timer",
      "Le routeur appartient à l'AS 2"
    ],
    ans: 1,
    exp: "Tant que la session n'est pas montée, la colonne affiche un état textuel (Idle, Connect, Active, OpenSent, OpenConfirm). Dès qu'elle est Established, elle affiche le nombre de préfixes reçus (0, 1, 2...)."
  },
  {
    cat: "bgp",
    q: "Quel message BGP est envoyé pour signaler une erreur de configuration (ex : mauvais remote-as) et fermer la session ?",
    opts: ["KEEPALIVE", "UPDATE", "NOTIFICATION", "ROUTE-REFRESH"],
    ans: 2,
    exp: "Le message NOTIFICATION (type 3) signale une erreur protocolaire ou de configuration et termine immédiatement la session BGP."
  },
  {
    cat: "bgp",
    q: "Quelle est la taille minimale d'un en-tête de message BGP (correspondant aussi à un KEEPALIVE) ?",
    opts: ["19 octets (Marqueur 16 + Longueur 2 + Type 1)", "24 octets", "64 octets", "8 octets"],
    ans: 0,
    exp: "Polycopié 3 (diapo 58) : Marqueur (16 octets à FF) + Longueur (2 octets) + Type (1 octet) = 19 octets d'en-tête commun."
  },
  {
    cat: "bgp",
    q: "Pourquoi établit-on généralement les sessions iBGP entre adresses de Loopback ?",
    opts: [
      "Parce que TCP 179 ne fonctionne pas sur Ethernet",
      "Parce qu'une interface Loopback est toujours up/up : la session survit à la panne d'un lien physique tant qu'un chemin alternatif existe dans l'IGP",
      "Parce que cela réduit la Distance Administrative de 200 à 20",
      "Parce que c'est obligatoire même avec un seul lien direct"
    ],
    ans: 1,
    exp: "Avec des loopbacks (+ update-source Loopback0), la session iBGP reste établie si une interface physique tombe et que l'IGP (OSPF) bascule sur un lien de secours."
  },
  {
    cat: "bgp",
    q: "Que se passe-t-il si on tape 'network 192.168.10.0 mask 255.255.0.0' dans BGP alors que la table de routage contient 'C 192.168.10.0/24' ?",
    opts: [
      "BGP annonce automatiquement 192.168.10.0/24",
      "BGP n'annonce RIEN : la commande network exige une correspondance EXACTE du préfixe ET du masque dans la RIB",
      "BGP coupe la session avec un message NOTIFICATION",
      "BGP convertit le /24 en /16"
    ],
    ans: 1,
    exp: "Règle absolue BGP : 'network <préfixe> mask <masque>' n'annonce le préfixe que si une route strictement identique existe dans 'show ip route'."
  },
  {
    cat: "bgp",
    q: "Quelles sont les Distances Administratives Cisco par défaut pour eBGP, OSPF et iBGP ?",
    opts: [
      "eBGP = 200, OSPF = 110, iBGP = 20",
      "eBGP = 20, OSPF = 110, iBGP = 200",
      "eBGP = 110, OSPF = 20, iBGP = 120",
      "Tous ont une AD de 110"
    ],
    ans: 1,
    exp: "Connecté = 0, Statique = 1, eBGP = 20, OSPF = 110, RIP = 120, iBGP = 200."
  },

  // === REDISTRIBUTION & DÉPANNAGE (10 questions) ===
  {
    cat: "redistribution",
    q: "Que se passe-t-il si on oublie le mot-clé 'subnets' dans 'redistribute bgp 400' sous OSPF ?",
    opts: [
      "Cisco IOS refuse la commande avec une erreur de syntaxe",
      "OSPF ne redistribue que les réseaux classful purs et ignore les sous-réseaux (ex : 172.16.40.0/24)",
      "Les routes sont injectées en O IA au lieu de O E2",
      "Rien, subnets est purement décoratif"
    ],
    ans: 1,
    exp: "Sans 'subnets', IOS ne redistribue que les réseaux de classe entière (/8, /16, /24 classe C) et ignore silencieusement les réseaux sous-réseautés !"
  },
  {
    cat: "redistribution",
    q: "Quelle est la métrique par défaut d'une route BGP redistribuée dans OSPF (O E2) ?",
    opts: ["0", "1", "20", "110"],
    ans: 1,
    exp: "Une route redistribuée depuis BGP dans OSPF reçoit par défaut une métrique E2 de 1 (alors qu'une route static ou connected redistribuée reçoit une métrique E2 de 20)."
  },
  {
    cat: "redistribution",
    q: "Dans le TD3 (AS100 — AS200 sous OSPF — AS300 sans iBGP), pourquoi faut-il écrire 'redistribute ospf 1 match internal external 1 external 2' dans BGP ?",
    opts: [
      "Parce que par défaut 'redistribute ospf 1' n'exporte que les routes internes (O/O IA) et ignore les routes externes O E2 venant de l'autre bordure",
      "Pour chiffrer les routes OSPF en MD5",
      "Pour conserver le TTL à 1",
      "Pour créer une aire Totally Stub"
    ],
    ans: 0,
    exp: "Sur Router4 (AS200), le réseau de l'AS100 arrive en 'O E2' depuis Router2. Sans 'match internal external 1 external 2', BGP n'exporte pas cette route externe vers l'AS300 !"
  },
  {
    cat: "redistribution",
    q: "Quelle est la principale limite d'utiliser OSPF + redistribution mutuelle (TD3) au lieu d'iBGP dans un AS de transit ?",
    opts: [
      "OSPF ne fonctionne pas sur GigabitEthernet",
      "L'AS_PATH d'origine est perdu (l'AS300 reçoit '200 ?' au lieu de '200 100 i'), ce qui casse les attributs BGP et la prévention de boucles globale",
      "La bande passante est divisée par deux",
      "Cela empêche les pings ICMP"
    ],
    ans: 1,
    exp: "OSPF ne transporte pas les attributs BGP (AS_PATH, Communities, Local_Pref). En réinjectant OSPF dans BGP, l'AS_PATH repart de zéro (origine '?' incomplete) : seule une session iBGP préserve intégralement les attributs BGP."
  },
  {
    cat: "redistribution",
    q: "En production, pourquoi remplace-t-on souvent 'redistribute bgp <AS> subnets' par 'default-information originate always' sur l'ASBR ?",
    opts: [
      "Pour éviter de surcharger la RAM/CPU des routeurs internes OSPF avec les centaines de milliers de routes de la table Internet",
      "Parce que OSPF ne supporte pas les LSA de type 5",
      "Parce que BGP interdit la redistribution",
      "Pour supprimer la nécessité d'annoncer nos LAN dans BGP"
    ],
    ans: 0,
    exp: "Annoncer une unique route par défaut O*E2 0.0.0.0/0 suffit pour que tout le trafic sortant rejoigne l'ASBR, qui consulte ensuite sa table BGP complète."
  },
  {
    cat: "redistribution",
    q: "Un PC d'une aire OSPF ping un PC d'un autre AS BGP. Le routeur local répond 'Destination host unreachable'. Quelle est la cause la plus probable ?",
    opts: [
      "Le câble du PC distant est débranché",
      "Le routeur local OSPF n'a aucune route vers le préfixe distant (oubli de redistribute bgp ... subnets ou de route par défaut)",
      "Le PC local a un mauvais DNS",
      "Le switch bloque ICMP"
    ],
    ans: 1,
    exp: "Quand la passerelle locale répond elle-même 'Destination host unreachable' (comme R1 dans le CR Interconnexion), c'est qu'elle ne trouve aucune entrée correspondante dans sa table de routage !"
  },
  {
    cat: "redistribution",
    q: "Un routeur affiche 'B 192.168.4.0/24 [20/0]' et 'O 192.168.1.0/24 [110/3]', mais les PC de 192.168.1.0/24 ne peuvent pas joindre 192.168.4.0/24. Que faut-il vérifier en priorité ?",
    opts: [
      "La couleur des câbles",
      "Que la redistribution a bien été faite dans LES DEUX SENS (BGP→OSPF pour l'aller ET OSPF→BGP pour le retour)",
      "Le nom d'hôte (hostname) des routeurs",
      "Le serveur HTTP sécurisé"
    ],
    ans: 1,
    exp: "Sur le routeur de bordure, OSPF et BGP sont indépendants : sans redistribution (ou annonces network) dans les deux sens, ni l'aller ni le retour ne traversent la frontière."
  },
  {
    cat: "redistribution",
    q: "Dans le TP1, R2 (bordure Aire 0 / Aire 40) a accidentellement déclaré son lien vers R1 (10.0.40.0/24) en 'area 0' alors que R1 est resté en 'area 40'. Que se passe-t-il ?",
    opts: [
      "R2 convertit automatiquement R1 en area 0",
      "L'adjacence OSPF entre R1 et R2 tombe immédiatement car l'Area ID des Hello ne concorde plus",
      "La route passe simplement en O IA",
      "Les paquets passent en MD5"
    ],
    ans: 1,
    exp: "Deux routeurs partageant un même lien doivent impérativement être dans la MÊME aire sur ce lien (seule l'interface côté switch de R2 devait être en area 0)."
  },
  {
    cat: "redistribution",
    q: "Dans Packet Tracer, la commande 'monitor capture' (TP2) et la WebUI (TP3) ne sont pas disponibles. Par quoi les remplace-t-on ?",
    opts: [
      "Par 'show version'",
      "Par le mode Simulation (filtre OSPF, BGP, TCP, ICMP) et l'inspection Inbound/Outbound PDU Details",
      "Par une route statique flottante",
      "On ne peut pas observer les paquets dans Packet Tracer"
    ],
    ans: 1,
    exp: "Dans Packet Tracer, le mode Simulation remplace Wireshark/EPC/WebUI : on filtre sur OSPF/BGP/TCP/ICMP et on clique sur chaque enveloppe pour inspecter les champs PDU."
  },
  {
    cat: "redistribution",
    q: "Dans le TP3 (Aire 20 en NSSA), quel code apparaît dans la table de routage de l'ABR R3 pour le LAN 192.168.20.0/24 redistribué par R4 ?",
    opts: ["O IA", "O E2", "O N2", "B"],
    ans: 2,
    exp: "Dans l'aire NSSA, R4 génère une LSA de type 7 : R3 (ABR) l'installe donc en 'O N2' [110/20], puis traduit cette LSA 7 en LSA 5 ('O E2') pour l'aire 0 et les autres aires !"
  }
];

window.SAE33.FLASHCARDS = [
  { cat: "Internet", q: "Quel est le rôle de l'ISOC ?", a: "Internet Society : association internationale à but non lucratif, superstructure morale et technique promouvant le développement ouvert d'Internet." },
  { cat: "Internet", q: "Quel est le rôle de l'ICANN et de l'IANA ?", a: "ICANN coordonne IP, DNS et ports ; elle a englobé l'IANA qui gère les registres mondiaux d'adresses IP et d'ASN." },
  { cat: "Internet", q: "Différence entre IETF (IESG) et IRTF (IRSG) ?", a: "IETF = ingénierie et normes/standards (RFC), 1res implantations. IRTF = recherche long terme qui prépare les futurs travaux de l'IETF." },
  { cat: "Internet", q: "Quels sont les 3 statuts d'une RFC Standard-track (du cours) ?", a: "1) Proposed Standard (retenue par IESG) → 2) Draft Standard (2 implémentations interopérables) → 3) Internet Standard (norme officielle)." },
  { cat: "Internet", q: "Quels sont les 3 niveaux physiques d'Internet ?", a: "1) Équipements d'extrémité (PC/serveurs), 2) Réseaux d'accès (boucle locale), 3) Réseau cœur (dorsales / routeurs très haut débit)." },
  { cat: "Internet", q: "Différence entre Transit IP et Peering ?", a: "Transit = payant à la consommation, donne accès à tout Internet. Peering = échange direct de routes entre pairs comparables, généralement gratuit ou au forfait." },
  { cat: "Internet", q: "Peering Privé vs Peering Public ?", a: "Privé = liaison physique directe entre 2 acteurs. Public = via un point d'échange partagé IXP / GIX (ex : FranceIX, SFINX, AuvernIX)." },
  { cat: "Internet", q: "Définir Tier 1, Tier 2 et Tier 3.", a: "Tier 1 = 0 transit, peering avec tous les Tier 1. Tier 2 = transit + peering (ex : RENATER). Tier 3 = transit seul, 0 peering." },
  { cat: "Internet", q: "Que sont RENATER et GÉANT ?", a: "RENATER (1993) = réseau français Enseignement/Recherche + RIE (2015), Tier 2, connecté au SFINX et au réseau européen GÉANT." },
  { cat: "Internet", q: "Chaîne de délégation des ASN (32 bits) ?", a: "IANA → 5 RIR régionaux (RIPE NCC pour l'Europe) → LIR (Local Internet Registry : Orange, OVH, Free, RENATER...) → Clients finaux." },
  { cat: "Internet", q: "Citer les 4 catégories d'AS.", a: "1) Singlehomed (stub, 1 voisin), 2) Multihomed (≥2 voisins, pas de transit), 3) Transit (transporte trafic tiers), 4) IXP (ex : AuvernIX AS 201376)." },
  { cat: "OSPF", q: "Numéro de protocole IP et adresses multicast d'OSPFv2 ?", a: "Encapsulé directement dans IP : protocole 89 (0x59). Multicast 224.0.0.5 (AllSPFRouters, MAC 0100.5E00.0005) et 224.0.0.6 (AllDRouters), TTL=1." },
  { cat: "OSPF", q: "RFC d'OSPFv2 et d'OSPFv3 ?", a: "OSPFv2 (IPv4) = RFC 2328 (1997). OSPFv3 (IPv6) = RFC 5340 (2008)." },
  { cat: "OSPF", q: "Quelles sont les 4 étapes du fonctionnement d'OSPF ?", a: "1) Découverte voisins (Hello), 2) Échange LSA (flooding), 3) Construction LSDB identique par aire, 4) Calcul SPF (Dijkstra)." },
  { cat: "OSPF", q: "Timers Hello et Dead par défaut sur Ethernet ?", a: "Hello Interval = 10 secondes · Dead Interval = 40 secondes (4 × Hello)." },
  { cat: "OSPF", q: "Citer les 5 types de paquets OSPF dans l'ordre.", a: "1) Hello · 2) DBD (Database Description) · 3) LSR (Link State Request) · 4) LSU (Link State Update) · 5) LSAck (Ack)." },
  { cat: "OSPF", q: "Citer les 7 états d'adjacence OSPF dans l'ordre.", a: "DOWN → INIT → 2-WAY → EXSTART → EXCHANGE → LOADING → FULL." },
  { cat: "OSPF", q: "Rôle des LSA de types 1, 2, 3, 4, 5 et 7 ?", a: "1: Router (interne) · 2: Network (DR) · 3: Summary (ABR inter-aire) · 4: ASBR Summary (ABR) · 5: AS-External (ASBR) · 7: NSSA External (traduit en 5 par ABR)." },
  { cat: "OSPF", q: "Différence entre IAR, ABR et ASBR ?", a: "IAR = 1 seule aire (ne résume pas). ABR = relie Aire 0 à une autre aire (1 LSDB/aire, génère LSA 3). ASBR = redistribue des routes externes (LSA 5/7)." },
  { cat: "OSPF", q: "Qu'est-ce qu'un Virtual-Link OSPF ?", a: "Lien logique appartenant à l'aire 0 reliant un ABR isolé au backbone via une aire de transit NORMALE (jamais stub/NSSA)." },
  { cat: "OSPF", q: "Formule du coût OSPF par défaut chez Cisco ?", a: "Coût = 10⁸ / Bande passante (bit/s), min = 1 (donc FastEthernet 100M et Gigabit 1G valent tous les deux 1 sans changement de référence)." },
  { cat: "OSPF", q: "Ordre de préférence strict des routes OSPF ?", a: "O (intra-aire) > O IA (inter-aires) > O E1 (externe cumulé) > O E2 (externe fixe)." },
  { cat: "OSPF", q: "Comment est élu le Router-ID OSPF ?", a: "1) Commande 'router-id', sinon 2) plus haute IP Loopback active, sinon 3) plus haute IP physique active. Fixé au démarrage du processus." },
  { cat: "OSPF", q: "Règles d'élection DR / BDR et formule d'adjacences ?", a: "Plus haute Priority (0–255, 0 = exclu), puis plus grand Router-ID. NON PRÉEMPTIVE (clear ip ospf process). Sans DR : n(n-1)/2 adjacences." },
  { cat: "OSPF", q: "Citer les 4 types de réseaux OSPF du cours.", a: "Point-to-point, Broadcast multiaccess (DR/BDR), Point-to-multipoint, NBMA (DR/BDR)." },
  { cat: "OSPF", q: "Les 3 types d'authentification OSPF ?", a: "Type 0 : Aucune · Type 1 : Mot de passe en clair · Type 2 : MD5 (hash 16 o. + Key ID + Crypto Seq Number anti-rejeu, ne chiffre pas)." },
  { cat: "OSPF", q: "Différence Stub vs Totally Stub ?", a: "Stub (area X stub partout) bloque LSA 4/5 + injecte O*IA 0.0.0.0/0. Totally Stub (no-summary sur ABR seul) bloque en plus les LSA 3 détaillées." },
  { cat: "OSPF", q: "Différence NSSA vs Totally NSSA ?", a: "NSSA = Stub autorisant un ASBR interne (LSA 7 → traduites en 5 par l'ABR). Totally NSSA (no-summary sur ABR) bloque en plus les LSA 3 détaillées + défaut auto O*IA." },
  { cat: "OSPF", q: "Que fait 'passive-interface g0/1' dans OSPF ?", a: "Annonce le réseau de g0/1 dans OSPF tout en bloquant l'envoi de paquets Hello vers un LAN qui ne contient que des PC." },
  { cat: "OSPF", q: "Comment calculer un masque wildcard OSPF ?", a: "255.255.255.255 − masque normal. Ex : /24 → 0.0.0.255 ; /30 → 0.0.0.3 ; /32 → 0.0.0.0." },
  { cat: "BGP", q: "RFC, type et transport de BGP-4 ?", a: "RFC 4271 (1994), protocole à vecteur de chemins (Path-Vector) pour routage politique, transport TCP port 179." },
  { cat: "BGP", q: "Extensions MP-BGP et IPv6 ?", a: "RFC 2545 (IPv6) et RFC 2858 (MP-BGP : multi-protocole, notamment VPN MPLS)." },
  { cat: "BGP", q: "Différences eBGP vs iBGP (AD, TTL, AS_PATH, NEXT_HOP) ?", a: "eBGP : AS≠, AD 20, TTL=1, ajoute son AS à gauche, change NEXT_HOP. iBGP : même AS, AD 200, TTL=255, ne change ni AS_PATH ni NEXT_HOP, non transitif." },
  { cat: "BGP", q: "Citer les 6 états d'une session BGP.", a: "Idle → Connect → Active → OpenSent → OpenConfirm → Established." },
  { cat: "BGP", q: "Citer les 5 types de messages BGP.", a: "1) OPEN · 2) UPDATE · 3) NOTIFICATION · 4) KEEPALIVE · 5) ROUTE-REFRESH." },
  { cat: "BGP", q: "Format de l'en-tête BGP (19 octets) ?", a: "Marqueur (16 octets à FF) + Longueur (2 octets) + Type (1 octet)." },
  { cat: "BGP", q: "Timers BGP : cours vs Cisco IOS ?", a: "Cours (diapo 57) : Keepalive 30 s / Hold 90 s. Cisco IOS par défaut : Keepalive 60 s / Hold 180 s." },
  { cat: "BGP", q: "Les 4 catégories d'attributs BGP + 1 exemple chacune ?", a: "WM (AS_PATH, NEXT_HOP, ORIGIN) · WD (LOCAL_PREF, ATOMIC_AGGREGATE) · OT (COMMUNITY, AGGREGATOR) · ON (MED, CLUSTER_ID, ORIGINATOR_ID)." },
  { cat: "BGP", q: "Les 10 critères du choix de meilleur chemin BGP (dans l'ordre) ?", a: "0. Next-Hop joignable → 1. Weight (max) → 2. Local_Pref (max) → 3. Local → 4. AS_PATH (min) → 5. Origin (i<e<?) → 6. MED (min) → 7. eBGP>iBGP → 8. IGP Cost (min) → 9. Plus ancienne → 10. Router-ID (min)." },
  { cat: "BGP", q: "Comment AS_PATH empêche-t-il les boucles ?", a: "En eBGP, chaque AS préfixe son ASN à gauche. Si un routeur reçoit un UPDATE contenant déjà son propre ASN dans l'AS_PATH, il le rejette." },
  { cat: "BGP", q: "Weight vs Local_Pref vs MED ?", a: "Weight (Cisco, local routeur, max) · Local_Pref (tout l'AS via iBGP, défaut 100, max, choisit la SORTIE) · MED (AS voisin, défaut 0, min, choisit l'ENTRÉE)." },
  { cat: "BGP", q: "Les 3 formats de Communities BGP ?", a: "Standard (32 bits x:y, RFC 1997), Extended (8 octets, RFC 4360), Large (12 octets AS:func:param, RFC 8092, AS 32 bits)." },
  { cat: "BGP", q: "Pourquoi iBGP nécessite-t-il un full-mesh n(n-1)/2 ?", a: "Règle anti-boucle : un routeur iBGP ne réannonce JAMAIS à un voisin iBGP une route apprise d'un autre voisin iBGP. Solutions : Route Reflector (RFC 4456) ou Confédération (RFC 5065)." },
  { cat: "BGP", q: "À quoi sert 'neighbor <IP> next-hop-self' ?", a: "Sur un routeur de bordure vers son pair iBGP : remplace le NEXT_HOP externe (inconnu en interne) par sa propre IP." },
  { cat: "BGP", q: "Que signifient *, >, i (gauche), i (droite) et ? dans 'show ip bgp' ?", a: "* = valide · > = meilleur chemin · i gauche = appris en iBGP · i droite = ORIGIN IGP (network) · ? droite = ORIGIN Incomplete (redistribute)." },
  { cat: "BGP", q: "Pourquoi BGP ne découvre-t-il pas ses voisins automatiquement ?", a: "BGP repose sur TCP unicast port 179 entre paires déclarées explicitement (neighbor ... remote-as ...) pour le contrôle administratif/politique." },
  { cat: "Redistrib", q: "Pourquoi mettre 'subnets' dans 'redistribute bgp 400 subnets' ?", a: "Sans 'subnets', OSPF ignore tous les sous-réseaux non-classful (/24 en 172.16.x, /30 en 10.x) et ne redistribue que les réseaux classful." },
  { cat: "Redistrib", q: "Métrique E2 par défaut pour BGP→OSPF vs Static→OSPF ?", a: "BGP → OSPF : métrique E2 = 1 (avec Tag = ASN d'origine). Static / Connected → OSPF : métrique E2 = 20." },
  { cat: "Redistrib", q: "Que fait 'default-information originate always' dans OSPF ?", a: "Injecte une unique route par défaut O*E2 0.0.0.0/0 [110/1] dans OSPF même si l'ASBR n'a pas de route par défaut locale (évite d'injecter tout Internet)." },
  { cat: "Redistrib", q: "Pourquoi 'match internal external 1 external 2' dans TD3 ?", a: "Par défaut 'redistribute ospf 1' dans BGP n'exporte pas les routes O E2. En AS de transit OSPF sans iBGP, ce mot-clé est indispensable pour réannoncer l'autre AS." },
  { cat: "Dépannage", q: "Distances Administratives : C, S, eBGP, OSPF, RIP, iBGP ?", a: "Connecté = 0 · Statique = 1 · eBGP = 20 · OSPF = 110 · RIP = 120 · iBGP = 200." },
  { cat: "Dépannage", q: "Que vérifie 'show ip ospf neighbor' vs 'show ip bgp summary' ?", a: "OSPF : voisins en état FULL (ou 2WAY/DROTHER), DR/BDR, Dead Time. BGP : State/PfxRcd = un entier (0, 1, 2...) signifie Established." },
  { cat: "Dépannage", q: "Un lien est 'administratively down/down' : quelle commande ?", a: "Entrer sur l'interface et taper 'no shutdown' !" },
  { cat: "Dépannage", q: "Pourquoi un ping routeur → routeur peut marcher alors que PC → PC échoue ?", a: "Le routeur utilise son IP de transit comme source (connue du voisin), alors que le PC utilise le LAN : souvent la passerelle PC ou la route RETOUR vers le LAN manque !" }
];

window.SAE33.EXERCISES = [
  {
    title: "Exercice 1 — Sous-réseau /30 et Wildcard OSPF (type DSTP)",
    prompt: "On vous donne l'adresse d'interface 10.0.0.13/30 (lien R2–R3 du TD2). Déterminez l'adresse réseau, la seconde IP utilisable, l'adresse de broadcast, le masque normal et le masque wildcard OSPF, puis écrivez la commande network en aire 0.",
    solution: `<ul>
      <li><strong>Masque normal /30 :</strong> <code>255.255.255.252</code> (pas de 4 dans le dernier octet : .0, .4, .8, <strong>.12</strong>, .16).</li>
      <li><strong>Adresse réseau :</strong> <code>10.0.0.12</code> · <strong>Hôtes utilisables :</strong> <code>10.0.0.13</code> et <code>10.0.0.14</code> · <strong>Broadcast :</strong> <code>10.0.0.15</code>.</li>
      <li><strong>Masque Wildcard OSPF :</strong> <code>255.255.255.255 − 255.255.255.252 = 0.0.0.3</code>.</li>
      <li><strong>Commande OSPF :</strong> <code>network 10.0.0.12 0.0.0.3 area 0</code></li>
    </ul>`
  },
  {
    title: "Exercice 2 — Calcul de coût OSPF et choix de chemin",
    prompt: "Router0 peut joindre le LAN 192.168.3.0/24 (coût 1) soit directement via un lien de coût 250, soit via Router1 par deux liens successifs de coût 100 chacun. Quel chemin choisit OSPF et quel est le coût affiché dans show ip route ?",
    solution: `<p>OSPF choisit le chemin au <strong>coût cumulé le plus faible</strong> (et non le moins de sauts) :</p>
    <ul>
      <li>Chemin direct : <code>250 + 1 = 251</code></li>
      <li>Chemin via Router1 : <code>100 + 100 + 1 = 201</code> → <strong>ÉLU !</strong></li>
    </ul>
    <p>Table de routage : <code>O 192.168.3.0/24 [110/201] via &lt;IP_Router1&gt;</code>.</p>`
  },
  {
    title: "Exercice 3 — Élection DR / BDR et non-préemption",
    prompt: "Sur un switch Aire 0, R0 (ID 1.1.1.1, pri 1), R1 (ID 2.2.2.2, pri 1), R3 (ID 10.0.0.3, pri 1) et R4 (ID 192.168.41.254, pri 1) démarrent ensemble. 1) Qui est DR ? Qui est BDR ? 2) On ajoute ensuite R5 (ID 200.0.0.1, pri 255). Que se passe-t-il ? 3) Comment forcer R5 à devenir DR ?",
    solution: `<ol>
      <li>À priorité égale (1), le plus grand Router-ID gagne : <strong>DR = R4 (192.168.41.254)</strong>, <strong>BDR = R3 (10.0.0.3)</strong>, R0 et R1 sont <code>DROTHER</code>.</li>
      <li><strong>Rien ne change !</strong> L'élection DR/BDR est <strong>non préemptive</strong> : R5 devient <code>DROTHER</code> tant que le DR/BDR actuels sont vivants.</li>
      <li>Exécuter <code>clear ip ospf process</code> sur R4 et R3 (ou redémarrer OSPF sur le segment) pour déclencher une nouvelle élection où R5 (pri 255) sera élu DR.</li>
    </ol>`
  },
  {
    title: "Exercice 4 — Passage d'une aire en Stub puis Totally Stub (TP3 / TD2)",
    prompt: "L'aire 40 contient l'ABR Router5 et le routeur interne Router8. Router8 reçoit actuellement 5 routes O IA et 2 routes O E2 (venant de BGP). 1) Donnez les commandes exactes pour passer l'aire 40 en Totally Stub. 2) Décrivez les changements dans show ip route et show ip ospf database sur Router8.",
    solution: `<p><strong>1) Commandes IOS :</strong></p>
    <pre style="background:#0d1322;color:#e2e8f0;padding:0.75rem;border-radius:8px;overflow:auto;">! Sur Router5 (ABR uniquement pour no-summary) :
router ospf 1
 area 40 stub no-summary

! Sur Router8 (routeur interne) :
router ospf 1
 area 40 stub</pre>
    <p><strong>2) Changements observés sur Router8 :</strong></p>
    <ul>
      <li><strong>Table de routage :</strong> toutes les routes <code>O E2</code> et toutes les routes <code>O IA</code> détaillées disparaissent ; une unique route par défaut <code>O*IA 0.0.0.0/0 [110/2] via 10.40.0.1</code> apparaît.</li>
      <li><strong>LSDB :</strong> plus aucune LSA 4/5 ni LSA 3 détaillée ; il ne reste que les LSA 1 et 2 de l'aire 40 + une seule LSA 3 (<code>Link ID 0.0.0.0</code>). Le bit E des Hello passe à 0.</li>
    </ul>`
  },
  {
    title: "Exercice 5 — Départage complet du meilleur chemin BGP (type DS)",
    prompt: "Un routeur Cisco de l'AS500 reçoit deux annonces pour 198.51.100.0/24 avec Next-Hop accessible :\n• Route 1 (eBGP) : Weight=0, LocPrf=100, AS_PATH=(200 100), Origin=?, MED=10\n• Route 2 (iBGP) : Weight=0, LocPrf=100, AS_PATH=(300 100), Origin=i, MED=50\nLaquelle est choisie et à quelle étape exacte ?",
    solution: `<p>Déroulons les critères BGP dans l'ordre exact :</p>
    <ol>
      <li><strong>Weight :</strong> 0 vs 0 (égalité)</li>
      <li><strong>LOCAL_PREF :</strong> 100 vs 100 (égalité)</li>
      <li><strong>Self-originated :</strong> aucune n'est locale (égalité)</li>
      <li><strong>AS_PATH :</strong> 2 AS (<code>200 100</code>) vs 2 AS (<code>300 100</code>) (égalité de longueur !)</li>
      <li><strong>ORIGIN :</strong> <code>?</code> (Incomplete) vs <code>i</code> (IGP) → <strong>Route 2 GAGNE à l'étape 5</strong> car <code>i &lt; e &lt; ?</code> ! (On n'arrive même pas au MED ni à eBGP > iBGP !)</li>
    </ol>`
  },
  {
    title: "Exercice 6 — Diagnostic de panne BGP : Established mais Ping KO",
    prompt: "Entre AS100 (R1, LAN 192.168.1.0/24) et AS200 (R2, LAN 192.168.2.0/24), 'show ip bgp summary' indique Established avec PfxRcd = 1 sur R1 mais PfxRcd = 0 sur R2. Le ping PC1 → PC2 échoue. Expliquez la cause et donnez le correctif.",
    solution: `<p><strong>Diagnostic :</strong></p>
    <ul>
      <li>R1 a reçu 1 préfixe (<code>192.168.2.0/24</code> de R2) → le trajet aller part bien vers R2.</li>
      <li>R2 affiche <strong>PfxRcd = 0</strong> → R1 n'a <strong>pas annoncé</strong> son LAN <code>192.168.1.0/24</code> dans BGP (ou a fait une faute de masque dans <code>network ... mask ...</code>). Donc R2 n'a pas de <strong>route retour</strong> vers PC1 !</li>
    </ul>
    <p><strong>Correctif sur R1 :</strong> <code>router bgp 100</code> → <code>network 192.168.1.0 mask 255.255.255.0</code> (après avoir vérifié que 192.168.1.0/24 est bien en <code>C</code> dans <code>show ip route</code>).</p>`
  },
  {
    title: "Exercice 7 — Redistribution statique dans OSPF (TP1 Partie 6)",
    prompt: "La zone verte (R5 derrière 10.0.40.1, portant le LAN 192.168.40.0/24) est passée en routage statique. R4 (10.0.40.2) est connecté à l'Aire 0. Donnez les commandes sur R5 et R4, puis indiquez ce que voit R4 vs R3 (Aire 50) dans show ip route.",
    solution: `<pre style="background:#0d1322;color:#e2e8f0;padding:0.75rem;border-radius:8px;overflow:auto;">! Sur R5 (statique pur) :
no router ospf 100
ip route 0.0.0.0 0.0.0.0 10.0.40.2

! Sur R4 (devient ASBR) :
ip route 192.168.40.0 255.255.255.0 10.0.40.1
router ospf 100
 redistribute static subnets</pre>
    <ul>
      <li><strong>Sur R4 :</strong> <code>S 192.168.40.0/24 [1/0] via 10.0.40.1</code> (route statique locale AD 1).</li>
      <li><strong>Sur R3 (Aire 50) :</strong> <code>O E2 192.168.40.0/24 [110/20] via 10.0.0.4</code> (LSA Type 5, coût externe E2 fixe = 20).</li>
    </ul>`
  },
  {
    title: "Exercice 8 — Calcul TTL et nombre de routeurs traversés",
    prompt: "Dans le TP2 (Linux, TTL initial = 64), un ping de PC AS300 vers PC AS200 répond avec TTL = 60. Dans le TD2 (Packet Tracer Windows, TTL initial = 128), un ping de PC0 (AS50) vers PC5 (AS400 Aire 50) répond avec TTL = 123. Combien de routeurs et de switches sont traversés ? Un switch décrémente-t-il le TTL ?",
    solution: `<ul>
      <li><strong>TP2 :</strong> <code>64 − 60 = 4 routeurs</code> traversés (R_g300, R_d300, R_d200, R_g200).</li>
      <li><strong>TD2 :</strong> <code>128 − 123 = 5 routeurs</code> traversés (Router0, Router9, Router5, Router6, Router7).</li>
      <li><strong>Règle couche 2 :</strong> un <strong>switch ne décrémente JAMAIS le TTL IP</strong> car il commute les trames au niveau Ethernet (couche 2) sans traiter l'en-tête IP (couche 3).</li>
    </ul>`
  }
];
