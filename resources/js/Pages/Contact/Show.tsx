import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Mail, MessageCircle } from 'lucide-react';

interface ContactSettings {
    whatsapp1?: string;
    whatsapp1_label?: string;
    whatsapp2?: string;
    whatsapp2_label?: string;
    email?: string;
    email_label?: string;
    map_embed?: string;
    contact_text?: string;
    is_active?: boolean;
}

interface ContactProps {
    settings: ContactSettings;
}

export default function Contact({ settings }: ContactProps) {
    // Format WhatsApp number by removing any non-digit characters except the plus sign
    const formatWhatsAppNumber = (number: string | undefined): string => {
        if (!number) return '';
        // Remove all non-digit characters except plus
        return number.replace(/[^\d+]/g, '');
    };

    // Check if there are any active contact methods
    const hasActiveContacts = settings?.whatsapp1 || settings?.whatsapp2 || settings?.email;

    if (!hasActiveContacts) {
        return (
            <GuestLayout>
                <Head title={settings?.email_label || "Contact Us"} />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <h1 className="mb-4 text-2xl font-bold">Contact Information</h1>
                        <p className="text-gray-600">Contact information is not available at the moment. Please check back later.</p>
                    </div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Contact Us" />
            
            {/* Hero Section */}
            <div className="py-20 text-white bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="container px-4 pt-12 mx-auto text-center">
                    <h1 className="mb-4 text-3xl font-bold md:text-3xl">{settings.email_label}</h1>
                    <p className="max-w-3xl mx-auto text-md md:text-lg">
                        {settings.contact_text || "Have questions? We're here to help. Get in touch with our team."}
                    </p>
                </div>
            </div>

            {/* Contact Information */}
            <div className="container px-4 py-16 mx-auto">
                <div className="max-w-4xl grid-cols-1 gap-8 mx-auto md:grid-cols-2 md:grid">
                    {/* WhatsApp 1 */}
                    {settings.whatsapp1 && (
                        <div className="p-8 text-center bg-white rounded-lg shadow-lg hover:shadow-xl">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full">
                                <MessageCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">{settings.whatsapp1_label || 'WhatsApp 1'}</h3>
                            <p className="text-gray-600">
                                <a 
                                    href={`https://wa.me/${formatWhatsAppNumber(settings.whatsapp1)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 transition-colors hover:text-green-600"
                                >
                                    <span>{settings.whatsapp1}</span>
                                    <MessageCircle className="w-5 h-5" />
                                </a>
                            </p>
                        </div>
                    )}

                    {/* WhatsApp 2 */}
                    {settings.whatsapp2 && (
                        <div className="p-8 text-center bg-white rounded-lg shadow-lg hover:shadow-xl">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full">
                                <MessageCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">{settings.whatsapp2_label || 'WhatsApp 2'}</h3>
                            <p className="text-gray-600">
                                <a 
                                    href={`https://wa.me/${formatWhatsAppNumber(settings.whatsapp2)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 transition-colors hover:text-green-600"
                                >
                                    <span>{settings.whatsapp2}</span>
                                    <MessageCircle className="w-5 h-5" />
                                </a>
                            </p>
                        </div>
                    )}
                </div>

                {/* Email */}
                {settings.email && (
                    <div className="max-w-2xl p-8 mx-auto mt-8 text-center bg-white rounded-lg shadow-lg hover:shadow-xl">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full">
                            <Mail className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold">Email</h3>
                        <p className="text-gray-600">
                            <a 
                                href={`mailto:${settings.email}`} 
                                className="transition-colors hover:text-blue-600"
                            >
                                {settings.email}
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
