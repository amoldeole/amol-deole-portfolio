import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Cloud, Users, Calendar, MapPin, Phone, Mail, Globe, GraduationCap, User } from 'lucide-react';

const About: React.FC = () => {
  const highlights = [
    {
      icon: Code,
      title: 'Full-Stack Development',
      description: 'Expert in Java, Spring Boot, Angular, React with focus on scalable enterprise applications.'
    },
    {
      icon: Database,
      title: 'Database & Backend',
      description: 'Proficient in MySQL, PostgreSQL, MongoDB with strong API development skills.'
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps',
      description: 'Experienced with AWS, Docker, Jenkins, and modern CI/CD practices.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Strong experience in Agile methodologies and cross-functional team collaboration.'
    }
  ];

  const personalDetails = [
    { icon: Calendar, label: 'Birthday', value: '5 Jan 1993' },
    { icon: Globe, label: 'Website', value: 'ugraya.netlify.app' },
    { icon: Phone, label: 'Phone', value: '+91 7276948326' },
    { icon: MapPin, label: 'City', value: 'Pune, India' },
    { icon: User, label: 'Age', value: '31' },
    { icon: GraduationCap, label: 'Degree', value: 'Master' },
    { icon: Mail, label: 'Email', value: 'amoldeole511@gmail.com' },
    { icon: Code, label: 'Freelance/Fulltime', value: 'Available' }
  ];

  const stats = [
    { number: '12+', label: 'Happy Clients' },
    { number: '20+', label: 'Projects' },
    { number: '9000+', label: 'Hours Of Support' },
    { number: '9+', label: 'Awards' }
  ];

  const interests = [
    { name: 'Programming', icon: '💻', color: '#ffbb2c' },
    { name: 'Swimming', icon: '🏊', color: '#5578ff' },
    { name: 'Drawing', icon: '🎨', color: '#e80368' },
    { name: 'Writing', icon: '✍️', color: '#e361ff' },
    { name: 'Reading', icon: '📚', color: '#47aeff' },
    { name: 'Listening Songs', icon: '🎵', color: '#ffa76e' },
    { name: 'Watching movies, TV Series', icon: '🎬', color: '#11dbcf' },
    { name: 'Volleyball', icon: '🏐', color: '#4233ff' },
    { name: 'Cricket', icon: '🏏', color: '#b2904f' },
    { name: 'Surfing new Technologies', icon: '🌐', color: '#b20969' },
    { name: 'Travel', icon: '✈️', color: '#ff5828' },
    { name: 'Trekking', icon: '🥾', color: '#29cc61' }
  ];

  return (
    <section id="about" className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 pt-20 pb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-poppins">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Learn more about me
          </p>
        </motion.div>

        {/* About Me Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <img
              src="/assets/img/me.jpg"
              alt="Amol Deole"
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Amol Deole - Software Engineer</h3>
            <p className="text-lm text-gray-700 dark:text-gray-300 leading-relaxed mb-6 italic">
              Software Engineer with hands-on experience in full-stack development, 
              specializing in Java, Spring Boot, RESTful APIs, and microservices. 
              Proficient in relational databases like MySQL and Oracle. Skilled in building scalable frontends using micro-frontend architecture with Angular (2+), ReactJS, JavaScript, jQuery, and Material UI. 
              Experienced with DevOps and deployment tools including Git, Jira, Node.js, Nginx, and Apache.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {personalDetails.map((detail, index) => (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <detail.icon className="text-primary-600 dark:text-primary-400" size={18} />
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">{detail.label}:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      {detail.label === 'Email' ? (
                        <a href={`mailto:${detail.value}`} className="hover:text-primary-600">{detail.value}</a>
                      ) : detail.label === 'Website' ? (
                        <a href={`https://${detail.value}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">{detail.value}</a>
                      ) : (
                        detail.value
                      )}
                    </span>
                  </div>
                </motion.div>
          ))}
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Creating superior-original designs for the website structure Creative with good eye for aesthetics: layout,
              grid systems, color theory and typography on web. Strong understanding of creating designs for mobile platforms, 
              and responsive web designs. Understanding of the limitations of web and mobile, with approaches/ideas to flex those boundaries. 
              Sync with recent design standards and trends. Skilled in full stack development using Java, Spring boot, Angular 2 to Angular 8, 
              Reactjs, jQuery, JavaScript, HTML, CSS, SCSS, Material UI.
              </p>
            </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 card-shadow hover:shadow-xl transition-all duration-300">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-3xl font-bold gradient-text mb-2"
                >
                  {stat.number}
                </motion.div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Highlights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl card-shadow hover:shadow-xl transition-all duration-300"
            >
              <div className="gradient-bg w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <highlight.icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {highlight.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Interests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Interests</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl card-shadow hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="text-2xl mb-2">{interest.icon}</div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{interest.name}</h4>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
