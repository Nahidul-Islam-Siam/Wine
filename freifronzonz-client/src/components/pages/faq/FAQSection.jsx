// components/FAQSection.jsx
'use client';
import React, { useState } from 'react';

export default function FAQSection() {
  // Define FAQ data
  const faqs = [
    {
      id: 1,
      title: "Wine Selection",
      questions: [
        {
          q: "How do I choose the right wine?",
          a: "Choosing the right wine depends on your taste preference, the occasion, and the food you're pairing it with. Our website provides detailed tasting notes, wine types, and recommendations to help you select the perfect bottle every time."
        },
        {
          q: "Are your wines organic or natural?",
          a: "Yes! We carefully curate wines from vineyards that follow sustainable practices. Many of our selections are organic or made with minimal intervention, ensuring you enjoy pure, high-quality flavors in every sip."
        },
        {
          q: "How should I store wine at home?",
          a: "Proper storage preserves the flavor and quality of your wine. Keep bottles in a cool, dark place, ideally lying down, away from vibrations and direct sunlight, to enjoy them at their best."
        }
      ]
    },
    {
      id: 2,
      title: "Ordering & Payment",
      questions: [
        {
          q: "How can I place an order?",
          a: "Placing an order is simple and secure. Just browse our wine collection, select your desired bottles, add them to the cart, and follow the checkout process. You'll receive a confirmation email once your order is successfully placed."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept major credit and debit cards, PayPal, and other secure online payment options. All transactions are encrypted to ensure your personal and payment information remains safe."
        },
        {
          q: "Can I modify or cancel my order?",
          a: "Orders can be modified or canceled within a short time after placement. Please contact our customer support as soon as possible to make any changes. Once the order is processed for shipping, modifications may not be possible."
        }
      ]
    },
    {
      id: 3,
      title: "Signature Wine Quality",
      questions: [
        {
          q: "Are your wines made from high-quality grapes?",
          a: "Absolutely. All our wines are crafted from carefully selected, premium-quality grapes sourced from trusted vineyards. Each batch goes through a strict selection process to ensure rich flavor and consistency."
        },
        {
          q: "Controlled storage ensures the wine stays perfect.",
          a: "We follow temperature-controlled storage and professional packaging standards. Every bottle is handled with care to preserve its original aroma, taste, and freshness throughout delivery."
        },
        {
          q: "Do you use any artificial flavors or additives?",
          a: "No. Our wines are made using natural ingredients and traditional winemaking techniques. We do not use artificial flavors—ensuring a pure and authentic wine experience."
        }
      ]
    },
    {
      id: 4,
      title: "Our Wine Brand Collection",
      questions: [
        {
          q: "Do you offer wines from multiple brands?",
          a: "Yes, we feature a wide range of local and international wine brands, giving you plenty of options to match your taste and preference."
        },
        {
          q: "Are all the brands you offer authentic and verified?",
          a: "Absolutely. Every wine brand we list is sourced directly from trusted distributors, ensuring 100% authenticity and quality."
        },
        {
          q: "Can I compare different brands on your website?",
          a: "Yes, our website allows you to explore and compare various brands by flavor, type, and price to help you make the right choice."
        }
      ]
    }
  ];

  // State to track open accordion items
  const [openItems, setOpenItems] = useState({});

  const toggleAccordion = (sectionId, questionIndex) => {
    const key = `${sectionId}-${questionIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">

        {/* Main Heading */}
        <h2 className="text-3xl md:text-4xl font-abhaya font-extrabold text-center text-[#000000] mb-12">
          Frequently Asked Questions
        </h2>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((section) => (
            <div key={section.id} className=" rounded-lg p-6 shadow-sm">
              {/* Section Title */}
              <h3 className="text-2xl md:text-3xl font-abhaya font-extrabold text-[#AF6900] mb-6 flex items-center">
                <span className="text-4xl md:text-5xl mr-2">{String(section.id).padStart(2, '0')}.</span>
                {section.title}
              </h3>

              {/* Questions */}
              <div className="space-y-4">
                {section.questions.map((faq, index) => {
                  const isOpen = openItems[`${section.id}-${index}`];
                  return (
                    <div key={index} className="border-b border-[#D1D5DB] pb-4 last:border-b-0">
                      <button
                        onClick={() => toggleAccordion(section.id, index)}
                        className="w-full text-left flex justify-between items-start group"
                      >
                        <span className="text-base md:text-lg font-medium text-[#000000] pr-4">
                          • {faq.q}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        >
                          <path
                            d="M5 7.5L10 12.5L15 7.5"
                            stroke="#AF6900"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <div
                        className={`mt-2 text-sm md:text-base text-[#968F8F] transition-all duration-300 overflow-hidden ${
                          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        {faq.a}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}