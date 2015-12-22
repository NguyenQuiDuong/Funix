<?php

namespace Admin\Controller;

use Admin\Form\Report\ReportFilter;
use Admin\Model\Messages;
use Admin\Model\MessagesMG;
use Home\Controller\ControllerBase;
use Home\Model\DateBase;
use User\Model\User;

class ReportController extends ControllerBase
{
    public function indexAction()
    {
        $form = new ReportFilter();
        $form->setData($this->params()->fromQuery());

        $this->getViewModel()->setVariable('form', $form);
        if($form->isValid()){
        /** @var \Admin\Model\ReportMapper $reportMapper */
        $reportMapper = $this->getServiceLocator()->get('Admin\Model\ReportMapper');
        $option = $form->getData();
        $option['sort'] = $this->getSorting(null,null,['count','rating','time']);
        $result = $reportMapper->reportemployee($option);
//        $dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');
//        $mes = new Messages();
//        $mes->setSender('Demo');
//        $mes->setReceiver('DemoRe');
//        $mes->setCreated('2015-12-16 00:01:50.901Z');
//        $mes->setImgPath('de');
////        vdump($mes);die;
//        $dm->persist($mes);
////        vdump($dm);die;
//        $dm->flush();
//        die('thanh coong');

//        $qb = $dm->createQueryBuilder('Admin\Document\Messages')
//            ->select('sender');
//        $query = $qb->getQuery();
//        $mes = $query->execute();
//        $i=0;
//        foreach($mes as $m){
//            $i++;
//            vdump($i.'. '.$m->getSender());
//        }die;
//        vdump($mes);die;
            $this->getViewModel()->setVariable('data',$result);
            }
        return $this->getViewModel();
    }

    public function detailAction(){
        $id = $this->params()->fromQuery('id');
        $user = new User();
        $user->setId($id);
        /** @var \User\Model\UserMapper $userMapper */
        $userMapper = $this->getServiceLocator()->get('User\Model\UserMapper');
        if(!$user->getId() || !$userMapper->get($user->getId())){
            return $this->page404();
        }
        if(!$this->params()->fromQuery('created') || !DateBase::validateDate($this->params()->fromQuery('created'),DateBase::DISPLAY_DATE_FORMAT)){
            return $this->page404();
        }
        $user = $userMapper->get($id);
            /** @var \Admin\Model\MessagesMG $mess */
            $mess = new MessagesMG();
            $mess->setSender($user->getUsername());
            $mess->setCreated($this->params()->fromQuery('created'));

            /** @var \Admin\Model\ReportMapper $reportMapper */
            $reportMapper = $this->getServiceLocator()->get('Admin\Model\ReportMapper');

            $data = $reportMapper->reportdetail($mess);
        $this->getViewModel()->setVariable('data',$data);
        $this->getViewModel()->setVariable('user',$user);
        return $this->getViewModel();
    }


}
