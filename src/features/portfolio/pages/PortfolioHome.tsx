import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaSkype } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SocialLinks, { SocialLink } from '../../../shared/components/SocialLinks';

const PortfolioHome: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const socialLinks: SocialLink[] = [
    { icon: FaGithub, href: 'https://github.com/amoldeole', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/amol-deole-98bb847b/', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com/Amoldeole', label: 'Twitter' },
    { icon: FaFacebook, href: 'https://www.facebook.com/amol.deole', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://www.instagram.com/deole05', label: 'Instagram' },
    { icon: FaSkype, href: 'https://join.skype.com/invite/XNC4oRwWNQLp', label: 'Skype' },
    { icon: Mail, href: 'mailto:amoldeole511@gmail.com', label: 'Email' }
  ];

  return (
    <section
      id="home"
      className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 pt-20 pb-2"
    >
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-4"
          >
            <div className="relative inline-block">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="/assets/img/me.jpg"
                alt="Amol Deole"
                className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto mb-4 shadow-2xl border-4 border-white dark:border-gray-700"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 opacity-20 blur-xl"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-3">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 font-poppins">
              <span className="gradient-text">Amol Deole</span>
            </h1>
            <h2 className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-3 font-medium">
              I'm a passionate <span className="gradient-text font-semibold">Software Engineer</span> with a demonstrated history of working in the information technology and service industry.
            </h2>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto leading-relaxed"
          >
            Software Engineer with experience in full stack development in Java, Spring Boot, Rest APIs,
            Microservices, MySQL, Oracle. Microfront-end using Angular 2+ versions, ReactJs, Javascript,
            JQuery, Material, Git, Jira, Node, Nginx, Apache.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6"
          >
            <Link
              to="/contact"
              className="gradient-bg text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <Mail size={18} />
              Get In Touch
            </Link>
            <motion.a
              href="/assets/files/Amol_Deole_8+Years.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400 px-6 py-2 rounded-full font-semibold hover:bg-primary-600 hover:text-white dark:hover:bg-primary-400 dark:hover:text-gray-900 transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <Download size={18} />
              Download Resume
            </motion.a>
          </motion.div>

          <SocialLinks links={socialLinks} className="justify-center gap-4 mb-6 [&>a]:rounded-full" />

          <motion.div
            variants={itemVariants}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-400 dark:text-gray-500 rounded-lg"
          >
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioHome;
