import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { ModalCreateUpdateEvent } from './Components/ModalCreateUpdateEvent';

export type EventProps = {
    status: boolean; event_name: string, id: number, event_register: { user_id: number; }[]
}

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
                            <ModalCreateUpdateEvent />
                        </CardHeader>
                        <CardContent className='flex flex-wrap justify-center gap-8'>

                            {events?.map((event, key) => {
                                const imageNumber = (key % 5) + 1;
                                const inActive = event?.status

                                return (
                                    <div className="relative transition-transform transform hover:scale-105" key={key}>
                                        {/* Ribbon */}
                                        {!inActive && <div className="absolute z-10 -right-1 -top-1">
                                            <div className="relative bg-orange-500 text-white text-sm px-4 py-1 before:absolute before:top-0 before:right-full before:border-orange-500 before:border-t-[12px] before:border-l-[12px] before:border-l-transparent after:absolute after:left-0 after:top-full after:border-r-[12px] after:border-t-[6px] after:border-orange-700 after:border-transparent">
                                                Not Active
                                            </div>
                                        </div>}

                                        <div onClick={() => handleClickEvent(event.id)} className='flex flex-col gap-2 text-center cursor-pointer'>
                                            <Card className='w-40 h-40'>
                                                <CardContent className='p-0'>
                                                    <img src={`/images/run-${imageNumber}.svg`} alt="" className='object-cover w-40 h-40 rounded-xl' />
                                                </CardContent>
                                            </Card>
                                            <span className='text-sm font-semibold'>{event.event_name}</span>
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
