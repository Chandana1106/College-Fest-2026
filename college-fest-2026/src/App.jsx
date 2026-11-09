import AdminDashboard from "./admin/admindashboard";
import { useState, useEffect } from "react";
import "./App.css";


const categories = [
  { name: "Singing", icon: "🎤" },
  { name: "Dancing", icon: "💃" },
  { name: "Drawing", icon: "🎨" },
  { name: "Cooking", icon: "🍳" },
  { name: "Gaming", icon: "🎮" },
  { name: "Games", icon: "🏆" },
];

function App() {
  const [eventsLoading, setEventsLoading] = useState(false);
  const [events, setEvents] = useState(() => {
  const savedEvents = localStorage.getItem("collegeFestEvents");

  if (savedEvents) {
    return JSON.parse(savedEvents);
  }

  return [
    {
      id: 1,
      name: "Solo Singing",
      club: "Singing",
      icon: "🎤",
      date: "November 15, 2026",
      time: "09:00 AM - 10:00 AM",
      venue: "Auditorium",
      description: "Showcase your voice and musical talent.",
    },
    {
      id: 2,
      name: "Group Dance",
      club: "Dancing",
      icon: "💃",
      date: "November 15, 2026",
      time: "10:00 AM - 11:00 AM",
      venue: "Main Stage",
      description: "Bring your team and light up the stage.",
    },
    {
      id: 3,
      name: "Creative Sketching",
      club: "Drawing",
      icon: "🎨",
      date: "November 15, 2026",
      time: "11:00 AM - 12:00 PM",
      venue: "Art Room",
      description: "Turn your imagination into art.",
    },
    {
      id: 4,
      name: "Master Chef",
      club: "Cooking",
      icon: "🍳",
      date: "November 15, 2026",
      time: "12:00 PM - 01:00 PM",
      venue: "Food Court",
      description: "Create something delicious and impress everyone.",
    },
    {
      id: 5,
      name: "Gaming Tournament",
      club: "Gaming",
      icon: "🎮",
      date: "November 15, 2026",
      time: "02:00 PM - 03:30 PM",
      venue: "Computer Lab",
      description: "Challenge your friends and compete to win.",
    },
    {
      id: 6,
      name: "Treasure Hunt",
      club: "Games",
      icon: "🏆",
      date: "November 15, 2026",
      time: "03:30 PM - 04:30 PM",
      venue: "College Campus",
      description: "Solve clues and find the hidden treasure.",
    },
  ];
});
useEffect(() => {
  localStorage.setItem("collegeFestEvents", JSON.stringify(events));
}, [events]);
useEffect(() => {
  async function loadEvents() {
    try {
      setEventsLoading(true);

      const response = await fetch("http://localhost:8081/api/events");

      if (!response.ok) {
        throw new Error("Failed to load events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setEventsLoading(false);
    }
  }

  loadEvents();
}, []);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
const [loginError, setLoginError] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
const [adminPassword, setAdminPassword] = useState("");
  const [selectedClub, setSelectedClub] = useState("All");
const [search, setSearch] = useState("");

const [registered, setRegistered] = useState(false);
const [registrations, setRegistrations] = useState([]);

useEffect(() => {
  async function fetchRegistrations() {
    try {
      const response = await fetch(
        "http://localhost:8081/api/registrations"
      );

      if (!response.ok) {
        throw new Error("Failed to load registrations");
      }

      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Error loading registrations:", error);
    }
  }

  fetchRegistrations();
}, []);

const [registrationType, setRegistrationType] =
  useState("Individual");

const [selectedEvent, setSelectedEvent] = useState("");
const [studentName, setStudentName] = useState("");
const [rollNumber, setRollNumber] = useState("");
const [email, setEmail] = useState("");
const [teamName, setTeamName] = useState("");
const [teamMembers, setTeamMembers] = useState("");
  const filteredEvents = events.filter((event) => {
    const matchesClub =
      selectedClub === "All" || event.club === selectedClub;

    const matchesSearch =
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.club.toLowerCase().includes(search.toLowerCase());

    return matchesClub && matchesSearch;

  });

async function handleRegistration(e) {
  e.preventDefault();

  const newRegistration = {
    registrationType,
    studentName,
    rollNumber,
    email,
    teamName: registrationType === "Team" ? teamName : "",
    teamMembers: registrationType === "Team" ? teamMembers : "",
    event: selectedEvent,
    registeredAt: new Date().toLocaleString(),
  };

  try {
    const response = await fetch("http://localhost:8081/api/registrations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRegistration),
    });

    if (!response.ok) {
      throw new Error("Registration could not be saved.");
    }

    const savedRegistration = await response.json();

    setRegistrations((previousRegistrations) => [
      ...previousRegistrations,
      savedRegistration,
    ]);

    setRegistered(true);
    alert("Registration saved successfully!");
  } catch (error) {
    console.error("Registration error:", error);
    alert("Registration failed. Please try again.");
  }
}

  return (
  <>
    {isAdminLoggedIn ? (
      <AdminDashboard
  events={events}
  setEvents={setEvents}
  registrations={registrations}
  setRegistrations ={setRegistrations}
/>
    ) : (
    <div className="website">

      {/* NAVIGATION BAR */}
      <header className="navbar">
        <a href="#home" className="logo">
          <span className="logo-icon">✦</span>
          COLLEGE FEST <span>2026</span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#events">Events</a>
          <a href="#clubs">Clubs</a>
          <a href="#schedule">Schedule</a>
          <button
  className="admin-login-button"
  onClick={() => setShowAdminLogin(true)}
>
  🔐 Admin Login
</button>

        </nav>

        <a href="#register" className="nav-button">
          Register Now
        </a>
      </header>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">✦ THE BIGGEST COLLEGE CELEBRATION ✦</p>

          <h1>
            COLLEGE FEST
            <span>2026</span>
          </h1>

          <p className="hero-description">
            One campus. Endless talents. Unforgettable memories.
            Discover events, showcase your skills and celebrate
            your passion.
          </p>

          <div className="hero-buttons">
            <a href="#events" className="primary-button">
              Explore Events →
            </a>

            <a href="#schedule" className="secondary-button">
              View Schedule
            </a>
          </div>

          <div className="hero-info">
            <div>
              <strong>06+</strong>
              <span>Event Categories</span>
            </div>
            <div>
              <strong>06</strong>
              <span>Featured Events</span>
            </div>
            <div>
              <strong>01</strong>
              <span>Epic Celebration</span>
            </div>
          </div>
        </div>

        <div className="hero-art">
          <div className="glow-circle">
            <span>✦</span>
            <strong>FEST<br />2026</strong>
            <small>LET YOUR TALENT SHINE</small>
          </div>
        </div>
      </section>

      {/* CLUB CATEGORIES */}
      <section className="section" id="clubs">
        <div className="section-heading">
          <p className="eyebrow">FIND YOUR PASSION</p>
          <h2>Explore <span>Our Clubs</span></h2>
          <p>Something exciting for everyone.</p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <button
              className={`category-card ${
                selectedClub === category.name ? "active" : ""
              }`}
              key={category.name}
              onClick={() => {
                setSelectedClub(category.name);
                document.getElementById("events").scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
              <span className="category-link">Explore Events →</span>
            </button>
          ))}
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className="section events-section" id="events">
        <div className="section-heading">
          <p className="eyebrow">DON'T MISS OUT</p>
          <h2>Discover <span>Events</span></h2>
          <p>Find your favourite event and be part of the celebration.</p>
        </div>

        <div className="event-controls">
          <input
            type="text"
            placeholder="Search events or clubs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
          >
            <option value="All">All Clubs</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="event-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <article className="event-card" key={event.id}>
                <div className="event-card-top">
                  <span className="event-icon">{event.icon}</span>
                  <span className="event-tag">{event.club}</span>
                </div>

                <h3>{event.name}</h3>
                <p>{event.description}</p>

                <div className="event-details">
                  <span>📅 {event.date}</span>
                  <span>🕒 {event.time}</span>
                  <span>📍 {event.venue}</span>
                </div>

                <a href="#register" className="event-register">
                  Register for Event →
                </a>
              </article>
            ))
          ) : (
            <p className="no-events">No events found. Try another search.</p>
          )}
        </div>

        <button
          className="reset-button"
          onClick={() => {
            setSelectedClub("All");
            setSearch("");
          }}
        >
          View All Events
        </button>
      </section>

      {/* SCHEDULE */}
      <section className="section schedule-section" id="schedule">
        <div className="section-heading">
          <p className="eyebrow">PLAN YOUR DAY</p>
          <h2>Event <span>Schedule</span></h2>
          <p>Here's what is happening throughout the day.</p>
        </div>

        <div className="schedule-list">
          {events.map((event) => (
            <div className="schedule-item" key={event.id}>
              <div className="schedule-time">
                {event.time}
              </div>
              <div className="schedule-symbol">{event.icon}</div>
              <div className="schedule-details">
                <h3>{event.name}</h3>
                <p>{event.club} Club · {event.venue}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REGISTRATION */}
      {/* REGISTRATION */}
<section className="section registration-section" id="register">

  <div className="section-heading">
    <p className="eyebrow">BE PART OF THE CELEBRATION</p>
    <h2>Join <span>The Fest</span></h2>
    <p>Register individually or participate with your team.</p>
  </div>

  <form className="registration-form" onSubmit={handleRegistration}>

    <label>Registration Type</label>
    <select
      value={registrationType}
      onChange={(e) => {
        setRegistrationType(e.target.value);
        setRegistered(false);
      }}
    >
      <option value="Individual">Individual Registration</option>
      <option value="Team">Team Registration</option>
    </select>

    <label>
      {registrationType === "Team" ? "Team Leader Name" : "Student Name"}
    </label>
    <input
  type="text"
  placeholder="Enter your full name"
  value={studentName}
  onChange={(e) => setStudentName(e.target.value)}
  required
/>

    <label>Roll Number</label>
    <input
  type="text"
  placeholder="Enter your roll number"
  value={rollNumber}
  onChange={(e) => setRollNumber(e.target.value)}
  required
/>

    <label>Email Address</label>
    <input
  type="email"
  placeholder="Enter your email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

    {registrationType === "Team" && (
      <>
        <label>Team Name</label>
        <input
          type="text"
          placeholder="Enter your team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />

        <label>Team Members</label>
        <textarea
          placeholder="Enter member names separated by commas"
          rows="4"
          value={teamMembers}
          onChange={(e) => setTeamMembers(e.target.value)}
          required
        />
        <p className="form-hint">
          Include the team leader's name in the member list.
        </p>
      </>
    )}

    <label>Select Event</label>
    <select
      value={selectedEvent}
      onChange={(e) => {
        setSelectedEvent(e.target.value);
        setRegistered(false);
      }}
      required
    >
      <option value="" disabled>Choose an event</option>

      {events.map((event) => (
        <option key={event.id} value={event.name}>
          {event.name}
        </option>
      ))}
    </select>

    <button type="submit" className="primary-button submit-button">
      Submit Registration →
    </button>

    {registered && (
      <div className="success-message">
        <h3>Registration Successful! 🎉</h3>
        <p>
          Registration type: {registrationType}
        </p>
        <p>
          Event: {selectedEvent}
        </p>
        <p>
          This is a frontend demonstration. Your details
          are not yet saved to a database.
        </p>
      </div>
    )}

  </form>
</section>

      {/* FOOTER */}
      <footer className="footer">
        <a href="#home" className="logo">
          ✦ COLLEGE FEST 2026
        </a>
        <p>Discover. Participate. Celebrate.</p>
        <p>© 2026 College Fest. All rights reserved.</p>
      </footer>
      {showAdminLogin && (
  <div className="admin-modal">
    <div className="admin-modal-content">
      <button
        className="close-modal"
        onClick={() => setShowAdminLogin(false)}
      >
        ×
      </button>

      <h2>Admin Login 🔐</h2>
      <p>Enter your admin password to continue.</p>

      <input
        type="password"
        placeholder="Enter admin password"
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
      />

      <button
  className="primary-button"
  onClick={() => {
    if (adminPassword === "FestAdmin2026") {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      setAdminPassword("");
      setLoginError("");
    } else {
      setLoginError("Incorrect password. Please try again.");
    }
  }}
>
  Login
</button>
{loginError && (
  <p style={{ color: "#ff6b6b", marginTop: "12px" }}>
    {loginError}
  </p>
)}
    </div>
  </div>
)}

    </div>
)}
</>
  );
}

export default App;