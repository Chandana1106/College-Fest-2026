
import React from "react";
import "./admindashboard.css";

function AdminDashboard({ events, setEvents,registrations,setRegistrations}) {
  const today = new Date();
today.setHours(0, 0, 0, 0);

const upcomingEvents = events.filter((event) => {
  const eventDate = new Date(event.date);
  return !isNaN(eventDate.getTime()) && eventDate >= today;
});
const totalClubs = new Set(events.map((event) => event.club)).size;
const eventRegistrationCounts = events.map((event) => ({
  eventName: event.name,
  count: registrations.filter(
    (registration) => registration.event === event.name
  ).length
}));
const maxRegistrations = Math.max(
  ...eventRegistrationCounts.map((event) => event.count),
  1
);
const [registrationSearch, setRegistrationSearch] = React.useState("");
const filteredRegistrations = registrations.filter((registration) => {
  const searchText = registrationSearch.toLowerCase();

  return (
    registration.studentName.toLowerCase().includes(searchText) ||
    registration.rollNumber.toLowerCase().includes(searchText) ||
    registration.email.toLowerCase().includes(searchText)
  );
});
async function handleAddEvent() {
  const name = window.prompt("Enter event name:");
  if (!name) return;

  const club = window.prompt("Enter event category:");
  if (!club) return;

  const date = window.prompt("Enter event date:");
  if (!date) return;

  const time = window.prompt("Enter event time:");
  if (!time) return;

  const venue = window.prompt("Enter event venue:");
  if (!venue) return;

  const description = window.prompt("Enter event description:");
  if (!description) return;

  const newEvent = {
    name,
    club,
    icon: "🎉",
    date,
    time,
    venue,
    description,
  };

  try {
    const response = await fetch("http://localhost:8081/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    });

    if (!response.ok) {
      throw new Error("Failed to save event");
    }

    const savedEvent = await response.json();

    setEvents((previousEvents) => [...previousEvents, savedEvent]);

    alert("Event added successfully!");
  } catch (error) {
    alert("Unable to add event. Please check the backend server.");
    console.error(error);
  }
}
async function handleDeleteRegistration(registrationId) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this registration?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:8081/api/registrations/${registrationId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete registration");
    }

    setRegistrations((previousRegistrations) =>
      previousRegistrations.filter(
        (registration) => registration.id !== registrationId
      )
    );

    alert("Registration deleted successfully!");
  } catch (error) {
    console.error("Delete registration error:", error);
    alert("Could not delete registration. Please try again.");
  }
}


