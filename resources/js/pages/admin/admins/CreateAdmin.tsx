/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "react-hot-toast";
import axios from "axios";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from "lucide-react"


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admins',
        href: '/admin/create',
    },
];

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters")
    .refine(
        (password) => /[A-Z]/.test(password),
        "Password must contain at least one uppercase letter"
    )
    .refine(
        (password) => /[a-z]/.test(password),
        "Password must contain at least one lowercase letter"
    )
    .refine(
        (password) => /\d/.test(password),
        "Password must contain at least one number"
    );

const formSchema =
    z.object({
        name: z.string().min(2).max(50),
        email: z.string().email(),
        password: passwordSchema,
        passwordConfirmation: passwordSchema
    }).refine(data => data.password === data.passwordConfirmation, {
        message: "Passwords do not match",
        path: ["passwordConfirmation"]

    });

export default function CreateAdmin() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const url = route('admin.add')
            setIsSubmitting(true);
            const { passwordConfirmation, ...formData } = values;
            const response = await axios.post(url, formData, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            toast.success("Admin created successfully");
            form.reset();

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const serverErrors = error.response.data.errors;

                if (serverErrors) {
                    Object.entries(serverErrors).forEach(([key, messages]) => {
                        form.setError(key as never, {
                            type: 'server',
                            message: Array.isArray(messages) ? messages[0] : messages as string
                        });
                    });
                } else {
                    toast.error(error.response.data.message || "An error occurred");
                }
            } else {
                toast.error("Failed to create admin");
                console.error("Error creating admin:", error);
            }
        } finally {
            setIsSubmitting(false);
            window.location.href = route('admin.admins');
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admins" />
            <div className="p-4">
                <Link href={route('admin.admins')}
                      className="btn btn-primary h-fit py-1
                      w-fit rounded-lg">
                    <ArrowLeft />
                    Back to Admins
                </Link>
                <div className="flex items-center justify-center mt-7 mb-9">
                    <h1 className="text-3xl font-extrabold">Create Admin</h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-fit mx-auto">
                        <div className="flex flex-col gap-6">
                            <FormField
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-96">
                                        <FormLabel>Admin Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Admin Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-6">
                            <FormField
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="passwordConfirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password Confirmation</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button type="submit" className="mx-auto">Add Admin</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout>
    )
}
