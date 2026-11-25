/* ==========================================================================
   data-labs.js — Les 8 TP & TD complets avec topologies SVG, plans d'adressage,
   configs IOS prêtes à copier, sorties show commentées et points clés examen.
   ========================================================================== */
window.SAE33 = window.SAE33 || {};

window.SAE33.LABS = [
  {
    id: "tp1",
    tabLabel: "TP1 · OSPF",
    badge: "TP1 · AS100",
    title: "TP1 — Routage OSPF Multi-Aires, MD5, DR/BDR & Redistribution Statique",
    summary: "Topologie de 3 groupes (Aire 50, Aire 0, Aire 40) dans AS100 avec coût de lien fixé à 100, authentification MD5, regroupement sur switch commun Aire 0 (élection DR/BDR), puis passage de la zone verte en routage statique redistribué.",
    svg: `<svg viewBox="0 0 760 220" role="img" aria-label="Topologie TP1 OSPF : Aire 50, Aire 0 sur switch commun, et Aire 40 passant en statique">
      <g font-family="system-ui, sans-serif" fill="currentColor" text-anchor="middle">
        <rect x="12" y="20" width="215" height="175" rx="12" fill="#0284c7" fill-opacity="0.1" stroke="#0284c7" stroke-width="2" stroke-dasharray="5 3"/>
        <text x="119" y="40" font-weight="800" font-size="12" fill="#0284c7">Groupe 1 · Aire 50</text>
        <rect x="242" y="20" width="275" height="175" rx="12" fill="#2563eb" fill-opacity="0.12" stroke="#2563eb" stroke-width="2.5"/>
        <text x="380" y="40" font-weight="800" font-size="12" fill="#2563eb">Groupe 2 · Aire 0 (Switch 10.0.0.0/24)</text>
        <rect x="532" y="20" width="215" height="175" rx="12" fill="#059669" fill-opacity="0.1" stroke="#059669" stroke-width="2" stroke-dasharray="5 3"/>
        <text x="640" y="40" font-weight="800" font-size="12" fill="#059669">Groupe 3 · Aire 40 → Statique</text>

        <line x1="62" y1="115" x2="180" y2="115" stroke="currentColor" stroke-width="2.2"/>
        <line x1="180" y1="115" x2="380" y2="115" stroke="currentColor" stroke-width="2.2"/>
        <line x1="380" y1="115" x2="575" y2="115" stroke="currentColor" stroke-width="2.2"/>
        <line x1="575" y1="115" x2="695" y2="115" stroke="currentColor" stroke-width="2.2"/>
        <line x1="330" y1="75" x2="380" y2="115" stroke="currentColor" stroke-width="2"/>
        <line x1="430" y1="75" x2="380" y2="115" stroke="currentColor" stroke-width="2"/>

        <rect x="338" y="99" width="84" height="32" rx="6" fill="#2563eb" stroke="#fff" stroke-width="1.5"/>
        <text x="380" y="119" fill="#fff" font-weight="800" font-size="11">Switch A0</text>

        <circle cx="62" cy="115" r="22" fill="#1e293b" stroke="#0284c7" stroke-width="2"/>
        <text x="62" y="119" fill="#fff" font-weight="700" font-size="11">R_g1</text>
        <text x="62" y="152" font-size="10">192.168.50.0/24</text>

        <circle cx="180" cy="115" r="24" fill="#1e293b" stroke="#2563eb" stroke-width="2.5"/>
        <text x="180" y="119" fill="#fff" font-weight="800" font-size="11">R3 ABR</text>
        <text x="180" y="152" font-size="10">10.0.0.3</text>

        <circle cx="330" cy="75" r="18" fill="#1e293b" stroke="#2563eb" stroke-width="2"/>
        <text x="330" y="79" fill="#fff" font-weight="700" font-size="10">R0</text>
        <circle cx="430" cy="75" r="18" fill="#1e293b" stroke="#2563eb" stroke-width="2"/>
        <text x="430" y="79" fill="#fff" font-weight="700" font-size="10">R1</text>

        <circle cx="575" cy="115" r="24" fill="#1e293b" stroke="#059669" stroke-width="2.5"/>
        <text x="575" y="114" fill="#fff" font-weight="800" font-size="10.5">R4</text>
        <text x="575" y="126" fill="#34d399" font-size="8.5">ABR/ASBR</text>
        <text x="575" y="152" font-size="10">10.0.0.4</text>

        <circle cx="695" cy="115" r="22" fill="#1e293b" stroke="#059669" stroke-width="2"/>
        <text x="695" y="119" fill="#fff" font-weight="700" font-size="11">R5</text>
        <text x="695" y="152" font-size="10">192.168.40.0/24</text>
        <text x="635" y="102" font-size="10" font-family="monospace">10.0.40.0/24</text>
        <text x="120" y="102" font-size="10" font-family="monospace">10.0.50.0/24</text>
      </g>
    </svg>`,
    addressing: [
      { eq: "Groupe 1 (Aire 50)", intf: "LAN g. / Transit / LAN d.", ip: "192.168.50.0/24 · 10.0.50.0/24 · 192.168.51.0/24", role: "R3 relié au switch en 10.0.0.3" },
      { eq: "Groupe 2 (Aire 0)", intf: "LAN g. / Switch / LAN d.", ip: "192.168.0.0/24 · 10.0.0.0/24 · 192.168.1.0/24", role: "Backbone (R0=.1, R1=.2)" },
      { eq: "Groupe 3 — R1 (R5)", intf: "Gi0/0/1 (LAN) · Gi0/0/0 (lien)", ip: "192.168.40.1/24 · 10.0.40.1/24", role: "IAR Aire 40, puis statique" },
      { eq: "Groupe 3 — R2 (R4)", intf: "Gi0/0/0 (lien) · Gi0/0/1 (switch)", ip: "10.0.40.2/24 · 10.0.0.4/24", role: "ABR (Aires 0/40) puis ASBR" }
    ],
    configs: [
      {
        title: "Étape 1–3 : OSPF Aire 40 (Coût 100) + Authentification MD5 sur R1 & R2",
        code: `! === Routeur 1 (gauche, Aire 40) ===
interface GigabitEthernet0/0/1
 ip address 192.168.40.1 255.255.255.0
 ip ospf cost 100
 no shutdown
interface GigabitEthernet0/0/0
 ip address 10.0.40.1 255.255.255.0
 ip ospf cost 100
 ip ospf authentication message-digest
 ip ospf message-digest-key 1 md5 SecretRT40
 no shutdown
router ospf 100
 network 10.0.40.0 0.0.0.255 area 40
 network 192.168.40.0 0.0.0.255 area 40
 passive-interface GigabitEthernet0/0/1

! === PC0 (Linux) ===
sudo ip a add 192.168.40.2/24 dev enp2s0
sudo ip r add default via 192.168.40.1`
      },
      {
        title: "Étape 4–6 : Raccordement Aire 0 (ABR), puis Redistribution Statique (ASBR)",
        code: `! === Étape 4 : R2 (R4) devient ABR (seul 10.0.0.0 passe en area 0 !) ===
interface GigabitEthernet0/0/1
 ip address 10.0.0.4 255.255.255.0
 ip ospf cost 100
 ip ospf authentication message-digest
 ip ospf message-digest-key 1 md5 ospf123
 no shutdown
router ospf 100
 network 10.0.0.0 0.0.0.255 area 0
 ! ATTENTION : laisser 10.0.40.0 en area 40, sinon le voisinage avec R1 tombe !

! === Étape 6 : Zone verte en statique + Redistribution sur R4 ===
! Sur R1 (R5, intérieur) :
no router ospf 100
ip route 0.0.0.0 0.0.0.0 10.0.40.2

! Sur R2 (R4, bordure Aire 0 → devient ASBR) :
ip route 192.168.40.0 255.255.255.0 10.0.40.1
router ospf 100
 no network 10.0.40.0 0.0.0.255 area 40
 redistribute static subnets`
      }
    ],
    outputs: `R4# show ip route
C    10.0.0.0/24 is directly connected, GigabitEthernet0/0/1
O    192.168.0.0/24 [110/200] via 10.0.0.1     ! Intra-aire 0 (coût 100+100)
O IA 192.168.50.0/24 [110/300] via 10.0.0.3    ! Inter-aire (Aire 50 via ABR R3)
S    192.168.40.0/24 [1/0] via 10.0.40.1       ! Statique locale (AD 1)

! Attendu sur R3 (bordure Aire 50) après redistribute static subnets :
O E2 192.168.40.0/24 [110/20] via 10.0.0.4     ! Route externe E2, coût fixe = 20`,
    takeaways: [
      "Wireshark : Hello vers 224.0.0.5 toutes les 10 s (proto IP 89). Auth Type = 2 (Cryptographic), Key ID = 1, Auth Data Length = 16 (hash MD5), Crypto Sequence Number anti-rejeu.",
      "Sur le switch commun Aire 0 (4 routeurs), élection d'un DR et d'un BDR (Priority puis Router-ID, non préemptif). Mises à jour vers 224.0.0.6.",
      "Sur R4 (ASBR), la route statique reste 'S' (AD 1), tandis que R3 la reçoit en 'O E2 [110/20]' (LSA Type 5)."
    ]
  },
  {
    id: "tp2",
    tabLabel: "TP2 · BGP",
    badge: "TP2 · AS100/200/300",
    title: "TP2 — Routage iBGP puis eBGP sur Switch Commun (IXP)",
    summary: "Chaque groupe configure d'abord un AS en iBGP (2 routeurs + capture EPC/WebUI + question Loopback), puis les 3 AS (100, 200, 300) s'interconnectent sur un switch commun en eBGP avec next-hop-self.",
    svg: `<svg viewBox="0 0 760 210" role="img" aria-label="Topologie TP2 BGP : AS100, AS200 et AS300 reliés par un switch commun IXP">
      <g font-family="system-ui, sans-serif" fill="currentColor" text-anchor="middle">
        <rect x="20" y="16" width="210" height="80" rx="10" fill="#2563eb" fill-opacity="0.12" stroke="#2563eb" stroke-width="2"/>
        <text x="125" y="34" font-weight="800" font-size="11.5" fill="#2563eb">AS 100 (10.0.100.0/24)</text>
        <text x="125" y="84" font-size="10">iBGP · 192.168.100.0/24</text>

        <rect x="275" y="16" width="210" height="80" rx="10" fill="#7c3aed" fill-opacity="0.12" stroke="#7c3aed" stroke-width="2"/>
        <text x="380" y="34" font-weight="800" font-size="11.5" fill="#7c3aed">AS 200 (10.0.200.0/24)</text>
        <text x="380" y="84" font-size="10">iBGP · 192.168.200.0/24</text>

        <rect x="530" y="16" width="210" height="80" rx="10" fill="#059669" fill-opacity="0.12" stroke="#059669" stroke-width="2"/>
        <text x="635" y="34" font-weight="800" font-size="11.5" fill="#059669">AS 300 (10.0.30.0/24)</text>
        <text x="635" y="84" font-size="10">iBGP · 192.168.30.0/24</text>

        <line x1="160" y1="62" x2="340" y2="152" stroke="currentColor" stroke-width="2.2"/>
        <line x1="380" y1="62" x2="380" y2="152" stroke="currentColor" stroke-width="2.2"/>
        <line x1="600" y1="62" x2="420" y2="152" stroke="currentColor" stroke-width="2.2"/>

        <circle cx="80" cy="60" r="17" fill="#1e293b" stroke="#2563eb" stroke-width="2"/>
        <text x="80" y="64" fill="#fff" font-size="10" font-weight="700">R_g</text>
        <line x1="97" y1="60" x2="143" y2="60" stroke="#2563eb" stroke-width="2" stroke-dasharray="4 2"/>
        <circle cx="160" cy="60" r="17" fill="#1e293b" stroke="#2563eb" stroke-width="2.5"/>
        <text x="160" y="64" fill="#fff" font-size="10" font-weight="700">.1</text>

        <circle cx="335" cy="60" r="17" fill="#1e293b" stroke="#7c3aed" stroke-width="2"/>
        <text x="335" y="64" fill="#fff" font-size="10" font-weight="700">R_g</text>
        <line x1="352" y1="60" x2="398" y2="60" stroke="#7c3aed" stroke-width="2" stroke-dasharray="4 2"/>
        <circle cx="415" cy="60" r="17" fill="#1e293b" stroke="#7c3aed" stroke-width="2.5"/>
        <text x="415" y="64" fill="#fff" font-size="10" font-weight="700">.2</text>

        <circle cx="595" cy="60" r="17" fill="#1e293b" stroke="#059669" stroke-width="2.5"/>
        <text x="595" y="64" fill="#fff" font-size="10" font-weight="700">.3</text>
        <line x1="612" y1="60" x2="658" y2="60" stroke="#059669" stroke-width="2" stroke-dasharray="4 2"/>
        <circle cx="675" cy="60" r="17" fill="#1e293b" stroke="#059669" stroke-width="2"/>
        <text x="675" y="64" fill="#fff" font-size="10" font-weight="700">R_g</text>

        <rect x="275" y="150" width="210" height="40" rx="8" fill="#d97706" fill-opacity="0.18" stroke="#d97706" stroke-width="2"/>
        <text x="380" y="168" font-weight="800" font-size="12" fill="#d97706">Switch Commun (IXP · eBGP)</text>
        <text x="380" y="183" font-size="10.5" font-family="monospace">10.0.0.0/24 (.1 · .2 · .3)</text>
      </g>
    </svg>`,
    addressing: [
      { eq: "AS 100 (Gr. 1)", intf: "LANs / Transit / Switch", ip: "192.168.100.0/24 · 10.0.100.0/24 · 10.0.0.1/24", role: "eBGP vers AS200 & AS300" },
      { eq: "AS 200 (Gr. 2)", intf: "LANs / Transit / Switch", ip: "192.168.200.0/24 · 10.0.200.0/24 · 10.0.0.2/24", role: "eBGP vers AS100 & AS300" },
      { eq: "AS 300 (Gr. 3)", intf: "R_g : 10.0.30.1 · R_d : 10.0.30.2", ip: "LAN 192.168.30.0/24 · Switch 10.0.0.3/24", role: "iBGP interne + eBGP + next-hop-self" }
    ],
    configs: [
      {
        title: "Partie 2 : iBGP dans AS300 + Capture EPC sur vrai routeur IOS XE",
        code: `! === Routeur gauche (AS 300) ===
router bgp 300
 neighbor 10.0.30.2 remote-as 300
 network 192.168.30.0 mask 255.255.255.0

! === Routeur droit (AS 300) ===
router bgp 300
 neighbor 10.0.30.1 remote-as 300
 network 192.168.31.0 mask 255.255.255.0

! === Capture EPC (Embedded Packet Capture) sur lien inter-routeurs ===
monitor capture CAP interface GigabitEthernet0/0/0 both
monitor capture CAP match any
monitor capture CAP start
! ... attendre établissement BGP ...
monitor capture CAP stop
show monitor capture CAP buffer brief
monitor capture CAP export flash:cap.pcap`
      },
      {
        title: "Partie 3 : Interconnexion eBGP sur switch commun (Routeur de bordure AS300)",
        code: `interface GigabitEthernet0/0/1
 ip address 10.0.0.3 255.255.255.0
 no shutdown
router bgp 300
 no network 192.168.31.0 mask 255.255.255.0
 neighbor 10.0.0.1 remote-as 100
 neighbor 10.0.0.2 remote-as 200
 neighbor 10.0.30.1 next-hop-self`
      }
    ],
    outputs: `R_bordure_AS300# show ip route
B 192.168.200.0/24 [20/0] via 10.0.0.2     ! Appris en eBGP (AD 20) depuis AS200
B 192.168.30.0/24  [200/0] via 10.0.30.1   ! Appris en iBGP (AD 200) depuis R_gauche

R_droit# show ip bgp
*>i 192.168.30.0/24   10.0.30.1        100     0 i      ! i = iBGP, LocPrf 100
*>  192.168.31.0/24   0.0.0.0            0 32768 i      ! Route locale (Weight 32768)

! Ping PC AS300 -> PC AS200 : TTL = 60 (64 - 4 routeurs traversés)`,
    takeaways: [
      "Loopback dans BGP : interface virtuelle toujours up/up pour stabiliser les sessions iBGP (update-source Loopback0) quand il y a plusieurs chemins physiques. Pas nécessaire ici car 1 seul lien direct.",
      "next-hop-self est VITAL sur le routeur de bordure : sinon R_gauche reçoit Next-Hop = 10.0.0.2 (inconnu de lui) et ignore les routes d'AS200/AS100 !",
      "En iBGP la distance administrative vaut 200 (et AS_PATH reste vide) ; en eBGP elle vaut 20."
    ]
  },
  {
    id: "tp3",
    tabLabel: "TP3 · OSPF+BGP+NSSA",
    badge: "TP3 · Stub & NSSA",
    title: "TP3 — AS1 (OSPF Aires 0/10/20) + AS2 (eBGP) + Stub, Totally Stub, NSSA & Totally NSSA",
    summary: "Interconnexion d'AS1 (OSPF 3 aires sur switch commun) et AS2 (eBGP via R0 ASBR), puis transformation de l'Aire 10 en Stub → Totally Stub et de l'Aire 20 (avec ajout de R4) en NSSA → Totally NSSA.",
    svg: `<svg viewBox="0 0 760 220" role="img" aria-label="Topologie TP3 : AS1 avec Aire 10 Totally Stub, Aire 0 Switch, Aire 20 Totally NSSA, et AS2 via eBGP">
      <g font-family="system-ui, sans-serif" fill="currentColor" text-anchor="middle">
        <rect x="14" y="18" width="175" height="182" rx="12" fill="#0284c7" fill-opacity="0.1" stroke="#0284c7" stroke-width="2" stroke-dasharray="5 3"/>
        <text x="101" y="38" font-weight="800" font-size="11.5" fill="#0284c7">Aire 10 (Stub → T-Stub)</text>

        <rect x="205" y="18" width="205" height="182" rx="12" fill="#2563eb" fill-opacity="0.12" stroke="#2563eb" stroke-width="2.5"/>
        <text x="307" y="38" font-weight="800" font-size="11.5" fill="#2563eb">AS1 · Aire 0 (10.0.0.0/24)</text>

        <rect x="426" y="18" width="185" height="182" rx="12" fill="#059669" fill-opacity="0.1" stroke="#059669" stroke-width="2" stroke-dasharray="5 3"/>
        <text x="518" y="38" font-weight="800" font-size="11.5" fill="#059669">Aire 20 (NSSA → T-NSSA)</text>

        <rect x="625" y="65" width="122" height="125" rx="12" fill="#7c3aed" fill-opacity="0.12" stroke="#7c3aed" stroke-width="2"/>
        <text x="686" y="85" font-weight="800" font-size="11.5" fill="#7c3aed">AS 2 (eBGP)</text>

        <line x1="66" y1="100" x2="188" y2="100" stroke="currentColor" stroke-width="2.2"/>
        <line x1="188" y1="100" x2="307" y2="100" stroke="currentColor" stroke-width="2.2"/>
        <line x1="307" y1="100" x2="435" y2="100" stroke="currentColor" stroke-width="2.2"/>
        <line x1="435" y1="100" x2="555" y2="100" stroke="currentColor" stroke-width="2.2"/>
        <line x1="307" y1="115" x2="307" y2="162" stroke="currentColor" stroke-width="2.2"/>
        <line x1="330" y1="162" x2="660" y2="140" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="5 3"/>

        <rect x="270" y="84" width="74" height="30" rx="6" fill="#2563eb"/>
        <text x="307" y="103" fill="#fff" font-weight="800" font-size="11">Switch</text>

        <circle cx="66" cy="100" r="20" fill="#1e293b" stroke="#0284c7" stroke-width="2"/>
        <text x="66" y="104" fill="#fff" font-weight="700" font-size="11">R4</text>
        <text x="66" y="136" font-size="10">192.168.10.0/24</text>

        <circle cx="188" cy="100" r="22" fill="#1e293b" stroke="#2563eb" stroke-width="2.5"/>
        <text x="188" y="104" fill="#fff" font-weight="800" font-size="10.5">R1 ABR</text>
        <text x="188" y="136" font-size="10">.1</text>

        <circle cx="307" cy="162" r="22" fill="#1e293b" stroke="#7c3aed" stroke-width="2.5"/>
        <text x="307" y="166" fill="#fff" font-weight="800" font-size="10">R0 ASBR</text>

        <circle cx="435" cy="100" r="22" fill="#1e293b" stroke="#059669" stroke-width="2.5"/>
        <text x="435" y="104" fill="#fff" font-weight="800" font-size="10.5">R3 ABR</text>
        <text x="495" y="88" font-size="9.5" font-family="monospace">10.20.0.0/30</text>

        <circle cx="555" cy="100" r="21" fill="#1e293b" stroke="#059669" stroke-width="2"/>
        <text x="555" y="104" fill="#fff" font-weight="700" font-size="10">R4 NSSA</text>
        <text x="555" y="136" font-size="10">192.168.20.0/24</text>

        <circle cx="686" cy="138" r="22" fill="#1e293b" stroke="#7c3aed" stroke-width="2.5"/>
        <text x="686" y="142" fill="#fff" font-weight="700" font-size="11">R2</text>
        <text x="686" y="176" font-size="10">192.168.2.0/24</text>
      </g>
    </svg>`,
    addressing: [
      { eq: "R0 (AS1 ASBR)", intf: "Switch · Lien eBGP", ip: "10.0.0.3/24 · 10.0.2.1/24", role: "OSPF Aire 0 + eBGP AS1↔AS2 + Redistribution" },
      { eq: "R2 (AS2)", intf: "Lien eBGP · LAN", ip: "10.0.2.2/24 · 192.168.2.1/24", role: "eBGP AS2 (PC 192.168.2.10)" },
      { eq: "R1 / R4 (Aire 10)", intf: "Switch .1 · Lien 10.0.1.0/24", ip: "LAN 192.168.10.0/24", role: "Aire 10 : Stub puis Totally Stub" },
      { eq: "R3 / R4 (Aire 20)", intf: "Switch .2 · Lien 10.20.0.0/30", ip: "LAN 192.168.20.0/24 (PC .2)", role: "Aire 20 : NSSA puis Totally NSSA" }
    ],
    configs: [
      {
        title: "Partie 3 : Aire 10 en Stub puis Totally Stub (R1 ABR + R4 interne)",
        code: `! === 3.1 Mode STUB (sur R1 ET R4 — bit E des Hello doit concorder) ===
router ospf 1
 area 10 stub

! === 3.2 Mode TOTALLY STUB (sur R1 ABR UNIQUEMENT ; R4 garde 'area 10 stub') ===
router ospf 1
 area 10 stub no-summary`
      },
      {
        title: "Partie 4 : Aire 20 en NSSA puis Totally NSSA (R3 ABR + R4 ASBR interne)",
        code: `! === R4 (ASBR interne Aire 20, redistribue le LAN 192.168.20.0/24 en LSA 7) ===
interface GigabitEthernet0/0/0
 ip address 10.20.0.2 255.255.255.252
 no shutdown
interface GigabitEthernet0/0/1
 ip address 192.168.20.1 255.255.255.0
 no shutdown
router ospf 1
 router-id 4.4.4.4
 area 20 nssa
 redistribute connected subnets
 network 10.20.0.0 0.0.0.3 area 20

! === R3 (ABR Aires 0 / 20 — NSSA puis Totally NSSA) ===
interface GigabitEthernet0/0/1
 ip address 10.20.0.1 255.255.255.252
 no shutdown
router ospf 1
 no network 192.168.20.1 0.0.0.0 area 20
 network 10.0.0.2 0.0.0.0 area 0
 network 10.20.0.0 0.0.0.3 area 20
 area 20 nssa no-summary    ! (pour NSSA simple : enlever no-summary)`
      }
    ],
    outputs: `R3# show ip route ospf          ! (R3 ABR après ajout de R4 en NSSA)
O N2 192.168.20.0/24 [110/20] via 10.20.0.2, Gi0/0/1   ! LSA Type 7 depuis R4 (N2)
O IA 192.168.10.0/24 [110/3]  via 10.0.0.1,  Gi0/0/0   ! Inter-aire (Aire 10)
O E2 192.168.2.0/24  [110/1]  via 10.0.0.3,  Gi0/0/0   ! Externe BGP via R0

R4# show ip route               ! (R4 en Totally NSSA)
O*IA 0.0.0.0/0 [110/2] via 10.20.0.1, Gi0/0/0          ! Seule route distante !
C    10.20.0.0/30 is directly connected, Gi0/0/0
C    192.168.20.0/24 is directly connected, Gi0/0/1`,
    takeaways: [
      "Stub : supprime O E2 (LSA 4/5), garde O IA (LSA 3) et ajoute O*IA 0.0.0.0/0.",
      "Totally Stub (no-summary sur ABR seul) : supprime AUSSI les O IA détaillées, ne garde que O*IA 0.0.0.0/0.",
      "NSSA : autorise R4 à injecter 192.168.20.0/24 en LSA 7 (O N2 sur R3), que R3 traduit automatiquement en LSA 5 (O E2) vers l'aire 0 et le reste de l'AS !",
      "Totally NSSA (area 20 nssa no-summary sur R3) : R4 n'a plus qu'une seule route O*IA 0.0.0.0/0 tout en continuant d'annoncer son LAN en LSA 7."
    ]
  },
  {
    id: "td2",
    tabLabel: "TD2 · Complet",
    badge: "TD2 · 7 Routeurs",
    title: "TD2 — Topologie Complète : AS400 (OSPF Aires 50/0/40) + AS50/AS40 (eBGP) + Totally Stub",
    summary: "Le cas d'école intégral de la SAE3.CYBER.03 : 7 routeurs 2911 (Router0, 1, 5, 6, 7, 8, 9), 1 switch, 5 PC. OSPF multi-aires dans AS400 (Router5 ABR central), eBGP entre AS50/AS40/AS400 sur 172.16.0.0/24 (Router9 ASBR), redistribution bidirectionnelle, puis Aire 40 en Totally Stub.",
    svg: `<svg viewBox="0 0 760 250" role="img" aria-label="Topologie finale TD2 : AS400 avec Aires 50, 0, 40 et AS50/AS40 en eBGP via Switch0">
      <g font-family="system-ui, sans-serif" fill="currentColor" text-anchor="middle">
        <!-- AS400 Areas -->
        <rect x="10" y="15" width="230" height="105" rx="10" fill="#0284c7" fill-opacity="0.1" stroke="#0284c7" stroke-width="2" stroke-dasharray="5 3"/>
        <text x="125" y="33" font-weight="800" font-size="11" fill="#0284c7">Aire 50 (R7–R6–R5)</text>

        <rect x="10" y="135" width="230" height="100" rx="10" fill="#d97706" fill-opacity="0.1" stroke="#d97706" stroke-width="2" stroke-dasharray="5 3"/>
        <text x="125" y="153" font-weight="800" font-size="11" fill="#d97706">Aire 40 (Totally Stub · R8)</text>

        <rect x="255" y="45" width="235" height="155" rx="10" fill="#2563eb" fill-opacity="0.12" stroke="#2563eb" stroke-width="2.5"/>
        <text x="372" y="65" font-weight="800" font-size="11.5" fill="#2563eb">AS400 · Aire 0 (Backbone)</text>

        <rect x="515" y="15" width="235" height="220" rx="10" fill="#7c3aed" fill-opacity="0.1" stroke="#7c3aed" stroke-width="2"/>
        <text x="632" y="34" font-weight="800" font-size="11.5" fill="#7c3aed">eBGP · Switch0 (172.16.0.0/24)</text>

        <!-- Links -->
        <line x1="65" y1="75" x2="175" y2="75" stroke="currentColor" stroke-width="2"/>
        <line x1="175" y1="75" x2="305" y2="120" stroke="currentColor" stroke-width="2"/>
        <line x1="175" y1="192" x2="305" y2="120" stroke="currentColor" stroke-width="2"/>
        <line x1="305" y1="120" x2="435" y2="120" stroke="currentColor" stroke-width="2.4"/>
        <line x1="435" y1="120" x2="565" y2="120" stroke="#7c3aed" stroke-width="2.4"/>
        <line x1="565" y1="120" x2="685" y2="75" stroke="#7c3aed" stroke-width="2"/>
        <line x1="565" y1="120" x2="685" y2="180" stroke="#7c3aed" stroke-width="2"/>

        <!-- Nodes -->
        <circle cx="65" cy="75" r="20" fill="#1e293b" stroke="#0284c7" stroke-width="2"/>
        <text x="65" y="79" fill="#fff" font-size="10.5" font-weight="700">R7</text>
        <text x="65" y="109" font-size="9.5">PC5 192.168.50.1</text>

        <circle cx="175" cy="75" r="20" fill="#1e293b" stroke="#0284c7" stroke-width="2"/>
        <text x="175" y="79" fill="#fff" font-size="10.5" font-weight="700">R6</text>

        <circle cx="175" cy="192" r="20" fill="#1e293b" stroke="#d97706" stroke-width="2"/>
        <text x="175" y="196" fill="#fff" font-size="10.5" font-weight="700">R8</text>
        <text x="80" y="196" font-size="9.5">PC4 192.168.40.1</text>

        <circle cx="305" cy="120" r="24" fill="#1e293b" stroke="#2563eb" stroke-width="3"/>
        <text x="305" y="119" fill="#fff" font-size="10.5" font-weight="800">R5</text>
        <text x="305" y="131" fill="#60a5fa" font-size="8.5">ABR</text>

        <circle cx="435" cy="120" r="24" fill="#1e293b" stroke="#7c3aed" stroke-width="3"/>
        <text x="435" y="119" fill="#fff" font-size="10.5" font-weight="800">R9</text>
        <text x="435" y="131" fill="#c4b5fd" font-size="8.5">ASBR</text>
        <text x="435" y="162" font-size="9.5">PC6 192.168.10.1</text>
        <text x="370" y="108" font-size="9.5" font-family="monospace">10.0.1.0/30</text>

        <rect x="532" y="105" width="66" height="30" rx="6" fill="#7c3aed"/>
        <text x="565" y="124" fill="#fff" font-size="10.5" font-weight="800">Sw0</text>

        <circle cx="685" cy="75" r="22" fill="#1e293b" stroke="#7c3aed" stroke-width="2.5"/>
        <text x="685" y="74" fill="#fff" font-size="10" font-weight="800">R0</text>
        <text x="685" y="85" fill="#c4b5fd" font-size="8.5">AS50</text>
        <text x="685" y="112" font-size="9.5">PC0 172.16.50.1</text>

        <circle cx="685" cy="180" r="22" fill="#1e293b" stroke="#7c3aed" stroke-width="2.5"/>
        <text x="685" y="179" fill="#fff" font-size="10" font-weight="800">R1</text>
        <text x="685" y="190" fill="#c4b5fd" font-size="8.5">AS40</text>
        <text x="685" y="216" font-size="9.5">PC1 172.16.40.1</text>
      </g>
    </svg>`,
    addressing: [
      { eq: "Router5 (ABR)", intf: "G0/0 (A50) · G0/1 (A0) · G0/2 (A40)", ip: "10.50.0.1/30 · 10.0.1.1/30 · 10.40.0.1/30", role: "Router-ID 5.5.5.5 · area 40 stub no-summary" },
      { eq: "Router6 / Router7", intf: "Aire 50", ip: "10.50.1.0/30 · LAN PC5 192.168.50.0/24", role: "IAR Aire 50 (ID 6.6.6.6 / 7.7.7.7)" },
      { eq: "Router8 (Aire 40)", intf: "G0/0 · G0/1 (LAN PC4)", ip: "10.40.0.2/30 · 192.168.40.254/24", role: "IAR Totally Stub (area 40 stub)" },
      { eq: "Router9 (ASBR)", intf: "G0/0 (A0) · G0/1 (PC6) · G0/2 (Sw0)", ip: "10.0.1.2/30 · 192.168.10.254/24 · 172.16.0.3/24", role: "OSPF + BGP 400 + Redistribution 2 sens" },
      { eq: "Router0 (AS50) / R1 (AS40)", intf: "G0/0 (Sw0) · G0/1 (LAN)", ip: "R0: .1 / 172.16.50.254 · R1: .2 / 172.16.40.254", role: "Pairs eBGP sur 172.16.0.0/24" }
    ],
    configs: [
      {
        title: "Router5 (ABR central) & Router8 (Aire 40 Totally Stub)",
        code: `! === Router5 (ABR Aires 50 / 0 / 40) ===
hostname Router5
interface GigabitEthernet0/0
 ip address 10.50.0.1 255.255.255.252
 no shutdown
interface GigabitEthernet0/1
 ip address 10.0.1.1 255.255.255.252
 no shutdown
interface GigabitEthernet0/2
 ip address 10.40.0.1 255.255.255.252
 no shutdown
router ospf 1
 router-id 5.5.5.5
 network 10.50.0.0 0.0.0.3 area 50
 network 10.0.1.0 0.0.0.3 area 0
 network 10.40.0.0 0.0.0.3 area 40
 area 40 stub no-summary

! === Router8 (IAR Aire 40 Totally Stub) ===
hostname Router8
interface GigabitEthernet0/0
 ip address 10.40.0.2 255.255.255.252
 no shutdown
interface GigabitEthernet0/1
 ip address 192.168.40.254 255.255.255.0
 no shutdown
router ospf 1
 router-id 8.8.8.8
 network 10.40.0.0 0.0.0.3 area 40
 network 192.168.40.0 0.0.0.255 area 40
 passive-interface GigabitEthernet0/1
 area 40 stub`
      },
      {
        title: "Router9 (ASBR AS400), Router0 (AS50) et Router1 (AS40)",
        code: `! === Router9 (AS400, Aire 0 + ASBR) ===
hostname Router9
interface GigabitEthernet0/0
 ip address 10.0.1.2 255.255.255.252
 no shutdown
interface GigabitEthernet0/1
 ip address 192.168.10.254 255.255.255.0
 no shutdown
interface GigabitEthernet0/2
 ip address 172.16.0.3 255.255.255.0
 no shutdown
router ospf 1
 router-id 9.9.9.9
 network 10.0.1.0 0.0.0.3 area 0
 network 192.168.10.0 0.0.0.255 area 0
 passive-interface GigabitEthernet0/1
 redistribute bgp 400 subnets
exit
router bgp 400
 neighbor 172.16.0.1 remote-as 50
 neighbor 172.16.0.2 remote-as 40
 redistribute ospf 1

! === Router0 (AS50) ===
router bgp 50
 neighbor 172.16.0.2 remote-as 40
 neighbor 172.16.0.3 remote-as 400
 network 172.16.50.0 mask 255.255.255.0

! === Router1 (AS40) ===
router bgp 40
 neighbor 172.16.0.1 remote-as 50
 neighbor 172.16.0.3 remote-as 400
 network 172.16.40.0 mask 255.255.255.0`
      }
    ],
    outputs: `Router8# show ip route       ! AVANT : 12 routes (O IA + O E2) -> APRÈS Totally Stub :
Gateway of last resort is 10.40.0.1 to network 0.0.0.0
O*IA 0.0.0.0/0 [110/2] via 10.40.0.1, GigabitEthernet0/0
C    10.40.0.0/30 is directly connected, GigabitEthernet0/0
C    192.168.40.0/24 is directly connected, GigabitEthernet0/1

Router7# show ip route       ! Dans l'Aire 50 (normale) :
O E2 172.16.40.0/24 [110/1] via 10.50.1.1   ! Externe BGP redistribué (coût fixe = 1)
O E2 172.16.50.0/24 [110/1] via 10.50.1.1
O IA 192.168.40.0/24 [110/4] via 10.50.1.1  ! Inter-aire via ABR Router5`,
    takeaways: [
      "Router5 (ABR) voit tous les réseaux OSPF en 'O' (intra-aire) car il possède une LSDB pour chacune des 3 aires !",
      "Sur Router8, le passage en Totally Stub réduit la RIB de 12 routes à 3 lignes (+ O*IA 0.0.0.0/0), et dans la LSDB il ne reste qu'une seule Summary LSA (0.0.0.0).",
      "Le ping PC4 (Aire 40) → PC0 (AS50) passe toujours (TTL=124) : la route par défaut mène à Router5, qui route vers Router9 puis Router0."
    ]
  },
  {
    id: "td3",
    tabLabel: "TD3 · Transit BGP",
    badge: "TD3 · AS100-200-300",
    title: "TD3 — AS de Transit (AS100 ↔ AS200 sous OSPF ↔ AS300)",
    summary: "Parties 1–2 : session eBGP simple entre AS100 et AS200 (analyse PDU UPDATE). Partie 3 : interconnexion de 3 AS où l'AS200 joue le rôle d'AS de transit via OSPF interne (iBGP absent de Packet Tracer) et redistribution mutuelle avec match internal external 1 external 2.",
    svg: `<svg viewBox="0 0 760 185" role="img" aria-label="Topologie TD3 partie 3 : AS100, AS200 en transit OSPF aire 0, et AS300">
      <g font-family="system-ui, sans-serif" fill="currentColor" text-anchor="middle">
        <rect x="14" y="20" width="185" height="145" rx="12" fill="#2563eb" fill-opacity="0.1" stroke="#2563eb" stroke-width="2"/>
        <text x="106" y="40" font-weight="800" font-size="11.5" fill="#2563eb">AS 100</text>
        <rect x="235" y="20" width="290" height="145" rx="12" fill="#059669" fill-opacity="0.1" stroke="#059669" stroke-width="2.5"/>
        <text x="380" y="40" font-weight="800" font-size="11.5" fill="#059669">AS 200 (Transit · OSPF Aire 0)</text>
        <rect x="560" y="20" width="185" height="145" rx="12" fill="#7c3aed" fill-opacity="0.1" stroke="#7c3aed" stroke-width="2"/>
        <text x="652" y="40" font-weight="800" font-size="11.5" fill="#7c3aed">AS 300</text>

        <line x1="140" y1="95" x2="295" y2="95" stroke="#d97706" stroke-width="2.5" stroke-dasharray="5 3"/>
        <text x="217" y="82" font-size="10" font-weight="700" fill="#d97706">eBGP 10.1.0.0/30</text>
        <line x1="295" y1="95" x2="465" y2="95" stroke="#059669" stroke-width="3"/>
        <text x="380" y="82" font-size="10" font-weight="700" fill="#059669">OSPF 172.16.0.0/30</text>
        <line x1="465" y1="95" x2="620" y2="95" stroke="#d97706" stroke-width="2.5" stroke-dasharray="5 3"/>
        <text x="542" y="82" font-size="10" font-weight="700" fill="#d97706">eBGP 10.2.0.0/30</text>

        <circle cx="140" cy="95" r="22" fill="#1e293b" stroke="#2563eb" stroke-width="2.5"/>
        <text x="140" y="99" fill="#fff" font-size="11" font-weight="700">R3</text>
        <text x="80" y="145" font-size="10">PC2/PC3 · 192.168.1.0/24</text>

        <circle cx="295" cy="95" r="23" fill="#1e293b" stroke="#059669" stroke-width="2.5"/>
        <text x="295" y="99" fill="#fff" font-size="11" font-weight="800">R2</text>
        <text x="295" y="136" font-size="9.5">ID 2.2.2.2 · Redist.</text>

        <circle cx="465" cy="95" r="23" fill="#1e293b" stroke="#059669" stroke-width="2.5"/>
        <text x="465" y="99" fill="#fff" font-size="11" font-weight="800">R4</text>
        <text x="465" y="136" font-size="9.5">ID 4.4.4.4 · Redist.</text>

        <circle cx="620" cy="95" r="22" fill="#1e293b" stroke="#7c3aed" stroke-width="2.5"/>
        <text x="620" y="99" fill="#fff" font-size="11" font-weight="700">R5</text>
        <text x="680" y="145" font-size="10">PC4/PC5 · 192.168.3.0/24</text>
      </g>
    </svg>`,
    addressing: [
      { eq: "Router3 (AS100)", intf: "G0/0 (eBGP) · G0/1 (Sw0)", ip: "10.1.0.1/30 · 192.168.1.254/24", role: "Annonce 192.168.1.0/24" },
      { eq: "Router2 (AS200)", intf: "G0/0 (eBGP) · G0/1 (OSPF)", ip: "10.1.0.2/30 · 172.16.0.1/30", role: "Bordure AS100 + Redistrib. mutuelle" },
      { eq: "Router4 (AS200)", intf: "G0/0 (eBGP) · G0/1 (OSPF)", ip: "10.2.0.1/30 · 172.16.0.2/30", role: "Bordure AS300 + Redistrib. mutuelle" },
      { eq: "Router5 (AS300)", intf: "G0/0 (eBGP) · G0/1 (Sw2)", ip: "10.2.0.2/30 · 192.168.3.254/24", role: "Annonce 192.168.3.0/24" }
    ],
    configs: [
      {
        title: "Router2 et Router4 (Bordures AS200 — Transit OSPF ↔ BGP)",
        code: `! === Router2 (AS200, côté AS100) ===
router ospf 1
 router-id 2.2.2.2
 network 172.16.0.0 0.0.0.3 area 0
 redistribute bgp 200 subnets
exit
router bgp 200
 neighbor 10.1.0.1 remote-as 100
 redistribute ospf 1 match internal external 1 external 2

! === Router4 (AS200, côté AS300) ===
router ospf 1
 router-id 4.4.4.4
 network 172.16.0.0 0.0.0.3 area 0
 redistribute bgp 200 subnets
exit
router bgp 200
 neighbor 10.2.0.2 remote-as 300
 redistribute ospf 1 match internal external 1 external 2
! Secours si PT refuse "match external" : ajouter network 192.168.1.0 mask 255.255.255.0 sur R4`
      }
    ],
    outputs: `Router4# show ip route
C    10.2.0.0/30 is directly connected, GigabitEthernet0/0
C    172.16.0.0/30 is directly connected, GigabitEthernet0/1
O E2 192.168.1.0/24 [110/1] via 172.16.0.1, GigabitEthernet0/1   ! Appris de R2 via OSPF !
B    192.168.3.0/24 [20/0]  via 10.2.0.2                          ! Appris de R5 via eBGP !

PC2> tracert 192.168.3.2
 1  192.168.1.254 (R3) -> 2  10.1.0.2 (R2) -> 3  172.16.0.2 (R4) -> 4  10.2.0.2 (R5) -> 5  192.168.3.2`,
    takeaways: [
      "Sans 'match internal external 1 external 2', les routes O E2 venant de l'autre bordure ne sont PAS réannoncées en BGP !",
      "Limite théorique vs iBGP : Router5 reçoit 192.168.1.0/24 avec AS_PATH = '200 ?' au lieu de '200 100 i' (perte de l'AS d'origine lors du passage dans OSPF)."
    ]
  },
  {
    id: "cr-ospf",
    tabLabel: "CR · OSPF Chaîne",
    badge: "4 Routeurs · R0–R3",
    title: "CR OSPF — 4 Routeurs en Chaîne (Mono-aire → Multi-aires → Stub → Totally Stub)",
    summary: "Progression pédagogique parfaite sur 4 routeurs 2911 en ligne (R0–R1–R2–R3) : OSPF mono-aire 0, puis découpage en Aire 10 / Aire 0 / Aire 20 (R1 & R2 ABR), ajout d'une Loopback externe 203.0.113.0/24 sur R3 (ASBR), puis Aire 10 en Stub puis Totally Stub.",
    svg: `<svg viewBox="0 0 760 165" role="img" aria-label="4 routeurs en chaîne R0, R1, R2, R3 avec Aires 10, 0, 20 et Loopback externe sur R3">
      <g font-family="system-ui, sans-serif" fill="currentColor" text-anchor="middle">
        <rect x="20" y="16" width="210" height="125" rx="10" fill="#0284c7" fill-opacity="0.1" stroke="#0284c7" stroke-width="2" stroke-dasharray="5 3"/>
        <text x="125" y="34" font-weight="800" font-size="11" fill="#0284c7">Aire 10 (Stub → T-Stub)</text>
        <rect x="245" y="16" width="210" height="125" rx="10" fill="#2563eb" fill-opacity="0.12" stroke="#2563eb" stroke-width="2.5"/>
        <text x="350" y="34" font-weight="800" font-size="11" fill="#2563eb">Aire 0 (Backbone)</text>
        <rect x="470" y="16" width="270" height="125" rx="10" fill="#059669" fill-opacity="0.1" stroke="#059669" stroke-width="2" stroke-dasharray="5 3"/>
        <text x="605" y="34" font-weight="800" font-size="11" fill="#059669">Aire 20 (+ ASBR Lo0 203.0.113.0/24)</text>

        <line x1="95" y1="84" x2="255" y2="84" stroke="currentColor" stroke-width="2.2"/>
        <line x1="255" y1="84" x2="445" y2="84" stroke="currentColor" stroke-width="2.2"/>
        <line x1="445" y1="84" x2="615" y2="84" stroke="currentColor" stroke-width="2.2"/>

        <text x="175" y="72" font-size="9.5" font-family="monospace">10.0.1.0/30</text>
        <text x="350" y="72" font-size="9.5" font-family="monospace">10.0.2.0/30</text>
        <text x="530" y="72" font-size="9.5" font-family="monospace">10.0.3.0/30</text>

        <circle cx="95" cy="84" r="22" fill="#1e293b" stroke="#0284c7" stroke-width="2"/>
        <text x="95" y="88" fill="#fff" font-weight="700" font-size="11">R0</text>
        <text x="95" y="122" font-size="9.5">ID 1.1.1.1 · PC0 .10.1</text>

        <circle cx="255" cy="84" r="22" fill="#1e293b" stroke="#2563eb" stroke-width="2.5"/>
        <text x="255" y="88" fill="#fff" font-weight="800" font-size="10.5">R1 ABR</text>
        <text x="255" y="122" font-size="9.5">ID 2.2.2.2</text>

        <circle cx="445" cy="84" r="22" fill="#1e293b" stroke="#2563eb" stroke-width="2.5"/>
        <text x="445" y="88" fill="#fff" font-weight="800" font-size="10.5">R2 ABR</text>
        <text x="445" y="122" font-size="9.5">ID 3.3.3.3</text>

        <circle cx="615" cy="84" r="22" fill="#1e293b" stroke="#059669" stroke-width="2.5"/>
        <text x="615" y="88" fill="#fff" font-weight="800" font-size="10">R3 ASBR</text>
        <text x="615" y="122" font-size="9.5">ID 4.4.4.4 · PC1 .20.1</text>
      </g>
    </svg>`,
    addressing: [
      { eq: "R0 (Aire 10)", intf: "G0/0 · G0/1 (PC0)", ip: "10.0.1.1/30 · 192.168.10.254/24", role: "ID 1.1.1.1 · area 10 stub" },
      { eq: "R1 (ABR 10/0)", intf: "G0/0 (A10) · G0/1 (A0)", ip: "10.0.1.2/30 · 10.0.2.1/30", role: "ID 2.2.2.2 · area 10 stub no-summary" },
      { eq: "R2 (ABR 0/20)", intf: "G0/0 (A0) · G0/1 (A20)", ip: "10.0.2.2/30 · 10.0.3.1/30", role: "ID 3.3.3.3" },
      { eq: "R3 (Aire 20 + ASBR)", intf: "G0/0 · G0/1 (PC1) · Lo0", ip: "10.0.3.2/30 · 192.168.20.254/24 · 203.0.113.1/24", role: "ID 4.4.4.4 · redistribute connected subnets" }
    ],
    configs: [
      {
        title: "Configuration finale complète (R0, R1, R2, R3)",
        code: `! === R0 (Aire 10 Totally Stub) ===
router ospf 1
 router-id 1.1.1.1
 network 10.0.1.0 0.0.0.3 area 10
 network 192.168.10.0 0.0.0.255 area 10
 passive-interface GigabitEthernet0/1
 area 10 stub

! === R1 (ABR Aire 10 / Aire 0) ===
router ospf 1
 router-id 2.2.2.2
 network 10.0.1.0 0.0.0.3 area 10
 network 10.0.2.0 0.0.0.3 area 0
 area 10 stub no-summary

! === R3 (ASBR Aire 20 avec Loopback externe) ===
interface Loopback0
 ip address 203.0.113.1 255.255.255.0
router ospf 1
 router-id 4.4.4.4
 network 10.0.3.0 0.0.0.3 area 20
 network 192.168.20.0 0.0.0.255 area 20
 passive-interface GigabitEthernet0/1
 redistribute connected subnets`
      }
    ],
    outputs: `! Évolution de la table de R0 en 4 étapes :
! 1) Mono-aire 0     : O    10.0.2.0/30 [110/2], O    192.168.20.0/24 [110/4]
! 2) Multi-aires     : O IA 10.0.2.0/30 [110/2], O IA 192.168.20.0/24 [110/4], O E2 203.0.113.0/24 [110/20]
! 3) Aire 10 Stub    : O*IA 0.0.0.0/0 [110/2] + O IA conservées (O E2 supprimée !)
! 4) Totally Stub    : O*IA 0.0.0.0/0 [110/2] UNIQUEMENT (+ routes C/L locales)`,
    takeaways: [
      "En mono-aire, les coûts sur liens Gigabit valent 1 par saut : 3 liens + LAN PC1 = coût total 4.",
      "Un ABR (R1) affiche deux sections complètes dans 'show ip ospf database' : une pour l'Aire 0 et une pour l'Aire 10, chacune avec ses Summary Net Link States (LSA 3)."
    ]
  },
  {
    id: "cr-bgp",
    tabLabel: "CR · BGP Triangle",
    badge: "3 AS · Redondance",
    title: "CR BGP — 3 AS en Triangle, Sélection AS_PATH & Tolérance de Panne",
    summary: "Trois AS (AS100, AS200, AS300) maillés en triangle offrant 2 chemins vers chaque préfixe : vérification de la sélection par longueur d'AS_PATH, puis coupure (shutdown) du lien direct R1–R2 pour observer le basculement automatique via AS300.",
    svg: `<svg viewBox="0 0 760 205" role="img" aria-label="Triangle BGP AS100, AS200, AS300 avec chemin direct et secours">
      <g font-family="system-ui, sans-serif" fill="currentColor" text-anchor="middle">
        <line x1="215" y1="65" x2="545" y2="65" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6 4"/>
        <text x="380" y="52" font-size="10.5" font-weight="700" fill="#dc2626">10.0.12.0/30 (Test panne : shutdown !)</text>
        <line x1="215" y1="65" x2="380" y2="155" stroke="#059669" stroke-width="2.8"/>
        <text x="260" y="130" font-size="10" font-family="monospace">10.0.13.0/30</text>
        <line x1="545" y1="65" x2="380" y2="155" stroke="#059669" stroke-width="2.8"/>
        <text x="500" y="130" font-size="10" font-family="monospace">10.0.23.0/30</text>

        <circle cx="215" cy="65" r="28" fill="#1e293b" stroke="#2563eb" stroke-width="3"/>
        <text x="215" y="64" fill="#fff" font-weight="800" font-size="11.5">R1</text>
        <text x="215" y="77" fill="#60a5fa" font-size="9.5">AS100</text>
        <text x="105" y="69" font-size="10.5">PC1 · 192.168.1.0/24</text>

        <circle cx="545" cy="65" r="28" fill="#1e293b" stroke="#7c3aed" stroke-width="3"/>
        <text x="545" y="64" fill="#fff" font-weight="800" font-size="11.5">R2</text>
        <text x="545" y="77" fill="#c4b5fd" font-size="9.5">AS200</text>
        <text x="655" y="69" font-size="10.5">PC2 · 192.168.2.0/24</text>

        <circle cx="380" cy="155" r="28" fill="#1e293b" stroke="#059669" stroke-width="3"/>
        <text x="380" y="154" fill="#fff" font-weight="800" font-size="11.5">R3</text>
        <text x="380" y="167" fill="#34d399" font-size="9.5">AS300</text>
        <text x="380" y="196" font-size="10.5">PC3 · 192.168.3.0/24 (Devient AS de transit en cas de panne !)</text>
      </g>
    </svg>`,
    addressing: [
      { eq: "R1 (AS100)", intf: "G0/0 (R2) · G0/1 (R3) · G0/2 (PC1)", ip: "10.0.12.1/30 · 10.0.13.1/30 · 192.168.1.254/24", role: "Annonce 192.168.1.0/24" },
      { eq: "R2 (AS200)", intf: "G0/0 (R1) · G0/1 (R3) · G0/2 (PC2)", ip: "10.0.12.2/30 · 10.0.23.1/30 · 192.168.2.254/24", role: "Annonce 192.168.2.0/24" },
      { eq: "R3 (AS300)", intf: "G0/0 (R1) · G0/1 (R2) · G0/2 (PC3)", ip: "10.0.13.2/30 · 10.0.23.2/30 · 192.168.3.254/24", role: "Annonce 192.168.3.0/24" }
    ],
    configs: [
      {
        title: "Configuration eBGP en triangle (R1, R2, R3)",
        code: `! === R1 (AS100) ===
router bgp 100
 neighbor 10.0.12.2 remote-as 200
 neighbor 10.0.13.2 remote-as 300
 network 192.168.1.0 mask 255.255.255.0

! === R2 (AS200) ===
router bgp 200
 neighbor 10.0.12.1 remote-as 100
 neighbor 10.0.23.2 remote-as 300
 network 192.168.2.0 mask 255.255.255.0

! === R3 (AS300) ===
router bgp 300
 neighbor 10.0.13.1 remote-as 100
 neighbor 10.0.23.1 remote-as 200
 network 192.168.3.0 mask 255.255.255.0`
      }
    ],
    outputs: `R1# show ip bgp   ! AVANT PANNE : 2 chemins valides (*) par préfixe distant
   Network          Next Hop       Metric LocPrf Weight Path
*> 192.168.1.0/24   0.0.0.0             0         32768 i
*  192.168.2.0/24   10.0.13.2                         0 300 200 i
*>                  10.0.12.2           0             0 200 i      ! ÉLU (AS_PATH plus court)

! TEST PANNE sur R1 : interface Gi0/0 -> shutdown
%BGP-5-ADJCHANGE: neighbor 10.0.12.2 Down Interface flap           ! Détection immédiate !
R1# show ip bgp
*> 192.168.2.0/24   10.0.13.2                         0 300 200 i  ! Bascule auto via AS300 !`,
    takeaways: [
      "La table BGP conserve TOUS les chemins de secours (*) ; seule la meilleure route (>) est installée dans 'show ip route'.",
      "En cas de coupure d'interface (shutdown), BGP n'attend pas le Hold Time de 180 s : la perte de lien ('Interface flap') provoque un basculement immédiat vers le chemin de secours via AS300 !"
    ]
  },
  {
    id: "cr-interco",
    tabLabel: "CR · Interco & Défaut",
    badge: "OSPF ↔ BGP + Défaut",
    title: "CR Interconnexion OSPF–BGP & Variante Route par Défaut (default-information originate)",
    summary: "AS100 (R1–R2–R3 en OSPF Aire 0) raccordé à AS200 (R4 en eBGP) via R3 ASBR. Constat d'échec avant redistribution, redistribution bidirectionnelle avec observation de la LSA 5 (Tag 200), puis remplacement par la bonne pratique production : route par défaut O*E2.",
    svg: `<svg viewBox="0 0 760 165" role="img" aria-label="AS100 R1, R2, R3 OSPF relié à R4 AS200 en eBGP">
      <g font-family="system-ui, sans-serif" fill="currentColor" text-anchor="middle">
        <rect x="16" y="18" width="510" height="128" rx="12" fill="#2563eb" fill-opacity="0.1" stroke="#2563eb" stroke-width="2"/>
        <text x="270" y="37" font-weight="800" font-size="11.5" fill="#2563eb">AS 100 · OSPF Aire 0</text>
        <rect x="548" y="18" width="196" height="128" rx="12" fill="#7c3aed" fill-opacity="0.12" stroke="#7c3aed" stroke-width="2"/>
        <text x="646" y="37" font-weight="800" font-size="11.5" fill="#7c3aed">AS 200 · eBGP</text>

        <line x1="90" y1="86" x2="265" y2="86" stroke="currentColor" stroke-width="2.2"/>
        <line x1="265" y1="86" x2="450" y2="86" stroke="currentColor" stroke-width="2.2"/>
        <line x1="450" y1="86" x2="646" y2="86" stroke="#7c3aed" stroke-width="2.5" stroke-dasharray="5 3"/>

        <text x="177" y="75" font-size="9.5" font-family="monospace">10.0.12.0/30</text>
        <text x="357" y="75" font-size="9.5" font-family="monospace">10.0.23.0/30</text>
        <text x="548" y="75" font-size="9.5" font-family="monospace" fill="#7c3aed">10.0.34.0/30</text>

        <circle cx="90" cy="86" r="22" fill="#1e293b" stroke="#2563eb" stroke-width="2"/>
        <text x="90" y="90" fill="#fff" font-size="11" font-weight="700">R1</text>
        <text x="90" y="126" font-size="9.5">PC1 · 192.168.1.0/24</text>

        <circle cx="265" cy="86" r="22" fill="#1e293b" stroke="#2563eb" stroke-width="2"/>
        <text x="265" y="90" fill="#fff" font-size="11" font-weight="700">R2</text>
        <text x="265" y="126" font-size="9.5">PC2 · 192.168.2.0/24</text>

        <circle cx="450" cy="86" r="24" fill="#1e293b" stroke="#d97706" stroke-width="3"/>
        <text x="450" y="85" fill="#fff" font-size="10.5" font-weight="800">R3</text>
        <text x="450" y="97" fill="#fbbf24" font-size="8.5">ASBR</text>
        <text x="450" y="126" font-size="9.5">OSPF ↔ BGP</text>

        <circle cx="646" cy="86" r="22" fill="#1e293b" stroke="#7c3aed" stroke-width="2.5"/>
        <text x="646" y="90" fill="#fff" font-size="11" font-weight="700">R4</text>
        <text x="646" y="126" font-size="9.5">PC4 · 192.168.4.0/24</text>
      </g>
    </svg>`,
    addressing: [
      { eq: "R1 / R2 (AS100)", intf: "OSPF Aire 0", ip: "10.0.12.0/30 · 10.0.23.0/30 · LANs .1.0 & .2.0", role: "Routeurs internes OSPF" },
      { eq: "R3 (AS100 ASBR)", intf: "G0/0 (OSPF) · G0/1 (eBGP)", ip: "10.0.23.2/30 · 10.0.34.1/30", role: "Redistribution + Variante défaut" },
      { eq: "R4 (AS200)", intf: "G0/0 (eBGP) · G0/1 (PC4)", ip: "10.0.34.2/30 · 192.168.4.254/24", role: "Annonce 192.168.4.0/24" }
    ],
    configs: [
      {
        title: "R3 (ASBR) : Redistribution bidirectionnelle puis Variante Route par défaut",
        code: `! === Option A : Redistribution bidirectionnelle complète ===
router ospf 1
 router-id 3.3.3.3
 network 10.0.23.0 0.0.0.3 area 0
 redistribute bgp 100 subnets
exit
router bgp 100
 neighbor 10.0.34.2 remote-as 200
 redistribute ospf 1

! === Option B (Production) : Remplacer BGP->OSPF par une route par défaut ===
router ospf 1
 no redistribute bgp 100 subnets
 default-information originate always`
      }
    ],
    outputs: `! Sur R1 avec Option A (LSA Type 5, E bit = 1, Metric = 1, External Route Tag = 200) :
O E2 192.168.4.0/24 [110/1] via 10.0.12.2, GigabitEthernet0/0

! Sur R1 avec Option B (Route par défaut) :
Gateway of last resort is 10.0.12.2 to network 0.0.0.0
O*E2 0.0.0.0/0 [110/1] via 10.0.12.2, GigabitEthernet0/0

! Sur R4 (AS200) : routes redistribuées depuis OSPF avec origine '?' et MED = coût OSPF
*> 192.168.1.0/24   10.0.34.1      3      0 100 ?`,
    takeaways: [
      "Avant redistribution, PC1→PC4 retourne 'Reply from 192.168.1.254: Destination host unreachable' car R1 n'a aucune route vers 192.168.4.0/24.",
      "Dans la LSA Type 5 générée par R3, IOS place automatiquement External Route Tag = 200 (ASN d'origine BGP).",
      "default-information originate always injecte O*E2 0.0.0.0/0 même si R3 n'a pas de route par défaut locale : idéal face à une table Internet complète."
    ]
  },
  {
    id: "dstp-maquette",
    tabLabel: "DSTP · Guide Sujet",
    badge: "DSTP · Méthode",
    title: "Maquette DSTP Expliquée — Méthode Pas-à-Pas pour le Jour J",
    summary: "Synthèse du document CR-OSPF-BGP-explique : démarche complète de construction et vérification pour le DSTP de 2h sur Packet Tracer (OSPF aire 50 → multi-aires 0/40/50 → Totally Stub → eBGP AS200/AS300 → Raccordement AS400).",
    svg: `<svg viewBox="0 0 760 170" role="img" aria-label="Démarche en 5 étapes du DSTP Packet Tracer">
      <g font-family="system-ui, sans-serif" fill="currentColor" text-anchor="middle">
        <rect x="12" y="38" width="132" height="94" rx="10" fill="#2563eb" fill-opacity="0.14" stroke="#2563eb" stroke-width="2"/>
        <text x="78" y="62" font-weight="800" font-size="11.5" fill="#2563eb">1. Plan &amp; IP</text>
        <text x="78" y="82" font-size="9.5">Afficher ports</text>
        <text x="78" y="96" font-size="9.5">IP + no shut</text>
        <text x="78" y="110" font-size="9.5">Ping direct OK</text>

        <rect x="163" y="38" width="132" height="94" rx="10" fill="#0284c7" fill-opacity="0.14" stroke="#0284c7" stroke-width="2"/>
        <text x="229" y="62" font-weight="800" font-size="11.5" fill="#0284c7">2. OSPF</text>
        <text x="229" y="82" font-size="9.5">Aire 50 → 0/40/50</text>
        <text x="229" y="96" font-size="9.5">Voisins FULL</text>
        <text x="229" y="110" font-size="9.5">O / O IA vérifiés</text>

        <rect x="314" y="38" width="132" height="94" rx="10" fill="#d97706" fill-opacity="0.14" stroke="#d97706" stroke-width="2"/>
        <text x="380" y="62" font-weight="800" font-size="11.5" fill="#d97706">3. Stub/NSSA</text>
        <text x="380" y="82" font-size="9.5">area X stub (tous)</text>
        <text x="380" y="96" font-size="9.5">no-summary (ABR)</text>
        <text x="380" y="110" font-size="9.5">O*IA 0.0.0.0/0</text>

        <rect x="465" y="38" width="132" height="94" rx="10" fill="#7c3aed" fill-opacity="0.14" stroke="#7c3aed" stroke-width="2"/>
        <text x="531" y="62" font-weight="800" font-size="11.5" fill="#7c3aed">4. eBGP</text>
        <text x="531" y="82" font-size="9.5">remote-as distant</text>
        <text x="531" y="96" font-size="9.5">network exact</text>
        <text x="531" y="110" font-size="9.5">Established</text>

        <rect x="616" y="38" width="132" height="94" rx="10" fill="#059669" fill-opacity="0.14" stroke="#059669" stroke-width="2"/>
        <text x="682" y="62" font-weight="800" font-size="11.5" fill="#059669">5. Redistrib.</text>
        <text x="682" y="82" font-size="9.5">BGP→OSPF subnets</text>
        <text x="682" y="96" font-size="9.5">OSPF→BGP (retour)</text>
        <text x="682" y="110" font-size="9.5">Ping tous PC + Save</text>
      </g>
    </svg>`,
    addressing: [
      { eq: "R5 (Central AS400)", intf: "G0/0 (PC4) · G0/1 (R6) · G0/2 (Sw BGP)", ip: "10.50.1.1/24 · 10.50.12.1/30 · 172.16.0.1/29", role: "ABR + ASBR (OSPF + BGP 400)" },
      { eq: "R6 / R40 / R0", intf: "Aire 50 · Aire 40 · Aire 0", ip: "10.50.2.0/24 · 10.40.1.0/24 · 10.0.0.0/30", role: "Aire 40 en Totally Stub" },
      { eq: "R2 (AS200) / R3 (AS300)", intf: "Switch 172.16.0.0/29 (.2 / .3)", ip: "LANs 10.200.1.0/24 & 10.30.1.0/24", role: "Pairs eBGP sur /29" }
    ],
    configs: [
      {
        title: "Raccordement final sur R5 (AS400) — Annonces explicites + Redistribution",
        code: `router bgp 400
 neighbor 172.16.0.2 remote-as 200
 neighbor 172.16.0.3 remote-as 300
 network 10.50.1.0 mask 255.255.255.0
 network 10.50.2.0 mask 255.255.255.0
 network 10.40.1.0 mask 255.255.255.0
exit
router ospf 1
 redistribute bgp 400 subnets`
      }
    ],
    outputs: `! Checklist de contrôle rapide DSTP (sur chaque routeur) :
show ip interface brief    -> up/up partout
show ip ospf neighbor      -> FULL
show ip bgp summary        -> State/PfxRcd = un nombre (>= 1)
show ip route              -> C, O, O IA, O E2, O*IA, B
! Puis ping aller ET retour entre PC de TOUTES les aires et TOUS les AS !`,
    takeaways: [
      "Enregistrer le fichier .pkt (Save As) avant chaque grosse modification (ex : avant passage en Stub ou Redistribution).",
      "Si une commande échoue, lire la position du marqueur '^' et vérifier le mode CLI avec 'end' avant de recoller.",
      "Toujours tester les pings DEPUIS LES PC (Desktop → Command Prompt), jamais seulement depuis les routeurs !"
    ]
  }
];
