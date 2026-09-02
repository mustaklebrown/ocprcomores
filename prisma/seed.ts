import { PrismaClient, Role, MediaType, MessageStatus } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcryptjs';

const connectionString =
  process.env.DATABASE_URL || 'mysql://root:password@127.0.0.1:3306/ocpr_db';

const url = new URL(connectionString);
const databaseName = url.pathname.replace(/^\//, '').split('?')[0];
const isSslRequired = url.searchParams.get('ssl') === 'true' || process.env.DB_SSL === 'true';

const adapter = new PrismaMariaDb({
  host: url.hostname || '127.0.0.1',
  port: parseInt(url.port || '3306', 10),
  user: decodeURIComponent(url.username || 'root'),
  password: decodeURIComponent(url.password || ''),
  database: databaseName || 'ocpr_db',
  allowPublicKeyRetrieval: true,
  connectTimeout: 30000,
  acquireTimeout: 30000,
  charset: 'utf8mb4',
  ...(isSslRequired ? { ssl: { rejectUnauthorized: false } } : {}),
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Default Admin User
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@OCPR2026!';
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ocprcomores.com' },
    update: {},
    create: {
      email: 'admin@ocprcomores.com',
      name: 'Direction OCPR Comores',
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log(`✅ Default admin created: ${admin.email} (Password: ${defaultPassword})`);

  // 2. Initial Products (Filières de Rente)
  const products = [
    {
      name: 'Vanille Bourbon des Comores',
      scientificName: 'Vanilla planifolia',
      category: 'Pilier Majeur',
      icon: 'Sparkles',
      description:
        'Reconnue mondialement pour son taux d vanilline exceptionnel, la Vanille Bourbon des Comores bénéficie d un terroir volcanique unique et d un savoir-faire d affinage traditionnel.',
      specs: JSON.stringify({
        TauxDeVanilline: '2.0% - 2.4%',
        TauxDHumidite: '30% - 38%',
        LongueurGousses: '14 cm - 22 cm',
        Certification: 'Certificat Origine & Phytosanitaire',
      }),
      isoNorms: 'ISO 5565-1:1999 & ISO 5565-2:1999',
      exportDetails:
        'Conditionnement sous vide en boîtes métalliques hermétiques certifiées pour le transport aérien et maritime international.',
      islands: 'Grande Comore, Anjouan, Mohéli',
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Huile Essentielle d Ylang-Ylang',
      scientificName: 'Cananga odorata var. genuina',
      category: 'Pilier Majeur',
      icon: 'Droplet',
      description:
        'Extrait par distillation à la vapeur d eau dans les alambics comoriens, l Ylang-Ylang des Comores est le composant légendaire des plus grands parfumeurs mondiaux.',
      specs: JSON.stringify({
        QualiteDistillation: 'Extra Supérieure, Extra, Première, Deuxième, Troisième',
        DensiteRelative: '0.940 - 0.965',
        IndiceDeRefraction: '1.498 - 1.512',
        ComposantsCles: 'Linalol, Acétate de géranyle, Béta-caryophyllène',
      }),
      isoNorms: 'ISO 3063:2004',
      exportDetails:
        'Fûts en aluminium anodisé alimentaire ou en acier inoxydable de 25kg, 50kg et 200kg conformes aux normes IATA/IMDG.',
      islands: 'Anjouan, Mohéli, Grande Comore',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Girofle des Comores (Clous & Griffes)',
      scientificName: 'Syzygium aromaticum',
      category: 'Pilier Majeur',
      icon: 'TreeDeciduous',
      description:
        'Clous de girofle récoltés à la main, riches en eugénol (plus de 85%), recherchés par l industrie agroalimentaire et pharmaceutique internationale.',
      specs: JSON.stringify({
        TauxDEugenol: '82% - 88%',
        HumiditeMax: '12%',
        TauxDeMatieresEtrangeres: '< 0.5%',
        Couleur: 'Brun foncé roussâtre homogène',
      }),
      isoNorms: 'ISO 2254:2004',
      exportDetails: 'Sacs en jute de 50 kg traités anti-humidité ou conteneurs dry équipés de liners agroalimentaires.',
      islands: 'Anjouan, Grande Comore, Mohéli',
      imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1200&auto=format&fit=crop',
    },
    {
      name: 'Poivre Noir & Blanc de Moheli',
      scientificName: 'Piper nigrum',
      category: 'Filière Émergente',
      icon: 'Flame',
      description:
        'Cultivé sur les coteaux ombragés de Mohéli, ce poivre offre des arômes boisés et piqués intenses grâce à un séchage naturel au soleil islandais.',
      specs: JSON.stringify({
        Densite: '550g/l - 600g/l',
        TauxDePiperine: '4.5% - 6.0%',
        Humidite: '< 11%',
      }),
      isoNorms: 'ISO 959-1:1998',
      exportDetails: 'Sacs kraft sous atmosphère modifiée de 25 kg.',
      islands: 'Mohéli, Anjouan',
      imageUrl: 'https://images.unsplash.com/photo-1509358211525-44249e6f81d8?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log(`✅ Seeded ${products.length} products`);

  // 3. Initial News (Actualités)
  const newsItems = [
    {
      title: 'Pose de la première pierre du nouveau centre national d affinage de la Vanille',
      slug: 'pose-premiere-pierre-centre-affinage-vanille-2026',
      category: 'Infrastructure',
      excerpt:
        'La Direction Générale de l OCPR et le Ministère de l Agriculture ont officiellement lancé le chantier de construction du laboratoire d analyse et d affinage.',
      content:
        'Ce projet d un montant stratégique permettra d homologuer directement la Vanille Bourbon exportée vers l Europe et l Amérique du Nord sans intermédiaire régional. Le laboratoire sera équipé de spectromètres de masse et de salles de stockage à température et hygrométrie régulées.',
      date: '25 Juillet 2026',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1200&auto=format&fit=crop',
      readTime: '4 min',
    },
    {
      title: 'Fixation du Prix Plancher de la Vanille Verte pour la Campagne 2026-2027',
      slug: 'fixation-prix-plancher-vanille-verte-campagne-2026',
      category: 'Réglementation',
      excerpt:
        'En concertation avec les syndicats de producteurs et l Association des Exportateurs des Comores, l OCPR annonce le prix garanti au kilo.',
      content:
        'Afin d assurer un revenu équitable aux planteurs des trois îles et de lutter contre le vol sur pied, l OCPR a établi un barème strict accompagné de patrouilles d homologation sur les marchés régionaux.',
      date: '18 Juillet 2026',
      imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
      readTime: '3 min',
    },
    {
      title: 'Participation de l OCPR au Salon International des Épices de Dubaï',
      slug: 'participation-ocpr-salon-international-epices-dubai',
      category: 'Événement',
      excerpt:
        'Une délégation officielle représentant les coopératives d Ylang-Ylang et de Girofle des Comores a signé 3 contrats majeurs d exportation.',
      content:
        'Le pavillon Comores a attiré l attention de grands acheteurs du Moyen-Orient et d Asie grâce aux démonstrations de distillation d huile essentielle pure et aux échantillons de Vanille Bourbon.',
      date: '10 Juillet 2026',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
      readTime: '5 min',
    },
  ];

  for (const n of newsItems) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: {},
      create: n,
    });
  }

  console.log(`✅ Seeded news articles`);

  // 4. Initial Media Items
  const mediaItems = [
    {
      title: 'Récolte traditionnelle de la Vanille Bourbon à Anjouan',
      category: 'Vanille',
      type: MediaType.PHOTO,
      url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1200&auto=format&fit=crop',
      description: 'Planteur comorien procédant au tri manuel des gousses vertes.',
    },
    {
      title: 'Distillation d Ylang-Ylang dans un alambic traditionnel',
      category: 'Ylang-Ylang',
      type: MediaType.PHOTO,
      url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop',
      description: 'Démonstration du processus d extraction de l huile essentielle Extra.',
    },
    {
      title: 'Séchage des clous de Girofle au soleil à Mohéli',
      category: 'Girofle',
      type: MediaType.PHOTO,
      url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1200&auto=format&fit=crop',
      description: 'Alignement des nattes de séchage garantissant une qualité optimale.',
    },
  ];

  for (const m of mediaItems) {
    const existing = await prisma.media.findFirst({ where: { title: m.title } });
    if (!existing) {
      await prisma.media.create({ data: m });
    }
  }

  console.log(`✅ Seeded media items`);

  // 5. Initial Downloadable Documents (Textes Réglementaires)
  const initialDocuments = [
    {
      title: "Cadre Réglementaire & Statuts de l'OCPR",
      category: 'Réglementation',
      description:
        "Décret officiel régissant la création, les compétences et les prérogatives de l'Office Comorien des Produits de Rente.",
      fileSize: '1.2 MB',
      fileFormat: 'PDF',
      date: '2024',
      fileUrl: '/uploads/documents/cadre_reglementaire_ocpr.pdf',
    },
    {
      title: 'Guide des Normes de Qualité - Vanille Bourbon',
      category: 'Exportation',
      description:
        "Spécifications techniques, taux de vanilline requis (> 2.0%) et critères de calibrage pour les lots d'exportation certifiés.",
      fileSize: '850 KB',
      fileFormat: 'PDF',
      date: '2025',
      fileUrl: '/uploads/documents/guide_normes_vanille_bourbon.pdf',
    },
    {
      title: "Fiche Technique & Protocole d'Analyse - Ylang-Ylang",
      category: 'Exportation',
      description:
        "Normes de distillation et critères de contrôle physico-chimique (densité, indice de réfraction) pour l'homologation des huiles.",
      fileSize: '2.1 MB',
      fileFormat: 'PDF',
      date: '2025',
      fileUrl: '/uploads/documents/protocole_ylang_ylang.pdf',
    },
    {
      title: "Formulaire Officiel de Demande d'Agrément d'Exportateur",
      category: 'Formulaire',
      description:
        "Dossier de candidature à compléter pour toute demande d'agrément officiel et de licence annuelle d'exportation.",
      fileSize: '450 KB',
      fileFormat: 'PDF',
      date: '2025',
      fileUrl: '/uploads/documents/formulaire_agrement_exportateur.pdf',
    },
    {
      title: 'Rapport Annuel sur les Filières de Rente des Comores',
      category: 'Rapport',
      description:
        "Bilan statistique de la production, des tonnages exportés et de la valeur économique des cultures de rente.",
      fileSize: '3.6 MB',
      fileFormat: 'PDF',
      date: '2024',
      fileUrl: '/uploads/documents/rapport_annuel_filieres.pdf',
    },
    {
      title: 'Manuel des Bonnes Pratiques Agricoles pour les Producteurs',
      category: 'Guide',
      description:
        "Guide technique d'encadrement sur les méthodes durables de culture, de récolte à maturité et de séchage traditionnel.",
      fileSize: '1.9 MB',
      fileFormat: 'PDF',
      date: '2025',
      fileUrl: '/uploads/documents/manuel_bonnes_pratiques.pdf',
    },
  ];

  for (const doc of initialDocuments) {
    const existing = await prisma.document.findFirst({ where: { title: doc.title } });
    if (!existing) {
      await prisma.document.create({ data: doc });
    }
  }

  console.log(`✅ Seeded ${initialDocuments.length} initial documents`);

  // 6. Audit Log Initial Entry
  const auditExists = await prisma.auditLog.findFirst({ where: { action: 'SYSTEM_INITIALIZATION' } });
  if (!auditExists) {
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: 'SYSTEM_INITIALIZATION',
        details: 'Initialisation de la base de données MySQL et création du compte Super Admin.',
        ipAddress: '127.0.0.1',
      },
    });
  }

  console.log('✅ System Initialization audit log created.');
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