function handleExportRegistrations() {
  const headers = [
    "Type",
    "Student Name",
    "Roll Number",
    "Email",
    "Event",
    "Team Name",
    "Team Members",
    "Registered At"
  ];

  const rows = registrations.map((registration) => [
    registration.registrationType,
    registration.studentName,
    registration.rollNumber,
    registration.email,
    registration.event,
    registration.teamName || "",
    registration.teamMembers || "",
    registration.registeredAt
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`
      ).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "College_Fest_Registrations.csv";
  link.click();

  URL.revokeObjectURL(url);
}
async function handleEditEvent() {
  if (events.length === 0) {
    alert("No events available to edit!");
    return;
  }

  const eventList = events
    .map((event, index) => `${index + 1}. ${event.name}`)
    .join("\n");

  const choice = window.prompt(
    `Enter the event number to edit:\n\n${eventList}`
  );

  if (choice === null) return;

  const eventIndex = Number(choice) - 1;

  if (
    !Number.isInteger(eventIndex) ||
    eventIndex < 0 ||
    eventIndex >= events.length
  ) {
    alert("Invalid event number!");
    return;
  }

  const selectedEvent = events[eventIndex];

  const name = window.prompt("Event name:", selectedEvent.name);
  if (name === null) return;

  const club = window.prompt("Event category:", selectedEvent.club);
  if (club === null) return;

  const date = window.prompt("Event date:", selectedEvent.date);
  if (date === null) return;

  const time = window.prompt("Event time:", selectedEvent.time);
  if (time === null) return;

  const venue = window.prompt("Event venue:", selectedEvent.venue);
  if (venue === null) return;

  const description = window.prompt(
    "Event description:",
    selectedEvent.description
  );
  if (description === null) return;

  const updatedEvent = {
    ...selectedEvent,
    name: name.trim() || selectedEvent.name,
    club: club.trim() || selectedEvent.club,
    date: date.trim() || selectedEvent.date,
    time: time.trim() || selectedEvent.time,
    venue: venue.trim() || selectedEvent.venue,
    description: description.trim() || selectedEvent.description,
  };

  try {
    const response = await fetch(
      `http://localhost:8081/api/events/${selectedEvent.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update event");
    }

    const savedEvent = await response.json();

    setEvents((previousEvents) =>
      previousEvents.map((event) =>
        event.id === savedEvent.id ? savedEvent : event
      )
    );

    alert("Event updated successfully!");
  } catch (error) {
    alert("Unable to update event. Please check the backend server.");
    console.error(error);
  }
}
async function handleDeleteEvent() {
  if (events.length === 0) {
    alert("No events available to delete!");
    return;
  }

  const eventList = events
    .map((event, index) => `${index + 1}. ${event.name}`)
    .join("\n");

  const choice = window.prompt(
    `Enter the event number to delete:\n\n${eventList}`
  );

  if (choice === null) return;

  const eventIndex = Number(choice) - 1;

  if (
    !Number.isInteger(eventIndex) ||
    eventIndex < 0 ||
    eventIndex >= events.length
  ) {
    alert("Invalid event number!");
    return;
  }

  const selectedEvent = events[eventIndex];

  const confirmed = window.confirm(
    `Are you sure you want to delete "${selectedEvent.name}"?`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:8081/api/events/${selectedEvent.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }

    setEvents((previousEvents) =>
      previousEvents.filter((event) => event.id !== selectedEvent.id)
    );

    alert("Event deleted successfully!");
  } catch (error) {
    alert("Unable to delete event. Please check the backend server.");
    console.error(error);
  }
}
  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <h2>FEST<span>2026</span></h2>

        <p className="sidebar-label">MAIN MENU</p>

        <a href="#overview" className="active">
          📊 Dashboard
        </a>

        <a href="#events">🎉 Manage Events</a>
        <a href="#registrations">👥 Registrations</a>
        <a href="#schedule">🕒 Schedule</a>
        <a href="#clubs">🎨 Clubs</a>

        <div className="sidebar-bottom">
          <button onClick={() => window.location.reload()}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">

        <header className="admin-header">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Welcome to College Fest 2026 Admin Panel</p>
          </div>

          <div className="admin-profile">
            🔐 Administrator
          </div>
        </header>

        {/* STATISTICS */}
        <section className="admin-stats">

          <div className="stat-card">
            <p>Total Events</p>
            <h2>{events.length.toString().padStart(2, "0")}</h2>
            <span>Events organized</span>
          </div>

          <div className="stat-card">
            <p>Total Registrations</p>
            <h2>{registrations.length.toString().padStart(2, "0")}</h2>
            <span>Student registrations</span>
          </div>

          <div className="stat-card">
            <p>Total Clubs</p>
            <h2>{totalClubs.toString().padStart(2,"0")}</h2>
            <span>Active clubs</span>
          </div>

          <div className="stat-card">
            <p>Upcoming Events</p>
            <h2>{upcomingEvents.length.toString().padStart(2, "0")}</h2>
            <span>Ready to begin</span>
          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section className="admin-actions" id="events">

          <h2>Quick Actions</h2>

          <div className="action-grid">

            <button onClick={handleAddEvent}>
              <span>➕</span>
              <strong>Add New Event</strong>
              <small>Create a new fest event</small>
            </button>

            <button onClick={handleEditEvent}>
              <span>✏️</span>
              <strong>Edit Events</strong>
              <small>Update event information</small>
            </button>

            <button onClick={handleDeleteEvent}>
              <span>🗑️</span>
              <strong>Delete Events</strong>
              <small>Remove an event</small>
            </button>

            <button>
              <span>👥</span>
              <strong>View Registrations</strong>
              <small>Check student details</small>
            </button>

          </div>

        </section>
        {/* EVENTS MANAGEMENT */}
