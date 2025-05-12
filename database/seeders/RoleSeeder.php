<?php

namespace Database\Seeders;

use App\Enums\PermissionsEnum;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'master-admin' => [
                PermissionsEnum::CAN_ENTER->value,
                PermissionsEnum::Data_Entry->value,
                PermissionsEnum::Manage_Editors->value,
                PermissionsEnum::Manage_Admins->value,
                PermissionsEnum::Give_Permissions->value,
            ],
            'admin' => [
                PermissionsEnum::CAN_ENTER->value,
                PermissionsEnum::Data_Entry->value,
                PermissionsEnum::Manage_Editors->value,
                PermissionsEnum::Give_Permissions->value,
            ],
            'editor' => [
                PermissionsEnum::CAN_ENTER->value,
                PermissionsEnum::Data_Entry->value,
            ],
        ];

        foreach ($roles as $roleName => $permissionNames) {
            $role = Role::findOrCreate($roleName);

            $permissions = Permission::whereIn('name', $permissionNames)->get();

            $role->syncPermissions($permissions);

            $this->command->info("Role \"$roleName\" created with " .
                count($permissions) . " permissions: " .
                implode(', ', $permissionNames));
        }
    }
}
