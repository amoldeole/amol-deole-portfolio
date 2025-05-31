import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

const Projects: React.FC = () => {
  const projects = [
    {
      title: 'WMS QVC-Zulily - Lead Consultant',
      company: 'ITC Infotech',
      period: 'Sep 2021 - Present',
      location: 'Pune, India',
      description: 'The WMS stands for Warehouse Management System. It consists of two environments Zulily (corp.zulily.com) and QHX (qvc.zulily.net). The project consisted of various modules based on the operations and the place in the Warehouse this operation performed.',
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop',
      technologies: ['ReactJs', 'Redux', 'Java', 'Spring Boot', 'MySQL', 'Redis', 'RabbitMQ', 'Node.js', 'MongoDB'],
      highlights: 'The main modules are FCS-Core, FCS-Packship, FCS-Picksort, FCS-Inbound where packship and picksort are part of the Outbound module. The Inbound module has Major components like ASN (Advance Shipment Notice) PO (Purchase Order import) Arrivals, Arrival History, Traffic COP, Tracking Products.',
      responsibilities: [
        'Working as Lead Consultant, coordinating with the team for technical discussions, issues and help required to them',
        'Worked on developing backend APIs using Java Spring boot, written test cases and tested APIs using postman integrating it with front end',
        'Worked on front-end stories using ReactJs with micro-front-end architecture which includes Redux for state management',
        'Created various reusable components, modified the existing frameworks created for workflow and reporting as per the requirement',
        'Daily status calls with team, customer and having active discussions on technical and architecturals flow design',
        'Worked on support issues as a primary resource and gained the domain and technical knowledge for other modules like Core, Outbound',
        'Using Datadog, Kibana for tracing logs and issues while working on primary support',
        'Using MySql, Redis, RabbitMQ for backend related API implementations',
        'Worked on complete development and deployment for ASN and PO migration on both front-end - using ReactJs, Redux, NPM, Gulp, Helm and backend - Java 8, Spring boot, MySql with microservices architecture'
      ],
      featured: true,
      year: '2021-Present'
    },
    {
      title: 'OVERSIGHT - Senior Software Engineer',
      company: 'Xpanxion UST Global',
      period: 'June 2019 - Sep 2021',
      location: 'Pune, India',
      description: "Oversight's platform works on customers' financial systems to continuously monitor and analyze all spend transactions for fraud, waste, and misuse. With a consolidated, consistent view of risk across their enterprise, customers can prevent financial loss and optimize spend while strengthening the controls that improve compliance.",
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      technologies: ['Java', 'Spring Boot', 'Angular 7', 'HTML5', 'CSS3', 'JavaScript', 'Prime-Ng', 'Angular Material', 'SQL'],
      highlights: "Oversight's platform works on customers' financial systems to continuously monitor and analyze all spend transactions for fraud, waste, and misuse.",
      responsibilities: [
        'Working as Senior Software Engineer, coordinating with the team for designing Mock-ups, developing Rest APIs',
        'Worked on developing backend APIs using Spring boot, java and testing it using postman integrating it with front end',
        'Analyze requirements, communicate, and resolve issues and assign tasks and monitor the progress of assigned tasks',
        'Coordinate with clients on status, technical discussions, issues and features. perform design, code reviews and enforce related standards',
        'Assist team members in technical issues, mentor team members as they grow in their career',
        'Creating jenkins Jobs, checking for build failure and fixing it, POCs for complex functionality',
        'Worked on different sub projects, like portal, workbench, OCR'
      ],
      featured: true,
      year: '2019-2021'
    },
    {
      title: 'AFS-UPL - Software Engineer',
      company: 'Tudip Technologies',
      period: 'Jan 2018 - June 2019',
      location: 'Pune, India',
      description: 'The concept of Adarsh Farm Services was conceived by UPL Ltd with the objective of providing best farm mechanization technology and services, leading to a transformation in farming through better efficiency, better yields and building direct relationships with the farming community.',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
      technologies: ['Angular 6', 'HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Google Map APIs', 'Google Earth Engine', 'Oracle 10G', 'SQL', 'Java', 'Spring Boot'],
      highlights: 'Adarsh Farm Services has been introduced to ensure around 50% cost saving for the farmers, bringing down their cost of spraying per acre. The biggest benefit was seen by the farmer in getting 10-20% yield increase for the crops treated.',
      responsibilities: [
        'As a multi-skilling team member my primary responsibility is to design and develop an UI and integrate rest APIs',
        'Analysis of the real time issues on the field and providing best solutions on it',
        'Interacting with clients for technical discussions, problems and suggesting feasible solutions',
        'Complete ownership of UI designs and development from scratch',
        'Worked with the team to implement functional flows, Android app designs and support for customers web based and Mobile applications',
        'Visited different states to interact with BDO, FO and Operators for understanding their requirements, problems they are facing in the current system and implementation of new solutions',
        'Complete design of MDM (Master data management) portal',
        'Daily scrum calls, Client meetings, Project demos, and deployment of front end on server (Development, Staging and Production)'
      ],
      featured: true,
      year: '2018-2019'
    },
    {
      title: 'MyLocalAccess - Software Engineer',
      company: 'Tudip Technologies',
      period: 'July 2017 - Aug 2018',
      location: 'Pune, India',
      description: 'My Local Access can make easy and safe tours for tourists of multiple locations all over the world. Admin can add, edit, activate and deactivate tour guides and recruiters of multiple locations. Tour guides get hired by tourists and tour guides can communicate with those tourists using the message feature.',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
      technologies: ['NodeJs', 'Express', 'MongoDB', 'Angular 2', 'HTML5', 'CSS3', 'JavaScript', 'jQuery', 'Google Map APIs'],
      highlights: 'Once a tourist hires a tour guide for a specific time period then tourists can share their live location with their loved ones so that they can track you.',
      responsibilities: [
        'Worked on development of the complete front end using Angular-4',
        'Worked with the team to implement and support web based and Mobile applications',
        'Customer demo, regular internal and client meetings',
        'Implemented Location tracking with live chatting support and multiple roles such as admin, recruiter, tour guide, tourist',
        'Sharing the current location of tourists with their family and friends. Integrating the "Stripe" for the trip payment along with the auto refresh functionality',
        'Deployment of front end on server (Development, Staging and Production)'
      ],
      featured: false,
      year: '2017-2018'
    },
    {
      title: 'Geo-Localization - Intern Software Engineer',
      company: 'MAN Diesel & Turbo India Pvt.Ltd.',
      period: 'Jan 2016 - Jun 2016',
      location: 'Aurangabad, India',
      description: 'The Geo-Localization project is created to keep the track of ships moving across the globe. It includes tracking the locations of ships showing its details. The ArcGIS server is used to keep the data for locations like longitude, latitude and some other details.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      technologies: ['C# .Net', 'Google Map API', 'Javascript', 'MySQL'],
      highlights: 'Used Google MAP SDK to show the locations of the ships along with different filters created to filter the data/ship locations based on Ship Type, Date, Engine Capacity etc.',
      responsibilities: [
        'The Geo-Localization project is created to keep the track of ships moving across the globe. It includes tracking the locations of ships showing its details',
        'The ArcGIS server is used to keep the data for locations like longitude, latitude and some other details',
        'The responsive UI is created using bootstrap, HTML, CSS and media queries',
        'Used Google MAP SDK to show the locations of the ships along with different filters created to filter the data/ship locations based on Ship Type, Date, Engine Capacity etc.'
      ],
      featured: false,
      year: '2016'
    }
  ];

  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <section id="projects" className="py-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-poppins">
            Professional <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Real-world projects that showcase my professional experience and technical expertise
          </p>
        </motion.div>

        {/* Featured Projects */}
        <div className="space-y-12 mb-16">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl card-shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Header with background image */}
              <div 
                className="relative p-8 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${project.image})` }}
              >
                {/* Blur overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                {/* Year badge */}
                <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                    {project.year}
                  </div>
                
                {/* Header content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-primary-300 font-semibold mb-2">
                    <Briefcase size={16} />
                    <span className="text-white">{project.company}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {project.title}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-200">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {project.period}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {project.location}
                    </div>
                  </div>
                </div>
                    </div>

              {/* Content without background */}
              <div className="p-8">
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>
                  {project.highlights && (
                    <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <h4 className="font-semibold text-primary-700 dark:text-primary-300 mb-2">Highlights:</h4>
                      <p className="text-sm text-primary-700 dark:text-primary-300 italic">
                        {project.highlights}
                      </p>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Key Responsibilities:
                    </h4>
                    <ul className="space-y-2">
                      {project.responsibilities.slice(0, 4).map((responsibility, i) => (
                        <li key={i} className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2">
                          <span className="text-primary-500 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0"></span>
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Internship & Early Career Projects
              </h3>
            </motion.div>

            <div className="grid md:grid-cols-1 gap-8">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-xl card-shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Header with background image */}
                  <div 
                    className="relative p-8 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${project.image})` }}
                  >
                    {/* Blur overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                    
                    {/* Year badge */}
                    <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                      {project.year}
                    </div>
                    
                    {/* Header content */}
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-primary-300 font-semibold mb-2">
                        <Briefcase size={16} />
                        <span className="text-white">{project.company}</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {project.title}
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-200">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {project.period}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {project.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content without background */}
                  <div className="p-8">
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {project.highlights && (
                      <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <h4 className="font-semibold text-primary-700 dark:text-primary-300 mb-2">Highlights:</h4>
                        <p className="text-sm text-primary-700 dark:text-primary-300 italic">
                          {project.highlights}
                        </p>
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Key Responsibilities:
                      </h4>
                      <ul className="space-y-2">
                        {project.responsibilities.slice(0, 4).map((responsibility, i) => (
                          <li key={i} className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-primary-500 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0"></span>
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Projects;
