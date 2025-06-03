import React from 'react';
import { motion } from 'framer-motion';
import { dynamicSkillsService } from '../services/skills.service.dynamic';

interface Skill {
  name: string;
  level: number;
  icon: string;
  color?: string;
  description?: string;
  yearsOfExperience?: number;
  isCore?: boolean;
  isFeatured?: boolean;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

const Skills: React.FC = () => {
  const [skillCategories, setSkillCategories] = React.useState<SkillCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const hasFetched = React.useRef(false);

  React.useEffect(() => {
    const abortController = new AbortController();

    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching skills from API...'); // Debug log
        const skillsData = await dynamicSkillsService.getAllSkills();
        
        // Check if the request was aborted
        if (abortController.signal.aborted) {
          return;
        }
        
        console.log('Skills data received:', skillsData); // Debug log
        
        if (skillsData && skillsData.skills && Array.isArray(skillsData.skills)) {
          setSkillCategories(skillsData.skills);
        } else {
          console.error('Invalid skills data structure:', skillsData);
          setError('Invalid data structure received from API');
          setSkillCategories([]);
        }
      } catch (err) {
        if (abortController.signal.aborted) {
          return; // Don't update state if component was unmounted
        }
        
        console.error('Error fetching skills:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch skills');
        setSkillCategories([]);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSkills();

    // Cleanup function
    return () => {
      abortController.abort();
    };
  }, []); // Empty dependency array

  const handleRetry = () => {
    hasFetched.current = false;
    setLoading(true);
    setError(null);
    // Trigger re-fetch by updating a state that's in the dependency array
    window.location.reload();
  };

  if (loading) {
    return (
      <section id="skills" className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading skills...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="skills" className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          <button 
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (!skillCategories || skillCategories.length === 0) {
    return (
      <section id="skills" className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-gray-50 dark:bg-gray-800">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">No skills data available</p>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-poppins">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 card-shadow hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                {category.title}
              </h3>
              
              <div className="space-y-4">
                {category.skills && Array.isArray(category.skills) ? (
                  category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={`${skill.name}-${skillIndex}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{skill.icon}</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {skill.level}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                          viewport={{ once: true }}
                          className="gradient-bg h-2 rounded-full"
                          style={{ 
                            backgroundColor: skill.color || undefined 
                          }}
                        />
                      </div>
                      
                      {skill.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {skill.description}
                        </p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No skills available in this category
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
