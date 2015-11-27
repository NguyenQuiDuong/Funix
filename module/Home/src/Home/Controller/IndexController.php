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
        $user = new User();
        $user->setId(5);
        /** @var $userMapper \User\Model\UserMapper */
        $userMapper = $this->getServiceLocator()->get('User\Model\UserMapper');
        $user = $userMapper->get($user->getId());
        $user->setActive(null);
        $userMapper->save($user);
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
}