<?php
/**
 * Created by PhpStorm.
 * User: Ace
 * Date: 20-Dec-15
 * Time: 5:29 PM
 */

namespace Admin\Model;


use Home\Model\BaseMapper;

class MessagesMapper extends BaseMapper
{
    /**
     * @param $messages \Admin\Model\MessagesMG
     */
    public function fetchAll($messages){
        $dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');

        $qb = $dm->createQueryBuilder('Admin\Model\MessagesMG');
        if($messages->getSender()){
            $qb->field('sender')->equals($messages->getSender());
        }
        if($messages->getReceiver()){
            $qb->field('receiver')->equals($messages->getReceiver());
        }
        if($messages->getCreated()){
            $qb->field('receiver')->equals($messages->getReceiver());
        }

        $query = $qb->getQuery();
        $mesArray = $query->execute();
        return $mesArray;

    }
}