import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { ModalCreateUpdateEvent } from './Components/ModalCreateUpdateEvent';
import { ModalDeleteEvent } from './Components/ModalDeleteEvent';


export type ActivityProps = { activity_name: string, strava_url: string, created_at: string, distance: number, duration: number, pace: number }
export type EventRegisterProps = { id: number, total_distance: string, total_duration: number, total_pace: number, gender: string, activity: ActivityProps[] }

export default function Dashboard() {
    const event = usePage().props?.event as any
    const eventRegisters = usePage().props?.eventRegisters as any

    const onFinish = () => {
        router.get(`/manage-event/${event.id}`)
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
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <div className='flex flex-col gap-1'>
                                <CardTitle>Event: {event?.event_name}</CardTitle>
                                <CardDescription>{event?.description}</CardDescription>
                            </div>
                            <div className='flex items-center gap-3'>
                                <ModalDeleteEvent {...event} />
                                <ModalCreateUpdateEvent {...event} status={event.status > 0} onFinish={onFinish} />
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 min-h-96">
                            <div className="space-y-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[200px]">BIB</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Gender</TableHead>
                                            <TableHead className="text-right">Total Distances</TableHead>
                                            <TableHead className="text-right">Total Durations</TableHead>
                                            <TableHead className="text-right">Total Pace</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {eventRegisters?.data?.map((leaderboard: any) => (
                                            <TableRow key={leaderboard?.id}>
                                                <TableCell className="font-medium">{leaderboard?.bib}</TableCell>
                                                <TableCell className="font-medium">{leaderboard?.user?.name}</TableCell>
                                                <TableCell className='capitalize'>{leaderboard?.user?.gender}</TableCell>
                                                <TableCell className="text-right">{parseInt(leaderboard?.total_distance, 10)} KM</TableCell>
                                                <TableCell className="text-right">{leaderboard?.total_duration}</TableCell>
                                                <TableCell className="text-right">{leaderboard?.total_pace}</TableCell>
                                                <TableCell><Link href={`/event/${leaderboard?.event_id}/user/${leaderboard?.user_id}`}>Detail</Link></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="flex items-center justify-end w-full py-4 space-x-2">
                                    <div className="flex-1 text-sm text-muted-foreground">
                                        {eventRegisters?.to} of{" "}
                                        {eventRegisters?.total} data.
                                    </div>
                                    <div className="space-x-2">
                                        <Link
                                            href={eventRegisters?.prev_page_url ?? ''}
                                            preserveScroll
                                            className={`inline-flex items-center justify-center h-8 gap-2 px-3 text-xs font-medium border rounded-md shadow-sm whitespace-nowrap ${!eventRegisters?.prev_page_url ? 'pointer-events-none opacity-50' : ''} border-input bg-background hover:bg-accent hover:text-accent-foreground`}
                                            disabled={!eventRegisters?.prev_page_url}
                                        >Previous</Link>
                                        <Link
                                            href={eventRegisters?.next_page_url ?? ''}
                                            preserveScroll
                                            className={`inline-flex items-center justify-center h-8 gap-2 px-3 text-xs font-medium border rounded-md shadow-sm whitespace-nowrap ${!eventRegisters?.next_page_url ? 'pointer-events-none opacity-50' : ''} border-input bg-background hover:bg-accent hover:text-accent-foreground`}
                                            disabled={!eventRegisters?.next_page_url}
                                        >Next</Link>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
