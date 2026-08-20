export function PageSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 w-full">
      <div className="animate-pulse flex flex-col items-center gap-6 w-full max-w-4xl">
        <div className="h-12 bg-neutral-800 rounded-md w-1/3 mb-4"></div>
        <div className="h-4 bg-neutral-800 rounded-md w-full"></div>
        <div className="h-4 bg-neutral-800 rounded-md w-5/6"></div>
        <div className="h-4 bg-neutral-800 rounded-md w-4/6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
          <div className="h-48 bg-neutral-800 rounded-md"></div>
          <div className="h-48 bg-neutral-800 rounded-md"></div>
          <div className="h-48 bg-neutral-800 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
