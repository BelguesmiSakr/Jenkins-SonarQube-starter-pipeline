// app/admin/page.tsx

import Link from "next/link";

export default function AdminPage() {
  const cards = [
    {
      title: "🚨 Incidents",
      description: "Manage incident locations",
      href: "/admin/incidents",
      color: "bg-blue-500",
    },
    {
      title: "👷 Technicians",
      description: "Manage technicians and their information",
      href: "/admin/techniciens",
      color: "bg-green-500",
    },
    {
      title: "🛠️ Interventions",
      description: "Manage interventions",
      href: "/admin/interventions",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group"
          >
            <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition duration-200 cursor-pointer">

              <div
                className={`w-12 h-12 flex items-center justify-center text-white rounded-xl mb-4 ${card.color}`}
              >
                {card.title.split(" ")[0]}
              </div>

              <h2 className="text-xl font-semibold mb-2 group-hover:underline">
                {card.title}
              </h2>

              <p className="text-gray-500 text-sm">
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}