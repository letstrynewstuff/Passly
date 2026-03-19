// // src/services/qrcode.service.js
// import qrcode from "qrcode";

// export const generateQRCode = async (data) => {
//   return qrcode.toDataURL(data);
// };

// server/services/qrcode.service.js
import QRCode from "qrcode";

export const generateQRCode = async (data) => {
  return await QRCode.toDataURL(data);
};