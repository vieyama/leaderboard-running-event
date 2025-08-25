import { Link } from '@inertiajs/react';
import { route } from '@/utils/route';

export default function AdminNav() {
    return (
        <nav className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                            <Link href="/admin" className="text-xl font-bold text-gray-800">
                                Admin Panel
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link 
                                href="/admin" 
                                className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900"
                            >
                                Dashboard
                            </Link>
                            <Link 
                                href={route('admin.contact-settings.index')}
                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            >
                                Contact Settings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
