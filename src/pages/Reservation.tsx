import React from "react";

const Reservation: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center text-white bg-black/60 px-6">
      <h1 className="text-5xl font-serif text-[#c9a45c] mb-6">Rezervasyon</h1>
      <p className="text-lg max-w-xl text-gray-300 mb-8">
        Zarafetin ve lezzetin buluştuğu LÂL Restaurant’ta size özel bir masa
        ayırtın.
      </p>

      <form className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Adınız Soyadınız"
          className="p-3 rounded bg-black/40 border border-gray-600 text-white"
        />
        <input
          type="email"
          placeholder="E-posta adresiniz"
          className="p-3 rounded bg-black/40 border border-gray-600 text-white"
        />
        <input
          type="date"
          className="p-3 rounded bg-black/40 border border-gray-600 text-white"
        />
        <button
          type="submit"
          className="mt-2 bg-[#c9a45c] text-black font-semibold py-3 rounded hover:bg-[#b8944e]"
        >
          Rezervasyon Yap
        </button>
      </form>
    </section>
  );
};

export default Reservation;
