<?php

namespace App\Enums;

enum contentStatusEnum:string
{
    case DRAFT = 'draft';
    case DELETED = 'deleted';
    case PUBLISHED = 'published';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
