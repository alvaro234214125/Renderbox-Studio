import { useState } from "react";

export default function WhatsappChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const whatsappNumber = "51953212812"; // tu número con código de país

  const handleSend = () => {
    const base = `https://wa.me/${whatsappNumber}`;
    const url = message
      ? `${base}?text=${encodeURIComponent(message)}`
      : base;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition overflow-hidden outline-none focus:ring-0 focus:outline-none border-0"
        style={{
          WebkitTapHighlightColor: "transparent", // elimina borde gris en iOS
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-9 h-9 block object-contain"
          style={{
            display: "block",
            background: "transparent",
          }}
        />
      </button>

      {/* Chat flotante */}
      {isOpen && (
        <div className="bg-white shadow-2xl rounded-xl p-4 mt-3 w-72 border border-gray-200">
          <p className="text-gray-800 font-semibold mb-2">¡Hola! 👋</p>
          <p className="text-gray-600 text-sm mb-3">
            Cuéntanos en qué podemos ayudarte.
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="w-full border rounded-lg p-2 text-sm resize-none mb-3"
            rows="3"
          />
          <button
            onClick={handleSend}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Enviar a WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
