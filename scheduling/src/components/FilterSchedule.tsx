
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

type FormValues = z.infer<typeof formSchema>
const formSchema = z.object({
    name: z
        .string(),
    eventName: z
        .string()
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

const FilterSchedule = ({ onAddSuccess, handleFilter }: { handleFilter: (filters: {assigned_name: string, event_name: string}) => void , onAddSuccess: () => void }) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        name: "",
        eventName: "",
        },
    })

    const onSubmit = async (values: FormValues) => {
            // console.log('Filters:', values);

            handleFilter({
                assigned_name: values.name,
                event_name: values.eventName,
            })

            onAddSuccess();
    }

  return (
    <>
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

                <Button 
                type="submit"
                >
                    Filter
                    </Button>
            </form>
        </Form> }
   
    </>
  )
}

export default FilterSchedule
