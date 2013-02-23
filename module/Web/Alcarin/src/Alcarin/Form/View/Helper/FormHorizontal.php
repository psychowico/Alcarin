<?php
/**
 * rending form in boostrap horizontal form style.
 */

namespace Alcarin\Form\View\Helper;

use Zend\Form\ElementInterface;
use Zend\Form\View\Helper\FormElement;

class FormHorizontal extends FormElement
{
    /**
     * Render an element
     *
     * Introspects the element type and attributes to determine which
     * helper to utilize when rendering.
     *
     * @param  ElementInterface $element
     * @return string
     */
    public function render(ElementInterface $element)
    {
        $renderer = $this->getView();
        if (!method_exists($renderer, 'plugin')) {
            // Bail early if renderer is not pluggable
            return '';
        }

        if (!$element instanceof \Zend\Form\FieldsetInterface) {
            throw new \DomainException('formHorizontal helper can only render full forms.');
        }

        foreach( $element->getElements() as $current_element ) {
            $el_content = parent::render($current_element);
            \Zend\Debug\Debug::dump($el_content);
exit;
        }

    }

    /**
     * Invoke helper as function
     *
     * Proxies to {@link render()}.
     *
     * @param  ElementInterface|null $element
     * @return string|FormElement
     */
    public function __invoke(ElementInterface $element = null)
    {
        if (!$element) {
            return $this;
        }

        return $this->render($element);
    }
}
