<?php

namespace Home\Form\Search;

use Home\Form\FormBase;
use User\Model\User;
use Zend\Form\Element\Hidden;
use Zend\Form\Element\Password;
use Zend\Form\Element\Radio;
use Zend\Form\Element\Text;
use Zend\Form\Element\Textarea;
use ZendX\Form\Element\DisplayGroup;

class SearchDetail extends FormBase
{

    public function __construct($serviceLocator, $options = null)
    {
        parent::__construct('AccountIndex');
        $this->setServiceLocator($serviceLocator);
        $this->setAttribute('method', 'post');

        $filter = $this->getInputFilter();

        $group = new DisplayGroup('Search');
        $group->setLabel('Tìm kiếm trợ giúp ??');
        $this->add($group);


        // search
        $search = new Text('search');
        $search->setLabel('Tôi cần giúp về: ');
        $search->setAttributes([
            'maxlength' => 255,
            'class' =>  'input-title',
            'placeholder'   =>  'e.g. Need help debugging SASS/CSS for frontend in Rails app'
        ]);
        $this->add($search);
        $group->addElement($search);
        $filter->add(array(
            'name' => 'search',
            'required' => false,
            'filters' => array(
                array(
                    'name' => 'StringTrim'
                )
            ),
        ));

        $searchDetail = new Textarea('searchDetail');
        $searchDetail->setAttributes([
            'placeholder'   =>  'Thêm chi tiết giúp bạn nhận hỗ trợ nhanh hơn',
            'class' =>  'input-description',
        ]);
        $this->add($searchDetail);
        $group->addElement($searchDetail);
        $filter->add(array(
            'name' => 'searchDetail',
            'required' => false,
            'filters' => array(
                array(
                    'name' => 'StringTrim'
                )
            ),
        ));

        $subject  = new Text('subject');
        $subject->setAttributes([
            'placeholder'   =>  'Thêm môn học'
        ]);
        $this->add($subject);
        $filter->add(array(
            'name'  =>  'subject',
            'required'  =>  false,
            'filters'   =>  array(
                array(
                    'name'  =>  'StringTrim'
                )
            ),
        ));
        $subjectId = new Hidden('subjectId');
        $this->add($subjectId);
        $filter->add(array(
            'name'  =>  'subjectId',
            'required'  =>  true,
            'filters'   =>  array(
                array(
                    'name'  =>  'StringTrim'
                )
            ),
            'validators'    =>  array(
                array(
                    'name' => 'NotEmpty',
                    'break_chain_on_failure' => true,
                    'options' => array(
                        'messages' => array(
                            'isEmpty' => 'Bạn cần điền ít nhất là 1 môn học'
                        )
                    )
                ),
            )
        ));
        $budget = new Radio('budget');
        $budget->setValueOptions([
            '5'     =>  '20',
            '10'    =>  '40'
        ]);
        $this->add($budget);
        $filter->add(array(
            'name'  =>  'budget',
            'required'  =>  false,
            'filters'   =>  array(
                array(
                    'name'  =>  'StringTrim'
                )
            ),
        ));
        $email = new Text('email');
        $email->setLabel('Email');
        $this->add($email);
        $filter->add(array(
            'name'  =>  'email',
            'required'  =>  true,
            'filters'   =>  array(
                array(
                    'name'  =>  'StringTrim'
                )
            ),
            'validators'    =>  array(
                array(
                    'name' => 'NotEmpty',
                    'break_chain_on_failure' => true,
                    'options' => array(
                        'messages' => array(
                            'isEmpty' => 'Bạn chưa nhập email'
                        )
                    )
                ),
                array(
                    'name'    => 'EmailAddress',
                    'break_chain_on_failure' => true,
                    'options' => array(
                        'messages' => array(
                            'emailAddressInvalidFormat' => 'Địa chỉ email không hợp lệ'
                        )
                    )
                ),
            )
        ));

        $password = new Password('password');
        $password->setAttributes(array(
            'type'  => 'password',
            'id' => 'password'
        ));
        $password->setLabel('Mật khẩu:');
        $this->add($password);
        //$groupBasic->addElement($password);
        $filter->add(array(
            'name' => 'password',
            'required' => false,
            'validators' => array(
                array(
                    'name'    => 'NotEmpty',
                    'options' => array(
                        'messages' => array(
                            'isEmpty' => 'Bạn chưa nhập mật khẩu'
                        )
                    )
                ),
            ),
        ));

        $this->add(array(
            'name' => 'submit',
            'options' => array(
                'clearBefore' => true
            ),
            'attributes' => array(
                'type' => 'submit',
                'value' => 'Lưu',
                'id' => 'btnSave',
                'class' => 'btn btn-primary'
            )
        ));
    }
    public function isValid(){
        $isValid = parent::isValid();
        if($isValid){
            /** @var \User\Service\User $userService */
            $userService = $this->getServiceLocator()->get('User\Service\User');
            $data = parent::getData();
            $user = new User();
            $user->setEmail($data['email']);
            /** @var \User\Model\UserMapper $userMapper */
            $userMapper = $this->getServiceLocator()->get('User\Model\UserMapper');
            if($userMapper->isActive($user) && !$data['password']){
                $this->get('email')->setMessages(['Bạn đã đăng ký, vui lòng chọn đăng nhập để tiếp tục']);
                return false;
            }
            if(!$userService->isAvailableEmail($data['email'])){
                return true;
            }
            if($data['password'] != '' && !$userService->authenticate($data['email'], $data['password'])){
                $this->get('email')->setMessages([\User\Form\Signin::ERROR_INVALID]);
                return false;
            }

        }
        return $isValid;
    }
}

?>