<?php
/**
 * Home\Controller
 *
 */

namespace Home\Controller;


use Home\Form\Search\Search;
use User\Model\User;

class IndexController extends ControllerBase
{
    public function indexAction()
    {
        $form = new Search($this->getServiceLocator());
        /** @var $subjectMapper \Subject\Model\SubjectMapper */
        $subjectMapper = $this->getServiceLocator()->get('Subject/Model/SubjectMapper');
        $subjects = $subjectMapper->featchAll('category');
        $this->layout()->setVariables(['subjectCategories' => $subjects]);
        $this->getViewModel()->setVariables(['form'   =>  $form]);
//        $user = new User();
//        $user->setId(5);
//        /** @var $userMapper \User\Model\UserMapper */
//        $userMapper = $this->getServiceLocator()->get('User\Model\UserMapper');
//        $user = $userMapper->get($user->getId());
//        $user->setActive(null);
//        $userMapper->save($user);
    	return $this->getViewModel();
    }

    public function addAction()
    {

    }

    public function editAction()
    {

    }

    public function deleteAction()
    {

    }

    public function introAction()
    {

    }

    public function searchAction()
    {
        return $this->getViewModel();
    }
    public function callcenterAction(){
        $this->getViewModel()->setTerminal(true);
        return $this->getViewModel();
    }
    public function historyAction(){
        $id = $this->params()->fromQuery('id');
        $created = $this->params()->fromQuery('created');
        if(!$id || $created){
            return $this->page404();
        }
        /** @var \Admin\Model\ReportMapper $reportMapper */
        $reportMapper = $this->getServiceLocator()->get('Admin\Model\ReportMapper');

        /** @var \User\Model\UserMapper $userMapper */
        $userMapper = $this->getServiceLocator()->get('User\Model\UserMapper');
        $user = new User();
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



        $data = $reportMapper->reportdetail($mess);
        $this->getViewModel()->setVariable('data',$data);
        $this->getViewModel()->setVariable('user',$user);
        return $this->getViewModel();
    }
}