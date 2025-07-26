import { ReactNode } from 'react';
import { Head } from '@inertiajs/react';
import AdminNav from './Components/AdminNav';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title = 'Admin' }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100">
            <Head title={title} />
            
            <AdminNav />
            
            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
