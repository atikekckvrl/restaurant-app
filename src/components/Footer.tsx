import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      {/* === Sol Alt: Kadeh + Dairesel Çerçeve === */}
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          left: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          zIndex: 50,
        }}
      >
        {/* Altın Çerçeveli Arka Plan */}
        <div
          style={{
            width: "65px",
            height: "65px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.09), rgba(0,0,0,0.2))",
            border: "1.2px solid rgba(201, 165, 92, 0.18)",
            boxShadow:
              "0 0 12px rgba(201,164,92,0.25), inset 0 0 10px rgba(255,255,255,0.06)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "glowRotate 12s infinite linear",
          }}
        >
          {/* Küçültülmüş SVG */}
          <img
            src="/kadeh.svg"
            alt="Kadeh Amblemi"
            style={{
              width: "42px",
              height: "42px",
              filter:
                "drop-shadow(0 0 6px rgba(203,178,120,0.4)) drop-shadow(0 0 12px rgba(255,215,160,0.25))",
              animation: "pulse 6s infinite ease-in-out",
            }}
          />
        </div>

        {/* Marka Yazısı */}
        <span
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: "0.9rem",
            color: "#d9caa3",
            letterSpacing: "1.4px",
            textShadow:
              "0 0 10px rgba(0,0,0,0.6), 0 0 5px rgba(255,215,160,0.3)",
            fontWeight: 500,
            opacity: 0.95,
          }}
        >
          LÂL — Fine Taste & Elegance
        </span>
      </div>

      {/* === Sağ Alt — Telif === */}
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          right: "20px",
          background: "rgba(20, 20, 20, 0.45)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#e7dec0",
          padding: "6px 14px",
          borderRadius: "10px",
          fontSize: "0.85rem",
          fontFamily: "Cinzel, serif",
          letterSpacing: "0.5px",
          backdropFilter: "blur(5px)",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          zIndex: 9999,
        }}
      >
        © {new Date().getFullYear()} LÂL RESTAURANT
      </div>

      {/* === Animasyonlar === */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.96); opacity: 0.85; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(0.96); opacity: 0.85; }
        }

        @keyframes glowRotate {
          0% { box-shadow: 0 0 10px rgba(201,164,92,0.25), inset 0 0 6px rgba(255,255,255,0.08); }
          50% { box-shadow: 0 0 16px rgba(201,164,92,0.4), inset 0 0 8px rgba(255,255,255,0.15); }
          100% { box-shadow: 0 0 10px rgba(201,164,92,0.25), inset 0 0 6px rgba(255,255,255,0.08); }
        }
      `}</style>
    </>
  );
};

export default Footer;
