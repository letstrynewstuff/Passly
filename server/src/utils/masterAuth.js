// src/utils/masterAuth.js
// Fixed, valid ObjectId used as the master's "user id" (so ScanLog / Ticket
// fields that expect an ObjectId still work). It is not a real User document.
export const MASTER_USER_ID = "000000000000000000000001";
