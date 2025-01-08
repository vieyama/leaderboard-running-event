import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover"
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import { Button } from "@/components/ui/button";
import { ActivityProps } from "../DetailEvent";
import { Link } from "@inertiajs/react";

dayjs.extend(duration);
dayjs.extend(relativeTime);
export function PopoverDetailActivity({ activity }: { activity: ActivityProps }) {
    const duration = dayjs.duration(activity?.pace, 'seconds');
    const minutes = duration.minutes(); // Get minutes
    const remainingSeconds = duration.seconds(); // Get seconds
    const pace = `${minutes}'${remainingSeconds}"`;
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="link" className="flex flex-col items-start px-4 py-8">
                    <p className="text-sm font-medium leading-none">
                        {activity?.activity_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {dayjs(activity.created_at).fromNow()}
                    </p>
                </Button>

            </PopoverTrigger>
            <PopoverContent className="w-96" side="right">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">{activity?.activity_name}</h4>
                        <p className="text-sm text-muted-foreground">
                            {dayjs(activity.created_at).format('DD MMMM YYYY H:m')} WIB
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid items-center grid-cols-3 gap-4">
                            <Label htmlFor="width">Distance</Label>
                            {activity?.distance} KM
                        </div>
                        <div className="grid items-center grid-cols-3 gap-4">
                            <Label htmlFor="maxWidth">Duration</Label>
                            {dayjs.duration(activity?.duration, 'seconds').format('HH:mm:ss')}
                        </div>
                        <div className="grid items-center grid-cols-3 gap-4">
                            <Label htmlFor="height">Pace</Label>
                            {pace}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="height">Strava URL</Label>
                            <a href={activity.strava_url ?? '-'} target="blank">{activity.strava_url ?? '-'}</a>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