<section className="admin-events" id="manage-events">

  <h2>Manage Events</h2>
  <p>View all events organized for College Fest 2026.</p>

  <div className="events-table-container">
    <table>
      <thead>
        <tr>
          <th>Event Name</th>
          <th>Category</th>
          <th>Date</th>
          <th>Time</th>
          <th>Venue</th>
        </tr>
      </thead>

      <tbody>
        {events.map((event) => (
          <tr key={event.id}>
            <td>{event.icon} {event.name}</td>
            <td>{event.club}</td>
            <td>{event.date}</td>
            <td>{event.time}</td>
            <td>{event.venue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

</section>
{/* REGISTRATION ANALYTICS CHART */}
<section className="admin-recent">
  <h2>Registration Analytics</h2>
  <p>Compare registrations across different events.</p>

  <div className="analytics-chart">
    {eventRegistrationCounts.map((event, index) => (
      <div className="analytics-bar-item" key={index}>
        <div className="analytics-bar-info">
          <span>{event.eventName}</span>
          <strong>{event.count}</strong>
        </div>

        <div className="analytics-bar-track">
          <div
            className="analytics-bar-fill"
            style={{
              width: `${(event.count / maxRegistrations) * 100}%`
            }}
          ></div>
        </div>
      </div>
    ))}
  </div>
</section>
      {/* EVENT-WISE REGISTRATION COUNT */}
      <section className="admin-recent">
        <h2>Event-wise Registration Count</h2>
        <p>View the number of registrations received for each event.</p>

        <div className="events-table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Total Registrations</th>
              </tr>
            </thead>

            <tbody>
              {eventRegistrationCounts.map((event, index) => (
                <tr key={index}>
                  <td>{event.eventName}</td>
                  <td>{event.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* STUDENT REGISTRATIONS */}
      <section className="admin-recent" id="registrations"></section>

       {/* STUDENT REGISTRATIONS */}
<section className="admin-recent" id="registrations">
  <div className="registration-header">
  <h2>Student Registrations</h2>

  <button
    className="export-registration-button"
    onClick={handleExportRegistrations}
    disabled={registrations.length === 0}
  >
    Export Registrations
  </button>
</div>
  <div className="registration-search">
  <input
    type="text"
    placeholder="Search by student name, roll number or email..."
    value={registrationSearch}
    onChange={(e) => setRegistrationSearch(e.target.value)}
  />
</div>

  {registrations.length === 0 ? (
    <p>No registrations available yet.</p>
  ) : (
    <div className="registrations-table-wrapper">
      <table className="registrations-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Student Name</th>
            <th>Roll Number</th>
            <th>Email</th>
            <th>Event</th>
            <th>Team Name</th>
            <th>Team Members</th>
            <th>Registered At</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredRegistrations.map((registration) => (
            <tr key={registration.id}>
              <td>{registration.registrationType}</td>
              <td>{registration.studentName}</td>
              <td>{registration.rollNumber}</td>
              <td>{registration.email}</td>
              <td>{registration.event}</td>
              <td>{registration.teamName || "—"}</td>
              <td>{registration.teamMembers || "—"}</td>
              <td>{registration.registeredAt}</td>
              <td>
  <button
    className="delete-registration-button"
    onClick={() => handleDeleteRegistration(registration.id)}
  >
    Delete
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section> 

      </main>
    </div>
  );
}


export default AdminDashboard;