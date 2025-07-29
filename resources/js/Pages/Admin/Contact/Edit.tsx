import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Switch } from '@/Components/ui/switch';
import { Textarea } from '@/Components/ui/textarea';
import { PageProps } from '@/types';

interface ContactSettings {
    id: number;
    whatsapp1?: string;
    whatsapp1_label: string;
    whatsapp2?: string;
    whatsapp2_label: string;
    email?: string;
    email_label: string;
    contact_text?: string;
    is_active: boolean;
}

type Props = {
    settings: ContactSettings;
} & PageProps;

export default function EditContactSettings({ auth, settings }: Props) {
    const { data, setData, put, processing, errors } = useForm<{
        whatsapp1: string;
        whatsapp1_label: string;
        whatsapp2: string;
        whatsapp2_label: string;
        email: string;
        email_label: string;
        contact_text: string;
        is_active: boolean;
    }>({
        whatsapp1: settings.whatsapp1 || '',
        whatsapp1_label: settings.whatsapp1_label || 'WhatsApp 1',
        whatsapp2: settings.whatsapp2 || '',
        whatsapp2_label: settings.whatsapp2_label || 'WhatsApp 2',
        email: settings.email || '',
        email_label: settings.email_label || 'Email Us',
        contact_text: settings.contact_text || '',
        is_active: settings.is_active || false,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('admin.contact-settings.update', settings.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Contact Settings
                </h2>
            }
        >
            <Head title="Edit Contact Settings" />

            <div className="container py-6 mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Edit Contact Settings</h1>
                    <Link href={route('admin.contact-settings.index')}>
                        <Button variant="outline">Back to List</Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>
                                Update the contact information displayed on the contact page
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="w-full md:w-1/2">
                                <Label htmlFor="email_label">Label</Label>
                                <Input
                                    id="email_label"
                                    value={data.email_label}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email_label', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h3 className="font-medium">WhatsApp 1</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp1">Phone Number</Label>
                                        <Input
                                            id="whatsapp1"
                                            value={data.whatsapp1}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('whatsapp1', e.target.value)}
                                            placeholder="e.g., 6281234567890"
                                        />
                                        {errors.whatsapp1 && <p className="text-sm text-red-600">{errors.whatsapp1}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp1_label">Label</Label>
                                        <Input
                                            id="whatsapp1_label"
                                            value={data.whatsapp1_label}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('whatsapp1_label', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-medium">WhatsApp 2</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp2">Phone Number</Label>
                                        <Input
                                            id="whatsapp2"
                                            value={data.whatsapp2}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('whatsapp2', e.target.value)}
                                            placeholder="e.g., 6281234567890"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp2_label">Label</Label>
                                        <Input
                                            id="whatsapp2_label"
                                            value={data.whatsapp2_label}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('whatsapp2_label', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                                    placeholder="contact@example.com"
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div className="space-y-4">
                                <Label htmlFor="contact_text">Custom Text</Label>
                                <Textarea
                                    id="contact_text"
                                    value={data.contact_text}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('contact_text', e.target.value)}
                                    placeholder="Custom text to display on the contact page"
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="space-y-1">
                                    <Label htmlFor="is_active">Active</Label>
                                    <p className="text-sm text-gray-500">
                                        {data.is_active ? 'This contact information is currently visible.' : 'This contact information is currently hidden.'}
                                    </p>
                                </div>
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                                />
                            </div>

                            <div className="flex justify-end pt-4 space-x-4">
                                <Link href={route('admin.contact-settings.index')}>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
