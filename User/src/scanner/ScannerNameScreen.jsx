// src/pages/ScannerNameScreen.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ScannerNameScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name before continuing.");
      return;
    }
    localStorage.setItem("scannerUsername", trimmed);
    navigate("/scanner");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Who is using this scanner?
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your name so we can track who scanned each ticket. This won't
          affect your login.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
          <div>
            <label
              htmlFor="operatorName"
              className="block text-sm font-medium text-gray-700"
            >
              Your name
            </label>
            <div className="mt-1">
              <input
                id="operatorName"
                type="text"
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleContinue();
                }}
                placeholder="e.g. John Doe"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleContinue}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue to Scanner →
          </button>
        </div>
      </div>
    </div>
  );
}
