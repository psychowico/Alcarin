<?php

namespace Admin\GameObject\Extension;

class OrbisMinimap extends \Core\GameObject
{
    const MINIMAP_PATH = 'data/cache/map/minimap.jpg';

    public function exists()
    {
        return false;
    }

    public function recreate()
    {
        $path = static::MINIMAP_PATH;
        if( !is_dir(dirname($path)) ) {
            mkdir(dirname($path), 0755, true);
        }

        if( file_exists($path) ) {
            unlink($path);
        }
        touch($path);

        $my_img = imagecreate( 200, 80 );
        $background = imagecolorallocate( $my_img, 0, 0, 255 );
        $text_colour = imagecolorallocate( $my_img, 255, 255, 0 );
        $line_colour = imagecolorallocate( $my_img, 128, 255, 0 );
        imagestring( $my_img, 4, 30, 25, "thesitewizard.com",
          $text_colour );
        imagesetthickness ( $my_img, 5 );
        imageline( $my_img, 30, 45, 165, 45, $line_colour );

        header( "Content-type: image/png" );
        imagepng( $my_img );
        imagecolordeallocate( $line_color );
        imagecolordeallocate( $text_color );
        imagecolordeallocate( $background );
        imagedestroy( $my_img );
        exit;
    }

    public function fileGetContents()
    {
        return file_get_contents(static::MINIMAP_PATH);
    }
}