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

type Schedule = {
  schedule_id: number;
  name: string;
  event_name: string;
  schedule_date: string;

};

export default function App() {

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const { data, error } = await supabase
        .from<'schedules',Schedule>('schedules')
        .select();

      if (error) console.error('Error fetching:', error);
      else setSchedules(data || []);
    };

    fetchSchedules();
  }, []);

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
        {schedules.map(schedule => (
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

