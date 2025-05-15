<?php

namespace App\Enums;

enum RolesEnum: string
{
    case ADMIN = 'admin';
    case MASTER_ADMIN = 'master-admin';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
