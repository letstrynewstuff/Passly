// src/pages/PlannerEvents.jsx
import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, Calendar, MapPin, X } from "lucide-react";
import { createEvent } from "../api/services/eventApi";

const PlannerEvents = ({ events = [], isDark }) => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    media: "",
    tags: "",
    ticketCategories: [
      {
        name: "",
        price: "",
        quantityAvailable: "",
        description: "",
        saleStart: "",
        saleEnd: "",
      },
    ],
  });

  /* -------------------- HANDLERS -------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTicketChange = (index, field, value) => {
    const updated = [...formData.ticketCategories];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, ticketCategories: updated }));
  };

  const addTicketCategory = () => {
    setFormData((prev) => ({
      ...prev,
      ticketCategories: [
        ...prev.ticketCategories,
        {
          name: "",
          price: "",
          quantityAvailable: "",
          description: "",
          saleStart: "",
          saleEnd: "",
        },
      ],
    }));
  };

  const removeTicketCategory = (index) => {
    const updated = formData.ticketCategories.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, ticketCategories: updated }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("location", formData.location);
      form.append("date", formData.date);
      form.append("time", formData.time);
      form.append("tags", formData.tags);

      if (formData.image) {
        form.append("media", formData.image);
      }

      form.append(
        "ticketCategories",
        JSON.stringify(
          formData.ticketCategories.map((ticket) => ({
            name: ticket.name,
            price: Number(ticket.price),
            quantityAvailable: Number(ticket.quantityAvailable),
            description: ticket.description,
            saleStart: ticket.saleStart || null,
            saleEnd: ticket.saleEnd || null,
          })),
        ),
      );

      await createEvent(form);

      setShowCreateEvent(false);
    } catch (err) {
      console.error("Create event failed:", err.response?.data || err.message);
    }
  };
  /* -------------------- CALCULATIONS -------------------- */

  const getTicketsSold = (event) =>
    event.ticketCategories?.reduce((acc, t) => acc + (t.quantitySold || 0), 0);

  const getTotalTickets = (event) =>
    event.ticketCategories?.reduce(
      (acc, t) => acc + (t.quantityAvailable || 0),
      0,
    );

  const getRevenue = (event) =>
    event.ticketCategories?.reduce(
      (acc, t) => acc + t.price * (t.quantitySold || 0),
      0,
    );

  /* -------------------- UI -------------------- */

  return (
    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          My Events
        </h2>

        <Motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateEvent(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </Motion.button>
      </div>

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400">
            No events created yet
          </div>
        ) : (
          events.map((event) => (
            <Motion.div
              key={event._id}
              whileHover={{ y: -5 }}
              className={`rounded-2xl overflow-hidden shadow-xl ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="relative h-48">
                <img
                  src={event.media?.[0] || "https://via.placeholder.com/400"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <h3
                  className={`font-bold text-lg mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {event.title}
                </h3>

                <div
                  className={`space-y-2 text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>

                  <div className="flex justify-between mt-3">
                    <span>
                      {getTicketsSold(event)} / {getTotalTickets(event)} sold
                    </span>
                    <span className="font-bold text-purple-500">
                      ₦{getRevenue(event)?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 flex items-center justify-center gap-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-sm">
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>

                  <button className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </Motion.div>
          ))
        )}
      </div>

      {/* CREATE EVENT MODAL */}
      <AnimatePresence>
        {showCreateEvent && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateEvent(false)}
          >
            <Motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Create New Event
                </h3>
                <X
                  onClick={() => setShowCreateEvent(false)}
                  className="cursor-pointer"
                />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="title"
                  placeholder="Event Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-gray-100"
                />

                <textarea
                  name="description"
                  placeholder="Event Description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-100"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="p-3 rounded-lg bg-gray-100"
                  />
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="p-3 rounded-lg bg-gray-100"
                  />
                </div>

                <input
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-100"
                />

                {/* <input
                  name="media"
                  placeholder="Cover Image URL"
                  value={formData.media}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-100"
                /> */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      image: e.target.files[0],
                    }))
                  }
                  className="w-full p-3 rounded-lg bg-gray-100"
                />

                <input
                  name="tags"
                  placeholder="Tags (comma separated)"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-100"
                />

                {/* Ticket Categories */}
                <h4 className="text-lg font-semibold mt-6">
                  Ticket Categories
                </h4>

                {formData.ticketCategories.map((ticket, index) => (
                  <div key={index} className="border rounded-xl p-4 space-y-2">
                    <input
                      placeholder="Ticket Name"
                      value={ticket.name}
                      onChange={(e) =>
                        handleTicketChange(index, "name", e.target.value)
                      }
                      className="w-full p-2 rounded bg-gray-100"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Price"
                        value={ticket.price}
                        onChange={(e) =>
                          handleTicketChange(index, "price", e.target.value)
                        }
                        className="p-2 rounded bg-gray-100"
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={ticket.quantityAvailable}
                        onChange={(e) =>
                          handleTicketChange(
                            index,
                            "quantityAvailable",
                            e.target.value,
                          )
                        }
                        className="p-2 rounded bg-gray-100"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeTicketCategory(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove Ticket
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addTicketCategory}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                >
                  Add Ticket Category
                </button>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl mt-4"
                >
                  Create Event
                </button>
              </form>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.div>
  );
};

export default PlannerEvents;
