
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

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, 
    parse, 
    // isValid 
} from "date-fns"
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
    'Malore',
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

    // const [selectedName, setSelectedName] = useState("");
    // const [selectedScheduleDate, setSelectedScheduleDate] = useState("");
    // const [selectedEvent, setSelectedEvent] = useState("");

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
            // setSelectedName(data?.name);
            // setSelectedScheduleDate(data?.schedule_date);
            // setSelectedEvent(data?.event_name.toUpperCase());
            form.reset({
                name: data?.name,
                // scheduleDate: parse("08/02/2025", "MM/dd/yyyy", new Date()),
                scheduleDate: parse(data?.schedule_date, "MM/dd/yyyy", new Date()),
                eventName: data?.event_name.toUpperCase(),
            })
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
        const { data, error } = await supabase
        .from('schedules')
        .update({
            name: values.name,
            event_name: values.eventName,
            schedule_date: values.scheduleDate
        }).
        eq("schedule_id", schedule_id)
        .select();

        setLoading(false);

        if (error) {
            console.error('Update error:', error.message);
        } else {
            console.log('Updated:', values);
            console.log('Data:', data);
        }
    }

    

  return (
    <>
        {/* {schedule_id} */}
        {/* {selectedName} */}
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
                        value={field.value} 
                        onValueChange={(val) => {
                            field.onChange(val); 
                        }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose Assigned"  />
                            </SelectTrigger>
                            <SelectContent>
                                {names.map(name => (
                                <SelectItem 
                                key={name}
                                value={name}
                                >
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
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? format(field.value, "MM/dd/yyyy") : 'Pick a date'}
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
                        <Select 
                        value={field.value} 
                        onValueChange={(val) => {
                            field.onChange(val); 
                        }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose Event"  />
                            </SelectTrigger>
                            <SelectContent>
                                {events.map(event => (
                                <SelectItem 
                                key={event.toUpperCase()}
                                value={event.toUpperCase()}
                                >
                                    {event.toUpperCase()} 
                                    {field.value === event.toUpperCase() && <Check className="h-4 w-4" />}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
