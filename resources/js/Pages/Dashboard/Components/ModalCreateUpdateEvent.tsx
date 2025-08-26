import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Switch } from "@/Components/ui/switch";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Calendar, Upload, X } from "lucide-react";
import ErrorBoundary from "@/Components/ErrorBoundary";

// Get current date in local timezone
const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// Get today's date in local timezone
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const todayString = getLocalDateString(today);

// Calculate one year from now
const oneYearFromNow = new Date(today);
oneYearFromNow.setFullYear(today.getFullYear() + 1);
const oneYearFromNowString = getLocalDateString(oneYearFromNow);

const FormSchema = z
    .object({
        event_name: z
            .string()
            .min(5, "Activity name must be at least 5 characters"),
        description: z.string().nullable(),
        status: z.boolean().nullable(),
        image: z
            .any()
            .refine(
                (file) =>
                    !file ||
                    (file instanceof File && file.size <= 2 * 1024 * 1024),
                {
                    message: "Image must be less than 2MB",
                }
            )
            .refine(
                (file) =>
                    !file ||
                    [
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                        "image/gif",
                        "image/svg+xml",
                    ].includes(file?.type),
                {
                    message:
                        "Only .jpg, .jpeg, .png, .gif, and .svg formats are supported",
                }
            )
            .nullable()
            .optional(),
        start_date: z.string().min(1, "Start date is required").superRefine((date, ctx) => {
            // Create date objects in local timezone
            const selectedDate = new Date(date);
            const todayAtMidnight = new Date();
            todayAtMidnight.setHours(0, 0, 0, 0);

            // Reset time components for comparison
            const selectedDateAtMidnight = new Date(selectedDate);
            selectedDateAtMidnight.setHours(0, 0, 0, 0);

            // For existing events, also check it's not before the original start date
            const parentData = (ctx as any).parent;
            if (parentData?.id && parentData?.start_date) {
                const originalDate = new Date(parentData.start_date);
                originalDate.setHours(0, 0, 0, 0);

                if (selectedDateAtMidnight < originalDate) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Start date cannot be earlier than the existing start date"
                    });
                }
            }
        }),
        end_date: z.string().min(1, "End date is required").superRefine((date, ctx) => {
            const selectedDate = new Date(date);
            const todayAtMidnight = new Date();
            todayAtMidnight.setHours(0, 0, 0, 0);

            // Reset time components for comparison
            const selectedDateAtMidnight = new Date(selectedDate);
            selectedDateAtMidnight.setHours(0, 0, 0, 0);

            // Check if date is more than 1 year from now
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            oneYearFromNow.setHours(0, 0, 0, 0);

            if (selectedDateAtMidnight > oneYearFromNow) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "End date cannot be more than 1 year from now"
                });
            }
        })
    })
    .refine(
        (data) => {
            if (data.start_date && data.end_date) {
                const start = new Date(data.start_date);
                const end = new Date(data.end_date);
                return start <= end;
            }
            return true;
        },
        {
            message: "End date must be after or equal to start date",
            path: ["end_date"],
        }
    );

interface ModalCreateUpdateEventProps {
    id?: number;
    event_name?: string;
    description?: string;
    status?: boolean;
    start_date?: string;
    end_date?: string;
    image_path?: string;
    onFinish?: () => void;
}

