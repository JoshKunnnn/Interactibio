import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: "My 8-year-old son has never been this excited about science. He asked to redo the volcano experiment twice! It's brilliant having something both fun and educational to share after school.",
      author: "Hannah R.",
      role: "Parent from UK",
      avatar: "👩",
      backgroundColor: "#E6E6FA"
    },
    {
      id: 2,
      text: "The activities are incredibly well thought-out. I use the logic puzzles as warm-ups in my classroom — it gets the kids thinking right from the start. Highly recommend it for teachers looking to make STEM more accessible.",
      author: "James Carter",
      role: "Year 5 Teacher, Canada",
      avatar: "👨‍🏫",
      backgroundColor: "#FFB6C1"
    },
    {
      id: 3,
      text: "As a working parent, I love how everything is ready to go. No prep needed, just pure fun with learning. My daughter actually chooses a math game over TV now — never thought I'd say that!",
      author: "Aisha K.",
      role: "Mom of two, London",
      avatar: "👩‍💼",
      backgroundColor: "#FFFFE0"
    }
  ];

  return (
    <section className="testimonials section">
      <div className="container">
        <h2 className="section-title" style={{ color: '#8E44AD' }}>
          Parent Reviews & Teacher Testimonials
        </h2>
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className="testimonial-card"
              style={{ backgroundColor: testimonial.backgroundColor }}
            >
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.avatar}</div>
                <div className="author-info">
                  <h4 className="author-name">{testimonial.author}</h4>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="testimonials-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 