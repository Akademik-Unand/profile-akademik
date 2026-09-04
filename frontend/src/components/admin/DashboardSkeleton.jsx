export function DashboardSkeleton() {
  return (
    <div>
      <div className="mb-6">
        <div className="skeleton mb-2 h-4 w-28" />
        <div className="skeleton h-7 w-48" />
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="card bg-base-100 shadow-sm">
            <div className="card-body gap-2 py-4">
              <div className="skeleton h-3 w-20" />
              <div className="skeleton h-8 w-12" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="skeleton h-72 w-full" />
        <div className="skeleton h-72 w-full" />
      </div>
    </div>
  );
}
