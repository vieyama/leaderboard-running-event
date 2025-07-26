import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Pencil } from 'lucide-react';
import { PageProps } from '@/types';
import { PropsWithChildren } from 'react';

interface ContactSettings {
    id: number;
    whatsapp1?: string;
    whatsapp1_label: string;
    whatsapp2?: string;
    whatsapp2_label: string;
    email?: string;
    email_label: string;
    map_embed?: string;
    contact_text?: string;
    is_active: boolean;
}

type Props = {
    settings: ContactSettings;
} & PageProps;

export default function ContactSettings({ auth, settings }: Props) {
    return (
        <AuthenticatedLayout 
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Contact Settings
                </h2>
            }
        >
            <Head title="Contact Settings" />
            
            <div className="container py-6 mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Contact Settings</h1>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>
                                    Manage your contact information displayed on the contact page
                                </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                                <Link href={route('admin.contact-settings.edit', settings.id)}>
                                    <Button variant="outline" size="sm">
                                        <Pencil className="mr-2 w-4 h-4" />
                                        Edit
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <h3 className="font-medium">WhatsApp 1</h3>
                                    <p className="text-gray-600">
                                        {settings.whatsapp1 || 'Not set'}
                                        <span className="block text-sm text-gray-500">{settings.whatsapp1_label}</span>
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium">WhatsApp 2</h3>
                                    <p className="text-gray-600">
                                        {settings.whatsapp2 || 'Not set'}
                                        <span className="block text-sm text-gray-500">{settings.whatsapp2_label}</span>
                                    </p>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-medium">Email</h3>
                                <p className="text-gray-600">
                                    {settings.email || 'Not set'}
                                    <span className="block text-sm text-gray-500">{settings.email_label}</span>
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="font-medium">Status</h3>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${settings.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {settings.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
