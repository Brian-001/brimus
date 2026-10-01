import {
  CONTACT_EMAIL,
  GOOGLE_MAPS_URL,
  LINKEDIN_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/constants";

const organization = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: SITE_NAME,
  alternateName: "Brimus Consultancy",
  url: SITE_URL,
  logo: `${SITE_URL}/images/brimus_logo.svg`,
  image: `${SITE_URL}/images/og-image.png`,
  slogan: SITE_TAGLINE,
  description:
    "Professional audit, tax, advisory, research and strategic management services for businesses, NGOs, development organisations and public institutions in Kenya and across Africa.",
  email: CONTACT_EMAIL,
  telephone: "+254722366503",
  hasMap: GOOGLE_MAPS_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mang'u Road",
    addressLocality: "Thika",
    addressRegion: "Kiambu",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.0434998,
    longitude: 37.0584989,
  },
  sameAs: [LINKEDIN_URL],
};

export function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}

interface ProfileJsonLdProps {
  name: string;
  role: string;
  bio: string;
  slug: string;
}

export function ProfileJsonLd({ name, role, bio, slug }: ProfileJsonLdProps) {
  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name,
      jobTitle: role,
      description: bio,
      url: `${SITE_URL}/about/${slug}`,
      worksFor: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }}
    />
  );
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  date: string;
  slug: string;
}

export function ArticleJsonLd({ title, description, date, slug }: ArticleJsonLdProps) {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: `${date}T00:00:00.000Z`,
    dateModified: `${date}T00:00:00.000Z`,
    mainEntityOfPage: `${SITE_URL}/insights/${slug}`,
    image: `${SITE_URL}/images/og-image.png`,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/brimus_logo.svg`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
    />
  );
}
