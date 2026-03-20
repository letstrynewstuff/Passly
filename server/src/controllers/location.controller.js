// src/controllers/location.controller.js

// Nigeria states and their major cities
const LOCATIONS = {
  Abia: ["Umuahia", "Aba", "Ohafia", "Arochukwu"],
  Adamawa: ["Yola", "Mubi", "Numan", "Jimeta"],
  "Akwa Ibom": ["Uyo", "Eket", "Ikot Ekpene", "Oron"],
  Anambra: ["Awka", "Onitsha", "Nnewi", "Ekwulobia"],
  Bauchi: ["Bauchi", "Azare", "Misau", "Katagum"],
  Bayelsa: ["Yenagoa", "Ogbia", "Brass", "Nembe"],
  Benue: ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala"],
  Borno: ["Maiduguri", "Biu", "Konduga", "Gwoza"],
  "Cross River": ["Calabar", "Ikom", "Ogoja", "Obudu"],
  Delta: ["Asaba", "Warri", "Sapele", "Ughelli"],
  Ebonyi: ["Abakaliki", "Afikpo", "Onueke", "Ezza"],
  Edo: ["Benin City", "Ekpoma", "Auchi", "Uromi"],
  Ekiti: ["Ado-Ekiti", "Ikere", "Oye", "Ijero"],
  Enugu: ["Enugu", "Nsukka", "Agbani", "Oji River"],
  FCT: ["Abuja", "Gwagwalada", "Kuje", "Bwari"],
  Gombe: ["Gombe", "Kumo", "Kaltungo", "Billiri"],
  Imo: ["Owerri", "Orlu", "Okigwe", "Mbaise"],
  Jigawa: ["Dutse", "Hadejia", "Gumel", "Birnin Kudu"],
  Kaduna: ["Kaduna", "Zaria", "Kafanchan", "Kagoro"],
  Kano: ["Kano", "Wudil", "Bichi", "Gwarzo"],
  Katsina: ["Katsina", "Daura", "Funtua", "Malumfashi"],
  Kebbi: ["Birnin Kebbi", "Argungu", "Yauri", "Zuru"],
  Kogi: ["Lokoja", "Okene", "Idah", "Kabba"],
  Kwara: ["Ilorin", "Offa", "Omu-Aran", "Patigi"],
  Lagos: [
    "Lagos Island",
    "Ikeja",
    "Lekki",
    "Victoria Island",
    "Surulere",
    "Yaba",
    "Ajah",
    "Ikorodu",
    "Badagry",
    "Epe",
  ],
  Nasarawa: ["Lafia", "Keffi", "Akwanga", "Nasarawa"],
  Niger: ["Minna", "Bida", "Kontagora", "Suleja"],
  Ogun: ["Abeokuta", "Sagamu", "Ijebu-Ode", "Ilaro"],
  Ondo: ["Akure", "Ondo", "Owo", "Ikare"],
  Osun: ["Osogbo", "Ile-Ife", "Ilesa", "Ede"],
  Oyo: ["Ibadan", "Ogbomosho", "Oyo", "Iseyin"],
  Plateau: ["Jos", "Bukuru", "Shendam", "Pankshin"],
  Rivers: ["Port Harcourt", "Bonny", "Obio-Akpor", "Eleme"],
  Sokoto: ["Sokoto", "Wurno", "Illela", "Gwadabawa"],
  Taraba: ["Jalingo", "Wukari", "Bali", "Gembu"],
  Yobe: ["Damaturu", "Potiskum", "Nguru", "Gashua"],
  Zamfara: ["Gusau", "Kaura Namoda", "Anka", "Talata Mafara"],
};

// GET /api/locations/states
export const getStates = (req, res) => {
  const states = Object.keys(LOCATIONS).sort();
  return res.json({ success: true, states });
};

// GET /api/locations/cities?state=Lagos
export const getCities = (req, res) => {
  const { state } = req.query;
  if (!state)
    return res
      .status(400)
      .json({ success: false, message: "state is required" });
  const cities = LOCATIONS[state];
  if (!cities)
    return res.status(404).json({ success: false, message: "State not found" });
  return res.json({ success: true, cities: cities.sort() });
};
