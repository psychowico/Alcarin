<?php

namespace Alcarin\Twig\Extension;

use ZfcTwig\View\Renderer\TwigRenderer;

class AlcarinTwigExtensions extends \Twig_Extension
{
    public function getFilters()
    {
        $filter = new \Twig_SimpleFilter('class', array($this, 'class_filter'));

        return ['get_class' => $filter];
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
}