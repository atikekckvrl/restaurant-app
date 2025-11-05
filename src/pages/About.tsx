import React from "react";

const About: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center text-white bg-black/60 px-6">
      <h1 className="text-5xl font-serif text-[#c9a45c] mb-6">Hakkımızda</h1>
      <p className="max-w-2xl text-gray-300 leading-relaxed text-lg">
        LÂL Restaurant, modern mutfak teknikleri ile geleneksel tatları birleştiren
        özel bir fine-dining deneyimi sunar.  
        Her tabak, ustalık ve zarafetin bir yansımasıdır.
      </p>
    </section>
  );
};

export default About;
