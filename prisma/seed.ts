import { PrismaClient, Role, MediaType, MessageStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/ocpr_db';
const adapter = new PrismaPg({ connectionString });
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
    await prisma.news.create({ data: n });
  }

  console.log(`✅ Seeded ${newsItems.length} news articles`);

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
    await prisma.media.create({ data: m });
  }

  console.log(`✅ Seeded ${mediaItems.length} media items`);

  // 5. Audit Log Initial Entry
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'SYSTEM_INITIALIZATION',
      details: 'Initialisation de la base de données PostgreSQL et création du compte Super Admin.',
      ipAddress: '127.0.0.1',
    },
  });

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
