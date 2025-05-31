import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import CertificateModal from './CertificateModal';

interface Certificate {
  title: string;
  subtitle: string;
  image: string;
  category: string;
  year: string;
}

const Certificates: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('*');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const certificates: Certificate[] = [
    {
      title: 'Generative AI',
      subtitle: 'Power Of Gen AI',
      image: '/amol-deole-portfolio/assets/certificates/Amol Ashok Deole_page-0001.jpg',
      category: 'Gen-AI',
      year: '2024'
    },
    {
      title: 'Angular Intermediate',
      subtitle: 'HackerRank',
      image: '/amol-deole-portfolio/assets/hacker-rank/Angular-Intermediate-HackerRank.png',
      category: 'angular',
      year: '2023'
    },
    {
      title: 'Angular Basics',
      subtitle: 'HackerRank',
      image: '/amol-deole-portfolio/assets/hacker-rank/Angular-Basics-HackerRank.png',
      category: 'angular',
      year: '2023'
    },
    {
      title: 'Java Basics',
      subtitle: 'HackerRank',
      image: '/amol-deole-portfolio/assets/hacker-rank/Java-Basics-HackerRank.png',
      category: 'java',
      year: '2023'
    },
    {
      title: 'JavaScript Intermediate',
      subtitle: 'HackerRank',
      image: '/amol-deole-portfolio/assets/hacker-rank/JavaScript-Intermediate-HackerRank.png',
      category: 'javascript',
      year: '2023'
    },
    {
      title: 'JavaScript Basic',
      subtitle: 'HackerRank',
      image: '/amol-deole-portfolio/assets/hacker-rank/JavaScript-Basic-HackerRank.png',
      category: 'javascript',
      year: '2023'
    },
    {
      title: 'SQL Intermediate',
      subtitle: 'HackerRank',
      image: '/amol-deole-portfolio/assets/hacker-rank/SQL-Intermediate-HackerRank.png',
      category: 'SQL',
      year: '2023'
    },
    {
      title: 'SQL Basic',
      subtitle: 'HackerRank',
      image: '/amol-deole-portfolio/assets/hacker-rank/SQL-Basic-HackerRank.png',
      category: 'SQL',
      year: '2023'
    },
    {
      title: 'Problem Solving Intermediate',
      subtitle: 'HackerRank',
      image: '/amol-deole-portfolio/assets/hacker-rank/ProblemSolving-Intermediate-HackerRank.png',
      category: 'problem-solving',
      year: '2023'
    },
    {
      title: 'Problem Solving Basic',
      subtitle: 'HackerRank',
      image: '/amol-deole-portfolio/assets/hacker-rank/ProblemSolving-Basic-HackerRank.png',
      category: 'problem-solving',
      year: '2023'
    },
    {
      title: 'CSS',
      subtitle: 'HackerRank',
      image: '/amol-deole-portfolio/assets/hacker-rank/CSS-HackerRank.png',
      category: 'CSS',
      year: '2023'
    },
    {
      title: 'Quarterly Award',
      subtitle: 'All Rounder',
      image: '/amol-deole-portfolio/assets/certificates/Quarterly-Award Certificate.jpg',
      category: 'Award',
      year: '2023'
    }
  ];

  const filters = [
    { name: 'All', value: '*' },
    { name: 'Generative AI', value: 'Gen-AI' },
    { name: 'Angular', value: 'angular' },
    { name: 'Java', value: 'java' },
    { name: 'JavaScript', value: 'javascript' },
    { name: 'SQL', value: 'SQL' },
    { name: 'Problem Solving', value: 'problem-solving' },
    { name: 'CSS', value: 'CSS' },
    { name: 'Awards', value: 'Award' }
  ];

  const filteredCertificates = activeFilter === '*' 
    ? certificates 
    : certificates.filter(cert => cert.category === activeFilter);

  const handleCertificateClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  return (
    <section id="certificates" className="py-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-poppins">
            Certificates & <span className="gradient-text">Awards</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            My professional certifications and achievements
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {filters.map((filter) => (
            <motion.button
              key={filter.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.value
                  ? 'gradient-bg text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {filter.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCertificates.map((certificate, index) => (
            <motion.div
              key={certificate.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden card-shadow hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => handleCertificateClick(certificate)}
            >
              <div className="relative overflow-hidden group">
                <img
                  src={certificate.image}
                  alt={certificate.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {certificate.year}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="bg-white text-gray-900 px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 font-medium"
                  >
                    View Details
                  </motion.div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {certificate.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {certificate.subtitle}
                </p>
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-primary-600" />
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-medium uppercase tracking-wide">
                    {certificate.category.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        certificate={selectedCertificate}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default Certificates;