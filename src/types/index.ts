export interface TeamMember {
  name: string;
  slug?: string;
  role: string;
  bio: string;
  image?: string;
  expertise?: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  items?: string[];
  icon: string;
}

export interface Experience {
  id: string;
  client: string;
  sector: string;
  description: string;
  year?: string;
  location?: string;
  services?: string[];
  challenge?: string;
  approach?: string;
  outcome?: string;
}

export interface InquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  services: string[];
  message: string;
}
