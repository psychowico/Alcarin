<?php

namespace Alcarin\Twig\Extension;

use ZfcTwig\View\Renderer\TwigRenderer;

class AlcarinTwigExtensions extends \Twig_Extension
{
    public function getFilters()
    {
        $filters = [
            //return object class name
            'class' => 'class_filter',
            //shorter text to max length and adding '...'
            //default max is 20 chars.
            'short' => 'text_shorter_filter',
        ];
        foreach($filters as $key => $method) {
            $filters[$key] = new \Twig_SimpleFilter($key, array($this, $method));
        }


        return $filters;
    }

    public function getFunctions()
    {
        $method = new \Twig_SimpleFunction('throw', array($this, 'throw_function'));

        return ['throw' => $method];
    }

    /*
     * @return string The extension name
     */
    public function getName()
    {
        return 'alcarin-twig';
    }

    public function class_filter($obj) {
            return get_class($obj);
    }

    public function text_shorter_filter($text, $max = 20)
    {
        if(strlen($text) > $max) {
            $text = substr($text, 0, $max - 3) . '...';
        }

        return $text;
    }

    public function throw_function($exception)
    {
        throw $exception;
    }
}