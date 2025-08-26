import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { ModalCreateUpdateEvent } from './Components/ModalCreateUpdateEvent';
import dayjs from 'dayjs';

export type EventProps = {
    status: boolean;
    event_name: string;
    id: number;
    event_register: { user_id: number; }[];
    start_date: string;
    end_date: string;
    description?: string;
    image_path?: string;
}

// Function to get a random running image from assets
const getRandomRunningImage = () => {
    const randomNum = Math.floor(Math.random() * 5) + 1; // 1-5
    return `/images/run-${randomNum}.svg`;
};

export default function AdminDashboard() {
    const events = usePage().props?.events as EventProps[]

    const handleClickEvent = (id: number) => {
        router.get(`/manage-event/${id}`)
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

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card className="w-full">
                        <CardHeader className='flex flex-row justify-between'>
                            <div>
                                <CardTitle className='text-2xl'>Your event list</CardTitle>
                                <CardDescription>Manage your events!</CardDescription>
                            </div>
                            <ModalCreateUpdateEvent
                                event_name=""
                                start_date=""
                                end_date=""
                                image_path=""
                                status={false}
                            />
                        </CardHeader>
                        <CardContent className='flex flex-wrap gap-8 justify-center'>

                            {events?.map((event, key) => {
                                const today = dayjs().startOf("day");
                                const startDate = dayjs(event.start_date).startOf("day");
                                const endDate = dayjs(event.end_date).endOf("day");

                                const isActive = event.status && today.isAfter(startDate.subtract(1, "day")) && today.isBefore(endDate.add(1, "day"));

                                return (
                                    <div className="relative transition-transform transform hover:scale-105" key={key}>
                                        {/* Ribbon */}
                                        {!isActive && <div className="absolute -top-1 -right-1 z-10">
                                            <div className="relative bg-orange-500 text-white text-sm px-4 py-1 before:absolute before:top-0 before:right-full before:border-orange-500 before:border-t-[12px] before:border-l-[12px] before:border-l-transparent after:absolute after:left-0 after:top-full after:border-r-[12px] after:border-t-[6px] after:border-orange-700 after:border-transparent">
                                                Not Active
                                            </div>
                                        </div>}

                                        <div onClick={() => handleClickEvent(event.id)} className='flex flex-col gap-2 text-center cursor-pointer group'>
                                            <Card className='overflow-hidden w-48 h-56 group'>
                                                <div className='overflow-hidden h-32'>
                                                    {event.image_path ? (
                                                        <div className='relative w-full h-full'>
                                                            <div className='relative w-full h-full'>
                                                                <img
                                                                    src={`/storage/${event.image_path}`}
                                                                    alt={event.event_name}
                                                                    className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-105'
                                                                    onError={(e) => {
                                                                        const target = e.target as HTMLImageElement;
                                                                        target.src = getRandomRunningImage();
                                                                        target.className = 'object-contain p-4 w-full h-full opacity-60';
                                                                    }}
                                                                    onLoad={(e) => {
                                                                        const img = e.target as HTMLImageElement;
                                                                        img.parentElement?.classList.add('loaded');
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className='flex flex-col justify-center items-center p-4 w-full h-full bg-gray-50'>
                                                            <img
                                                                src={getRandomRunningImage()}
                                                                alt='Running event placeholder'
                                                                className='object-contain w-20 h-20 opacity-40'
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <CardContent className='p-3'>
                                                    <div className='text-sm font-medium truncate'>{event.event_name}</div>
                                                    <div className='mt-1 text-xs text-gray-500'>{event.event_register?.length || 0} Participants</div>
                                                    <div className='mt-1 text-xs text-gray-500'>
                                                        {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
