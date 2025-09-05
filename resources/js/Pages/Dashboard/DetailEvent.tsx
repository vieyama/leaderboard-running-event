import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Timer, Medal, Activity, ExternalLink, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { ModalDeleteActivity } from './Components/ModalDeleteActivity';
import { ModalActivity } from './Components/ModalActivity';
import { calculateTotalPace, formatDuration } from '@/utils/calculateTotalPace';

export type ActivityProps = { id: number, date: string, activity_name: string, strava_url: string, created_at: string, distance: number, duration: number, pace: number }
export type EventRegisterProps = { bib: string, id: number, total_distance: string, total_duration: number, total_pace: number, gender: string, activity: ActivityProps[], user: { name: string, email: string } }

export default function Dashboard() {
    const event = usePage().props?.event as any
    const isAdmin = usePage().props?.is_admin
    const eventRegister = usePage().props?.eventRegister as EventRegisterProps
    const activities = eventRegister?.activity
    
    // Check if the event is currently active
    const isEventActive = () => {
        const now = new Date();
        const startDate = new Date(event.start_date);
        const endDate = new Date(event.end_date);
        return now >= startDate && now <= endDate;
    }

    function formatPace(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} min/km`;
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    console.log(eventRegister);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => window.history.back()}
                        className="p-1 rounded-full transition-colors hover:bg-gray-100"
                        title="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Event Details
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />
            <ScrollArea className='h-[80vh] h-800:h-[85vh]'>
                <div className="px-4 py-12 min-h-screen bg-gray-50 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="space-y-6">
                            {/* Runner Info Card */}
                            <Card className="shadow-lg">
                                <CardHeader className="pb-2 text-center">
                                    <CardTitle className="text-2xl font-bold">{eventRegister.user?.name}</CardTitle>
                                    <p className="text-muted-foreground">{eventRegister.user?.email}</p>
                                    <p className="text-muted-foreground">BIB: {eventRegister?.bib}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="pt-4">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {/* Event Details */}
                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <div className="flex gap-2 items-center">
                                                        <Medal className="w-5 h-5 text-primary" />
                                                        <CardTitle className="text-lg">Event Details</CardTitle>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-2">
                                                        <p className="text-lg font-semibold">{event.event_name}</p>
                                                        <p className="text-muted-foreground">{event.description}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Performance Stats */}
                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <div className="flex gap-2 items-center">
                                                        <Timer className="w-5 h-5 text-primary" />
                                                        <CardTitle className="text-lg">Performance</CardTitle>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Total Distance</p>
                                                            <p className="font-semibold">{eventRegister.total_distance ?? 0} km</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Total Duration</p>
                                                            <p className="font-semibold">{formatDuration(eventRegister.total_duration)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Total Pace</p>
                                                            <p className="font-semibold">{calculateTotalPace((Number(eventRegister.total_distance) ?? 0), formatDuration(eventRegister.total_duration))}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Activities Section */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2 items-center">
                                            <Activity className="w-5 h-5 text-primary" />
                                            <CardTitle className="text-lg">Activities</CardTitle>
                                        </div>
                                        {!isAdmin && isEventActive() && (
                                            <div className="relative group">
                                                <ModalActivity 
                                                    eventRegisterId={eventRegister.id} 
                                                />
                                            </div>
                                        )}
                                        {!isEventActive() && (
                                            <div className="ml-2 px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 flex items-center">
                                                {new Date() < new Date(event.start_date) 
                                                    ? `Event starts on ${formatDate(event.start_date)}` 
                                                    : `Event ended on ${formatDate(event.end_date)}`}
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {activities.map((activity) => (
                                            <Card key={activity.id} className="bg-gray-50">
                                                <CardContent className="pt-6">
                                                    <div className="flex flex-col space-y-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="text-lg font-semibold">{activity.activity_name}</h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {formatDate(activity.date)}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-4 items-center">
                                                                {activity.strava_url !== '-' && (
                                                                    <a
                                                                        href={activity.strava_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex gap-1 items-center text-primary hover:text-primary/80"
                                                                    >
                                                                        <span className="text-sm">Strava</span>
                                                                        <ExternalLink className="w-4 h-4" />
                                                                    </a>
                                                                )}
                                                                <ModalDeleteActivity activity_name={activity.activity_name} id={activity.id} />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-4">
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Distance</p>
                                                                <p className="font-semibold">{activity.distance} km</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Duration</p>
                                                                <p className="font-semibold">{formatDuration(activity.duration)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">Pace</p>
                                                                <p className="font-semibold">{formatPace(activity.pace)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </AuthenticatedLayout>
    );
}




// { !isAdmin && <ModalActivity eventRegisterId={eventRegister.id} /> }
