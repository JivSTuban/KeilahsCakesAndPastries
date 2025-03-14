export function MenuItemSkeleton() {
  return (
    <div className="bg-card/50 border border-border/50 rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-muted rounded-md" />
          <div className="h-4 w-24 bg-muted rounded-md" />
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-muted rounded-full" />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded-md" />
        <div className="h-4 w-3/4 bg-muted rounded-md" />
      </div>
      <div className="mt-4">
        <div className="h-6 w-20 bg-muted rounded-full" />
      </div>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-card/50 border border-border/50 rounded-xl p-6 animate-pulse"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-muted rounded-md" />
              <div className="h-4 w-24 bg-muted rounded-md" />
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-muted rounded-full" />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded-md" />
            <div className="h-4 w-3/4 bg-muted rounded-md" />
            <div className="h-4 w-1/2 bg-muted rounded-md" />
          </div>
          <div className="mt-4">
            <div className="h-6 w-24 bg-muted rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
