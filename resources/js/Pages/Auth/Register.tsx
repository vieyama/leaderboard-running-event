import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/Select';
import AuthLayout from '@/Layouts/AuthLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { PageProps } from '@/types';
import Select from 'react-select';

interface Company {
    id: number;
    company_name: string;
}

type RegisterPageProps = PageProps & {
    companies: Company[];
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        gender: 'male',
        company_id: '',
        password: '',
        password_confirmation: '',
    });
    
    const { props: { companies } } = usePage<RegisterPageProps>();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="block mt-1 w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block mt-1 w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="gender" value="Gender" />

                    <SelectInput
                        id='gender'
                        name='gender'
                        value={data.gender}
                        className="block mt-1 w-full text-sm"
                        options={[{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }]}
                        onChange={(e) => setData('gender', e.target.value)}
                        required
                    />
                    <InputError message={errors.gender} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="company_id" value="Company" />
                    
                    <Select
                        id="company_id"
                        name="company_id"
                        options={companies.map(company => ({
                            value: company.id.toString(),
                            label: company.company_name
                        }))}
                        value={companies
                            .filter(company => company.id.toString() === data.company_id.toString())
                            .map(company => ({
                                value: company.id.toString(),
                                label: company.company_name
                            }))[0]}
                        onChange={(selected) => setData('company_id', selected?.value?.toString() || '')}
                        isSearchable={true}
                        placeholder="Search company..."
                        className="mt-1"
                        classNamePrefix="select"
                        classNames={{
                            control: (state) => `mt-1 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${state.isFocused ? 'ring-1 ring-indigo-500 border-indigo-500' : ''}`,
                            menu: () => 'border border-gray-300 rounded-md shadow-lg mt-1',
                            option: (state) => `px-4 py-2 ${state.isFocused ? 'bg-indigo-100' : ''} ${state.isSelected ? 'bg-indigo-600 text-white' : ''} cursor-pointer`,
                            singleValue: () => 'text-gray-900',
                            input: () => 'focus:ring-0 focus:outline-none focus:border-transparent focus:ring-0',
                            placeholder: () => 'text-gray-400',
                        }}
                        styles={{
                            input: (base) => ({
                                ...base,
                                'input:focus': {
                                    boxShadow: 'none',
                                },
                            }),
                        }}
                        required
                    />
                    <InputError message={errors.company_id} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block mt-1 w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block mt-1 w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex justify-end items-center mt-4">
                    <Link
                        href={route('login')}
                        className="text-sm text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </AuthLayout>
    );
}
