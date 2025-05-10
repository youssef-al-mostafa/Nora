<?php

namespace Database\Seeders;

use App\Enums\PermissionsEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = PermissionsEnum::values();

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission);
            $this->command->info("Permission \"$permission\" created");
        }
    }
}
