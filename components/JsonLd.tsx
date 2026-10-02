import React from 'react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ocprcomores.com';

export default function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Office Comorien des Produits de Rente',
    alternateName: ['OCPR Comores', 'OCPR', 'Office des Produits de Rente'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/og-image.png`,
      width: 1200,
      height: 630,
    },
    image: `${SITE_URL}/og-image.png`,
    description:
      "Établissement public de promotion, développement, valorisation et contrôle de qualité des filières de rente agricoles aux Comores : Vanille Bourbon, Ylang-Ylang, Girofle et Épices d'exception.",
    foundingDate: '2010',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Petite Coulée, Rue Caisse des Retraites des Comores',
      addressLocality: 'Moroni',
      addressRegion: 'Grande Comore',
      postalCode: 'BP 2681',
      addressCountry: 'KM',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -11.7022,
      longitude: 43.2551,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+269-733-23-18',
        contactType: 'customer support',
        email: 'info@ocprcomores.com',
        areaServed: 'KM',
        availableLanguage: ['French', 'Arabic'],
      },
    ],
    sameAs: [
      'https://www.facebook.com/profile.php?id=61552777156634',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'OCPR Comores',
    alternateName: "Portail Officiel de l'OCPR Comores",
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'fr-KM',
    description:
      "Portail officiel de l'Office Comorien des Produits de Rente (OCPR). Informations sur les filières vanille, girofle, ylang-ylang, réglementations et agréments.",
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const productsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Filières Agricoles et Produits de Rente des Comores',
    description:
      "Principaux produits de rente encadrés et certifiés par l'OCPR pour l'exportation.",
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Vanille Bourbon des Comores (Vanilla planifolia)',
        url: `${SITE_URL}/#produits`,
        description:
          'Vanille noire gourmet et TK réputée mondialement pour son taux élevé de vanilline et son arôme puissant.',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: "Huile Essentielle d'Ylang-Ylang (Cananga odorata)",
        url: `${SITE_URL}/#produits`,
        description:
          'Fleur emblématique des Comores, 1er producteur mondial. Distillation fractionnée Extra Supérieure et Complète pour la haute parfumerie.',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Clous de Girofle des Comores (Syzygium aromaticum)',
        url: `${SITE_URL}/#produits`,
        description:
          "Girofle de qualité CG3 et Hand-Picked, riche en eugénol, cultivé sous le soleil des îles de l'archipel.",
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: "Épices d'Exception des Comores (Poivre, Cannelle, Muscade)",
        url: `${SITE_URL}/#produits`,
        description:
          "Filières émergentes d'épices biologiques certifiées pour les marchés d'exportation haut de gamme.",
      },
    ],
  };

  // FAQPage schema — triggers accordion rich results in Google Search
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: "Qu'est-ce que l'OCPR Comores ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "L'Office Comorien des Produits de Rente (OCPR) est un établissement public à caractère administratif et à vocation agricole et économique de l'Union des Comores. Il est chargé de la promotion, du développement, de la réglementation et du contrôle de qualité des filières Vanille Bourbon, Girofle et Ylang-Ylang.",
        },
      },
      {
        '@type': 'Question',
        name: 'Comment obtenir un agrément exportateur de Vanille aux Comores ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Pour obtenir un agrément d'exportateur de vanille aux Comores, soumettez un dossier complet à l'OCPR incluant les documents juridiques de votre société, les justificatifs de capacité de stockage et vos références commerciales. Contactez-nous à info@ocprcomores.com ou au +269 733 23 18.",
        },
      },
      {
        '@type': 'Question',
        name: 'Quelles sont les normes qualité de la Vanille Bourbon des Comores ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "La Vanille Bourbon des Comores est soumise aux normes ISO 5565-1:1999 et ISO 5565-2:1999. L'OCPR contrôle l'humidité (35–38%), le taux de vanilline (minimum 1,6%), la longueur des gousses (minimum 11 cm) et l'absence de moisissures pour garantir la qualité à l'exportation.",
        },
      },
      {
        '@type': 'Question',
        name: "Les Comores sont-elles le premier producteur mondial d'Ylang-Ylang ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oui, les Comores sont le premier producteur mondial d'huile essentielle d'Ylang-Ylang (Cananga odorata), représentant plus de 80% de la production mondiale. L'OCPR supervise la qualité des distillations Extra, Supérieure, I, II, III et Complète.",
        },
      },
      {
        '@type': 'Question',
        name: "Comment contacter l'OCPR Comores ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Contactez l'OCPR par téléphone au +269 733 23 18 ou +269 499 60 25, par email à info@ocprcomores.com, ou en vous rendant à Moroni, Petite Coulée, Rue Caisse des Retraites des Comores. Notre formulaire de contact en ligne est disponible sur ce portail.",
        },
      },
    ],
  };

  // BreadcrumbList — helps Google understand single-page structure
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: "À propos de l'OCPR", item: `${SITE_URL}/#about` },
      { '@type': 'ListItem', position: 3, name: 'Filières & Produits', item: `${SITE_URL}/#produits` },
      { '@type': 'ListItem', position: 4, name: 'Actualités', item: `${SITE_URL}/#actu` },
      { '@type': 'ListItem', position: 5, name: 'Contact', item: `${SITE_URL}/#contact` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
