import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      id: 1,
      question: "Do I need to be good at science or math to use this with my child?",
      answer: "Not at all! Each activity comes with simple, step-by-step instructions. Whether you're a parent or a teacher, you'll find everything beginner-friendly."
    },
    {
      id: 2,
      question: "Are the activities printable or online only?",
      answer: "We offer both! Many activities can be printed for offline use, while others are interactive online experiences. You can choose what works best for your situation."
    },
    {
      id: 3,
      question: "Is this designed for home use or classrooms?",
      answer: "Both! Our platform is designed to work perfectly in both home and classroom environments. Parents love the no-prep activities, while teachers appreciate the curriculum-aligned content."
    },
    {
      id: 4,
      question: "How often is new content added?",
      answer: "We add new activities and content regularly, typically monthly. Subscribers get early access to new learning packs and seasonal activities."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section className="faq section">
      <div className="container">
        <h2 className="section-title" style={{ color: '#8E44AD' }}>
          Frequently Asked Questions
        </h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">
                  {activeIndex === index ? '−' : '+'}
                </span>
              </button>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 