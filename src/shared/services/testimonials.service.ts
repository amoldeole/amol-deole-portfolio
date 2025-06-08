import testimonialsData from '../../assets/data/testimonials.json';

export const TestimonialsService = {
  getAllTestimonials: () => testimonialsData.testimonials,
  getTestimonialsByRating: (rating: number) => 
    testimonialsData.testimonials.filter(testimonial => testimonial.rating === rating)
};