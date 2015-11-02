<?php
/**
 * Created by PhpStorm.
 * User: Ace
 * Date: 30-Oct-15
 * Time: 2:06 AM
 */
namespace Admin\Controller;

use Home\Controller\ControllerBase;

class ThemeController extends ControllerBase
{
    public function indexAction()
    {
        $fileIndex = TEMPLATES_PATH.'\html\index.html';
        $f = fopen($fileIndex,'rt');
        $contentIndex = fread($f,filesize($fileIndex));
        $this->getViewModel()->setVariables(['content' => $contentIndex]);
        if($this->getRequest()->isPost()){
            $content = $this->getRequest()->getPost('content');
            $i = file_put_contents($fileIndex,$content);
            $this->getViewModel()->setVariables(['content' => $content]);
        }

        return $this->getViewModel();
    }

    public function expertAction()
    {
        $fileIndex = TEMPLATES_PATH.'\html\expert.html';
        $f = fopen($fileIndex,'rt');
        $contentIndex = fread($f,filesize($fileIndex));
        $this->getViewModel()->setVariables(['content' => $contentIndex]);
        if($this->getRequest()->isPost()){
            $content = $this->getRequest()->getPost('content');
            $i = file_put_contents($fileIndex,$content);
            $this->getViewModel()->setVariables(['content' => $content]);
        }

        return $this->getViewModel();
    }
}
