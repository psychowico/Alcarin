<?php

namespace Core\Permission;

class Resource
{
    //main chars panel
    const PLAYER_PANEL = 1;
    const PLAYER_TEST = 2;

    public static function defaultForLoggedUser()
    {
        return static::PLAYER_PANEL;
    }
}