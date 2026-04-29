# Crisis View 🚨

**Crisis View** is a real-time incident management dashboard designed to track emergency interventions on a map and manage technician assignments.

---

## Features

### 🗺️ Interactive Incident Map
- **Live Visualization**: Displays all active incidents using OpenStreetMap (Leaflet).
- **Technician Tracking**: Each marker shows the number of technicians currently assigned to that incident.
- **Visual Urgency**:
  - 🔴 **Red Marker**: Critical! No technician has been assigned yet.
  - 🔵 **Blue Marker**: Intervention in progress (at least one technician assigned).
- **Responsive Popups**: Click any marker to see details and the count of responders.

### ⚙️ Dashboard (Admin Interface)
Full CRUD (Create, Read, Update, Delete) management for:
- **Incidents**: Manage incident names and geographical coordinates.
- **Technicians**: Track workforce details (name, email, phone).
- **Interventions**: Link technicians to specific incidents.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Running Backend API**: Ensure the [Backend API](https://github.com/fredericEducentre/api_crisiview) is running on `http://localhost:3001`.

### Installation

1. Clone the repository and navigate to the project folder.
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Build the application:
```bash
npm run build
```

5. Run the production server:
```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000) (or the next available port).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Mapping**: [Leaflet](https://leafletjs.org/) & [React Leaflet](https://react-leaflet.js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/) (if applicable)

---

## 📁 Project Structure

```text
app/
├── page.tsx               # Public Map view
├── layout.tsx             # Main navigation & Header
├── admin/                 # Dashboard routes
│   ├── page.tsx           # Dashboard landing
│   ├── incidents/         # Incident management
│   ├── techniciens/       # Technician management
│   └── interventions/     # Assignment management
└── components/
    └── Map.tsx            # Leaflet Map component with color logic
```

---

## 🔗 Connection to API

The frontend connects to the backend via local network requests. The default API URL is configured as:
`http://localhost:3001`
