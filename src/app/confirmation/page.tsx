/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Plane, Luggage, Mail, Loader2, IndianRupee, CheckCircle2 } from "lucide-react";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Header } from "@/components/header";
import Ticket from "@/components/ticket";
import { TicketPrint } from "@/components/ticket-print";
import BaggageTag from "@/components/baggage-tag";
import { BaggageTagPrint } from "@/components/baggage-tag-print";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { downloadPDF } from "@/lib/pdf";
import { toast } from "sonner";

const BAGGAGE_PRICE_PER_UNIT = 800;

export default function ConfirmationPage() {
  const bookings = useSelector((state: RootState) => state.booking.bookings);
  const booking = bookings[bookings.length - 1]; // Get the most recent booking
  const router = useRouter();
  const [downloadState, setDownloadState] = useState<{
    type: 'ticket' | 'baggage' | null;
    error: string | null;
  }>({ type: null, error: null });
  
  const isDownloading = downloadState.type !== null;

  useEffect(() => {
    if (!booking) {
      router.replace("/");
    }
  }, [booking, router]);

  const handleDownload = async (type: 'ticket' | 'baggage') => {
    try {
      setDownloadState({ type, error: null });
      
      // Add a small delay to ensure the UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const elementId = type === 'ticket' ? 'ticket-print' : 'baggage-print';
      const element = document.getElementById(elementId);
      
      if (!element) {
        throw new Error(`Could not find ${type} element to print`);
      }
      
      // Make the element temporarily visible for rendering
      const originalDisplay = element.style.display;
      element.style.display = 'block';
      
      try {
        const fileName = `${type}-${new Date().toISOString().split('T')[0]}.pdf`;
        console.log(`Starting download of ${fileName}...`);
        
        await downloadPDF(element, fileName);
        
        toast.success('Download complete!', { 
          description: `${type === 'ticket' ? 'E-ticket' : 'Baggage tag'} has been downloaded.`,
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
        });
      } finally {
        // Restore original display state
        element.style.display = originalDisplay;
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF';
      setDownloadState(prev => ({ ...prev, error: errorMessage }));
      
      toast.error('Download failed', { 
        description: errorMessage,
        action: {
          label: 'Retry',
          onClick: () => handleDownload(type),
        },
      });
    } finally {
      setDownloadState(prev => ({ ...prev, type: null }));
    }
  };
  
  if (!booking) {
    return null;
  }
  
  const flightPrice = (booking as any).flightDetails?.price || 0;
  const totalFlightCost = flightPrice * (booking.passengers?.length || 0);
  const totalSeatCost = (booking.passengers || []).reduce((acc: number, p: any) => acc + ((p.seat?.price) || 0), 0);
  const totalBaggageCost = (booking.bags || 0) * BAGGAGE_PRICE_PER_UNIT;
  const grandTotal = totalFlightCost + totalSeatCost + totalBaggageCost;

  /**
   * Prepare a booking object tailored for print components. We supply fallbacks (empty strings)
   * for fields that the print components expect, and normalize ids to strings.
   * We cast to `any` when passing down to the print components to avoid strict mismatch errors.
   */
  const bookingForPrint = {
    // copy everything we can
    ...booking,
    // ensure id/bookingId exist as strings
    id: (booking as any).id ? String((booking as any).id) : ((booking as any).bookingId ? String((booking as any).bookingId) : ''),
    bookingId: (booking as any).bookingId ? String((booking as any).bookingId) : ((booking as any).id ? String((booking as any).id) : ''),
    // ensure flight metadata exist
    departureTime: (booking as any).departureTime ?? '',
    arrivalTime: (booking as any).arrivalTime ?? '',
    flightNumber: (booking as any).flightNumber ?? '',
    pnr: (booking as any).pnr ?? '',
  };

  // Helper to normalize passenger for print usage
  const makePrintablePassenger = (p: any) => {
    return {
      ...p,
      id: p.id !== undefined && p.id !== null ? String(p.id) : '',
      firstName: p.firstName ?? '',
      lastName: p.lastName ?? '',
      name: p.name ?? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim(),
      // convert null seat -> undefined, and convert seat.id to string if present
      seat: p.seat ? { ...p.seat, id: p.seat.id !== undefined && p.seat.id !== null ? String(p.seat.id) : String(p.seat.id ?? '') } : undefined
    };
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary">Booking Confirmed!</h1>
            <p className="mt-2 text-lg text-muted-foreground">Your journey awaits. Here are your booking details.</p>
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
                  <div className="p-3 bg-primary/10 rounded-full text-primary"><Plane /></div>
                  <div>
                    <p className="text-sm text-muted-foreground">{booking.tripType === 'one-way' ? 'One Way' : 'Round Trip'}</p>
                    <p className="font-semibold text-lg">{booking.from} to {booking.to}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary"><Luggage /></div>
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
                <div className="flex justify-between text-sm"><span>Flights Total:</span> <span><IndianRupee size={12} className="inline-block -mt-1"/>{totalFlightCost.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span>Seats Total:</span> <span><IndianRupee size={12} className="inline-block -mt-1"/>{totalSeatCost.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span>Baggage Total:</span> <span><IndianRupee size={12} className="inline-block -mt-1"/>{totalBaggageCost.toLocaleString()}</span></div>
                <Separator/>
                <div className="flex justify-between font-bold text-lg"><span>Grand Total:</span> <span><IndianRupee size={16} className="inline-block -mt-1"/>{grandTotal.toLocaleString()}</span></div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-4">Your Documents</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">E-Ticket(s)</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload('ticket')} 
                    disabled={downloadState.type !== null}
                  >
                    {downloadState.type === 'ticket' ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4"/>
                    )}
                    Download All
                  </Button>
                </div>
                <div className="space-y-4 bg-background">
                  {booking.passengers.map((p: any) => p.seat && <Ticket key={p.id} booking={booking} passenger={p} />)}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Baggage Tag(s)</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload('baggage')} 
                    disabled={(booking.bags || 0) === 0 || downloadState.type !== null}
                  >
                    {downloadState.type === 'baggage' ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4"/>
                    )}
                    Download All
                  </Button>
                </div>
                {(booking.bags || 0) > 0 ? (
                  <div className="space-y-4 bg-background">
                    {Array.from({ length: booking.bags || 0 }).map((_, i) => (
                      <BaggageTag key={i} booking={booking} passenger={booking.passengers[0]} tagNumber={i+1} />
                    ))}
                  </div>
                ) : (
                  <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed">
                    <Luggage className="h-10 w-10 text-muted-foreground mb-2"/>
                    <p className="text-muted-foreground">No baggage added.</p>
                  </Card>
                )}
              </div>
            </div>

            {/* Print-safe containers (hidden from view) */}
            <div className="hidden print-safe">
              <div id="ticket-print" className="p-4 bg-white">
                {booking.passengers.map((p: any, index: number) => {
                  // Only print passengers that have a seat (same as visible list)
                  if (!p.seat) return null;
                  const printablePassenger = makePrintablePassenger(p);
                  return (
                    <div key={index} className="mb-8">
                      <TicketPrint
                        passenger={printablePassenger as any}
                        booking={bookingForPrint as any}
                      />
                    </div>
                  );
                })}
              </div>

              {(booking.bags || 0) > 0 && (
                <div id="baggage-print" className="p-4 mt-8 bg-white">
                  {booking.passengers.flatMap((p: any, idx: number) => 
                    Array.from({ length: booking.bags || 0 }).map((_, i) => {
                      const printablePassenger = makePrintablePassenger(p);
                      return (
                        <div key={`${idx}-${i}`} className="mb-6">
                          <BaggageTagPrint
                            data={{
                              passenger: printablePassenger,
                              booking: bookingForPrint,
                              tagNumber: i + 1
                            } as any}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
