const Footer = () => {
  return (
    <footer className="bg-stone-100 text-gray-800 mt-16 shadow-inner rounded-t-3xl border-t-2 border-blue-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Branding & Address */}
          <div>
            <a href="#" className="flex items-center space-x-3 mb-4">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                alt="ShopEase Logo"
                className="h-8"
              />
              <span className="text-2xl font-bold">ShopEase</span>
            </a>
            <p className="text-sm text-gray-600">
              123 Market Street, New Delhi, India – 110001 <br />
              📞 +91 98765 43210 <br />
              ✉️ support@shopease.com
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:text-blue-600 transition">About</a></li>
              <li><a href="#" className="hover:text-blue-600 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-600 transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-blue-600 transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-blue-600 transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <form
              action="mailto:support@shopease.com"
              method="POST"
              encType="text/plain"
              className="space-y-3"
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                required
              />
              <textarea
                name="message"
                rows="3"
                placeholder="Your Message"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        <hr className="my-10 border-gray-300" />
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} <span className="font-semibold">ShopEase™</span>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
