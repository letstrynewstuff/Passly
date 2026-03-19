// src/Scanner/QRScanner.jsx
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function QRScanner({ onScanSuccess, onScanError }) {
  useEffect(() => {
   const scanner = new Html5QrcodeScanner(
     "qr-reader",
     {
       fps: 10,
       qrbox: { width: 280, height: 280 },
       aspectRatio: 1.0,
       rememberLastUsedCamera: true,
       supportedScanTypes: [0], // camera only
       videoConstraints: {
         facingMode: "environment", 
       },
     },
     false,
   );

    scanner.render(
      (decodedText) => {
        try {
          const data = JSON.parse(decodedText); // expecting { ticketId, eventId }
          onScanSuccess(data);
        } catch {
          onScanError("Invalid QR format");
        }
      },
      (err) => onScanError?.(err),
    );

    return () => scanner.clear();
  }, []);

  return <div id="reader" className="w-full max-w-md mx-auto" />;
}
