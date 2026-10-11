/**
 * Central studio configuration for Protorev Digital.
 * All business details live in this single file.
 * Any unknown or unverified detail uses the string "TODO_CONFIRM".
 * No hyphens, em dashes, or exclamation marks in customer facing copy.
 */

export interface StudioConfig {
  siteTitle: string;
  siteDescription: string;
  canonicalUrl: string;
  studioName: string;
  sheetCode: string;
  revision: string;
  revisionDate: string;
  revisionStatus: string;
  contactEmail: string;
  contactEmailConfirmed: boolean;
  city: string;
  bookingLink: string;
  social: {
    github: string;
    twitter: string;
    linkedin: string;
  };
  privacy: {
    dataRetentionPeriod: string;
    privacyOfficerContact: string;
  };
  pilot: {
    price: string;
    duration: string;
    scopeSummary: string;
  };
}

export const studioConfig: StudioConfig = {
  siteTitle: "Protorev Digital",
  siteDescription: "A new studio for web design, SEO, marketing ops, and workflow automation.",
  canonicalUrl: "https://www.protorevdigital.com",
  studioName: "Protorev Digital",
  sheetCode: "SHEET 01 OF 06",
  revision: "REV A",
  revisionDate: "10 Oct 2026",
  revisionStatus: "Initial public release, no client work published",
  contactEmail: "hello@protorevdigital.com",
  contactEmailConfirmed: false, // Flagged for confirmation in README checklist
  city: "TODO_CONFIRM",
  bookingLink: "TODO_CONFIRM",
  social: {
    github: "TODO_CONFIRM",
    twitter: "TODO_CONFIRM",
    linkedin: "TODO_CONFIRM"
  },
  privacy: {
    dataRetentionPeriod: "TODO_CONFIRM",
    privacyOfficerContact: "TODO_CONFIRM"
  },
  pilot: {
    price: "TODO_CONFIRM",
    duration: "TODO_CONFIRM",
    scopeSummary: "Fixed scope technical evaluation and prototype audit"
  }
};
