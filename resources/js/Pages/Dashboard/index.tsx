import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { ModalRegisterEvent } from './Components/ModalRegisterEvent';
import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { eventIdAtom } from '@/Store/eventAtom';

export type EventProps = { event_name: string, id: number, event_register: { user_id: number; }[] }

export default function Dashboard() {
    const user = usePage().props?.auth?.user
    const events = usePage().props?.events as EventProps[]
    const [isOpen, setIsOpen] = useState(false)
    const setEventId = useSetAtom(eventIdAtom)

    const handleClickEvent = (isRegistered: boolean, id: number) => {
        if (!isRegistered) {
            setEventId(id)
            setIsOpen(true)
        } else {
            router.get(`/dashboard/event/${id}`)
        }
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
                        <CardHeader>
                            <CardTitle className='text-2xl'>Made for You</CardTitle>
                            <CardDescription>Join our event and start running!</CardDescription>
                        </CardHeader>
                        <CardContent className='flex flex-wrap justify-center gap-8'>

                            {events?.map((event, key) => {
                                const imageNumber = (key % 5) + 1;
                                const registered = event?.event_register.find((register) => register.user_id === user.id);

                                return (
                                    <div className="relative transition-transform transform hover:scale-105" key={key}>
                                        {/* Ribbon */}
                                        {registered && <div className="absolute z-10 -right-1 -top-1">
                                            <div className="relative bg-green-500 text-white text-sm px-4 py-1 before:absolute before:top-0 before:right-full before:border-green-500 before:border-t-[12px] before:border-l-[12px] before:border-l-transparent after:absolute after:left-0 after:top-full after:border-r-[12px] after:border-t-[6px] after:border-green-700 after:border-transparent">
                                                Registered
                                            </div>
                                        </div>}

                                        <div onClick={() => handleClickEvent(!!registered, event.id)} className='flex flex-col gap-2 text-center cursor-pointer'>
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
            <ModalRegisterEvent open={isOpen} onClose={() => setIsOpen(false)} />
        </AuthenticatedLayout>
    );
}
