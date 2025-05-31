import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Linkedin } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Bhushan Patil',
      role: 'Sr Lead - Applications Development at TransUnion',
      testimonial: 'I have worked with Amol for quite a sometime now as his colleague. Amol is smart, hardworking, technically savvy and has in-depth knowledge about Angular and Java technologies. His problem-solving attitude is very much appreciated by the teams. He also possesses good leadership qualities.',
      rating: 5
    },
    {
      name: 'Amol Bhujbal',
      role: 'Software Engineer II at Avaya Software',
      testimonial: 'I worked with Amol on multiple stories, projects. He is very talented, provided unique solutions on multiple occasions. Amol has very good grasp on Angular and showed interest as full stack developer by working on Java based backend also.',
      rating: 5
    },
    {
      name: 'Pranay Kohad',
      role: 'Senior Software Engineer at Maveric Systems Limited',
      testimonial: 'One of the best front end developer that I worked with.',
      rating: 5
    },
    {
      name: 'Manoj Kumar',
      role: 'Web Developer at AGILIAD',
      testimonial: 'I know Amol Deole as a hard working and very serious team player. I learned a lot from working with Amol. Amol is a great UI developer with good understanding of Javascript, jQuery, DOM, and Angular.',
      rating: 5
    },
    {
      name: 'Harshal Yeole',
      role: 'MS Information Technology @ ASU | AWS Certified | Former Module Lead & Full Stack Developer',
      testimonial: 'Amol is an amazing professional who brings all of the skills and expertise in programming and UI design. It was indeed a great pleasure working with Amol for two years at Tudip Technologies.',
      rating: 5
    },
    {
      name: 'Saurabh Mahajan',
      role: 'Tech Lead || React, JavaScript',
      testimonial: 'Amol is one of the best developers I know. He is expert in angular JS and is a team player.',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-poppins">
            LinkedIn <span className="gradient-text">Recommendations</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            What my colleagues and peers say about working with me
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 card-shadow hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-4">
                <Linkedin className="text-blue-600" size={20} />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={16} />
                  ))}
                </div>
              </div>
              
              <Quote className="text-primary-600 mb-4" size={24} />
              
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                "{testimonial.testimonial}"
              </p>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
