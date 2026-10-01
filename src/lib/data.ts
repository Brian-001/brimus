import { TeamMember, Experience, Service } from "@/types";
import {
  FileText,
  TrendingUp,
  Shield,
  Users,
  CheckCircle2,
  Building2,
  BarChart3,
  Coins,
  type LucideIcon,
} from "lucide-react";

export const services: Service[] = [
  {
    id: "assurance",
    title: "Assurance",
    description:
      "Comprehensive audit and assurance solutions to give stakeholders confidence in financial information and internal controls.",
    longDescription:
      "Comprehensive audit and assurance solutions that provide stakeholders with confidence in financial information, internal controls, and governance frameworks. Our statutory audits comply with International Standards on Auditing (ISA) and ICPAK requirements.",
    icon: "FileText",
    items: [
      "Statutory Audit",
      "Internal Audit",
      "Forensic Audit",
      "Information Systems Audit",
      "Compliance Audit",
      "Due Diligence",
    ],
  },
  {
    id: "tax",
    title: "Tax",
    description:
      "Strategic tax planning and compliance to optimize your tax position while ensuring full regulatory adherence.",
    longDescription:
      "Strategic tax planning and full compliance services to optimise your tax position while ensuring complete regulatory adherence. We handle corporate returns, personal tax, VAT, PAYE, and represent clients in tax disputes.",
    icon: "TrendingUp",
    items: [
      "Corporate Tax",
      "Personal Tax",
      "VAT & Withholding Tax",
      "PAYE Compliance",
      "Tax Planning & Advisory",
      "Tax Appeals & Disputes",
    ],
  },
  {
    id: "advisory",
    title: "Advisory",
    description:
      "Expert advisory to support strategic decision-making, risk management, and business growth.",
    longDescription:
      "Expert advisory services to support strategic decision-making, risk identification, and business growth. From due diligence to policy drafting, we provide actionable insights that drive value.",
    icon: "Shield",
    items: [
      "Due Diligence",
      "Strategic Planning",
      "Feasibility Studies",
      "Risk Management",
      "Business Valuations",
      "Policy Drafting & Analysis",
    ],
  },
  {
    id: "outsourcing",
    title: "Business Outsourcing & PM",
    description:
      "End-to-end project management and business outsourcing solutions for development and research initiatives.",
    longDescription:
      "End-to-end project management and business outsourcing solutions for development and research initiatives. We deliver M&E frameworks, baseline surveys, capacity building, and fund management support.",
    icon: "Users",
    items: [
      "Monitoring & Evaluation (M&E)",
      "Baseline Surveys",
      "Fund Management Support",
      "Project Management",
      "Capacity Building",
      "Research & Data Collection",
    ],
  },
];

export const iconMap: Record<string, LucideIcon> = {
  FileText,
  TrendingUp,
  Shield,
  Users,
  CheckCircle2,
  Building2,
  BarChart3,
  Coins,
};

export const teamMembers: TeamMember[] = [
  {
    name: "Onesmus Murimi",
    role: "Founder & Lead Partner",
    bio: "Chartered Accountant with over 20 years of experience in audit, tax advisory, and strategic financial management. Former senior manager at a Big 4 firm, Onesmus brings deep expertise across East African markets and international regulatory frameworks.",
  },
  {
    name: "Brian Kimathi",
    role: "Co-Founder & Director",
    bio: "An experienced financial consultant and researcher specializing in policy analysis, market research, and development sector advisory. Brian has led engagements for USAID, UNDP, World Bank, and major SACCOs across Kenya and East Africa.",
  },
  {
    name: "Senior Associates",
    role: "Professional Team",
    bio: "A dedicated team of senior professionals with expertise spanning statutory audit, tax compliance, forensic investigation, systems audit, and project management. All team members maintain active memberships with ICPAK and relevant professional bodies.",
  },
];

export const experiences: Experience[] = [
  {
    id: "1",
    client: "USAID Kenya",
    sector: "Development / NGO",
    description:
      "Provided comprehensive audit and financial advisory services for multiple USAID-funded programs across health, education, and economic growth sectors.",
  },
  {
    id: "2",
    client: "UNDP East Africa",
    sector: "Development / NGO",
    description:
      "Delivered financial management assessments, M&E framework development, and policy analysis for UNDP regional programs.",
  },
  {
    id: "3",
    client: "World Bank Group",
    sector: "International Development",
    description:
      "Conducted due diligence and feasibility studies for infrastructure and private sector development projects in East Africa.",
  },
  {
    id: "4",
    client: "Major SACCOs in Kenya",
    sector: "Financial Services",
    description:
      "Delivered statutory audits, internal audit reviews, and IT audit services for savings and credit cooperatives with assets exceeding KSh 5 billion.",
  },
  {
    id: "5",
    client: "Leading Kenyan Corporations",
    sector: "Private Sector",
    description:
      "Provided tax planning, strategic advisory, and compliance services to multinational and local corporations across manufacturing, real estate, and financial services.",
  },
  {
    id: "6",
    client: "Government Agencies",
    sector: "Public Sector",
    description:
      "Supported policy drafting, regulatory compliance reviews, and public financial management reforms for Kenyan government entities.",
  },
];
