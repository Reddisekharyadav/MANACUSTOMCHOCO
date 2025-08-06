'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Star, Heart } from 'lucide-react';

export default function ContactPage() {
  const handleEmailOrder = () => {
    const subject = 'General Inquiry - Custom Chocolate Wrappers';
    const body = `Hi ManaCustom Choco,

I'm interested in your custom chocolate wrappers. Please provide me with more information about:

- Available designs and model numbers
- Pricing for bulk orders
- Customization options
- Delivery timeline

Thank you!`;
    
    const mailtoLink = `mailto:orders@manacustomchoco.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-6"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-700 mb-8"
          >
            Ready to order your custom chocolate wrappers? We&apos;re here to help!
          </motion.p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Email */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">For orders and inquiries</p>
              <button
                onClick={handleEmailOrder}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-colors"
              >
                orders@manacustomchoco.com
              </button>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">For quick assistance</p>
              <a
                href="tel:+911234567890"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transition-colors inline-block"
              >
                +91 12345 67890
              </a>
            </motion.div>

            {/* WhatsApp */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Quick chat support</p>
              <a
                href="https://wa.me/911234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-2 rounded-full font-semibold hover:from-green-500 hover:to-green-600 transition-colors inline-block"
              >
                Chat on WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ordering Guide */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">How to Order</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-amber-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Browse Gallery</h3>
                <p className="text-sm text-gray-600">Explore our beautiful wrapper collection</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-orange-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Note Model Number</h3>
                <p className="text-sm text-gray-600">Each design has a unique model (e.g. MC001)</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-red-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                <p className="text-sm text-gray-600">Email, call, or WhatsApp us with the model</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Your Order</h3>
                <p className="text-sm text-gray-600">We&apos;ll handle the rest and deliver!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 text-center"
          >
            <Clock className="w-8 h-8 mx-auto mb-4 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Business Hours</h3>
            <div className="space-y-2 text-gray-700">
              <p><strong>Monday - Saturday:</strong> 9:00 AM - 8:00 PM</p>
              <p><strong>Sunday:</strong> 10:00 AM - 6:00 PM</p>
              <div className="mt-4 p-3 bg-purple-200 rounded-lg">
                <p className="font-semibold text-purple-800">🌙 Late Night Specials</p>
                <p className="text-sm text-purple-700">Special pricing active from 10:00 PM - 6:00 AM IST</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
