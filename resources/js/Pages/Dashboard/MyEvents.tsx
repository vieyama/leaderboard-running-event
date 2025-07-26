import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Button } from '@/Components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    type: string;
}

interface Event {
    id: number;
    event_name: string;
    description?: string;
    start_date: string;
    end_date: string;
    image_path?: string;
    status: boolean;
}

interface PagePropsWithAuth extends PageProps<{
    auth: {
        user: User;
    };
    events: Event[];
}> {}

export default function MyEvents({ auth, events }: PagePropsWithAuth) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => router.visit('/dashboard')}
                        className="p-1 rounded-full transition-colors hover:bg-gray-100"
                        title="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        My Registered Events
                    </h2>
                </div>
            }
        >
            <Head title="My Events" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {events.length > 0 ? (
                            events.map((event) => (
                                <Card key={event.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                    <div className="overflow-hidden relative h-48">
                                        {event.image_path ? (
                                            <img
                                                src={event.image_path.startsWith('http') ? event.image_path : `/storage/${event.image_path}`}
                                                alt={event.event_name}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="flex justify-center items-center w-full h-full bg-gray-100">
                                                <span className="text-gray-400">No image</span>
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-xl">{event.event_name}</CardTitle>
                                        <CardDescription className="line-clamp-2">
                                            {event.description || 'No description available'}
                                        </CardDescription>
                                        <div className="mt-2 text-sm text-gray-600">
                                            <p>Start: {new Date(event.start_date).toLocaleDateString()}</p>
                                            <p>End: {new Date(event.end_date).toLocaleDateString()}</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href={`/dashboard/event/${event.id}`}>View Details</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-3 py-12 text-center">
                                <p className="text-muted-foreground">You haven't registered for any events yet.</p>
                                <Button asChild className="mt-4">
                                    <Link href="/dashboard">Browse Events</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
