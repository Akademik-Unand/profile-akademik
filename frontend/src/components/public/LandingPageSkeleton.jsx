import { Skeleton } from '../ui/Skeleton';

export function LandingPageSkeleton() {
  return (
    <>
      <div className="pb-8">
        <section className="relative flex min-h-svh items-end overflow-hidden bg-hero">
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-chrome pb-24 md:px-6 md:pb-32">
            <Skeleton className="h-4 w-32 !bg-white/20" />
            <Skeleton className="mt-3 h-12 w-full max-w-3xl !bg-white/25 md:h-16" />
            <Skeleton className="mt-4 h-16 max-w-xl !bg-white/20" />
            <Skeleton className="mt-8 h-10 w-40 !bg-white/90" />
            <div className="mt-8 flex gap-2">
              <Skeleton className="h-1.5 w-8 !bg-white/40" />
              <Skeleton className="h-1.5 w-8 !bg-white/20" />
              <Skeleton className="h-1.5 w-8 !bg-white/20" />
            </div>
          </div>
        </section>
        <div className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 md:-mt-12 md:px-6">
          <div className="grid grid-cols-2 overflow-hidden rounded-md border border-neutral-200 bg-surface sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="px-4 py-5">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="mt-2 h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <section className="bg-mist py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-12 md:px-6">
          <div className="md:col-span-5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="mt-4 h-12 w-full md:h-16" />
            <Skeleton className="mt-6 h-1 w-16" />
          </div>
          <div className="space-y-4 md:col-span-7">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="mt-4 h-4 w-28" />
          </div>
        </div>
      </section>
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Skeleton className="mb-8 h-8 w-48" />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <Skeleton className="h-72 w-full md:h-[28rem]" />
            <div className="flex flex-col divide-y divide-neutral-200">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex gap-4 py-4 first:pt-0">
                  <Skeleton className="h-20 w-28 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-mist py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-6 lg:grid-cols-2">
          <div>
            <Skeleton className="mb-4 h-8 w-40" />
            <div className="space-y-px overflow-hidden rounded-md border border-neutral-200 bg-surface">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex gap-4 px-4 py-4">
                  <Skeleton className="h-10 w-14 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="mb-4 h-8 w-32" />
            <div className="divide-y divide-neutral-200 overflow-hidden rounded-md border border-neutral-200 bg-surface">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-4 px-4 py-4">
                  <Skeleton className="h-14 w-14 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-mist py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Skeleton className="h-8 w-28" />
          <div className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-4">
            <Skeleton className="col-span-2 row-span-2 min-h-[22rem] w-full" />
            <Skeleton className="min-h-44 w-full lg:min-h-52" />
            <Skeleton className="min-h-44 w-full lg:min-h-52" />
          </div>
        </div>
      </section>
      <section className="bg-primary py-16 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:flex-row md:justify-between md:px-6">
          <div className="max-w-2xl space-y-4">
            <Skeleton className="h-12 w-72 !bg-white/25" />
            <Skeleton className="h-5 w-full !bg-white/20" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-40 !bg-white/25" />
            <Skeleton className="h-10 w-32 !bg-white/20" />
          </div>
        </div>
      </section>
    </>
  );
}
