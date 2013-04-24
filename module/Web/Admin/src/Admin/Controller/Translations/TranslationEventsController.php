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
            $group = strtolower($data['group']);
            $lang = strtolower($data['lang']);

            $keys = $this->system()->getSentencesKeysForGroup($group, $lang);
            //getting sentences plain names
            $regex = sprintf('/%s\.(.*?)(\..*?)?\.%s/', $group, $lang);

            $rKeys = [];
            $matches = null;
            foreach ($keys as $key) {
                preg_match($regex, $key, $matches);
                $rKeys[$matches[1]] = null;
            }
            $rKeys = array_keys($rKeys);

            $result = $this->success(['sentences' => $rKeys]);
        }
        return $this->emit('sentences.reload', $result);
    }

    protected function onSentenceChange($data)
    {
        if(empty($data['sentence']) || empty($data['lang']) || empty($data['group'])) {
            $result = $this->fail();
        }
        else {
            $sentence = strtolower($data['sentence']);
            $group = strtolower($data['group']);
            $lang = strtolower($data['lang']);

            $tr = $this->system()->translation($group, $sentence, $lang);

            $result = $this->success(['sentence' => $tr->value()]);
        }
        return $this->emit('sentence.changed', $result);
    }


    public function system()
    {
        return $this->gameServices()->get('translations');
    }
}