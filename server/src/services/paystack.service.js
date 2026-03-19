// src/services/paystack.service.js

export const initializePayment = async (email, amount, metadata) => {
  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100,
        metadata,
        callback_url: "http://localhost:5173/checkout",
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Paystack initialization failed: ${response.statusText}`);
  }
console.log("PAYSTACK KEY:", process.env.PAYSTACK_SECRET_KEY);
  return response.json();
};

export const verifyPayment = async (reference) => {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Paystack verification failed: ${response.statusText}`);
  }

  return response.json();
};
