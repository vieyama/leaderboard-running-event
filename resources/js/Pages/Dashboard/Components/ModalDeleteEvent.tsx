import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast";
import { router } from "@inertiajs/react";
import { useState } from "react";

export function ModalDeleteEvent({ id, event_name }: { id: number, event_name: string }) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => (
        router.delete(`/event/${id}`, {
            onSuccess: () => {
                toast({
                    title: "Event deleted",
                    description: "The event was successfully deleted.",
                })
                setOpen(false);
                router.get('/admin-dashboard')
            }
        })
    )

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" onClick={() => setOpen(true)}>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure want to delete event: {event_name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        event.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button variant="destructive" onClick={handleDelete}>Continue</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
