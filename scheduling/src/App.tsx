import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import './App.css'
import './components/AddSchedule'
import AddSchedule from "./components/AddSchedule"

import { supabase } from './supabaseClient';
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
} from '@/components/ui/full-calendar';


type Schedule = {
  schedule_id: number;
  name: string;
  event_name: string;
  schedule_date: string;
};

// 1. Define event type
export type CalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color: string;
};

// 2. Define Calendar props
export type CalendarProps = {
  events: CalendarEvent[];
  children?: React.ReactNode;
};

export default function App() {

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [eventsArr, setEventsArr] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchedules () {
      const { data, error } = await supabase
        .from<'schedules',Schedule>('schedules')
        .select();

      if (error) {
          console.error('Error fetching:', error);
        } else {
          setSchedules(data || []);
          const selected = data.map(({ schedule_id, name, schedule_date }) => (
            { 
              id: String(schedule_id), 
              start: new Date(schedule_date),
              end: new Date(schedule_date),
              title: name,
              color: "default"
            }
          ));
          console.log('selected ',selected);
          const y = [...selected];
          setEventsArr(y);
          setLoading(false);
        }
    }

    fetchSchedules();
  }, []);
  
  const x: CalendarEvent[] = [
            {
              id: '1',
              start: new Date('2025-08-02'),
              end: new Date('2025-08-02'),
              title: 'Meeting with John',
              color: 'pink',
            },
            {
              id: '2',
              start: new Date('2025-08-26'),
              end: new Date('2025-08-26'),
              title: 'Project Review',
              color: 'blue',
            },
          ];

    if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex min-h-svh flex-col items-center gap-8">
        <div className="flex items-end justify-between w-full">
          <h1 className="text-3xl font-bold tracking-tigh"> Scheduling </h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Add</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Schedule</DialogTitle>
                <DialogDescription>
                  {/* This action cannot be undone. This will permanently delete your account. */}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <AddSchedule />
              </div>
              
              <DialogFooter>
                {/* <Button variant="outline" className="">Cancel</Button> */}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

    <Calendar
          events = {eventsArr}
        >

      <div className="h-svh w-full p-14 flex flex-col">
        <div className="flex px-6 items-center gap-2 mb-6">
          <CalendarViewTrigger
            className="aria-[current=true]:bg-accent"
            view="day"
          >
            Day
          </CalendarViewTrigger>
          <CalendarViewTrigger
            view="week"
            className="aria-[current=true]:bg-accent"
          >
            Week
          </CalendarViewTrigger>
          <CalendarViewTrigger
            view="month"
            className="aria-[current=true]:bg-accent"
          >
            Month
          </CalendarViewTrigger>
          <CalendarViewTrigger
            view="year"
            className="aria-[current=true]:bg-accent"
          >
            Year
          </CalendarViewTrigger>

          <span className="flex-1" />

          <CalendarCurrentDate />

          <CalendarPrevTrigger>
            <ChevronLeft size={20} />
            <span className="sr-only">Previous</span>
          </CalendarPrevTrigger>

          <CalendarTodayTrigger>Today</CalendarTodayTrigger>

          <CalendarNextTrigger>
            <ChevronRight size={20} />
            <span className="sr-only">Next</span>
          </CalendarNextTrigger>

        </div>

        <div className="flex-1 px-6 overflow-hidden">
          <CalendarDayView />
          <CalendarWeekView />
          <CalendarMonthView />
          <CalendarYearView />
        </div>
      </div>
    </Calendar>

      <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Event Name</TableHead>
          <TableHead>Schedule Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map(schedule => 
        (
          <TableRow key={schedule.schedule_id}>
            <TableCell> {schedule.schedule_id}</TableCell>
            <TableCell> {schedule.name}</TableCell>
            <TableCell> {schedule.event_name}</TableCell>
            <TableCell> {schedule.schedule_date}</TableCell>
          </TableRow>
        ))}


       
      </TableBody>
    </Table>
      
    </div>
    </>
  )
}

