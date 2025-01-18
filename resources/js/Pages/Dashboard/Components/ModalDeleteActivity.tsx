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
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function ModalDeleteActivity({ id, activity_name }: { id: number, activity_name: string }) {
    const [open, setOpen] = useState(false);

    const handleDelete = () => (
        router.delete(`/activity/${id}`, {
            onSuccess: () => {
                toast({
                    title: "Activity deleted",
                    description: "The activity was successfully deleted."
                })
                setOpen(false);
            }
        })
    )

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" onClick={() => setOpen(true)}><Trash2 /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure want to delete activity: {activity_name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        activity.
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
