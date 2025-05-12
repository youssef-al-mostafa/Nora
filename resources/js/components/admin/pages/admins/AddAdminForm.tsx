import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "react-hot-toast";
import axios from "axios";


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

export const AdminsForm = () => {
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
            setIsSubmitting(true);

            // Extract the data we need to send to the API


            const { passwordConfirmation, ...formData } = values;

            // Make API request
            const response = await axios.post('/api/admins', formData, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            // Show success notification
            toast.success("Admin created successfully");

            // Reset form
            form.reset();

        } catch (error) {
            // Handle errors from the API
            if (axios.isAxiosError(error) && error.response) {
                // Laravel validation errors
                const serverErrors = error.response.data.errors;

                if (serverErrors) {
                    // Map server errors to form fields
                    Object.entries(serverErrors).forEach(([key, messages]) => {
                        form.setError(key as any, {
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
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-fit mx-auto">
                <div className="flex gap-6">
                    <FormField
                        name="name"
                        render={({ field }) => (
                            <FormItem>
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
                <div className="flex gap-6">
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
    )
}
