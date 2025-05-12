<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MasterAdminSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Creating Master Admin account');

        $name = $this->command->ask('Enter name', 'Master Admin');
        $email = $this->command->ask('Enter email', 'master@example.com');

        do {
            $password = $this->command->secret('Enter password (min 8 characters)');
            if (strlen($password) < 8) {
                $this->command->error('Password must be at least 8 characters long');
            }
        } while (strlen($password) < 8);

        $passwordConfirm = $this->command->secret('Confirm password');
        if ($password !== $passwordConfirm) {
            $this->command->error('Passwords do not match');
            return;
        }

        $admin = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'email_verified_at' => now(),
                'password' => Hash::make($password),
            ]
        );

        $admin->assignRole('master-admin');

        $this->command->info('Master Admin created successfully:');
        $this->command->info("Name: $name");
        $this->command->info("Email: $email");
    }
}
