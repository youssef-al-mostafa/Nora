import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import InputError from '@/components/admin/core/input-error';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/common/dialog';
import { Trash2 } from 'lucide-react';
import axios from 'axios';


interface DeleteUserTableProps {
    adminId: number;
}

export default function DeleteUserTable({ adminId }: DeleteUserTableProps) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy,
            processing, reset, errors, clearErrors } = useForm<Required<{ password: string }>>({ password: '' });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();
        axios.delete(route('admin.delete'), {
            data: {
                id: adminId,
                password: data.password
            },
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(() => {
            closeModal();
            window.location.reload();
        })
        .catch((error) => {
            if (axios.isAxiosError(error) && error.response) {
                const serverErrors = error.response.data.errors;
                if (serverErrors?.password) {
                    errors.password = serverErrors.password[0];
                    passwordInput.current?.focus();
                }
            } else {
                console.error('Error deleting admin:', error);
            }
        })
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <div className="space-y-6">
            <Dialog>
                <DialogTrigger asChild>
                    <button type="button"
                            className='btn my-auto bg-transparent border-0 text-black
                                       shadow-none delete hover:text-red-600
                                       hover:bg-transparent p-0! w-[36px]'>
                        <Trash2 />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>
                        Are you sure you want to delete this account?
                    </DialogTitle>
                    <DialogDescription>
                        Once this account is deleted, all of its resources and data will also be permanently deleted.
                         Please enter the account password
                        to confirm you would like to permanently delete this account.
                    </DialogDescription>
                    <form className="space-y-6" onSubmit={deleteUser}>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="sr-only">
                                Password
                            </Label>

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                                autoComplete="current-password" />
                            <InputError message={errors.password} />
                        </div>

                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary" onClick={closeModal}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button variant="destructive" disabled={processing} asChild>
                                <button type="submit">Delete account</button>
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
