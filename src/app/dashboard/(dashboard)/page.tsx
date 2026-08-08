// import { register } from "@/actions/user-actions";

export default  function DashboardPage() {
//  await register();
  return (
    <div className="grid gap-6 md:grid-cols-2 mt-4 lg:grid-cols-3">
      {/* Stats Card */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-slate-500 text-sm font-medium"></h3>
          <p className="text-2xl font-bold mt-2"></p>
          <span className="text-green-500 text-xs font-medium"></span>
        </div>
      ))}

      {/* Large Content Placeholder */}
      <div className="col-span-full h-[400px] bg-white rounded-xl border border-dashed border-slate-300 flex items-center justify-center">
        <p className="text-slate-400">Your Charts or Table will go here</p>
      </div>
    </div>
  )
}