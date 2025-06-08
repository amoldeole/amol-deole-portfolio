import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import { ProjectsService } from '../../../shared/services/projects.service';
import { Project } from '../../../shared/types/project.types';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectsData = await ProjectsService.getAllProjects();
        setProjects(projectsData);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 pt-20 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 pt-20 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </section>
    );
  }

  const featuredProjects = projects.filter((project: Project) => project.featured);
  const otherProjects = projects.filter((project: Project) => !project.featured);

  return (
    <section id="projects" className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 pt-20 pb-2">
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
          {featuredProjects.map((project: Project, index: number) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl card-shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Header with background image */}
              <div
                className="relative p-8 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${project.images[0] || ''})` }}
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
                    <span className="text-white">{project.role || 'Developer'}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3">
                    {project.title}
                  </h3>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-200">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present'}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {project.category}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content without background */}
              <div className="p-8">
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>
                {project.shortDescription && (
                  <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <h4 className="font-semibold text-primary-700 dark:text-primary-300 mb-2">Highlights:</h4>
                    <p className="text-sm text-primary-700 dark:text-primary-300 italic">
                      {project.shortDescription}
                    </p>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Key Features:
                  </h4>
                  <ul className="space-y-2">
                    {project.features.slice(0, 4).map((feature: string, i: number) => (
                      <li key={i} className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-primary-500 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string, i: number) => (
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
                Other Projects
              </h3>
            </motion.div>

            <div className="grid md:grid-cols-1 gap-8">
              {otherProjects.map((project: Project, index: number) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-900 rounded-xl card-shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Header with background image */}
                  <div
                    className="relative p-8 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${project.images[0] || ''})` }}
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
                        <span className="text-white">{project.role || 'Developer'}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-3">
                        {project.title}
                      </h3>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-200">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present'}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {project.category}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content without background */}
                  <div className="p-8">
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {project.shortDescription && (
                      <div className="mb-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <h4 className="font-semibold text-primary-700 dark:text-primary-300 mb-2">Highlights:</h4>
                        <p className="text-sm text-primary-700 dark:text-primary-300 italic">
                          {project.shortDescription}
                        </p>
                      </div>
                    )}

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Key Features:
                      </h4>
                      <ul className="space-y-2">
                        {project.features.slice(0, 4).map((feature: string, i: number) => (
                          <li key={i} className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2">
                            <span className="text-primary-500 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string, i: number) => (
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
