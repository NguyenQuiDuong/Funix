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
            $active = $this->params()->fromQuery('active', 0);
            if ($user->getEmail()) {
                $user->setActive($active);
                //  var_dump($user);die;
            }
            $userMapper->save($user);
            echo "Cập nhật thành công";
            die;
        }
    }

    public function lockAction() {
        $id = $this->params()->fromQuery('id', null);
        /** @var \User\Model\UserMapper $userMapper */
        $userMapper = $this->getServiceLocator()->get('User\Model\UserMapper');
        if(!$id || !$userMapper->get($id)){
            echo "Không tìm thấy user";
            die;
        }

            /** @var \User\Model\USer $user */
            $user = new User();
            $user->setId($id);
            $user = $userMapper->get($user->getId());
            $lock = $this->params()->fromQuery('lock', 2);
            if ($user->getEmail()) {
                $user->setLocked($lock);
            }
            $userMapper->updateUser($user);
            echo "Cập nhật thành công";
            die;
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
