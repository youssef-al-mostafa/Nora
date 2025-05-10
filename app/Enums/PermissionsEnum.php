<?php

namespace App\Enums;

enum PermissionsEnum: string
{
    case CAN_ENTER = 'Can Enter';
    case Data_Entry = 'Data Entry';
    case Manage_Editors = 'Manage Editors';
    case Manage_Admins = 'Manage Admins';
    case Give_Permissions = 'Give Permissions';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
