export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
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
}

export interface InquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  services: string[];
  message: string;
}
