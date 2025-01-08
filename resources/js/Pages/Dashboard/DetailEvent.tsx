import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { ModalActivity } from './Components/ModalActivity';
import dayjs from 'dayjs';

import { ScrollArea } from '@/Components/ui/scroll-area';
import { PopoverDetailActivity } from './Components/PopoverDetailActivity';


export type ActivityProps = { activity_name: string, strava_url: string, created_at: string, distance: number, duration: number, pace: number }
export type EventRegisterProps = { id: number, total_distance: string, total_duration: number, total_pace: number, gender: string, activity: ActivityProps[] }

export default function Dashboard() {
    const event = usePage().props?.event as any
    const eventRegister = usePage().props?.eventRegister as EventRegisterProps
    const activities = eventRegister?.activity

    const duration = dayjs.duration(eventRegister?.total_pace, 'seconds');
    const minutes = duration.minutes(); // Get minutes
    const remainingSeconds = duration.seconds(); // Get seconds
    const pace = `${minutes}'${remainingSeconds}"`;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="w-full">
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <div className='flex flex-col'>
                                <CardTitle>Event: {event.event_name}</CardTitle>
                                <CardDescription>You have {activities?.length ?? 0} activities.</CardDescription>
                            </div>
                            <ModalActivity eventRegisterId={eventRegister.id} />
                        </CardHeader>
                        <CardContent className="grid gap-4 min-h-96">
                            {!!activities && <div className="flex items-center p-4 space-x-4 border rounded-md ">
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Your total activities
                                    </p>
                                    <div className='flex gap-5'>
                                        <p className="text-sm text-muted-foreground">
                                            Distances: {eventRegister?.total_distance} KM
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Durations: {dayjs.duration(eventRegister?.total_duration, 'seconds').format('HH:mm:ss')}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Pace: {pace}
                                        </p>
                                    </div>
                                </div>
                            </div>}
                            {!activities ?
                                <p className="my-auto text-center text-muted-foreground">No activities to display</p> :
                                <ScrollArea className='h-[46vh] h-800:h-[60vh]'>
                                    {activities?.map((activity, index) => {

                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-5 mb-2 last:mb-0 last:pb-0"
                                            >
                                                <span className="flex w-2 h-2 rounded-full bg-sky-500" />
                                                <PopoverDetailActivity activity={activity} />
                                            </div>
                                        )
                                    })}
                                </ScrollArea>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
