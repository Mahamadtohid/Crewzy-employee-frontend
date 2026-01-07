function DashBoard() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Employees</h1>

      <div className="mb-4 flex gap-2">
        <input
          className="p-2 border rounded w-64"
          placeholder="Search by name or role"
        />
        <button className="bg-blue-600 text-white px-4 rounded">
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Example Card */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg">John Doe</h2>
          <p className="text-gray-600">Backend Engineer</p>
          <p className="text-sm text-gray-400">john@example.com</p>
        </div>
      </div>
    </div>
  );
}
export default DashBoard;