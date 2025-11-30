"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlaneTakeoff, PlaneLanding, Clock, Search, Plane } from "lucide-react";
import { allFlights } from "@/lib/data";

// Define the flight interface for proper typing
interface Flight {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  status: string;
}

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

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'On Time': return 'green';
    case 'Delayed': return 'secondary';
    case 'Cancelled': return 'destructive';
    default: return 'outline';
  }
};

// Create a separate component for the flight table for better lazy loading
const FlightTable = ({ filteredFlights }: { filteredFlights: Flight[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Flight</TableHead>
          <TableHead>Route</TableHead>
          <TableHead className="hidden md:table-cell">Timings</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredFlights.length > 0 ? filteredFlights.map((flight) => (
          <TableRow key={flight.id}>
            <TableCell className="font-medium">{flight.id}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                 <PlaneTakeoff className="h-4 w-4 text-muted-foreground" />
                 <span>{flight.from}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <PlaneLanding className="h-4 w-4 text-muted-foreground" />
                <span>{flight.to}</span>
              </div>
            </TableCell>
             <TableCell className="hidden md:table-cell">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{flight.departure} - {flight.arrival}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Badge variant={getStatusVariant(flight.status)}>{flight.status}</Badge>
            </TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              No flights match your criteria.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default function FlightsPage() {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredFlights = allFlights?.filter(flight => 
      flight.id.toLowerCase().includes(filter.toLowerCase()) ||
      flight.from.toLowerCase().includes(filter.toLowerCase()) ||
      flight.to.toLowerCase().includes(filter.toLowerCase())
    )?.filter(flight => statusFilter === 'all' || flight.status === statusFilter);

  return (
    <div className="flex flex-col min-h-screen bg-blue-200 p-3">
      <LazyHeader />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary">Flight Information</h1>
            <p className="mt-2 text-lg text-muted-foreground">Check the status of all our flights.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Live Flight Tracker</CardTitle>
              <div className="mt-4 flex flex-col md:flex-row gap-4">
                <div className="relative grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search by flight no., origin, or destination" 
                    className="pl-10"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="On Time">On Time</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Flight</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead className="hidden md:table-cell">Timings</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                            <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="h-6 bg-muted rounded w-20 animate-pulse ml-auto"></div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }>
                <FlightTable filteredFlights={filteredFlights} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}