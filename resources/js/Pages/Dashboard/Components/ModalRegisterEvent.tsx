import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog"
import { eventIdAtom } from "@/Store/eventAtom"
import { router } from "@inertiajs/react"
import { useAtom } from "jotai"

export function ModalRegisterEvent({ open, onClose }: { open: boolean, onClose: () => void }) {
    const [eventId] = useAtom(eventIdAtom)

    const handleRegister = () => {
        router.get(`/event/register/${eventId}`)
        onClose()
    }

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Event Registration</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to register for this event? Once confirmed, your registration will be finalized, and further changes may require contacting the event organizer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRegister}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
