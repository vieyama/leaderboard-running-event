import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Timer, Medal, Activity, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { ModalDeleteActivity } from './Components/ModalDeleteActivity';
import { ModalActivity } from './Components/ModalActivity';

export type ActivityProps = { id: number, activity_name: string, strava_url: string, created_at: string, distance: number, duration: number, pace: number }
export type EventRegisterProps = { bib: string, id: number, total_distance: string, total_duration: number, total_pace: number, gender: string, activity: ActivityProps[], user: { name: string, email: string } }

export default function Dashboard() {
    const event = usePage().props?.event as any
    const isAdmin = usePage().props?.is_admin
    const eventRegister = usePage().props?.eventRegister as EventRegisterProps
    const activities = eventRegister?.activity

    function formatDuration(seconds: number) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function formatPace(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} /km`;
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <ScrollArea className='h-[80vh] h-800:h-[85vh]'>
                <div className="min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
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
                                                    <div className="flex items-center gap-2">
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
                                                    <div className="flex items-center gap-2">
                                                        <Timer className="w-5 h-5 text-primary" />
                                                        <CardTitle className="text-lg">Performance</CardTitle>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Distance</p>
                                                            <p className="font-semibold">{eventRegister.total_distance} km</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Duration</p>
                                                            <p className="font-semibold">{formatDuration(eventRegister.total_duration)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-muted-foreground">Average Pace</p>
                                                            <p className="font-semibold">{formatPace(eventRegister.total_pace)}</p>
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
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-primary" />
                                            <CardTitle className="text-lg">Activities</CardTitle>
                                        </div>
                                        {!isAdmin && <ModalActivity eventRegisterId={eventRegister.id} />}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {activities.map((activity) => (
                                            <Card key={activity.id} className="bg-gray-50">
                                                <CardContent className="pt-6">
                                                    <div className="flex flex-col space-y-4">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h3 className="text-lg font-semibold">{activity.activity_name}</h3>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {formatDate(activity.created_at)}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                {activity.strava_url && (
                                                                    <a
                                                                        href={activity.strava_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-1 text-primary hover:text-primary/80"
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
