import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Eye, EyeOff, FileText, Calendar, GraduationCap } from 'lucide-react';

const Resume: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false);

  const education = [
    {
      degree: 'Master of Computer Application (MCA)',
      institution: 'Government College of Engineering, Aurangabad (Maharashtra)',
      year: '2013 - 2016',
      description: 'Government College of Engineering, Aurangabad is an autonomous engineering Institute in Maharashtra state of India. It is affiliated to the Dr. Babasaheb Ambedkar Marathwada University and was established in 1960.'
    },
    {
      degree: 'Bachelor of Computer Application (BCA)',
      institution: 'Rajasthan Aaryan College, Washim',
      year: '2011 - 2013',
      description: 'The Institute holds pride in being one of the selected few colleges in India to have accreditation from NAAC at the A Grade. College with Potential for Excellence (CPE) status awarded by UGC.'
    },
    {
      degree: 'Intermediate Higher Sec. Schools(HSC) (12th)',
      institution: 'N. N. Mundada Vidhyalaya & Jr. College, Malegaon',
      year: '2009 - 2011',
      description: 'Higher Secondary Certificate with Science stream'
    },
    {
      degree: 'State Board of Secondary Schools(SSC) (10th)',
      institution: 'Dr. Vitthalrao Jogdand Vidyalaya, Dawha',
      year: '2008 - 2009',
      description: 'Vitthalrao Jogdand Vidyalaya was established in 1997 and it is managed by the Pvt. Aided. The school consists of Grades from 5 to 12.'
    }
  ];

  const competencyMatrix = [
    'Planning & Execution',
    'Collaboration Skills',
    'Requirement Study, Analysis & Gathering',
    'Issue Handling & Resolution',
    'Maintenance & Implementation'
  ];

  const careerContour = [
    {
      role: 'Lead Consultant',
      company: 'ITC Infotech',
      location: 'Cerebrum IT Park, Kalyani Nagar, Pune',
      period: '22nd Sep 2021 to till date',
      url: 'https://www.itcinfotech.com'
    },
    {
      role: 'Sr. Software Engineer',
      company: 'Xpanxion UST Global pvt. ltd',
      location: 'Pune',
      period: '25th June 2019 - 17th Sep 2021',
      url: 'https://www.xpanxion.com'
    },
    {
      role: 'Software Engineer',
      company: 'Tudip Technologies pvt. ltd',
      location: 'wakad, Pune',
      period: '1st August 2016 to 22 June 2019',
      url: 'https://tudip.com'
    }
  ];

  return (
    <section id="resume" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-poppins">
            Check My <span className="gradient-text">Resume</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Download my complete resume or preview it below
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="/amol-deole-portfolio/assets/files/Amol_Deole_8+Years.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-bg text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Download size={20} />
              Download Resume
            </motion.a>
            <motion.button
              onClick={() => setShowPreview(!showPreview)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400 px-8 py-4 rounded-full font-semibold hover:bg-primary-600 hover:text-white dark:hover:bg-primary-400 dark:hover:text-gray-900 transition-all duration-300 flex items-center gap-2"
            >
              {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </motion.button>
          </div>
        </motion.div>

        {/* PDF Preview */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 card-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="text-primary-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resume Preview</h3>
                </div>
                <div className="w-full h-[800px] border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <embed
                    src="/amol-deole-portfolio/assets/files/Amol_Deole_8+Years.pdf"
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Career Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Career Summary</h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 card-shadow">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                Contact: +91 7276948326
              </span>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                Email: amoldeole511@gmail.com
              </span>
            </div>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Having a total <strong>8+ years</strong> of IT industry experience and 6 Months of Internship 
                experience with strong technical skills in complex web development including experience in system 
                analysis, design, workflow architecture, development, testing and maintenance of web based applications.
              </p>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Experience in developing highly interactive web applications utilizing Java, Spring Boot with 
                microservices, Restful API's, Google map API's. In depth knowledge of web technologies and standards 
                to deliver the best experiences across web and mobile devices including responsive Web-UI with Angular-2+ 
                versions, ReactJs, JavaScript, Typescript with object oriented programming cross browser / cross device 
                compatibility using material UI, Kendo-UI, HTML5, CSS3, CSS, SASS, JavaScript, jQuery, AJAX, JSON, Twitter Bootstrap.
                    </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Knowledge of micro-front end applications using Angular 12, webpack 5 and module federation. 
                Knowledge of AWS, Google Cloud, Docker, Jenkins, CI-CD Datadog, Kibana, RabbitMq. 
                Worked with various version control systems - Git and GitLab, SVN.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Good understanding of Model View Controller MVC, MVVC, Factory design patterns. 
                Strong knowledge of modern frontend technologies, best practices, and load speed optimization techniques. 
                Excellent analytical, programming skill and ability to work in a team as well as an individual environment.
                    </p>
                  </div>

            {/* Competency Matrix */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Competency Matrix:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {competencyMatrix.map((competency, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{competency}</span>
                </div>
            ))}
          </div>
            </div>

            {/* Career Contour */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Career Contour:</h4>
              <div className="space-y-3">
                {careerContour.map((career, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      <strong>{career.role}</strong> at{' '}
                      <a href={career.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">
                        {career.company}
                      </a>
                      {', '}{career.location} from {career.period}.
                    </p>
              </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Education</h3>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 card-shadow hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="gradient-bg w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="text-white" size={24} />
      </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {edu.degree}
                    </h4>
                    <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                      {edu.institution}
                    </p>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm mb-2">
                      <Calendar size={14} />
                      {edu.year}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {edu.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Resume;