import React from "react";

const Footer: React.FC = () => {
  return (
    <>

      {/* telifi sağ alt köşeye sabitledim */}
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
          backgroundColor: "rgba(0,0,0,0.2)",
          color: "white",
          padding: "2px 8px",
          borderRadius: "6px",
          fontSize: "0.9rem",
          zIndex: 9999,
        }}
      >
        © {new Date().getFullYear()} LÂL RESTAURANT
      </div>
    </>
  );
};

export default Footer;
