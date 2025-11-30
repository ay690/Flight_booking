"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Plane } from "lucide-react";

// Lazy load the Header component
const LazyHeader = dynamic(
  () => import('@/components/header').then((mod) => mod.Header),
  { 
    loading: () => (
      <div className="fixed top-0 left-0 right-0 z-30 bg-card shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <Plane className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">SkyRoute</span>
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const BookingsContent = dynamic(
  () => import('./_components/bookings-content').then((mod) => mod.BookingsContent),
  {
    loading: () => (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="h-16 bg-muted rounded"></div>
                <div className="h-16 bg-muted rounded"></div>
                <div className="h-16 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    ssr: false,
  }
);

export default function BookingsPage() {

  return (
    <div className="flex flex-col min-h-screen bg-blue-200">
      <LazyHeader />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary">My Bookings</h1>
            <p className="mt-2 text-lg text-muted-foreground">View your past and upcoming trips.</p>
          </div>
          
          <Suspense fallback={
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="h-16 bg-muted rounded"></div>
                      <div className="h-16 bg-muted rounded"></div>
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <BookingsContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
