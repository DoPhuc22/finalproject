import React from 'react';

const testimonials = [
  {
    id: 1,
    name: 'John Doe',
    feedback: 'I absolutely love my new watch! The quality is outstanding and it looks fantastic.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Jane Smith',
    feedback: 'Great selection of watches and excellent customer service. Highly recommend!',
    rating: 4,
  },
  {
    id: 3,
    name: 'Alice Johnson',
    feedback: 'The best shopping experience I have ever had. Will definitely be back for more!',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-10 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">What Our Customers Say</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic">"{testimonial.feedback}"</p>
            <h3 className="mt-4 font-semibold">{testimonial.name}</h3>
            <div className="flex items-center mt-2">
              {Array.from({ length: testimonial.rating }, (_, index) => (
                <span key={index} className="text-yellow-500">★</span>
              ))}
              {Array.from({ length: 5 - testimonial.rating }, (_, index) => (
                <span key={index} className="text-gray-300">★</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;