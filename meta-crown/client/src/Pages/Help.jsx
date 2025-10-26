import React, { useState } from "react";
import "../Styles/Help.css";

export default function Help() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const faqs = [
    {
      id: 1,
      question: "How do I connect my Clash Royale account?",
      answer: "To connect your Clash Royale account, simply enter your player tag (found in your Clash Royale profile) during the signup process. Your player tag should look like #ABC123XYZ. Once connected, we'll automatically sync your player data including decks, statistics, and match history."
    },
    {
      id: 2,
      question: "How does the deck builder work?",
      answer: "Our deck builder allows you to create, save, and manage your Clash Royale decks. Simply drag and drop cards from the card list into your deck slots. You can sort cards by name, elixir cost, or rarity. Once your deck is complete (8 cards), you can save it to your library and edit it later. The system also calculates average elixir cost and other stats for your deck."
    },
    {
      id: 3,
      question: "What data do you collect from my Clash Royale account?",
      answer: "We only collect publicly available data from your Clash Royale profile through the official Supercell API. This includes your username, trophy count, clan information, current deck, recent battle history, and card collection. We do not have access to any personal information, payment details, or private account data."
    },
    {
      id: 4,
      question: "How often is my data updated?",
      answer: "Your player data is updated in real-time whenever you visit your dashboard or search for your profile. Battle history and statistics are fetched fresh from the Clash Royale API each time you load the page. However, some data may be cached briefly to improve performance and reduce API calls."
    }
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      setSubmitMessage("Please fill in all fields.");
      setTimeout(() => setSubmitMessage(""), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch('http://localhost:6969/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setSubmitMessage("Message sent successfully! We'll get back to you soon.");
        setContactForm({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        setSubmitMessage("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitMessage("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(""), 5000);
    }
  };

  return (
    <div className="help-container">
      <div className="help-content">
        <h1>Help & Support</h1>
        
        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq) => (
              <div key={faq.id} className="faq-item">
                <button
                  className={`faq-question ${openFAQ === faq.id ? 'active' : ''}`}
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openFAQ === faq.id ? '−' : '+'}</span>
                </button>
                <div className={`faq-answer ${openFAQ === faq.id ? 'open' : ''}`}>
                  <div className="faq-answer-content">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-section">
          <h2>Still Need Help?</h2>
          <p>Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.</p>
          
          <form className="contact-form" onSubmit={handleFormSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={contactForm.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={contactForm.subject}
                onChange={handleFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={contactForm.message}
                onChange={handleFormChange}
                required
              ></textarea>
            </div>

            {submitMessage && (
              <div className={`form-message ${submitMessage.includes('success') ? 'success' : 'error'}`}>
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
