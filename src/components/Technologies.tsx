import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Server, TestTube, Monitor, Wrench, Settings, Globe, Package } from 'lucide-react';

const Technologies: React.FC = () => {
  const technologyCategories = [
    {
      title: 'Backend Technologies',
      icon: Server,
      color: 'from-blue-500 to-blue-600',
      technologies: [
        'Core Java', 'JAVA8', 'Spring boot', 'Spring MVC', 
        'Spring security', 'Microservices', 'Restful Web Services'
      ]
    },
    {
      title: 'Web Technologies',
      icon: Code,
      color: 'from-green-500 to-green-600',
      technologies: [
        'Angular 2 to Angular 14', 'Angular Material', 'ReactJs', 'Micro front-end', 
        'Kendo-UI', 'JavaScript', 'jQuery', 'Google map APIs', 'AJAX', 'JSON', 
        'Twitter Bootstrap', 'HTML/HTML5', 'CSS2/CSS3', 'SAAS', 'LESS', 'Angular animations'
      ]
    },
    {
      title: 'Platform Used',
      icon: Monitor,
      color: 'from-purple-500 to-purple-600',
      technologies: ['Windows', 'Linux', 'Mac']
    },
    {
      title: 'Testing and Frameworks',
      icon: TestTube,
      color: 'from-red-500 to-red-600',
      technologies: ['Junit with Mockito', 'Karma', 'Jasmin', 'Protractor']
    },
    {
      title: 'Web Servers',
      icon: Globe,
      color: 'from-orange-500 to-orange-600',
      technologies: ['Apache Tomcat 7.0', 'Nginx', 'Express']
    },
    {
      title: 'Database',
      icon: Database,
      color: 'from-teal-500 to-teal-600',
      technologies: ['Oracle 10G', 'MongoDB', 'MySql', 'Oracle', 'MongoDB', 'Redis', 'SQL']
    },
    {
      title: 'Development Tool',
      icon: Settings,
      color: 'from-indigo-500 to-indigo-600',
      technologies: [
        'Vscode', 'Eclipse', 'Spring Tool suite', 'Webstorm', 'Phpstorm', 'Atom'
      ]
    },
    {
      title: 'Build Tool',
      icon: Package,
      color: 'from-yellow-500 to-yellow-600',
      technologies: ['Maven', 'Webpack', 'NPM', 'NVM', 'CLI', 'Gulp', 'Bower']
    },
    {
      title: 'Other Tools & Technologies',
      icon: Wrench,
      color: 'from-pink-500 to-pink-600',
      technologies: [
        'NPME', 'Node', 'CLI - AWS', 'GCP', 'React', 'Angular', 'JIRA', 'Bitbucket', 
        'Confluence', 'Steersimple', 'Redmine', 'Jenkins CI-CD', 'Kubernetes', 
        'Docker', 'DataDog', 'Kibana', 'RabbitMq'
      ]
    }
  ];

  return (
    <section id="technologies" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-poppins">
            <span className="gradient-text">Technologies</span> & Tools
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive overview of technologies, frameworks, and tools I work with
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologyCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 card-shadow hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mr-4`}>
                  <category.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {category.title}
                </h3>
              </div>
              
              <div className="space-y-3">
                {category.technologies.map((tech, techIndex) => (
                  <motion.div
                    key={techIndex}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (index * 0.1) + (techIndex * 0.05) }}
                    viewport={{ once: true }}
                    className="flex items-center"
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {tech}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technologies;