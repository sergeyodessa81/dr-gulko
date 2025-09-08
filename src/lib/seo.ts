import type { Metadata } from "next"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article" | "profile"
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}

export function generateSEO({
  title = "Dr. Gulko - Medical Education Platform",
  description = "Advanced medical education platform for trauma and orthopedic surgery with AI-powered learning experiences.",
  keywords = ["trauma surgery", "orthopedics", "medical education", "AI learning"],
  image = "/og-image.jpg",
  url = "https://drgulko.com",
  type = "website",
  publishedTime,
  modifiedTime,
  authors = ["Dr. Gulko"],
}: SEOProps): Metadata {
  return {
    title,
    description,
    keywords,
    authors: authors.map((name) => ({ name })),
    openGraph: {
      title,
      description,
      type,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: "Dr. Gulko Medical Education",
      locale: "en_US",
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export function generateMedicalArticleStructuredData({
  title,
  description,
  author,
  publishedDate,
  modifiedDate,
  url,
  image,
}: {
  title: string
  description: string
  author: string
  publishedDate: string
  modifiedDate?: string
  url: string
  image?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalScholarlyArticle",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author,
      jobTitle: "Trauma & Orthopedic Surgeon",
    },
    datePublished: publishedDate,
    ...(modifiedDate && { dateModified: modifiedDate }),
    url,
    ...(image && { image }),
    publisher: {
      "@type": "Organization",
      name: "Dr. Gulko Medical Education Platform",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }
}
