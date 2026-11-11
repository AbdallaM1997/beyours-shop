const statuses = ["New", "Design check", "Printing", "Shipped today"];

export default function AdminHome() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-4xl font-bold">Orders</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statuses.map((s) => (
          <div key={s} className="rounded-2xl border-2 border-line bg-paper p-5">
            <p className="font-bold text-muted">{s}</p>
            <p className="font-display text-4xl font-bold">0</p>
          </div>
        ))}
      </div>
      <p className="text-muted">Orders table, order drawer and design queue are built in milestones M3 and M5.</p>
    </div>
  );
}
