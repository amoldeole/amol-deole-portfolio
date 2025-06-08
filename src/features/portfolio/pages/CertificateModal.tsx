import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { CertificateModalProps } from '../../../shared/types/certificate.types';

const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, isOpen, onClose }) => {
  if (!certificate) return null;

  const getCertificateDetails = (category: string, title: string) => {
    const details: Record<string, any> = {
      'angular': {
        description: 'It covers topics like MVC Frameworks, Components (Angular, Dynamic, Styling), TypeScript, Two Way Binding and Form Validation.',
        topics: ['MVC Frameworks', 'Angular Components', 'Dynamic Styling', 'TypeScript', 'Two Way Binding', 'Form Validation']
      },
      'java': {
        description: 'It will cover basic topics in Java language such as classes, data structures, inheritance, exception handling, etc. You are expected to be proficient in either Java 7 or Java 8.',
        topics: ['Classes', 'Data Structures', 'Inheritance', 'Exception Handling', 'Java 7/8 Features']
      },
      'javascript': {
        description: title.includes('Intermediate') 
          ? 'It covers topics like Design Patterns, Memory management, concurrency model, and event loops, among others.'
          : 'It covers topics like Routing, NgModules, Observables for data transmission and event handling, Dependency Injections, and APIs.',
        topics: title.includes('Intermediate') 
          ? ['Design Patterns', 'Memory Management', 'Concurrency Model', 'Event Loops']
          : ['Routing', 'NgModules', 'Observables', 'Dependency Injection', 'APIs']
      },
      'problem-solving': {
        description: title.includes('Intermediate')
          ? 'It covers topics of Data Structures (such as HashMaps, Stacks and Queues) and Algorithms (such as Optimal Solutions).'
          : 'It covers basic topics of Data Structures (such as Arrays, Strings) and Algorithms (such as Sorting and Searching).',
        topics: title.includes('Intermediate')
          ? ['HashMaps', 'Stacks', 'Queues', 'Optimal Algorithms']
          : ['Arrays', 'Strings', 'Sorting', 'Searching']
      },
      'SQL': {
        description: title.includes('Intermediate')
          ? 'It includes complex joins, unions, and sub-queries.'
          : 'It includes simple queries, relationships, and aggregators.',
        topics: title.includes('Intermediate')
          ? ['Complex Joins', 'Unions', 'Sub-queries', 'Advanced SQL']
          : ['Simple Queries', 'Relationships', 'Aggregators', 'Basic SQL']
      },
      'CSS': {
        description: 'It covers CSS fundamentals, styling techniques, responsive design, and modern CSS features.',
        topics: ['CSS Fundamentals', 'Styling Techniques', 'Responsive Design', 'Modern CSS Features']
      },
      'Gen-AI': {
        description: 'Comprehensive course on Generative AI technologies, covering machine learning, neural networks, and AI applications.',
        topics: ['Machine Learning', 'Neural Networks', 'AI Applications', 'Generative Models']
      },
      'Award': {
        description: 'Recognition for outstanding performance and contribution as an all-rounder team member.',
        topics: ['Leadership', 'Team Collaboration', 'Technical Excellence', 'Innovation']
      }
    };

    return details[category] || {
      description: 'Professional certification demonstrating expertise in the field.',
      topics: ['Professional Skills', 'Technical Knowledge', 'Best Practices']
    };
  };

  const details = getCertificateDetails(certificate.category, certificate.title);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Certificate Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Certificate Image */}
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={certificate.image}
                      alt={certificate.title}
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                    <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {certificate.year}
                    </div>
                  </div>
                  
                  <motion.a
                    href={certificate.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <ExternalLink size={20} />
                    View Full Certificate
                  </motion.a>
                </div>

                {/* Certificate Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {certificate.title}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                      {certificate.subtitle}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Category & Client
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex">
                          <span className="font-medium text-gray-700 dark:text-gray-300 w-20">Category:</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {certificate.category.replace('-', ' ')}
                          </span>
                        </li>
                        <li className="flex">
                          <span className="font-medium text-gray-700 dark:text-gray-300 w-20">Client:</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {certificate.subtitle}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Description
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {details.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Topics Covered
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {details.topics.map((topic: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CertificateModal;