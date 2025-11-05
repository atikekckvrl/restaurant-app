import React from "react";

const Home: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-end min-h-screen px-6 bg-black/50 pb-16">
      {/* pb-16 -> Footer ile çakışmamak için boşluk */}
      <h1 className="text-4xl md:text-6xl font-serif text-white tracking-widest drop-shadow-md">
        LÂL RESTAURANT’A HOŞ GELDİNİZ
      </h1>
      <p className="mt-4 text-gray-200 max-w-2xl text-center">
        Gelenekten ilham alan modern tatlar, zarafetin lezzetle buluştuğu nokta.
      </p>

      <div className="mt-8 flex justify-center gap-4">
        <a
          href="/menu"
          className="px-6 py-3 bg-[#c9a45c] text-black rounded font-semibold"
        >
          Menüye Göz At
        </a>
        <a
          href="/reservation"
          className="px-6 py-3 border border-gray-500 text-gray-200 rounded"
        >
          Rezervasyon Yap
        </a>
      </div>
    </section>
  );
};

export default Home;
