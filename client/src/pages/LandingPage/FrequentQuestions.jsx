import React, { useState } from 'react';

function FrequentQuestions() {
  const [activeIndex, setActiveIndex] = useState(null); // State to track the active accordion

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Toggle the active section
  };

  return (
    <section className="w-full bg-rose-50 py-6">
      <div className="w-1/2 px-4 pb-8 mx-auto lg:pb-24 lg:px-6 bg-white">
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-center text-gray-900 lg:mb-8 lg:text-3xl dark:text-white pt-6">
        Read our FAQs
        </h2>
        <div className="max-w-screen-md mx-auto">
          <div id="accordion-flush">
            {[
              {
                question: "What makes a good tutor?",
                answer:
                  "Subject knowledge is a must, but being a good tutor is really about explaining difficult concepts in a way that's clear, engaging and personalised for each student. You can have three degrees in Physics, but that doesn't mean you'll be good at explaining it at GCSE level! Tutors who can empathise with their students and help them build confidence help teens unleash their potential, and we see amazing results in just a few lessons.Our tutors are from top UK unis, and because they're just a few years older, they can explain things in a way that teens find relatable. We interview all of our tutors, and only the friendliest and most knowledgeable make it on to our platform. We're very picky about it - just 1 in 8 applicants make the cut.",
              },
              {
                question: "Which tutor is right for you?",
                answer:
                  "Before you look for a tutor, it's helpful to have a really clear idea of exactly where your child needs help - whether with a specific English Literature text, one area of Maths or their exam technique - and filter your choices accordingly. If you're not sure where they need to focus, having a chat with them or their teacher can help you work out the best place to start. In a free meeting, you can then ask the tutor any questions you like and see how well they get on with your child before deciding to book.",
              },
              {
                question: "Why is online tutoring important?",
                answer:
                  "Online tutoring gives kids the chance to learn at their own pace and in a way that matches their learning style. Teens are often too shy to put their hand up in class - especially if they're struggling. The reassurance of one-to-one tutoring means they can ask all the questions they want, and go over topics as much as they need until they get it.",
              },
              {
                question: "What are the benefits of online tutoring?",
                answer:
                  "One-to-one tutoring lets kids unleash their potential. Worried about learning gaps? We'll fill them in. No tutors in your area? We've got you covered. No academic confidence? No problem. Whatever your child needs help with, their tutor will guide them through tricky topics and boost their self-belief. With the personalised one-to-one support from their tutor, your child can get the grades they deserve.",
              },
              {
                question: "How much does a tutor cost?",
                answer:
                  "Our tutors set their own prices based on their experience and qualifications, starting from £25/hour at GCSE level. Most of our tutors charge between £25 and £39 an hour. You can see all the tutors who match your budget with the handy price filter on our Find a tutor page.",
              },
              {
                question: "How to find a tutor?",
                answer:
                  `Finding a tutor is easy. Whatever you need, you can search and filter by subject, level, price, experience and more.
View our tutors, and narrow your search by subject, academic level or price. Or if you'd like expert help, book a call with our free tutor matching service.
Compare their profiles to learn about their background, experience and availability. Don't forget to take a peek at their reviews from parents and students!
Message a tutor (or two, or three) and book your free meeting at a time that suits you.
Book a lesson and pay as you go. There are no hidden costs and you can skip or cancel any time.`,
              },
              {
                question: "How do online lessons work?",
                answer:
                  "We have our own online lesson space with video chat, messaging and an interactive whiteboard - this makes it easy for students and tutors to talk to each other, discuss tricky concepts and do practice questions together. With the live video chat, they can have a natural back-and-forth conversation - just like on FaceTime, Whatsapp and other apps teens use all the time.",
              },
            ].map((item, index) => (
              <div key={index}>
                <h3>
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className={`flex items-center justify-between w-full py-5 font-medium text-left border-b  ${
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
