import React from "react";

const OrderPage: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center bg-black text-[#f5d48a]">
      <h1 className="text-5xl font-serif mb-4">QR ile Sipariş Ver</h1>
      <p className="text-lg max-w-md text-gray-300">
        Masanızdaki QR kodu tarayarak menüye ulaşın ve garson beklemeden siparişinizi verin.
      </p>
    </section>
  );
};

export default OrderPage;
