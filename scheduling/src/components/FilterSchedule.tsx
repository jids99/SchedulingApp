
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

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilterCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type FormValues = z.infer<typeof formSchema>
const formSchema = z.object({
    name: z
        .string(),
    eventName: z
        .string(),
    show_all: z
        .boolean()
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

const FilterSchedule = ({ onAddSuccess, handleFilter, filter }: 
                        { handleFilter: (filters: {assigned_name: string, event_name: string, show_all: boolean}) => void, 
                            filter: {assigned_name: string, event_name: string, show_all: boolean}, 
                            onAddSuccess: () => void }) => {

    const clearFilters = () => {
        form.reset({
            name: "Choose Assigned",
            eventName: "Choose Event",
            show_all: false,
        });
    };
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        name: filter.assigned_name,
        eventName: filter.event_name,
        show_all: filter.show_all,
        },
    })

    const onSubmit = async (values: FormValues) => {
        handleFilter({
            assigned_name: values.name,
            event_name: values.eventName,
            show_all: values.show_all
        })
        onAddSuccess();
    }

  return (
    <>
    <Button 
                onClick={() => clearFilters()}
                className="w-full mb-4 border border-gray-300 bg-white text-black px-4 py-2 rounded
                hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700"
                >
                    <FontAwesomeIcon icon={faFilterCircleXmark} /> 
                    Clear Filter
                    </Button>
        {<Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Assigned</FormLabel>
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

                <FormField
                control={form.control}
                name="show_all"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 
                                        has-[[aria-checked=true]]:border-blue-600 
                                        has-[[aria-checked=true]]:bg-blue-50 
                                        dark:has-[[aria-checked=true]]:border-blue-900 
                                        dark:has-[[aria-checked=true]]:bg-blue-950"
                        >
                            <Checkbox
                            id="toggle-2"
                            // defaultChecked
                            checked={field.value || false}
                            onCheckedChange={(val) => field.onChange(val === true)}
                            className="data-[state=checked]:border-blue-600 
                                        data-[state=checked]:bg-blue-600 
                                        data-[state=checked]:text-white 
                                        dark:data-[state=checked]:border-blue-700 
                                        dark:data-[state=checked]:bg-blue-700"
                            />
                            <div className="grid gap-1.5 font-normal">
                            <p className="text-sm leading-none font-medium">
                                Show All
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Unhide past schedules automatically hidden
                            </p>
                            </div>
                        </Label>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <Button 
                type="submit"
                className="w-full mt-4"
                >
                    <FontAwesomeIcon icon={faFilterCircleXmark} /> 
                    Filter
                    </Button>
            </form>
        </Form> }
   
    </>
  )
}

export default FilterSchedule
