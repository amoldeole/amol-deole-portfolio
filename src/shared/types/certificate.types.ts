export interface Certificate {
  title: string;
  subtitle: string;
  image: string;
  category: string;
  year: string;
  details?: {
    description: string;
    topics: string[];
  };
}

export interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}
