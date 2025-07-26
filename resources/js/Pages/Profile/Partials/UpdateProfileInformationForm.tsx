import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import SelectInput from '@/Components/Select';
import { ParticipantProps } from '@/Pages/Dashboard';
import { Building2, Mail, Phone, MapPin as MapPinIcon } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
    participant
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
    participant: ParticipantProps;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            gender: participant?.gender
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            {participant?.company && (
                <div className="mt-8 space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary-600" />
                            Company Information
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Your company details are managed by your organization administrator
                        </p>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Company Name</p>
                                <div className="flex items-center p-3 bg-white rounded-md border border-gray-200">
                                    <p className="text-sm text-gray-900">{participant.company.name}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <div className="flex items-center p-3 bg-white rounded-md border border-gray-200">
                                    <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                    <p className="text-sm text-gray-900 truncate">{participant.company.email}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Phone</p>
                                <div className="flex items-center p-3 bg-white rounded-md border border-gray-200">
                                    <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                    <p className="text-sm text-gray-900">{participant.company.phone}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Address</p>
                                <div className="flex items-start p-3 bg-white rounded-md border border-gray-200">
                                    <MapPinIcon className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-900">{participant.company.address}</p>
                                </div>
                            </div>
                        </div>
                        
                        {participant.company.logo && (
                            <div className="pt-2">
                                <p className="text-sm font-medium text-gray-500 mb-2">Company Logo</p>
                                <div className="p-3 bg-white rounded-md border border-gray-200 inline-block">
                                    <img 
                                        src={participant.company.logo} 
                                        alt={`${participant.company.name} logo`}
                                        className="h-12 object-contain"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="block w-full mt-1"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        disabled
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="block w-full mt-1"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="gender" value="Gender" />

                    <SelectInput
                        id='gender'
                        name='gender'
                        value={data.gender}
                        className="block w-full mt-1 text-sm"
                        options={[{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }]}
                        onChange={(e) => setData('gender', e.target.value)}
                        required
                    />
                    <InputError message={errors.gender} className="mt-2" />
                </div>


                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="text-sm text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
