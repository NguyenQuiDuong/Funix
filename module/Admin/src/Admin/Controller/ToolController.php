<?php
/**
 * Created by PhpStorm.
 * User: Ace
 * Date: 21-Dec-15
 * Time: 7:41 PM
 */

namespace Admin\Controller;


use Home\Controller\ControllerBase;

class ToolController extends ControllerBase
{
    public function gethistorieschatAction(){

        return $this->getJsonModel();
    }

}