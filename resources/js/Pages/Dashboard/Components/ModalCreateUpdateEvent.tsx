import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "@/hooks/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form"
import { router } from "@inertiajs/react"
import { useState } from "react"
import { Switch } from "@/Components/ui/switch"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/Components/ui/textarea"

const FormSchema = z.object({
    event_name: z.string().min(5, "Activity name must be at least 5 characters"),
    description: z.string().nullable(),
    status: z.boolean().nullable()

});

export function ModalCreateUpdateEvent(props: { id?: number, event_name?: string, description?: string, status?: boolean, onFinish?: () => void }) {
    const { id, event_name, description, status, onFinish } = props
    const [open, setOpen] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            event_name: event_name ?? "",
            description: description ?? "",
            status: status ?? true
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        router.post(`/event/${id ? ('update/' + id) : 'create'}`, data,
            {
                onSuccess: () => {
                    setOpen(false);
                    form.reset();
                    toast({
                        title: `Event ${id ? 'updated' : 'created'}`,
                        description: `The event was successfully ${id ? 'updated' : 'created'}.`
                    })
                    onFinish && onFinish()
                }
            });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{id ? 'Edit' : 'Create'} new event</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{id ? 'Edit' : 'Create'} new event</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">

                        {id && <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Activate Status</FormLabel>
                                        <FormDescription>
                                            If your event status is not active, it will not appear on the runner's dashboard.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value ?? false}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />}

                        <FormField
                            control={form.control}
                            name="event_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Morning Run" {...field} />
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
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Description"
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
