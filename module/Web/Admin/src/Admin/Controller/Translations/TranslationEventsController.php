<?php

namespace Admin\Controller\Translations;

use Core\Controller\AbstractEventController;
use Admin\GameObject\DynamicTranslations;

class TranslationEventsController extends AbstractEventController
{
    protected function onGroupChange($data)
    {
        if(empty($data['group']) ||
           !in_array($data['group'], DynamicTranslations::$groups) ||
           empty($data['lang']) ||
           !in_array($data['lang'], DynamicTranslations::$languages)
           ) {
            $result = $this->fail();
        }
        else {
            $group = $data['group'];
            $lang = $data['lang'];

            $keys = $this->system()->getAllTagsIdInGroup($group, $lang);
            $result = $this->success(['sentences' => $keys]);
        }
        return $this->emit('sentences.reload', $result);
    }

    protected function onSentenceChange($data)
    {
        if(empty($data['sentence']) || empty($data['lang']) || empty($data['group'])) {
            $result = $this->fail();
        }
        else {
            $tagid = $data['sentence'];
            $group = $data['group'];
            $lang = $data['lang'];

            $def = $this->system()->getTagDefinition($group, $tagid, $lang);

            $result = $this->success(['sentence' => $def]);
        }
        return $this->emit('sentence.changed', $result);
    }


    public function system()
    {
        return $this->gameServices()->get('translations');
    }
}