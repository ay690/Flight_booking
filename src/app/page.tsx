"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Header } from '@/components/header';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { BookingForm } from '@/components/booking-form';
import { Button } from '@/components/ui/button';
import { Award, ShieldCheck, Tag, Twitter, Facebook, Instagram } from 'lucide-react';
import { destinations } from '@/lib/data';

export default function Home() {
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const [prefillTo, setPrefillTo] = useState<string | undefined>(undefined);
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');
  const popularDestImages = {
    'BOM': PlaceHolderImages.find((img) => img.id === 'dest-bom'),
    'GOI': PlaceHolderImages.find((img) => img.id === 'dest-goi'),
    'BLR': PlaceHolderImages.find((img) => img.id === 'dest-blr'),
  };
  
  const features = [
    { icon: <Award className="h-10 w-10 text-primary" />, title: "Award-Winning Service", description: "Recognized for our exceptional customer service and on-time performance." },
    { icon: <ShieldCheck className="h-10 w-10 text-primary" />, title: "Safety First", description: "Your safety is our top priority, with industry-leading maintenance and training." },
    { icon: <Tag className="h-10 w-10 text-primary" />, title: "Best Price Guarantee", description: "We offer competitive fares and the best prices on your favorite destinations." },
  ];

  const popularDestinations = destinations.filter(d => ['BOM', 'GOI', 'BLR'].includes(d.value));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/40 to-transparent" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-shadow-lg">
              Your Journey, Our Passion
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-shadow">
              Experience seamless travel with SkyRoute. Book your next adventure with us.
            </p>
          </div>
        </section>

        <section ref={formSectionRef} id="booking-form" className='p-2 relative z-20 -mt-25 md:-mt-32'>
          <BookingForm prefillTo={prefillTo} />
        </section>

        <section className="py-16 md:py-24 bg-background p-1">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Why Choose SkyRoute?</h2>
                  <p className="text-muted-foreground max-w-3xl mx-auto">We are committed to providing you with an exceptional travel experience from start to finish. Here&apos;s what sets us apart.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                    <Card key={i} className="text-center p-8 hover:shadow-xl transition-shadow">
                        <div className="flex justify-center mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </Card>
                ))}
              </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Destinations</h2>
                  <p className="text-muted-foreground max-w-3xl mx-auto">Fly to your dream destinations with our exclusive offers.</p>
              </div>
              <div className="grid p-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {popularDestinations.map(dest => {
                      const destImage = popularDestImages[dest.value as keyof typeof popularDestImages];
                      return (
                        <Card key={dest.value} className="overflow-hidden group p-0">
                           {destImage && <div className="relative h-60">
                                <Image src={destImage.imageUrl} alt={destImage.description} fill className="object-fill group-hover:scale-105 transition-transform duration-300" data-ai-hint={destImage.imageHint} />
                            </div>}
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">{dest.label}</h3>
                                <p className="text-muted-foreground mb-4">Starting from <span className="font-bold text-primary">₹4,800</span></p>
                                <Button
                                  className="w-full cursor-pointer"
                                  onClick={() => {
                                    setPrefillTo(dest.value);
                                    if (formSectionRef.current) {
                                      formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                  }}
                                >
                                  Book Now
                                </Button>
                            </CardContent>
                        </Card>
                      )
                  })}
              </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-950 text-background p-1">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">SkyRoute</h3>
              <p className="text-sm text-muted-foreground">Your journey, our passion.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/bookings" className="text-muted-foreground hover:text-white">My Bookings</Link></li>
                <li><Link href="/flights" className="text-muted-foreground hover:text-white">Flight Status</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-white"><Twitter /></Link>
                <Link href="#" className="text-muted-foreground hover:text-white"><Facebook /></Link>
                <Link href="#" className="text-muted-foreground hover:text-white"><Instagram /></Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SkyRoute. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
