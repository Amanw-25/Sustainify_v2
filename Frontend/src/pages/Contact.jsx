import React, { useState, useRef } from 'react';
import emailjs from 'emailjs-com';
import { motion } from 'framer-motion';

const Contact = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    emailjs
      .sendForm(
        "service_3nqxxfs", 
        "template_kjqk8b7", 
        form.current,
        "Sv-YsrlCXT2Lf3dBC" 
      )
      .then(
        (result) => {
          setSuccess(true);
          setError(false);
          form.current.reset();
          setTimeout(() => {
            setSuccess(false);
          }, 5000);
        },
        (error) => {
          setError(true);
          setSuccess(false);
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  // Animation for the contact section and its elements
  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const inputVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.2, duration: 0.6, ease: 'easeOut' },
    },
  };

  const messageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { delay: 0.5, duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.section
      className='px-4 mx-auto max-w-screen-md py-16'
      variants={sectionVariants}
      initial="initial"
      animate="animate"
    >
      <h2 className='heading text-center'>
        Contact Us
      </h2>
      <p className='mb-8 lg:mb-16 font-light text-center text__para'>
        Got a technical issue? Want to send feedback about a beta feature? Let us know.
      </p>
      <motion.form
        ref={form}
        onSubmit={handleSubmit}
        className='space-y-8'
        variants={inputVariants}
        initial="initial"
        animate="animate"
      >
        <div>
          <label htmlFor="email" className='form__label'>
            Your Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="example@gmail.com"
            name="from_email" // Required by emailjs
            className="form__input mt-1"
            required
          />
        </div>
        <div>
          <label htmlFor="subject" className='form__label'>
            Subject
          </label>
          <input
            type="text"
            id="subject"
            placeholder="Let us know how we can help you"
            name="subject" // Required by emailjs
            className="form__input mt-1"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className='form__label'>
            Your Message
          </label>
          <textarea
            rows={5}
            id="message"
            placeholder="Leave a comment . . ."
            name="message" // Required by emailjs
            className="form__input-1 mt-1"
            required
          />
        </div>
        <button
          type="submit"
          className="btn rounded-full bg-black sm:w-fit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </motion.form>

      {/* Success/Error Message */}
      {success && (
        <motion.div
          className="mt-4 text-green-500"
          variants={messageVariants}
          initial="initial"
          animate="animate"
        >
          Message Sent Successfully!
        </motion.div>
      )}
      {error && (
        <motion.div
          className="mt-4 text-red-500"
          variants={messageVariants}
          initial="initial"
          animate="animate"
        >
          Error: Something went wrong. Please try again.
        </motion.div>
      )}
    </motion.section>
  );
};

export default Contact;