export function ModalCreateUpdateEvent(props: ModalCreateUpdateEventProps) {
    const {
        id,
        event_name,
        description,
        status,
        start_date,
        end_date,
        image_path,
        onFinish,
    } = props;
    const [open, setOpen] = useState(false);
    const [imageRemoved, setImageRemoved] = useState(false);

    const formatDateForInput = (dateString?: string) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
        } catch (e) {
            console.error("Error formatting date:", e);
            return "";
        }
    };

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const defaultImage = "/images/no-image.png"; // Default placeholder image

    // Set minimum date to start_date for existing events, or today for new events
    const minDate =
        id && start_date && new Date(start_date) < new Date()
            ? formatDateForInput(start_date)
            : todayString;

    const methods = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            event_name: event_name || "",
            description: description || "",
            status: status || false,
            start_date: formatDateForInput(start_date) || todayString,
            end_date: formatDateForInput(end_date) || todayString,
            image: null,
        },
        mode: "onChange",
    });

    const { control, handleSubmit, reset, setValue, register } = methods;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        if (id && !previewImage && image_path && !imageRemoved) {
            setPreviewImage(`${image_path}`);
        }
    }, [id, image_path, previewImage, imageRemoved]);

    const removeImage = () => {
        setImageRemoved(true);
        setValue("image", null);
        setPreviewImage(null);
        const fileInput = document.getElementById("image-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            const formData = new FormData();

            // Append all form values except the image
            Object.entries(values).forEach(([key, value]) => {
                if (key !== "image" && value !== null && value !== undefined) {
                    formData.append(key, value as string | Blob);
                }
            });

            // Handle file upload
            if (values.image instanceof File) {
                formData.append("image", values.image);
            }

            const url = id ? `/event/update/${id}` : "/event/create";

            router.post(url, formData, {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                    toast({
                        title: `Success`,
                        description: `Event ${id ? "updated" : "created"} successfully.`,
                        variant: "default",
                    });
                    onFinish?.();
                },
                onError: (errors) => {
                    console.error("Form submission error:", errors);
                    toast({
                        title: "Error",
                        description: errors?.message ||
                            "An error occurred while saving the event.",
                        variant: "destructive",
                    });
                },
                preserveScroll: true,
            });
        } catch (error) {
            console.error("Unexpected error:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <ErrorBoundary>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant={id ? "outline" : "default"}>
                        {id ? "Edit" : "Create Event"}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] w-full">
                    <FormProvider {...methods}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6 w-full max-h-[80vh] overflow-y-auto"
                        >
                            <DialogHeader>
                                <DialogTitle className="text-2xl">
                                    {id ? "Edit" : "Create"} Event
                                </DialogTitle>
                                <div className="mt-4">
                                    <FormField
                                        control={control}
                                        name="image"
                                        render={({
                                            field: { onChange, ...field },
                                        }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Event Image
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex flex-col gap-4 items-center">
                                                        {previewImage ? (
                                                            <div className="relative group">
                                                                <img
                                                                    src={
                                                                        previewImage.startsWith(
                                                                            "data:"
                                                                        )
                                                                            ? previewImage
                                                                            : `/storage/${previewImage}`
                                                                    }
                                                                    alt="Event preview"
                                                                    className="object-cover w-full h-48 rounded-md border border-gray-200"
                                                                    onError={(
                                                                        e
                                                                    ) => {
                                                                        // If image fails to load, show default placeholder
                                                                        const target =
                                                                            e.target as HTMLImageElement;
                                                                        target.src =
                                                                            defaultImage;
                                                                        target.className =
                                                                            "object-contain p-8 w-full h-48 rounded-md border border-gray-200";
                                                                    }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        removeImage
                                                                    }
                                                                    className="absolute -top-2 -right-2 p-1 text-white bg-red-500 rounded-full transition-colors hover:bg-red-600"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <label
                                                                htmlFor="image-upload"
                                                                className="flex flex-col justify-center items-center w-full h-32 rounded-lg border-2 border-gray-300 border-dashed transition-colors cursor-pointer hover:bg-gray-50"
                                                            >
                                                                <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                                                    <Upload className="mb-2 w-8 h-8 text-gray-400" />
                                                                    <p className="text-sm text-gray-500">
                                                                        <span className="font-semibold">
                                                                            Click
                                                                            to
                                                                            upload
                                                                        </span>{" "}
                                                                        or drag
                                                                        and drop
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        PNG,
                                                                        JPG, GIF
                                                                        up to
                                                                        2MB
                                                                    </p>
                                                                </div>
                                                                <input
                                                                    id="image-upload"
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    {...register(
                                                                        "image"
                                                                    )}
                                                                    onChange={
                                                                        handleImageChange
                                                                    }
                                                                />
                                                            </label>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </DialogHeader>

                            {id && (
                                <FormField
                                    control={control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row justify-between items-center p-3 rounded-lg border shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>
                                                    Activate Status
                                                </FormLabel>
                                                <FormDescription>
                                                    If your event status is not
                                                    active, it will not appear
                                                    on the runner's dashboard.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={
                                                        field.value ?? false
                                                    }
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={control}
                                name="event_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Morning Run"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={control}
                                    name="start_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Start Date</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Calendar className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                        min={minDate}
                                                        max={
                                                            oneYearFromNowString
                                                        }
                                                        className="pl-8 custom-date"
                                                        onKeyDown={(e) =>
                                                            e.preventDefault()
                                                        } // Prevent manual entry
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="end_date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End Date</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Calendar className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                        min={minDate}
                                                        max={
                                                            oneYearFromNowString
                                                        }
                                                        className="pl-8 custom-date"
                                                        onKeyDown={(e) =>
                                                            e.preventDefault()
                                                        } // Prevent manual entry
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Description"
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value
                                                    )
                                                }
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </FormProvider>
                </DialogContent>
            </Dialog>
        </ErrorBoundary>
    );
}
