// src/api/events.js

export const events = [
  {
    id: "evt_001",
    title: "Midnight Rave",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-concert-crowd-enjoying-live-music-5347/1080p.mp4",
    posterUrl:
      "https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3799205012995858839",
    location: "Benin City",
    date: "2026-02-14T22:00:00Z",
    tickets: [
      { type: "Regular", price: 3000 },
      { type: "VIP", price: 7000 },
    ],
    comments: [
      { id: 1, user: "Ada", text: "Can I bring a friend?", time: "2h ago" },
      {
        id: 2,
        user: "Chinedu",
        text: "Is there parking available?",
        time: "1h ago",
      },
    ],
  },
  {
    id: "evt_002",
    title: "Amapiano Nights",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-people-working-in-a-modern-office-4894/1080p.mp4",
    posterUrl:
      "https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3799205013079737586",
    location: "Lagos",
    date: "2026-02-18T21:00:00Z",
    tickets: [
      { type: "Regular", price: 4000 },
      { type: "VIP", price: 8000 },
    ],
    comments: [
      { id: 1, user: "Bola", text: "Who's the DJ?", time: "3h ago" },
      { id: 2, user: "Tunde", text: "Can't wait for this!", time: "1h ago" },
    ],
  },
  {
    id: "evt_003",
    title: "Afrobeats Fest",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-chef-preparing-food-in-kitchen-9693/1080p.mp4",
    posterUrl:
      "https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3799205013088173971",
    location: "Abuja",
    date: "2026-03-01T20:00:00Z",
    tickets: [
      { type: "Regular", price: 5000 },
      { type: "VIP", price: 10000 },
    ],
    comments: [
      { id: 1, user: "Chioma", text: "Any age restrictions?", time: "4h ago" },
      {
        id: 2,
        user: "Emeka",
        text: "I’m coming with my crew!",
        time: "2h ago",
      },
    ],
  },
  {
    id: "evt_004",
    title: "Lagos Street Party",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-woman-running-in-the-city-3555/1080p.mp4",
    posterUrl:
      "https://76crimes.com/wp-content/uploads/2025/11/Group-Therapy-nightclub-scene-in-Lagos-Instagram-1024x627.jpg",
    location: "Lagos",
    date: "2026-03-05T22:00:00Z",
    tickets: [
      { type: "Regular", price: 2500 },
      { type: "VIP", price: 6000 },
    ],
    comments: [
      {
        id: 1,
        user: "Funke",
        text: "Will there be food vendors?",
        time: "1h ago",
      },
      { id: 2, user: "Obinna", text: "Can't wait to dance!", time: "30m ago" },
    ],
  },
  {
    id: "evt_005",
    title: "Sunset Grooves",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-woman-looking-at-art-in-a-gallery-4157/1080p.mp4",
    posterUrl:
      "https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3799205012995854475",
    location: "Port Harcourt",
    date: "2026-03-10T18:00:00Z",
    tickets: [
      { type: "Regular", price: 3500 },
      { type: "VIP", price: 7000 },
    ],
    comments: [
      { id: 1, user: "Ngozi", text: "Is it outdoors?", time: "5h ago" },
      {
        id: 2,
        user: "Ifeanyi",
        text: "Love the vibes already!",
        time: "3h ago",
      },
    ],
  },
  {
    id: "evt_006",
    title: "Nightlife Reloaded",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-dj-playing-music-at-a-party-9234/1080p.mp4",
    posterUrl:
      "https://i.guim.co.uk/img/media/fe1bab358f26dcd2d47af62f81e666114875650d/0_0_6292_3776/master/6292.jpg?width=700&quality=85&auto=format&fit=max&s=5a4392d64a9ca7e3754d072efc787d5c",
    location: "Ibadan",
    date: "2026-03-12T21:00:00Z",
    tickets: [
      { type: "Regular", price: 3000 },
      { type: "VIP", price: 6500 },
    ],
    comments: [
      { id: 1, user: "Sola", text: "Is there a dress code?", time: "2h ago" },
      { id: 2, user: "Tosin", text: "Bring your own drinks?", time: "1h ago" },
    ],
  },
  {
    id: "evt_007",
    title: "Underground Beats",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-woman-doing-yoga-on-the-beach-1283/1080p.mp4",
    posterUrl:
      "https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-2191056161.jpg?q=w_1110,c_fill",
    location: "Benin City",
    date: "2026-03-15T22:00:00Z",
    tickets: [
      { type: "Regular", price: 4000 },
      { type: "VIP", price: 7500 },
    ],
    comments: [
      { id: 1, user: "Ada", text: "Exclusive event?", time: "1h ago" },
      { id: 2, user: "Bola", text: "Any afterparty?", time: "30m ago" },
    ],
  },
  {
    id: "evt_008",
    title: "Glow Party Lagos",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-people-laughing-in-a-comedy-club-8234/1080p.mp4",
    posterUrl:
      "https://www.shutterstock.com/image-photo/crowd-nigerian-youths-during-youth-260nw-2173599957.jpg",
    location: "Lagos",
    date: "2026-03-20T23:00:00Z",
    tickets: [
      { type: "Regular", price: 3500 },
      { type: "VIP", price: 7000 },
    ],
    comments: [
      { id: 1, user: "Chika", text: "Do we get glow sticks?", time: "3h ago" },
      { id: 2, user: "Emeka", text: "What time does it end?", time: "1h ago" },
    ],
  },
  {
    id: "evt_009",
    title: "Afro Fusion",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-fashion-models-walking-on-runway-3421/1080p.mp4",
    posterUrl:
      "https://static01.nyt.com/images/2025/12/22/multimedia/00int-nigeria-dispatch-promo/00int-nigeria-dispatch-1-tgfh-facebookJumbo.jpg",
    location: "Abuja",
    date: "2026-03-22T21:00:00Z",
    tickets: [
      { type: "Regular", price: 4500 },
      { type: "VIP", price: 8500 },
    ],
    comments: [
      { id: 1, user: "Ngozi", text: "Any VIP perks?", time: "2h ago" },
      { id: 2, user: "Tunde", text: "Will there be security?", time: "1h ago" },
    ],
  },
  {
    id: "evt_010",
    title: "Vibes at Dusk",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-street-food-vendor-cooking-5623/1080p.mp4",
    posterUrl:
      "https://rexclarkeadventures.com/wp-content/uploads/2025/11/afrofuture-lead-column.webp",
    location: "Port Harcourt",
    date: "2026-03-25T18:30:00Z",
    tickets: [
      { type: "Regular", price: 3000 },
      { type: "VIP", price: 6000 },
    ],
    comments: [
      { id: 1, user: "Ifeanyi", text: "Is this outdoors?", time: "3h ago" },
      { id: 2, user: "Chioma", text: "Can I bring a friend?", time: "2h ago" },
    ],
  },
  {
    id: "evt_011",
    title: "Electric Nights",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-jazz-band-performing-live-6723/1080p.mp4",
    posterUrl:
      "https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3799205012995897376",
    location: "Ibadan",
    date: "2026-03-28T22:00:00Z",
    tickets: [
      { type: "Regular", price: 4000 },
      { type: "VIP", price: 8000 },
    ],
    comments: [
      {
        id: 1,
        user: "Sola",
        text: "EDM + Afrobeat? Sounds lit!",
        time: "2h ago",
      },
      { id: 2, user: "Bola", text: "Do I need ID?", time: "1h ago" },
    ],
  },
  {
    id: "evt_012",
    title: "Campus Carnival",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-people-playing-video-games-7834/1080p.mp4",
    posterUrl:
      "https://www.bellanaija.com/wp-content/uploads/2023/11/82A0A227-32EF-472D-B4F2-D275BB130AED-scaled.jpeg",
    location: "Benin City",
    date: "2026-04-01T20:00:00Z",
    tickets: [
      { type: "Regular", price: 2000 },
      { type: "VIP", price: 5000 },
    ],
    comments: [
      { id: 1, user: "Ada", text: "Student discount?", time: "3h ago" },
      { id: 2, user: "Tosin", text: "DJ lineup?", time: "1h ago" },
    ],
  },
  {
    id: "evt_013",
    title: "Rave in the City",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-people-playing-beach-volleyball-2134/1080p.mp4",
    posterUrl:
      "https://www.metropolitanshuttle.com/wp-content/uploads/2025/12/AfroGoGo-at-Station1640-scaled-e1764777440150-1024x608.webp",
    location: "Lagos",
    date: "2026-04-03T23:00:00Z",
    tickets: [
      { type: "Regular", price: 3500 },
      { type: "VIP", price: 7000 },
    ],
    comments: [
      { id: 1, user: "Emeka", text: "Exclusive invite?", time: "4h ago" },
      { id: 2, user: "Chika", text: "Can I bring a +1?", time: "2h ago" },
    ],
  },
  {
    id: "evt_014",
    title: "Nightfall Beats",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-movie-theater-audience-watching-film-4523/1080p.mp4",
    posterUrl:
      "https://www.bellanaija.com/wp-content/uploads/2025/11/FR-4-scaled.jpeg",
    location: "Abuja",
    date: "2026-04-05T20:00:00Z",
    tickets: [
      { type: "Regular", price: 3000 },
      { type: "VIP", price: 6500 },
    ],
    comments: [
      { id: 1, user: "Chioma", text: "Is there seating?", time: "1h ago" },
      { id: 2, user: "Ngozi", text: "Will drinks be sold?", time: "30m ago" },
    ],
  },
  {
    id: "evt_015",
    title: "Friday Fever",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-person-rock-climbing-indoors-8934/1080p.mp4",
    posterUrl:
      "https://rexclarkeadventures.com/wp-content/uploads/2024/11/343162833_1287404238536868_7435276672981087210_n.jpeg",
    location: "Port Harcourt",
    date: "2026-04-10T21:00:00Z",
    tickets: [
      { type: "Regular", price: 2500 },
      { type: "VIP", price: 6000 },
    ],
    comments: [
      { id: 1, user: "Tunde", text: "Weekly event?", time: "2h ago" },
      { id: 2, user: "Ifeanyi", text: "Bring friends?", time: "1h ago" },
    ],
  },
  {
    id: "evt_016",
    title: "Underground Vibes",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-orchestra-performing-classical-music-5634/1080p.mp4",
    posterUrl:
      "https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3794043137883126540",
    location: "Ibadan",
    date: "2026-04-12T22:00:00Z",
    tickets: [
      { type: "Regular", price: 4000 },
      { type: "VIP", price: 7500 },
    ],
    comments: [
      { id: 1, user: "Sola", text: "Invite-only?", time: "2h ago" },
      { id: 2, user: "Bola", text: "Can I RSVP online?", time: "1h ago" },
    ],
  },
  {
    id: "evt_017",
    title: "Glow Fest",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-people-drinking-beer-at-bar-7234/1080p.mp4",
    posterUrl:
      "https://www.papermag.com/media-library/image.jpg?id=22191255&width=1200&height=800&quality=80&coordinates=0%2C0%2C0%2C1",
    location: "Lagos",
    date: "2026-04-15T23:00:00Z",
    tickets: [
      { type: "Regular", price: 3500 },
      { type: "VIP", price: 7000 },
    ],
    comments: [
      { id: 1, user: "Chika", text: "Bring glow sticks?", time: "3h ago" },
      { id: 2, user: "Emeka", text: "Time to start?", time: "1h ago" },
    ],
  },
  {
    id: "evt_018",
    title: "Afrobeat Explosion",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-ice-skating-performance-3267/1080p.mp4",
    posterUrl:
      "https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=1922355068561499",
    location: "Abuja",
    date: "2026-04-18T21:00:00Z",
    tickets: [
      { type: "Regular", price: 4500 },
      { type: "VIP", price: 9000 },
    ],
    comments: [
      { id: 1, user: "Ngozi", text: "VIP perks?", time: "2h ago" },
      { id: 2, user: "Tunde", text: "Will food be sold?", time: "1h ago" },
    ],
  },
  {
    id: "evt_019",
    title: "Weekend Vibes",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-photographer-taking-photos-6723/1080p.mp4",
    posterUrl:
      "https://img.redbull.com/images/q_auto,f_auto/redbullcom/2024/12/13/dvmtd9dgmhqigfhzybmo/detty-december-parties",
    location: "Port Harcourt",
    date: "2026-04-20T20:00:00Z",
    tickets: [
      { type: "Regular", price: 3000 },
      { type: "VIP", price: 6500 },
    ],
    comments: [
      { id: 1, user: "Ifeanyi", text: "Weekend party?", time: "2h ago" },
      { id: 2, user: "Chioma", text: "Can friends join?", time: "1h ago" },
    ],
  },
  {
    id: "evt_020",
    title: "City Nights",
    videoUrl:
      "https://cdn.coverr.co/videos/coverr-couple-dancing-salsa-4567/1080p.mp4",
    posterUrl:
      "https://www.themodaculture.com/wp-content/uploads/2024/05/StylishSinner-0243-1024x683.jpeg",
    location: "Benin City",
    date: "2026-04-25T22:00:00Z",
    tickets: [
      { type: "Regular", price: 3500 },
      { type: "VIP", price: 7000 },
    ],
    comments: [
      { id: 1, user: "Ada", text: "Late night event?", time: "3h ago" },
      { id: 2, user: "Chinedu", text: "Bring a friend?", time: "1h ago" },
    ],
  },
];

export const fetchEvents = async () => {
  try {
    // Simulate a small network delay (helps test loading/skeleton UI)
    await new Promise((resolve) => setTimeout(resolve, 800));
    return events;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
};