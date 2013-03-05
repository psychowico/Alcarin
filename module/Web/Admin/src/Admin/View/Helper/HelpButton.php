<?php

namespace Admin\View\Helper;

use Zend\View\Helper\AbstractHelper;

class HelpButton extends AbstractHelper
{
    public function __invoke($content, $placement = 'left',
                             $title = 'Help', $label_type = 'success')
    {
        return sprintf(<<<HTML
            <div class="admin-help">
                <button href="#" class="label label-%s popover-invoke"
                    data-placement="%s" title="%s" data-content="%s">
                    <i class="icon-question-sign"></i>
                </button>
            </div>
HTML
            , $label_type, $placement, $title, $content
        );
    }
}