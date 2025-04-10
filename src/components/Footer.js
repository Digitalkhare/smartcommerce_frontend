import React from "react";

const Footer = () => (
  <footer className="bg-dark text-light text-center py-4 mt-5">
    <p>
      &copy; {new Date().getFullYear()} Smart Commerce. All rights reserved.
    </p>
    <small>
      <a href="/#" className="text-light mx-2">
        Privacy Policy
      </a>
      |
      <a href="/#" className="text-light mx-2">
        Terms
      </a>
      |
      <a href="/#" className="text-light mx-2">
        Contact Us
      </a>
    </small>
  </footer>
);

export default Footer;
