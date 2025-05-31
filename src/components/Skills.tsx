import React from 'react';
import { motion } from 'framer-motion';

const Skills: React.FC = () => {
  const skillCategories = [
    {
      title: 'Frontend',
      skills: [
        { name: 'React', level: 90, icon: '⚛️' },
        { name: 'Angular', level: 95, icon: '🅰️' },
        { name: 'TypeScript', level: 90, icon: '📘' },
        { name: 'JavaScript', level: 95, icon: '🟨' },
        { name: 'HTML/CSS', level: 90, icon: '🎨' },
        { name: 'Tailwind CSS', level: 85, icon: '💨' }
      ]
    },
    {
      title: 'Backend',
      skills: [
        { name: 'Java', level: 95, icon: '☕' },
        { name: 'Spring Boot', level: 95, icon: '🍃' },
        { name: 'Node.js', level: 80, icon: '🟢' },
        { name: 'Python', level: 75, icon: '🐍' },
        { name: 'REST APIs', level: 95, icon: '🔗' },
        { name: 'Microservices', level: 90, icon: '🔧' }
      ]
    },
    {
      title: 'Database & Cloud',
      skills: [
        { name: 'MySQL', level: 90, icon: '🐬' },
        { name: 'PostgreSQL', level: 85, icon: '🐘' },
        { name: 'MongoDB', level: 80, icon: '🍃' },
        { name: 'AWS', level: 85, icon: '☁️' },
        { name: 'Docker', level: 85, icon: '🐳' },
        { name: 'Kubernetes', level: 75, icon: '⚙️' }
      ]
    },
    {
      title: 'Tools & Others',
      skills: [
        { name: 'Git', level: 95, icon: '📝' },
        { name: 'Jenkins', level: 80, icon: '🔨' },
        { name: 'JIRA', level: 85, icon: '📋' },
        { name: 'Maven', level: 90, icon: '📦' },
        { name: 'Gradle', level: 85, icon: '🏗️' },
        { name: 'Agile/Scrum', level: 90, icon: '🔄' }
      ]
    }
  ];

  return (
    <section id="skills" className="py-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
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
                      />
                    </div>
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

export default Skills;
