<?php

namespace Admin\Controller;

use Home\Controller\ControllerBase;
use Subject\Model\Subject;
use Home\Model\DateBase;
use User\Model\User;

class UserController extends ControllerBase {

    public function indexAction() {

        $form = new \Admin\Form\Subject\CategoryFilter($this->getServiceLocator());
        $form->setData($this->params()->fromQuery());

        $this->getViewModel()->setVariable('form', $form);

        if ($form->isValid()) {
            $user = new User();
            $user->exchangeArray($form->getData());

            $userMapper = $this->getServiceLocator()->get('User\Model\UserMapper');
            /** @var $userMapper \User\Model\UserMapper */
            $paginator = $userMapper->search($user);
            $this->getViewModel()->setVariable('paginator', $paginator);
        }
        return $this->getViewModel();
    }

    public function changeAction() {
        $id = $this->params()->fromQuery('id', null);
        if ($id) {
            $userMapper = $this->getServiceLocator()->get('User\Model\UserMapper');
            $user = new User();
            $user->setId($id);
            $user = $userMapper->get($user->getId());
            if($this->params()->fromQuery('active')){
                $active = $this->params()->fromQuery('active', 0);
                if ($user->getEmail()) {
                    $user->setActive($active);
                    //  var_dump($user);die;
                }
            }
            if($this->params()->fromQuery('lock')){
                $lock = $this->params()->fromQuery('lock',0);
                $user->setLocked($lock);
            }
            $userMapper->save($user);
            echo "Cập nhật thành công";
            die;
        }
    }

    public function changeroleAction() {
        
        $id = $this->params()->fromPost('id', null);
        $role = $this->params()->fromPost('role', null);
        $facebook = $this->params()->fromPost('facebook', null);
      //  var_dump($facebook);die;
        if ($id && ($role == User::ROLE_MENTOR || $role == User::ROLE_GUEST)) {
           
            $userMapper = $this->getServiceLocator()->get('User\Model\UserMapper');
            $user = new User();
            $user->setId($id);
            $user = $userMapper->get($user->getId());
            if ($user->getEmail()) {
                $user->setRole($role);
                $user->setFacebook($facebook);
                $userMapper->save($user);
                $this->flashMessenger()->addMessage('Cập nhật thành công!');
                $this->redirect()->toUrl("/admin/user"); 
            }
            $this->flashMessenger()->addMessage('User không tồn tại!');
            $this->redirect()->toUrl("/admin/user"); 
        }
        $this->flashMessenger()->addMessage('Dữ liệu truyền vào không đúng!');
        $this->redirect()->toUrl("/admin/user"); 
        
    }

}
