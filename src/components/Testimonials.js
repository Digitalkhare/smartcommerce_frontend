import React from "react";

const testimonials = [
  { name: "Jane", quote: "Smart Commerce made shopping fun again!" },
  { name: "Daniel", quote: "Super fast delivery and amazing support." },
  { name: "Aliyah", quote: "AI recommendations nailed my taste!" },
];

const Testimonials = () => (
  <div className="bg-light py-5">
    <div className="container text-center">
      <h4>What Customers Are Saying</h4>
      <div className="row mt-4">
        {testimonials.map((t, i) => (
          <div key={i} className="col-md-4 mb-3">
            <div className="p-3 border rounded">
              <p>“{t.quote}”</p>
              <strong>- {t.name}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Testimonials;
