import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import Guest from '@/Layouts/GuestLayout';
import { User } from '@/lib/mock-api';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useForm } from "react-hook-form"
import { useState } from 'react';

export interface FakeUsersProps {
    success: boolean;
    time: string;
    message: string;
    total_users: number;
    offset: number;
    limit: number;
    users: User[];
}

interface EventsProps {
    eventRegister: {
        to: number;
        total: number;
        prev_page_url: string | null;
        next_page_url: string | null;
        data: EventRegisterProps[]
    };
    id: number, event_name: string
}

interface EventRegisterProps {
    id: number;
    bib: string;
    user_id: number;
    event_id: number;
    total_distance: string;
    total_duration: number;
    total_pace: number;
    user: {
        id: number;
        name: string;
        gender: string;
    };
}

export default function Welcome() {
    const eventList = usePage().props?.eventList as EventsProps[]
    const [gender, setGender] = useState('all')
    const form = useForm({
        defaultValues: {
            search: "",
        },
    })

    function onSearch(data: { search: string }) {
        setGender('all')
        router.get('/', { ...(data.search && { search: data.search }) }, { preserveScroll: true, preserveState: true })
    }

    function handleSelectGender(event: { target: { value: string } }) {
        const selectedGender = event.target.value
        if (selectedGender === 'all') {
            router.get('/', {}, { preserveScroll: true, preserveState: true })
        } else {
            router.get('/', { gender: selectedGender }, { preserveScroll: true, preserveState: true })
        }
        setGender(selectedGender)
        form.reset()
    }

    return (
        <Guest>
            <Head title="Welcome" />
            <section className="relative">
                <div className="max-w-6xl px-4 mx-auto sm:px-6">

                    {/* Hero content */}
                    <div className="pt-32 text-center">
                        <div
                            className="mb-6 border-y [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1]"
                            data-aos="zoom-y-out"
                        >
                            <div className="relative overflow-hidden rounded-2xl">
                                <img
                                    src="https://pelindorunride.id/assets/images/slide-03.jpg?version=5"
                                    alt="Team collaboration"
                                    className="w-full h-[600px] object-cover rounded-2xl"
                                />
                            </div>
                        </div>
                        <h1
                            className="border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1] md:text-6xl text-primary"
                            data-aos="zoom-y-out"
                            data-aos-delay={150}
                        >
                            Leaderboard running event
                        </h1>
                        <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1]">
                            <p
                                className="mb-8 text-lg text-gray-500"
                                data-aos="zoom-y-out"
                                data-aos-delay={300}
                            >
                                Temukan dirimu dipuncak leaderboard.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="max-w-6xl px-4 mx-auto sm:px-6">
                    <Tabs defaultValue="1">
                        <div className='overflow-x-auto max-w-96 xs:max-w-full'>
                            <TabsList className='justify-start xs:justify-center'>
                                {eventList.map(item => (
                                    <TabsTrigger key={item.id} value={item.id.toString()}>{item.event_name}</TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                        <div className='flex items-center justify-between gap-2'>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSearch)} className="flex gap-3 my-5">
                                    <FormField
                                        control={form.control}
                                        name="search"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Search name..." className='md:w-72' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Submit</Button>
                                </form>
                            </Form>
                            <select value={gender} onChange={handleSelectGender} className='text-sm text-gray-900 border border-gray-300 rounded-lg'>
                                <option value="all">All</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        {eventList.map(item => {
                            return (
                                <TabsContent key={item.id} value={item.id.toString()}>
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
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {item?.eventRegister?.data?.map((leaderboard) => (
                                                    <TableRow key={leaderboard?.id}>
                                                        <TableCell className="font-medium">{leaderboard?.bib}</TableCell>
                                                        <TableCell className="font-medium">{leaderboard?.user?.name}</TableCell>
                                                        <TableCell className='capitalize'>{leaderboard?.user?.gender}</TableCell>
                                                        <TableCell className="text-right">{parseInt(leaderboard?.total_distance, 10)} KM</TableCell>
                                                        <TableCell className="text-right">{leaderboard?.total_duration}</TableCell>
                                                        <TableCell className="text-right">{leaderboard?.total_pace}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <div className="flex items-center justify-end w-full py-4 space-x-2">
                                            <div className="flex-1 text-sm text-muted-foreground">
                                                {item?.eventRegister?.to} of{" "}
                                                {item?.eventRegister?.total} data.
                                            </div>
                                            <div className="space-x-2">
                                                <Link
                                                    href={item?.eventRegister?.prev_page_url ?? ''}
                                                    preserveScroll
                                                    className={`inline-flex items-center justify-center h-8 gap-2 px-3 text-xs font-medium border rounded-md shadow-sm whitespace-nowrap ${!item?.eventRegister?.prev_page_url ? 'pointer-events-none opacity-50' : ''} border-input bg-background hover:bg-accent hover:text-accent-foreground`}
                                                    disabled={!item?.eventRegister?.prev_page_url}
                                                >Previous</Link>
                                                <Link
                                                    href={item?.eventRegister?.next_page_url ?? ''}
                                                    preserveScroll
                                                    className={`inline-flex items-center justify-center h-8 gap-2 px-3 text-xs font-medium border rounded-md shadow-sm whitespace-nowrap ${!item?.eventRegister?.next_page_url ? 'pointer-events-none opacity-50' : ''} border-input bg-background hover:bg-accent hover:text-accent-foreground`}
                                                    disabled={!item?.eventRegister?.next_page_url}
                                                >Next</Link>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            )
                        })}
                    </Tabs>
                </div>
            </section>
        </Guest>
    );
}
