"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useRouter } from "next/navigation";
import { Download, Plane, Luggage, Mail, Loader2, IndianRupee } from "lucide-react";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { printElement } from "@/lib/print";
import { toast } from "sonner";

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

// Lazy load the Ticket component
const LazyTicket = dynamic(
  () => import('@/components/ticket').then((mod) => mod.default),
  {
    loading: () => (
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Lazy load the BaggageTag component
const LazyBaggageTag = dynamic(
  () => import('@/components/baggage-tag').then((mod) => mod.default),
  {
    loading: () => (
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const BAGGAGE_PRICE_PER_UNIT = 800;

export default function ConfirmationPage() {
  const bookings = useSelector((state: RootState) => state.booking.bookings);
  const booking = bookings[bookings.length - 1];
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketsRef = useRef<HTMLDivElement>(null);
  const baggageTagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!booking) router.replace("/");
  }, [booking, router]);

  const handleDownload = async (type: "ticket" | "tag") => {
    const element = type === "ticket" ? ticketsRef.current : baggageTagsRef.current;
    const fileName = type === "ticket" ? "SkyRoute E-Tickets" : "SkyRoute Baggage Tags";

    if (!element) {
      toast.error("Could not find content to download.");
      return;
    }

    setIsDownloading(true);

    toast(`Preparing ${type}s... Your browser's print dialog will open shortly.`);

    try {
      printElement(element, fileName);
    } catch (error) {
      console.error(error);
      toast.error("Download failed. There was a problem preparing the documents.");
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  if (!booking) return null;

  const flightPrice = booking.flightDetails?.price || 0;
  const totalFlightCost = flightPrice * booking.passengers.length;
  const totalSeatCost = booking.passengers.reduce((acc, p) => acc + (p.seat?.price || 0), 0);
  const totalBaggageCost = (booking.bags || 0) * BAGGAGE_PRICE_PER_UNIT;
  const grandTotal = totalFlightCost + totalSeatCost + totalBaggageCost;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LazyHeader />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary">Booking Confirmed!</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Your journey awaits. Here are your booking details.
            </p>
          </div>

          <Alert>
            <Mail className="h-4 w-4" />
            <AlertTitle>Email Sent!</AlertTitle>
            <AlertDescription>
              A confirmation of your booking and your e-tickets have been sent to your registered email address.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Trip Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Plane />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {booking.tripType === "one-way" ? "One Way" : "Round Trip"}
                    </p>
                    <p className="font-semibold text-lg">
                      {booking.from} to {booking.to}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Luggage />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Baggage Allowance</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="font-bold text-lg">{booking.bags || 0}</span>
                      <p className="text-sm text-muted-foreground">bag(s) included</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">Cost Breakdown</h3>
                <div className="flex justify-between text-sm">
                  <span>Flights Total:</span>
                  <span>
                    <IndianRupee size={12} className="inline-block -mt-1" />
                    {totalFlightCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Seats Total:</span>
                  <span>
                    <IndianRupee size={12} className="inline-block -mt-1" />
                    {totalSeatCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Baggage Total:</span>
                  <span>
                    <IndianRupee size={12} className="inline-block -mt-1" />
                    {totalBaggageCost.toLocaleString()}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Grand Total:</span>
                  <span>
                    <IndianRupee size={16} className="inline-block -mt-1" />
                    {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-4">Your Documents</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* ---- TICKETS ---- */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">E-Ticket(s)</h3>
                  <Button variant="outline" onClick={() => handleDownload("ticket")} disabled={isDownloading}>
                    {isDownloading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Download All
                  </Button>
                </div>

                <div ref={ticketsRef} className="space-y-4 bg-background">
                  {booking.passengers.map(
                    (p) => p.seat && (
                      <Suspense key={p.id} fallback={
                        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 animate-pulse">
                          <div className="space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-20 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      }>
                        <LazyTicket booking={booking} passenger={p} />
                      </Suspense>
                    )
                  )}
                </div>
              </div>

              {/* ---- BAGGAGE TAGS ---- */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Baggage Tag(s)</h3>
                  <Button
                    variant="outline"
                    onClick={() => handleDownload("tag")}
                    disabled={(booking.bags || 0) === 0 || isDownloading}
                  >
                    {isDownloading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Download All
                  </Button>
                </div>

                {(booking.bags || 0) > 0 ? (
                  <div ref={baggageTagsRef} className="space-y-4 bg-background">
                    {Array.from({ length: booking.bags || 0 }).map((_, i) => (
                      <Suspense key={i} fallback={
                        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 animate-pulse">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      }>
                        <LazyBaggageTag
                          booking={booking}
                          passenger={booking.passengers[0]}
                          tagNumber={i + 1}
                        />
                      </Suspense>
                    ))}
                  </div>
                ) : (
                  <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed">
                    <Luggage className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No baggage added.</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
