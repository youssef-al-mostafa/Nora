import { Lock } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/common/dialog';
import { Button } from '@/components/common/button';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import InputError from '@/components/admin/core/input-error';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import axios from 'axios';

interface ChangeUserPasswordProps {
    adminId: number;
}

export const ChangeAdminPassword = ({ adminId }: ChangeUserPasswordProps) => {
    const passwordInput = useRef<HTMLInputElement>(null);
    const confirmPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, processing, reset, errors, clearErrors } = useForm<Required<{
        password: string,
        password_confirmation: string
    }>>({
        password: '',
        password_confirmation: ''
    });

    const changePassword: FormEventHandler = (e) => {
        e.preventDefault();

        axios.put(route('admin.changePassword'), {
            id: adminId,
            password: data.password,
            password_confirmation: data.password_confirmation
        }, {
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(() => {
            closeModal();
        })
        .catch((error) => {
            if (axios.isAxiosError(error) && error.response) {
                const serverErrors = error.response.data.errors;
                if (serverErrors?.password) {
                    errors.password = serverErrors.password[0];
                    passwordInput.current?.focus();
                }
                if (serverErrors?.password_confirmation) {
                    errors.password_confirmation = serverErrors.password_confirmation[0];
                }
            } else {
                console.error('Error changing admin password:', error);
            }
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <button type="button"
                        className='btn my-auto px-1 bg-transparent
                           border-0 text-black shadow-none
                           change-password hover:text-green-600'>
                        <Lock />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>
                        Please Enter the New Password
                    </DialogTitle>
                    <form className="space-y-6" onSubmit={changePassword}>
                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                New Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="New password" />
                            <p className="text-xs text-muted-foreground">
                                Password must be at least 8 characters long
                            </p>
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirm Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                ref={confirmPasswordInput}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm password" />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary" className='text-white' onClick={closeModal}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button variant="default" disabled={processing} type="submit">
                                Change Password
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};
