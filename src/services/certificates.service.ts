import certificatesData from './data/certificates.json';

export const CertificatesService = {
  getAllCertificates: () => certificatesData.certificates,
  getCertificateByCategory: (category: string) => 
    certificatesData.certificates.filter(cert => cert.category === category)
};