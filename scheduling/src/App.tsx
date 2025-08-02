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
};

// 2. Define Calendar props
export type CalendarProps = {
  events: CalendarEvent[];
  children?: React.ReactNode;
};

const options: Intl.DateTimeFormatOptions = {
  timeZone: "Asia/Manila",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

const formatDate = (localDate : string) => new Date(localDate).toLocaleDateString("en-PH", options);

export default function App() {

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  const [selected, setSelected] = useState<CalendarEvent[]>([]);

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from<'schedules',Schedule>('schedules')
      .select();

    if (!error) {
      return data;
    } else {
      console.error('Error fetching:', error);
    }

  }

  // const testEvents = [
  //   {
  //     id: '1',
  //     start: new Date('2025-08-26T09:30:00Z'),
  //     end: new Date('2025-08-26T14:30:00Z'),
  //     title: 'Meeting with John',
  //     color: 'pink',
  //   },
  //   {
  //     id: '2',
  //     start: new Date('2025-08-26T10:00:00Z'),
  //     end: new Date('2025-08-26T10:30:00Z'),
  //     title: 'Project Review',
  //     color: 'blue',
  //   }
  // ];

  useEffect(() => {

    const fetchData = async () => {
      const data  = await fetchSchedules() as Schedule[];
      setSchedules(data || []);

      const x = data.map(({ schedule_id, name, schedule_date }) => (
        { 
          id: String(schedule_id), 
          start: new Date(schedule_date),
          end: new Date(schedule_date),
          title: name,
        }
      ));
      setSelected([...x]);
    }; 

    fetchData();
    setLoading(false);

  }, [refresh]);

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
                <AddSchedule onAddSuccess={() => setRefresh((r) => r + 1)}/>
              </div>
              
              <DialogFooter>
                {/* <Button variant="outline" className="">Cancel</Button> */}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

    <Calendar
          key={selected.length}
          events = {[...selected]}
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
            <TableCell> {formatDate(schedule.schedule_date)}</TableCell>
          </TableRow>
        ))}


       
      </TableBody>
    </Table>
      
    </div>
    </>
  )
}

