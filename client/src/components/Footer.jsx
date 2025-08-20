const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white mt-16 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent"></div>
      </div>

      {/* Elegant top border with gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Enhanced Branding & Address */}
          <div className="lg:col-span-1">
            <div className="group mb-6">
              <a href="#" className="flex items-center space-x-3 mb-6 transform transition-transform hover:scale-105">
                <div className="relative">
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/011/144/540/non_2x/jewelry-ring-abstract-logo-template-design-with-luxury-diamonds-or-gems-isolated-on-black-and-white-background-logo-can-be-for-jewelry-brands-and-signs-free-vector.jpg"
                    alt="Jewellery Logo"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-rose-400 group-hover:ring-rose-300 transition-all duration-300"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                    Jewellery
                  </span>
                  <span className="text-xs text-gray-400 font-light tracking-wide">
                    Luxury Collection
                  </span>
                </div>
              </a>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <svg className="w-5 h-5 text-rose-400 mt-1 group-hover:text-rose-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    123 Market Street<br />
                    New Delhi, India – 110001
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 group cursor-pointer">
                <svg className="w-5 h-5 text-rose-400 group-hover:text-rose-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm text-gray-300 hover:text-white transition-colors">
                  +91 98765 43210
                </span>
              </div>

              <div className="flex items-center space-x-3 group cursor-pointer">
                <svg className="w-5 h-5 text-rose-400 group-hover:text-rose-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-300 hover:text-white transition-colors">
                  support@jewellery.com
                </span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-gray-300 mb-3">Follow Us</h5>
              <div className="flex space-x-4">
                {[
                  { name: 'Facebook', path: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' },
                  { name: 'Instagram', path: 'M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2ZM16.25 3.5h-8.5a4.25 4.25 0 0 0-4.25 4.25v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25ZM18.5 6.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7.25A4.75 4.75 0 1 1 12 16.75 4.75 4.75 0 0 1 12 7.25Zm0 1.5a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5Z' },
                  { name: 'Twitter', path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '#' },
                { name: 'Privacy Policy', href: '#' },
                { name: 'Terms & Conditions', href: '#' },
                { name: 'Shipping Info', href: '#' },
                { name: 'Return Policy', href: '#' },
                { name: 'Size Guide', href: '#' },
                { name: 'Contact', href: '#' }
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-rose-400 transition-all duration-300 flex items-center group"
                  >
                    <svg className="w-3 h-3 mr-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Categories */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              Categories
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Rings', icon: '💍', href: '#' },
                { name: 'Necklaces', icon: '🌟', href: '#' },
                { name: 'Earrings', icon: '💫', href: '#' },
                { name: 'Bracelets', icon: '💎', href: '#' },
                { name: 'Pendants', icon: '✨', href: '#' },
                { name: 'Anklets', icon: '🔗', href: '#' }
              ].map((category) => (
                <li key={category.name}>
                  <a
                    href={category.href}
                    className="text-sm text-gray-300 hover:text-rose-400 transition-all duration-300 flex items-center group"
                  >
                    <span className="mr-3 text-base group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {category.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Enhanced Contact Form */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold mb-6 bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              Get In Touch
            </h4>
            <form
              action="mailto:support@jewellery.com"
              method="POST"
              encType="text/plain"
              className="space-y-4"
            >
              <div className="group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm text-white placeholder-gray-400 transition-all duration-300 group-hover:bg-gray-800/70"
                  required
                />
              </div>
              <div className="group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm text-white placeholder-gray-400 transition-all duration-300 group-hover:bg-gray-800/70"
                  required
                />
              </div>
              <div className="group">
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Your Message"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm text-white placeholder-gray-400 resize-none transition-all duration-300 group-hover:bg-gray-800/70"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-rose-400 focus:outline-none"
              >
                Send Message
                <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Enhanced Divider */}
        <div className="my-12">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} <span className="font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Jewellery™</span>. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure Payment
              </span>
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Fast Delivery
              </span>
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Premium Quality
              </span>
            </div>
          </div>
          
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 flex items-center justify-center group"
      >
        <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;