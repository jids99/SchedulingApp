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

// import { format } from "date-fns";

import ViewSchedule from "./components/ViewSchedule"
import EditSchedule from "./components/EditSchedule"

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

  // const today = format(new Date(), "MM/dd/yyyy");

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  const [selected, setSelected] = useState<CalendarEvent[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState(0);

  const [viewEdit, setViewEdit] = useState<1 | 2>(1)

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from<'schedules',Schedule>('schedules')
      .select()
      // .gte('schedule_date', format(new Date(), "MM/dd/yyyy"))
      .order('schedule_id', { ascending: true });

    if (!error) {
      return data;
    } else {
      console.error('Error fetching:', error);
    }

  }

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
          <h1 className="text-3xl font-bold tracking-tight"> Scheduling </h1>

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

      <div className="h-svh w-full flex flex-col
                      lg:p-14">
        <div className="flex flex-col px-6 items-center justify-center gap-2 mb-6
                lg:flex-row">


            <div className="flex">
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
            </div>
            <div className="flex">
              <CalendarCurrentDate />
            </div>
            <div className="flex items-center gap-2">
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
          
        </div>

        <div className="flex-1 px-6 overflow-hidden">
          <CalendarDayView />
          <CalendarWeekView />
          <CalendarMonthView />
          <CalendarYearView />
        </div>
      </div>
    </Calendar>
    <Dialog>
      <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Event </TableHead>
            <TableHead>Assigned</TableHead>
            <TableHead>Schedule Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedules
          // .filter(schedule => new Date(schedule.schedule_date) >= new Date(today))
          .map(schedule => (
            
            <DialogTrigger 
            asChild
            key={schedule.schedule_id}
            >
              <TableRow 
              key={schedule.schedule_id}
              onClick={() => { setViewEdit(1); setSelectedSchedule(schedule.schedule_id) }}
              >
                <TableCell> {schedule.schedule_id}</TableCell>
                <TableCell> {schedule.event_name}</TableCell>
                <TableCell> {schedule.name}</TableCell>
                <TableCell> {formatDate(schedule.schedule_date)}</TableCell>
              </TableRow>
            </DialogTrigger>
            
          ))}
        </TableBody>
      </Table>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Details</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="py-4">

          {/* <ViewSchedule schedule_id={selectedSchedule}/> */}

          {viewEdit === 1 && (
            <ViewSchedule schedule_id={selectedSchedule} goNext={() => setViewEdit(2)} />
          )}

          {viewEdit === 2 && (
            <EditSchedule schedule_id={selectedSchedule} goBack={() => setViewEdit(1)} />
          )}

        </div>
      </DialogContent>
    </Dialog>
      
    </div>
    </>
  )
}

