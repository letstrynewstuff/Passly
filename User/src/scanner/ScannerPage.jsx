// src/scanner/ScannerPage.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { validateScannedTicket } from "../api/services/scannerService";
import ScanResult from "./ScanResult";

export default function ScannerPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [manualId, setManualId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [cameraStatus, setCameraStatus] = useState("Initializing camera...");
  const scannerRef = useRef(null);
  const isValidating = useRef(false);
  const restartTimer = useRef(null);

  // Read operator name saved at name screen
  const operatorName = localStorage.getItem("scannerUsername") || "Unknown";

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("scannerUsername");
    navigate("/scanner-login");
  };

  // Validate ticket
  const handleValidate = async (ticketId) => {
    if (!ticketId || isValidating.current) return;
    isValidating.current = true;

    if (restartTimer.current) {
      clearTimeout(restartTimer.current);
      restartTimer.current = null;
    }

    setScanning(false);
    setError(null);
    setResult(null);

    try {
      const response = await validateScannedTicket(ticketId, eventId);
      setResult(response.data);
    } catch (err) {
      console.log("full err.response:", err.response);
      console.log("data:", err.response?.data);
      console.log("status:", err.response?.status);
      setError(err.response?.data?.message || "Validation failed");
      setResult(err.response?.data ?? null);
    } finally {
      isValidating.current = false;

      restartTimer.current = setTimeout(() => {
        setScanning(true);
        setCameraStatus("Reinitializing camera...");
        restartTimer.current = null;
      }, 4000);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (restartTimer.current) clearTimeout(restartTimer.current);
    };
  }, []);

  // Initialize scanner
  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 280, height: 280 },
        aspectRatio: 1.0,
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
      },
      false,
    );

    scannerRef.current = scanner;

    try {
      scanner.render(
        async (decodedText) => {
          let ticketId;
          try {
            const data = JSON.parse(decodedText);
            ticketId = data.ticketId || decodedText;
          } catch {
            ticketId = decodedText.trim();
          }
          await handleValidate(ticketId);
        },
        (err) => {
          if (err?.name !== "NotFoundException") {
            console.debug("Scan error:", err);
          }
        },
      );

      setCameraStatus("Camera ready — point at QR code");
    } catch (err) {
      setCameraStatus("Camera failed to start");
      setError("Could not access camera. Try uploading QR image instead.");
      console.error("Scanner init failed:", err);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  // Image upload scanner
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const html5QrCode = new Html5Qrcode("qr-temp");
      const code = await html5QrCode.scanFile(file, true);

      let ticketId;
      try {
        const data = JSON.parse(code);
        ticketId = data.ticketId || code;
      } catch {
        ticketId = code.trim();
      }

      await handleValidate(ticketId);
    } catch (err) {
      setError(
        "Could not read QR from image. Try another photo or manual entry.",
      );
      console.error("Image scan failed:", err);
    }
  };

  // Reset
  const resetScanner = () => {
    if (restartTimer.current) {
      clearTimeout(restartTimer.current);
      restartTimer.current = null;
    }
    setResult(null);
    setError(null);
    setManualId("");
    setScanning(true);
    setCameraStatus("Initializing camera...");
  };

  return (
    <div className="max-w-md mx-auto space-y-6 py-6 px-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Scanning Event Tickets
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Operator:{" "}
            <span className="font-medium text-gray-700">{operatorName}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>

      {/* CAMERA */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="text-center text-sm mb-2 font-medium text-gray-700">
          {cameraStatus}
        </p>
        <div className="bg-black rounded-lg overflow-hidden border-4 border-gray-300 shadow-lg">
          <div id="qr-reader" className="w-full aspect-square bg-black" />
          <p className="text-center text-xs text-gray-400 py-2 bg-gray-900">
            Position QR code inside the square frame
          </p>
        </div>
      </div>

      {/* MANUAL ENTRY */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Ticket ID manually
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value.trim())}
            placeholder="Paste or type ticket ID"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && manualId) handleValidate(manualId);
            }}
          />
          <button
            onClick={() => manualId && handleValidate(manualId)}
            disabled={!manualId}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg disabled:opacity-50"
          >
            Verify
          </button>
        </div>
      </div>

      {/* UPLOAD */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload QR code image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700"
        />
      </div>
      <div id="qr-temp" style={{ display: "none" }} />

      {/* RESULT */}
      {(result || error) && (
        <ScanResult result={result} error={error} onReset={resetScanner} />
      )}
    </div>
  );
}
