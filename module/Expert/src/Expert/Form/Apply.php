<?php

namespace Expert\Form;

use Home\Form\FormBase;
use Zend\Form\Element\Radio;
use Zend\Form\Element\Text;
use Zend\Form\Element\Select;
use Zend\Form\Element\Textarea;
use ZendX\Form\Element\DisplayGroup;
use Zend\Form\Element\File;
use Zend\InputFilter\FileInput;
use Zend\Form\Element\Hidden;

class Apply extends FormBase
{

    public function __construct($serviceLocator, $options = null)
    {
        parent::__construct('AccountIndex');
        $this->setServiceLocator($serviceLocator);
        $this->setAttribute('method', 'post');

        $filter = $this->getInputFilter();

        $group = new DisplayGroup('Subject');
        $group->setLabel('Trở thành mentor  ');
        $this->add($group);


        // name
        $fullname = new Text('fullname');
        $fullname->setLabel('Họ và tên:');
        $fullname->setAttributes([
            'maxlength' => 255,
            'placeholder' => 'Tên'
        ]);
        $this->add($fullname);
        $group->addElement($fullname);
        $filter->add(array(
            'name' => 'fullname',
            'required' => true,
            'filters' => array(
                array(
                    'name' => 'StringTrim'
                )
            ),
            'validators' => array(
                array(
                    'name' => 'NotEmpty',
                    'break_chain_on_failure' => true,
                    'options' => array(
                        'messages' => array(
                            'isEmpty' => 'Bạn chưa nhập tên'
                        )
                    )
                )
            )
        ));

        $email = new Text('email');
        $email->setLabel('Email của Anh/Chị :');
        $email->setAttributes([
            'maxlength' => 255,
            'placeholder' => 'Email'
        ]);
        $this->add($email);
        $group->addElement($email);
        $filter->add(array(
            'name' => 'email',
            'required' => true,
            'filters' => array(
                array(
                    'name' => 'StringTrim'
                )
            ),
            'validators' => array(
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


        $skype = new Text('skype');
        $skype->setLabel('Skype:');
        $skype->setAttributes([
            'maxlength' => 255,
            'placeholder' => 'Skype'
        ]);
        $this->add($skype);
        $group->addElement($skype);
        $filter->add(array(
            'name' => 'skype',
            'required' => true,
            'filters' => array(
                array(
                    'name' => 'StringTrim'
                )
            ),
            'validators' => array(
                array(
                    'name' => 'NotEmpty',
                    'break_chain_on_failure' => true,
                    'options' => array(
                        'messages' => array(
                            'isEmpty' => 'Bạn chưa nhập skype'
                        )
                    )
                )
            )
        ));

        $mobile = new Text('mobile');
        $mobile->setLabel('Số điện thoại:');
        $mobile->setAttributes([
            'maxlength' => 12,
            'placeholder' => 'Số điện thoại'
        ]);
        $this->add($mobile);
        $group->addElement($mobile);
        $filter->add(array(
            'name' => 'mobile',
            'required' => true,
            'filters' => array(
                array(
                    'name' => 'StringTrim'
                )
            ),
            'validators' => array(
                array(
                    'name' => 'NotEmpty',
                    'break_chain_on_failure' => true,
                    'options' => array(
                        'messages' => array(
                            'isEmpty' => 'Bạn chưa nhập số điện thoại'
                        )
                    )
                )
            )
        ));

        $social = new Text('social');
        $social->setLabel('Link tới tài khoản mạng xã hội của bạn:');
        $social->setAttributes([
            'maxlength' => 255,
            'placeholder' => 'Mạng xã hội'
        ]);
        $this->add($social);
        $group->addElement($social);
        $filter->add(array(
            'name' => 'social',
            'required' => false,
            'filters' => array(
                array(
                    'name' => 'StringTrim'
                )
            ),
            'validators' => array(
                array(
                    'name' => 'NotEmpty',
                    'break_chain_on_failure' => true,
                    'options' => array(
                        'messages' => array(
                            'isEmpty' => 'Bạn chưa nhập skype'
                        )
                    )
                )
            )
        ));

        $isTeaching = new Radio('isTeaching');
        $isTeaching->setLabel('Bạn đã từng giảng dạy chưa?');
        $isTeaching->setValueOptions([
            '1' => 'Đã từng',
            '2' =>  'Chưa bao giờ',
        ]);
        $this->add($isTeaching);
        $group->addElement($isTeaching);
        $filter->add(array(
            'name' => 'isTeaching',
            'required' => false,
            'filters' => array(
                array(
                    'name' => 'StringTrim'
                )
            ),
            'validators' => array(
                array(
                    'name' => 'NotEmpty',
                    'break_chain_on_failure' => true,
                    'options' => array(
                        'messages' => array(
                            'isEmpty' => 'Bạn chưa chọn'
                        )
                    )
                )
            )
        ));


        $description = new Textarea('description');
        $description->setLabel('Mô tả công việc giảng dạy của bạn:');
        $description->setAttributes([
            'class' => ' inputBox',
            'style' => 'min-height: 300px;',
            'placeholder'   =>  'Mô tả'
        ]);
        $this->add($description);
        $group->addElement($description);
        $filter->add(array(
            'name' => 'description',
            'required' => false,
            'filters' => array(
                array(
                    'name' => 'StringTrim'
                )
            ),
            'validators' => array(
                array(
                    'name' => 'NotEmpty',
                    'break_chain_on_failure' => true,
                    'options' => array(
                        'messages' => array(
                            'isEmpty' => 'Bạn chưa nhập mô tả công việc giảng day của bạn'
                        )
                    )
                )
            )
        ));

        $cityId = new Select('cityId');
        $cityId->setLabel('Thành phố:');
        $this->loadCities($cityId);
        $filter->add(array(
            'name'  =>  'cityId',
            'required'  =>  false,
            'filters'   =>  array(),
        ));
        $this->add($cityId);


        $districtId = new Select('districtId');
        $districtId->setLabel('Quận/huyện: ');
        $this->loadDistricts($districtId,$cityId,$options);
        $this->add($districtId);
        $filter->add(array(
            'name'  =>  'districtId',
            'required'  =>  false,
            'filters'   =>  array(),
        ));

        $address = new Text('address');
        $address->setLabel('Địa chỉ: ');
        $filter->add(array(
            'name' => 'address',
            'required' => false,
            'filters' => array(
                array(
                    'name' => 'StringTrim'
                )
            ),
            'validators' => array(
                array(
                    'name' => 'NotEmpty',
                    'break_chain_on_failure' => true,
                    'options' => array(
                        'messages' => array(
                            'isEmpty' => 'Bạn chưa nhập địa chỉ của bạn'
                        )
                    )
                )
            )
        ));
        $this->add($address);

//        $birthday = new Text('birthday');
//        $birthday->setLabel('Tên danh mục:');
//        $birthday->setAttributes([
//            'maxlength' => 255,
//            'placeholder' => 'Ngày sinh',
//            'class' =>  'datepicker inputBox'
//        ]);
//        $this->add($birthday);
//        $group->addElement($birthday);
//        $filter->add(array(
//            'name' => 'birthday',
//            'required' => false,
//            'filters' => array(
//                array(
//                    'name' => 'StringTrim'
//                )
//            ),
//            'validators' => array(
//                array(
//                    'name' => 'NotEmpty',
//                    'break_chain_on_failure' => true,
//                    'options' => array(
//                        'messages' => array(
//                            'isEmpty' => 'Bạn chưa nhập ngày sinh'
//                        )
//                    )
//                ),
//            )
//        ));


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
}

?>