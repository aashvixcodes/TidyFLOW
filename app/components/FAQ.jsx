'use client';
import { useState } from 'react';

export default function FAQ({ items }) {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-list">
            {items.map((item, index) => {
                const isActive = openIndex === index;
                return (
                    <div key={index} className={`faq-item ${isActive ? 'active' : ''}`}>
                        <button className="faq-question" onClick={() => toggleFAQ(index)}>
                            {item.q}
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <div className="faq-answer">
                            <div className="faq-answer-inner">{item.a}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
