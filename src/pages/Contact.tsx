import React from "react";

const Contact: React.FC = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center text-white bg-black/60 px-6">
      <h1 className="text-5xl font-serif text-[#c9a45c] mb-6">İletişim</h1>
      <p className="max-w-2xl text-gray-300 mb-10">
        Bize ulaşmak veya özel etkinlik rezervasyonu yapmak için aşağıdaki
        iletişim bilgilerini kullanabilirsiniz.
      </p>

      <div className="flex flex-col gap-3 text-gray-300 text-lg">
        <p>📍 Adres: Bağdat Caddesi No:42, İstanbul</p>
        <p>📞 Telefon: +90 (212) 555 44 33</p>
        <p>✉️ E-posta: info@lalrestaurant.com</p>
      </div>
    </section>
  );
};

export default Contact;
