import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from '@/Components/ui/pagination';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import React from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    type: number;
    created_at: string;
    company_id?: number | null;
    company?: {
        id: number;
        company_name: string;
    } | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedData<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

type UsersPageProps = PageProps & {
    users: PaginatedData<User>;
    page_size: number;
    page: number;
};

const pageSizeOptions = [5, 10, 20, 50];

export default function UsersIndex({ auth, users, page_size = 10, page = 1 }: UsersPageProps) {
    const [search, setSearch] = React.useState('');
    const [searchTimeout, setSearchTimeout] = React.useState<NodeJS.Timeout | null>(null);

    const handlePageChange = (newPage: number) => {
        router.get(route('users.index'), {
            page: newPage,
            page_size,
            search,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageSizeChange = (newPageSize: string) => {
        router.get(route('users.index'), {
            page: 1, // Reset to first page when changing page size
            page_size: newPageSize,
            search,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);

        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Set a new timeout to trigger the search after 500ms of inactivity
        setSearchTimeout(setTimeout(() => {
            router.get(route('users.index'), {
                page: 1,
                page_size,
                search: value,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 500));
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    User Management
                </h2>
            }
        >
            <Head title="User Management" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between mb-4">
                                <div className="w-full max-w-md">
                                    <Input
                                        type="text"
                                        placeholder="Search by name, email, or company..."
                                        value={search}
                                        onChange={handleSearch}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Company
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Registered At
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">
                                                        {user.company?.company_name || (
                                                            <span className="text-gray-400">No company</span>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${user.type === 1 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                        {user.type === 1 ? 'Admin' : 'User'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col gap-4 justify-between items-center px-4 py-3 sm:flex-row sm:px-0">
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm text-muted-foreground">
                                        Rows per page
                                    </p>
                                    <Select
                                        value={page_size.toString()}
                                        onValueChange={handlePageSizeChange}
                                    >
                                        <SelectTrigger className="h-8 w-[70px]">
                                            <SelectValue placeholder={page_size} />
                                        </SelectTrigger>
                                        <SelectContent side="top">
                                            {pageSizeOptions.map((size) => (
                                                <SelectItem key={size} value={size.toString()}>
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm font-medium">
                                        {users.from}-{users.to} of {users.total} users
                                    </p>
                                    <Pagination className="mx-0 w-auto">
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationLink
                                                    className={`cursor-pointer ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    onClick={() => page !== 1 && handlePageChange(1)}
                                                    aria-label="First page"
                                                >
                                                    <ChevronsLeft className="w-4 h-4" />
                                                </PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink
                                                    className={`cursor-pointer ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    onClick={() => page !== 1 && handlePageChange(Math.max(1, page - 1))}
                                                    aria-label="Previous page"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </PaginationLink>
                                            </PaginationItem>

                                            {/* Show first page */}
                                            {page > 3 && users.last_page > 5 && (
                                                <PaginationItem>
                                                    <PaginationLink
                                                        isActive={1 === page}
                                                        onClick={() => handlePageChange(1)}
                                                        className="cursor-pointer"
                                                    >
                                                        1
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )}

                                            {/* Show ellipsis if needed */}
                                            {page > 4 && users.last_page > 5 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}

                                            {/* Show page numbers */}
                                            {Array.from({ length: Math.min(5, users.last_page) }, (_, i) => {
                                                let pageNum;
                                                if (users.last_page <= 5) {
                                                    pageNum = i + 1;
                                                } else if (page <= 3) {
                                                    pageNum = i + 1;
                                                } else if (page >= users.last_page - 2) {
                                                    pageNum = users.last_page - 4 + i;
                                                } else {
                                                    pageNum = page - 2 + i;
                                                }

                                                if (pageNum < 1 || pageNum > users.last_page) return null;

                                                // Skip if we're showing first or last page in the main range
                                                if (pageNum === 1 && page > 3) return null;
                                                if (pageNum === users.last_page && page < users.last_page - 2) return null;

                                                return (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationLink
                                                            isActive={pageNum === page}
                                                            onClick={() => handlePageChange(pageNum)}
                                                            className="cursor-pointer"
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            })}

                                            {/* Show ellipsis if needed */}
                                            {page < users.last_page - 3 && users.last_page > 5 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}

                                            {/* Show last page if not in main range */}
                                            {page < users.last_page - 2 && users.last_page > 5 && (
                                                <PaginationItem>
                                                    <PaginationLink
                                                        isActive={users.last_page === page}
                                                        onClick={() => handlePageChange(users.last_page)}
                                                        className="cursor-pointer"
                                                    >
                                                        {users.last_page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )}

                                            <PaginationItem>
                                                <PaginationLink
                                                    className={`cursor-pointer ${page === users.last_page ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    onClick={() => page !== users.last_page && handlePageChange(Math.min(users.last_page, page + 1))}
                                                    aria-label="Next page"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink
                                                    className={`cursor-pointer ${page === users.last_page ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    onClick={() => page !== users.last_page && handlePageChange(users.last_page)}
                                                    aria-label="Last page"
                                                >
                                                    <ChevronsRight className="w-4 h-4" />
                                                </PaginationLink>
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
