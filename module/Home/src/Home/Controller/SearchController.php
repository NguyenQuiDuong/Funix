<?php

namespace Home\Controller;


use Expert\Model\Expert\Subject;
use Home\Form\Search\Search;
use Home\Form\Search\SearchDetail;
use Home\Model\DateBase;
use Home\Service\Uri;
use User\Model\User;

class SearchController extends ControllerBase
{
	public function indexAction()
    {
        if(!$this->getRequest()->isPost()){
            return $this->page404();
        }
        $data = $this->getRequest()->getPost();
        $form = new Search($this->getServiceLocator());
        $form->setData($data);
        if($form->isValid()){
            $formSearchDetail = new SearchDetail($this->getServiceLocator());
            $dataSearch  = $data['search'];
            $dataSearchs = preg_split('/[\s,.-]+/', $dataSearch);
            /** @var \Subject\Model\SubjectMapper $subjectMapper */
            $subjectMapper = $this->getServiceLocator()->get('Subject/Model/SubjectMapper');
            $subjects = $subjectMapper->fetchSearch($dataSearchs);
            $subjectIds = [];
            foreach($subjects as $subject){
                $subjectIds[] = $subject->getId();
            }
            $expertsub = new Subject();
            $expertsub->addOption('subjectIds',$subjectIds);
            /** @var \Expert\Model\Expert\SubjectMapper $expertSubjectMapper */
            $expertSubjectMapper = $this->getServiceLocator()->get('Expert/Model/Expert/SubjectMapper');
            $mentors = $expertSubjectMapper->search($expertsub);
            $this->getViewModel()->setVariables(['expert' => $mentors]);
            $this->getViewModel()->setVariables(['searchContent' => $dataSearch]);
            $this->getViewModel()->setVariables(['subjects' => $subjects]);
            $this->getViewModel()->setVariables(['form'=>$formSearchDetail]);
            return $this->getViewModel();
        }
    }

    public function findmentorAction(){
        if(!$this->getRequest()->isPost()){
            return $this->page404();
        }
        $data = $this->getRequest()->getPost();
        $form = new SearchDetail($this->getServiceLocator());
        $form->setData($data);
        if($form->isValid()){
            $user = new User();
            $user->setEmail($data['email']);
            $activeKey = md5($user->getEmail().DateBase::getCurrentDateTime());
            $user->setActiveKey($activeKey);
            $user->setRole(User::ROLE_MEMBER);
            $user->setCreatedDateTime(DateBase::getCurrentDateTime());
            $user->setCreatedDate(DateBase::getCurrentDate());
            /** @var \User\Model\UserMapper $userMapper */
            $userMapper = $this->getServiceLocator()->get('User\Model\UserMapper');
            if(!$userMapper->isExistedEmail($user)){
                $userMapper->save($user);
                Uri::autoLink('/user/user/sendemail',['email'=>$data['email'],'activeKey'=>$user->getActiveKey()]);
                $this->getJsonModel()->setVariables(
                    [
                        'code' => 2,
                        'data'=>'Email kích hoạt tài khoản đã được gửi đến địa chỉ email của bạn. Kiểm tra hòm thư và làm theo hướng dẫn đễ kích hoạt tài khoản.'
                    ]
                );
                return $this->getJsonModel();
            }
            return $this->getViewModel();
        }else{
            $this->getJsonModel()->setVariables(
                [
                    'code' => 1,
                    'data'=>$form->getErrorMessagesList()
                ]
            );
        }
        return $this->getJsonModel();
    }

}