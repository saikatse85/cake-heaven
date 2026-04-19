export default function DashboardHome() {
  return (
    <div className="space-y-6 ml-64 ">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome to Dashboard 🎂
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-pink-500 font-semibold">Total Products</h2>
          <p className="text-2xl font-bold">24</p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-pink-500 font-semibold">Orders</h2>
          <p className="text-2xl font-bold">12</p>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-pink-500 font-semibold">Revenue</h2>
          <p className="text-2xl font-bold">$340</p>
        </div>
      </div>
    </div>
  );
}
