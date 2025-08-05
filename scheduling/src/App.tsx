import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
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
import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown  } from 'lucide-react';

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
import FilterSchedule from "./components/FilterSchedule"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilter, faPlus } from "@fortawesome/free-solid-svg-icons"

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
  const [selectedSchedule, setSelectedSchedule] = useState(0);

  const [calendarUpdate, setCalendarUpdate] = useState(0);

  const [viewEdit, setViewEdit] = useState<1 | 2>(1)

  const [scheduleFilters, setScheduleFilters] = useState({assigned_name: "", event_name: ""});
  const [filterCallback, setFilterCallback] = useState({assigned_name: "", event_name: ""});

  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalFilter, setOpenModalFilter] = useState(false);

  
  ///////////////////// MODAL ///////////////////// 

  const handleAddEditSuccess = () => {
    setOpenModalAdd(false);
    setOpenModalEdit(false);
    setOpenModalFilter(false);
    setRefresh((r) => r + 1)
  }

  ///////////////////// FETCHING ///////////////////// 

  const fetchSchedules = async () => {

    let query = supabase.from<'schedules',Schedule>('schedules').select().order('schedule_id', {ascending: true});

    const hasNameFilter = scheduleFilters.assigned_name.length > 0;
    const hasEventFilter = scheduleFilters.event_name.length > 0;
    const hasAllFilters = hasNameFilter && hasEventFilter;

    if(hasAllFilters) {
      query = supabase.rpc('get_user_event_schedules', { assigned: scheduleFilters.assigned_name, eventname: scheduleFilters.event_name });
    } else if(hasNameFilter){
      query = supabase.rpc('get_user_schedules', { assigned: scheduleFilters.assigned_name });
    } else if(hasEventFilter){
      query = supabase.rpc('get_event_schedules', { eventname: scheduleFilters.event_name });
    }

    const { data, error } = await query;

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
      setCalendarUpdate(v => v + 1);
    }; 

    fetchData();
    setLoading(false);

  }, [refresh]);


  ///////////////////// FILTERING ///////////////////// 

  const handleFilter = (filters: {assigned_name: string, event_name: string}) => {
    setScheduleFilters(filters);
    setFilterCallback(filters);

  }

  const filteredData = schedules.filter(schedule =>
    schedule.name.toLowerCase().includes(scheduleFilters.assigned_name.toLowerCase())
  )

  ///////////////////// SORTING ///////////////////// 

  const [sortBy, setSortBy] = useState<keyof Schedule | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortBy) return 0
    const valA = a[sortBy]
    const valB = b[sortBy]
    if (valA < valB) return sortDir === "asc" ? -1 : 1
    if (valA > valB) return sortDir === "asc" ? 1 : -1
    return 0
  })

  const toggleSort = (column: keyof Schedule) => {
    if (sortBy === column) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(column)
      setSortDir("asc")
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex min-h-svh flex-col items-center gap-8">
        <div className="flex items-end justify-between w-full">
          <h1 className="text-3xl font-bold tracking-tight"> Scheduling </h1>

          <div className="flex gap-2">

            <Dialog open={openModalFilter} onOpenChange={setOpenModalFilter}>
              <DialogTrigger asChild>
                <Button>
                  <FontAwesomeIcon icon={faFilter} /> 
                  Filter
                  </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <FilterSchedule handleFilter={handleFilter} filter={filterCallback} onAddSuccess={handleAddEditSuccess}/>
                </div>
                
                <DialogFooter>
                  {/* <Button variant="outline" className="">Cancel</Button> */}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={openModalAdd} onOpenChange={setOpenModalAdd}>
              <DialogTrigger asChild>
                <Button>
                  <FontAwesomeIcon icon={faPlus} /> 
                  Add
                  </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Schedule</DialogTitle>
                  <DialogDescription>
                    {/* This action cannot be undone. This will permanently delete your account. */}
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <AddSchedule onAddSuccess={handleAddEditSuccess}/>
                </div>
                
                <DialogFooter>
                  {/* <Button variant="outline" className="">Cancel</Button> */}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

        </div>

    <Calendar
          key={calendarUpdate}
          events = {[...selected]}
        >

      <div className="h-svh w-full flex flex-col
                      lg:p-8">
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
            <div className="flex w-full items-center justify-center p-2 mb-2">
              <CalendarCurrentDate />
            </div>

        <div className="flex-1 px-6 overflow-hidden">
          <CalendarDayView />
          <CalendarWeekView />
          <CalendarMonthView />
          <CalendarYearView />
        </div>
      </div>
    </Calendar>
    <div className="h-svh w-full
                      lg:px-14">

      <Dialog open={openModalEdit} onOpenChange={setOpenModalEdit}>
      
        <Table>
        <TableCaption>A list of assigned graphics kapatechies per event</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead 
              onClick={() => toggleSort("schedule_id")} className="cursor-pointer select-none">
                ID{" "}
              {sortBy === "schedule_id" && (sortDir === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
              </TableHead>
              <TableHead 
              onClick={() => toggleSort("event_name")} className="cursor-pointer select-none">
                Event{" "}
              {sortBy === "event_name" && (sortDir === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
              </TableHead>
              <TableHead 
              onClick={() => toggleSort("name")} className="cursor-pointer select-none">
                Assigned{" "}
              {sortBy === "name" && (sortDir === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
              </TableHead>
              <TableHead 
              onClick={() => toggleSort("schedule_date")} className="cursor-pointer select-none">
                Schedule Date{" "}
              {sortBy === "schedule_date" && (sortDir === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData
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
              <ViewSchedule 
                schedule_id={selectedSchedule} 
                goNext={() => setViewEdit(2)} 
                onAddSuccess={handleAddEditSuccess} 
              />
            )}

            {viewEdit === 2 && (
              <EditSchedule 
                schedule_id={selectedSchedule} 
                goBack={() => setViewEdit(1)} 
                onAddSuccess={handleAddEditSuccess} 
              />
            )}

          </div>
        </DialogContent>
      </Dialog>
    </div>
      
    </div>
    </>
  )
}

