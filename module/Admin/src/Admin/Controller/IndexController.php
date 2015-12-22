<?php

namespace Admin\Controller;

use Admin\Model\Messages;
use Home\Controller\ControllerBase;

class IndexController extends ControllerBase
{
    public function indexAction()
    {
//        $dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');
//        $receiver = $this->params()->fromQuery('r');
//        $sender = $this->params()->fromQuery('s');
//        $mess = new Messages();
//        if($receiver){
//            $mess->setReceiver($receiver);
//        }
//        if($sender){
//            $mess->setSender($sender);
//        }
////        $mes->setSender('Demo');
////        $mes->setReceiver('DemoRe');
////        $mes->setCreated('2015-12-16 00:01:50.901Z');
////        $mes->setImgPath('de');
//////        vdump($mes);die;
////        $dm->persist($mes);
//////        vdump($dm);die;
////        $dm->flush();
////        die('thanh coong');
//
//        $qb = $dm->createQueryBuilder('Admin\Model\Messages');
//        if($mess->getSender()){
//            $qb->field('sender')->equals($mess->getSender());
//        }
//        if($mess->getReceiver()){
//            $qb->field('receiver')->equals($mess->getReceiver());
//        }
//        $query = $qb->getQuery();
//        $mes = $query->execute();
//        $i=0;
//
//        foreach($mes as $m){
//            $i++;
//            vdump($i.'. Sender: '.$m->getSender().'|| Receiver: '.$m->getReceiver().' || Msg: '.$m->getMsg());
//        }die;
//        vdump($mes);die;
    }
    

}
