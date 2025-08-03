
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type FormValues = z.infer<typeof formSchema>
const formSchema = z.object({
    name: z
        .string()
        .nonempty(" is required"),
    scheduleDate: z
        .date()
        .refine((val) => val !== null, {
            message: "Schedule bro????",
        }),
    eventName: z
        .string()
        .nonempty(" is required"),
})


type Schedule = {
  schedule_id: number;
  name: string;
  event_name: string;
  schedule_date: string;
};

const events = [
    'Sunday',
    'Across',
    'Elevate',
    'B1G',
    'Movement',
    'Women2Women',
    'E-Mini',
    'GLC',
    'Shepherd',
];

const names = [
    'Dudong',
    'Oshin',
    'Mac',
    'Robin',
    'Jeno',
    'Irene',
    'Janzen',
    'Amy',
    'Ember',
    'Keziah',
    'JL',
    'Juvy',
    'Adi',
    'John',
];


const EditSchedule = ({ schedule_id, goBack }: {schedule_id: any, goBack: () => void }) => {
    const [loading, setLoading] = useState(true);
    const [scheduleDetails, setScheduleDetails] = useState<Schedule | null>(null);

    const [selectedName, setSelectedName] = useState(scheduleDetails?.name);
    const [selectedScheduleDate, setSelectedScheduleDate] = useState(scheduleDetails?.schedule_date);
    const [SelectedEvent, setSelectedEvent] = useState(scheduleDetails?.event_name);

    const fetchSchedule = async () => {
        const { data, error } = await supabase
          .from('schedules')
          .select('*')
          .eq('schedule_id', schedule_id)
          .maybeSingle();
    
        if (!error) {
          return data;
        } else {
          console.error('Error fetching:', error);
        }
    
    }

    useEffect(() => {
    
        const fetchData = async () => {
          const data  = await fetchSchedule();
          setScheduleDetails(data);
          console.log(data);
        }; 
    
        fetchData();
        setLoading(false);
    
    }, []);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        name: "",
        scheduleDate: undefined,
        eventName: "",
        },
    })
    
    const onSubmit = async (values: FormValues) => {
        setLoading(true);
        const { error } = await supabase
        .from('schedules')
        .update({
            name: values.name,
            event_name: values.eventName,
            schedule_date: values.scheduleDate
        }).
        eq("id", schedule_id);

        setLoading(false);

        if (error) {
            console.error('Update error:', error.message);
        } else {
            console.log('Updated:', values);
        }
    }


  return (
    <>
        {schedule_id}
        {selectedName}
        {scheduleDetails?.name}
        {<Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>

                        <Select 
                        value={selectedName} 
                        onValueChange={setSelectedName}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Pick one" />
                            </SelectTrigger>
                            <SelectContent>
                                {names.map(name => (
                                <SelectItem value={name}>
                                    {name} 
                                    {field.value === name && <Check className="h-4 w-4" />}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="scheduleDate"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Schedule</FormLabel>
                    <FormControl>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? format(field.value, "PPP") : scheduleDetails?.schedule_date}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Event</FormLabel>
                    <FormControl>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">{field.value || scheduleDetails?.event_name}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {events.map(event => (
                                    <DropdownMenuItem
                                        key={event}
                                        onClick={() => field.onChange(event)}
                                    >
                                        {event} 
                                        {field.value === event && <Check className="h-4 w-4" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button 
                disabled={loading} 
                type="submit"
                >
                    {loading ? 'Updating...' : 'Update'}
                    </Button>
            </form>
        </Form> }
        <div className='flex justify-between'>
            <Button
                            onClick={goBack}
                            className="my-4 w-full"
                        >
                            {/* <FontAwesomeIcon icon={faPen} /> */}
                                            Back
                        </Button>

        </div>
    </>
  )
}

export default EditSchedule
