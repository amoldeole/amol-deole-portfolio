import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import { ProjectsService } from '../services/projects.service';

const Projects: React.FC = () => {
  const projects = ProjectsService.getAllProjects();

  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
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
