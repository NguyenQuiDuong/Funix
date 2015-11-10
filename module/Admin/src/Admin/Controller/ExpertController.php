<?php

namespace Admin\Controller;

use Expert\Model\Expert;
use Home\Controller\ControllerBase;
use Home\Model\DateBase;
use Subject\Model\Subject;
use User\Model\User;

class ExpertController extends ControllerBase
{
    public function indexAction()
    {
        $form = new \Admin\Form\Subject\CategoryFilter($this->getServiceLocator());
        $form->setData($this->params()->fromQuery());

        $this->getViewModel()->setVariable('form', $form);

        if ($form->isValid()) {
            $expert = new User();
            $expert->exchangeArray($form->getData());
            $expert->setRole($expert::ROLE_MENTOR);

            $userMapper = $this->getServiceLocator()->get('User\Model\UserMapper');
            /** @var $expertMapper \Expert\Model\ExpertMapper */
            $paginator = $userMapper->search($expert,null);
            $this->getViewModel()->setVariable('paginator', $paginator);
        }
        return $this->getViewModel();

    }

    public function addAction(){
        $form = new \Admin\Form\Expert\Expert($this->getServiceLocator());
        if ($this->getRequest()->isPost()) {
            $form->setData($this->getRequest()->getPost());
            if ($form->isValid()) {
                $data = $form->getData();
                $user = new User();
                $user->exchangeArray($data);
                /** @var \User\Model\UserMapper $userMapper */
                $userMapper = $this->getServiceLocator()->get('User\Model\UserMapper');
                $user->setRole(User::ROLE_MENTOR);
                $userMapper->updateUser($user);

                /** @var \Subject\Model\SubjectMapper $subjectMapper */
                $subjectMapper = $this->getServiceLocator()->get('Subject\Model\SubjectMapper');

                $subjectIds = explode(',',$data['subjectId']);
                foreach($subjectIds as $subjectId){
                    $subject = new Subject();
                    $subject->setId($subjectId);
                    if($subjectMapper->get($subject))
                    {
                        $subjectNames[] = $subject->getName();
                        $expertSubject = new Expert\Subject();
                        $expertSubject->setExpertId($user->getId());
                        $expertSubject->setSubjectId($subjectId);
                        $expertSubject->setCreatedById($this->user()->getIdentity());
                        $expertSubject->setCreatedDateTime(DateBase::getCurrentDateTime());
                        /** @var \Expert\Model\Expert\SubjectMapper $expertSubjectMapper */
                        $expertSubjectMapper = $this->getServiceLocator()->get('Expert\Model\Expert\SubjectMapper');
                        $expertSubjectMapper->save($expertSubject);
                    }
                }

                if ($form->get('afterSubmit')->getValue()) {
                    return $this->redirect()->toUrl($form->get('afterSubmit')
                        ->getValue());
                }
            }
        }
        $this->getViewModel()->setVariable('form', $form);

        return $this->getViewModel();
    }

    public function editAction(){
        $id = $this->params()->fromQuery('id');
        $user = new User();
        $user->setId($id);
        $user->setRole(User::ROLE_MENTOR);
        /** @var \User\Model\UserMapper $userMapper */
        $userMapper = $this->getServiceLocator()->get('User\Model\UserMapper');
        if(!$user->getId() || !$userMapper->getUser($user)){
            return $this->page404();
        }
        $form = new \Admin\Form\Expert\Expert($this->getServiceLocator(),'edit');
        $form->remove('afterSubmit');
        $form->setData($user->toFormValues());
        $expertsubject = new Expert\Subject();
        $expertsubject->setExpertId($user->getId());
        /** @var \Expert\Model\Expert\SubjectMapper $subjectExpertmapper */
        $subjectExpertmapper = $this->getServiceLocator()->get('Expert\Model\Expert\SubjectMapper');
        $subjects = $subjectExpertmapper->fetchAllSubject($expertsubject);
        $subjectIdbs = [];
        if($subjects){
            $subjectIdbs = array_keys($subjects[$user->getId()]);
        }
        $form->get('subjectId')->setValue(implode(',',$subjectIdbs));
        $form->get('userId')->setValue($user->getId());
        $userName = $user->getFullName()?$user->getUsername().' - '.$user->getFullName():$user->getUsername();
        $form->get('userName')->setValue($userName);
        if($this->getRequest()->isPost()) {
            $form->setData($this->getRequest()->getPost());
            if ($form->isValid()) {
                $data = $form->getData();
                $user->setDescription($data['description']);
                if (!$data['subjectId']) {
                    $es = new Expert\Subject();
                    $es->setExpertId($user->getId());
                    $subjectExpertmapper->delete($es);
                }
                if ($data['subjectId']) {
                    $subjectIdas = explode(',', $data['subjectId']);
                    $subjectIdns = array_diff($subjectIdas, $subjectIdbs);
                    foreach ($subjectIdns as $subjId) {
                        $es = new Expert\Subject();
                        $es->setExpertId($user->getId());
                        $es->setSubjectId($subjId);
                        $es->setCreatedById($this->user()->getIdentity());
                        $es->setCreatedDateTime(DateBase::getCurrentDateTime());
                        $subjectExpertmapper->save($es);
                    }
                    $subjectIdds = array_diff($subjectIdbs, $subjectIdas);
                    foreach ($subjectIdds as $subjId) {
                        $es = new Expert\Subject();
                        $es->setExpertId($user->getId());
                        $es->setSubjectId($subjId);
                        $subjectExpertmapper->delete($es);
                    }
                }
                $userMapper->updateUser($user);
                return $this->redirect()->toUrl('/admin/expert');
            }
        }
        $this->getViewModel()->setVariables(['form' =>  $form]);
        return $this->getViewModel();
    }


}
