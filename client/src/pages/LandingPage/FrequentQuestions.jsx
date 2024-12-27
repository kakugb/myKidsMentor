import React, { useState } from 'react';

function FrequentQuestions() {
  const [activeIndex, setActiveIndex] = useState(null); // State to track the active accordion

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle the active section
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl px-4 pb-8 mx-auto lg:pb-24 lg:px-6">
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-center text-gray-900 lg:mb-8 lg:text-3xl dark:text-white">
          Frequently asked questions
        </h2>
        <div className="max-w-screen-md mx-auto">
          <div id="accordion-flush">
            {[
              {
                question: "Can I use Landwind in open-source projects?",
                answer:
                  "Landwind is an open-source library of interactive components built on top of Tailwind CSS including buttons, dropdowns, modals, navbars, and more. Check out this guide to learn how to get started and start developing websites even faster with components on top of Tailwind CSS.",
              },
              {
                question: "Is there a Figma file available?",
                answer:
                  "Landwind is first conceptualized and designed using the Figma software so everything you see in the library has a design equivalent in our Figma file.",
              },
              {
                question: "What are the differences between Landwind and Tailwind UI?",
                answer:
                  "The main difference is that the core components from Landwind are open source under the MIT license, whereas Tailwind UI is a paid product.",
              },
              {
                question: "What about browser support?",
                answer:
                  "Landwind supports modern browsers including Chrome, Firefox, Safari, and Edge. Older versions may not be fully supported.",
              },
            ].map((item, index) => (
              <div key={index}>
                <h3>
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className={`flex items-center justify-between w-full py-5 font-medium text-left border-b border-gray-200 dark:border-gray-700 ${
                      activeIndex === index
                        ? "text-gray-900 bg-gray-100 dark:bg-gray-800 dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <span>{item.question}</span>
                    <svg
                      className={`w-6 h-6 shrink-0 transform ${
                        activeIndex === index ? "rotate-180" : ""
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </h3>
                <div
                  className={`${
                    activeIndex === index ? "block" : "hidden"
                  } py-5 border-b border-gray-200 dark:border-gray-700`}
                >
                  <p className="mb-2 text-gray-500 dark:text-gray-400">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FrequentQuestions;
