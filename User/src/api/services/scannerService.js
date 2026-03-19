// src/services/scannerService.js
import API from "../axios";

export const validateScannedTicket = (ticketCode, eventId) =>
  API.post("/scanner/validate", { ticketCode, eventId });
