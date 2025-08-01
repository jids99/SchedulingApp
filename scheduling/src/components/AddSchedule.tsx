import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils" // helper to combine classNames

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { Check } from "lucide-react"

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


type FormValues = z.infer<typeof formSchema>

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
    


const AddSchedule = () => {

    const [selectedEvent, setSelectedEvent] = useState("Select Event");

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        name: "",
        scheduleDate: undefined,
        eventName: "",
        },
    })

    function onSubmit(values: FormValues) {
        console.log(values)
    }

  return (
    <div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        {/* <Input placeholder="Namae wa" {...field} /> */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">{field.value || "Select Name"}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {names.map(name => (
                                    <DropdownMenuItem
                                        key={name}
                                        onClick={() => field.onChange(name)}
                                    >
                                        {name} 
                                        {field.value === name && <Check className="h-4 w-4" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                        {/* <Input placeholder="Schedule" {...field} /> */}

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? format(field.value, "PPP") : "Pick a date"}
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
                                <Button variant="outline">{field.value || "Select Event"}</Button>
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

                <Button type="submit">Submit</Button>
            </form>
        </Form>
      
    </div>
  )
}

export default AddSchedule
