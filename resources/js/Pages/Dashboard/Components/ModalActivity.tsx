import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "@/hooks/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form"
import { router, usePage } from "@inertiajs/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const FormSchema = z.object({
    activity_name: z.string().min(5, "Activity name must be at least 5 characters"),
    description: z.string().nullable(),
    distance: z.number().positive("Distance must be a positive number"),
    duration: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Please enter a valid duration (HH:MM:SS)'),
    pace: z.string().regex(/^\d{2}:\d{2}$/, 'Please enter a valid pace (e.g., 03:50)')
});

const convertTimeToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};

const convertPaceToSeconds = (pace: string) => {
    const [minutes, seconds] = pace.split(':').map(Number);
    return minutes * 60 + seconds;
};


export function ModalActivity({ eventRegisterId }: { eventRegisterId: number }) {
    const [open, setOpen] = useState(false);
    const user = usePage().props.auth.user;
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            activity_name: "",
            description: "",
            distance: 0,
            duration: '00:00:00',
            pace: '00:00'
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const durationInSeconds = convertTimeToSeconds(data.duration);
        const paceInSeconds = convertPaceToSeconds(data.pace);

        router.post("/activity/create", {
            ...data,
            duration: durationInSeconds,
            pace: paceInSeconds,
            userId: user.id,
            eventRegisterId
        },
            {
                onSuccess: () => {
                    setOpen(false);
                    form.reset();
                    toast({
                        title: "Activity created",
                        description: "The activity was successfully recorded.",
                    })
                }
            });

    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Activity
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add Activity</DialogTitle>
                    <DialogDescription>
                        Add your activity to climb the leaderboard.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        <FormField
                            control={form.control}
                            name="activity_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Activity Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Morning Run" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="distance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Distance (km)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="3.0"
                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration (minutes)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="time"
                                            step="1"
                                            placeholder="00:03:20"
                                            onChange={e => field.onChange(e.target.value)}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pace"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pace (min/km)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="time"
                                            placeholder="16:49"
                                            onChange={e => field.onChange(e.target.value)}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Strava URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="url"
                                            placeholder="https://strava.com/activities/..."
                                            onChange={e => field.onChange(e.target.value)}
                                            value={field.value ?? ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}
