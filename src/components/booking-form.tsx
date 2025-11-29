'use client';

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, ArrowRightLeft, Users, Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

// Sonner toast
import { toast } from "sonner";

import { destinations } from "@/lib/data";
import { setBooking } from "@/store/slices/bookingSlice";
import { AppDispatch, RootState } from "@/store/store";

const formSchema = z.object({
    from: z.string().min(1, "Please select a departure location."),
    to: z.string().min(1, "Please select a destination."),
    tripType: z.enum(["one-way", "round-trip"]),
    departureDate: z.date(),
    returnDate: z.date().optional(),
    passengers: z.number().min(1).max(9),
  }).refine((data) => data.from !== data.to, {
    message: "Departure and destination cannot be the same.",
    path: ["to"],
  }).refine((data) => {
    if (data.tripType === "round-trip") {
      return !!data.returnDate;
    }
    return true;
  }, {
    message: "Return date is required for a round trip.",
    path: ["returnDate"],
  })
  .refine((data) => {
    if (data.tripType === "round-trip" && data.returnDate) {
      return data.returnDate > data.departureDate;
    }
    return true;
  }, {
    message: "Return date must be after departure date.",
    path: ["returnDate"],
  });

export function BookingForm({ prefillTo }: { prefillTo?: string }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from: "",
      to: "",
      tripType: "one-way",
      passengers: 1,
    },
  });

  const tripType = useWatch({ control: form.control, name: "tripType" });

  React.useEffect(() => {
    if (prefillTo) {
      form.setValue("to", prefillTo);
    }
  }, [prefillTo, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isAuthenticated) {
      toast.error("Please sign in to book a flight.");
      router.push('/auth');
      return;
    }
    dispatch(setBooking(values));

    // Sonner toast
    toast("Searching for flights...", {
      description: "Redirecting to flight selection...",
    });

    router.push("/flights/search");
  }

  return (
    <Card className="container mx-auto max-w-4xl p-0 shadow-2xl">
      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="tripType"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex items-center space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="one-way" />
                        </FormControl>
                        <FormLabel className="font-normal">One Way</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="round-trip" />
                        </FormControl>
                        <FormLabel className="font-normal">Round Trip</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-end">
              <div className="md:col-span-5">
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select departure" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {destinations.map((dest) => (
                            <SelectItem key={dest.value} value={dest.value}>
                              {dest.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="hidden md:flex justify-center items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const from = form.getValues("from");
                    const to = form.getValues("to");
                    form.setValue("from", to);
                    form.setValue("to", from);
                  }}
                >
                  <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>

              <div className="md:col-span-5">
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {destinations.map((dest) => (
                            <SelectItem key={dest.value} value={dest.value}>
                              {dest.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Departure Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Return Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                              tripType === "one-way" && "bg-muted cursor-not-allowed"
                            )}
                            disabled={tripType === "one-way"}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (tripType === "round-trip") field.onChange(date);
                          }}
                          disabled={(date) => date < form.getValues("departureDate")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passengers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passengers</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-between border rounded-md p-2">
                        <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span className="font-medium">{field.value}</span>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => field.onChange(Math.max(1, field.value - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => field.onChange(Math.min(9, field.value + 1))}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" size="lg" className="w-full cursor-pointer">
              Search Flights
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default BookingForm;
