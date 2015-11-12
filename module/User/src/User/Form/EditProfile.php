<?php

namespace User\Form;

use Home\Form\FormBase;
use Zend\Form\Element\Select;
use Zend\Form\Element\Text;
use Zend\Form\Element\Textarea;

class EditProfile extends FormBase
{
    const ERROR_INVALID = "Mail hoặc mật khẩu không chính xác";
    const ERROR_LOCKED = "Tài khoản của bạn đã bị khóa";
    const ERROR_INACTIVE = "Tài khoản của bạn chưa được kích hoạt";
    /**
     * @param null|string $name
     */
    public function __construct($serviceLocator, $options=null)
    {
        parent::__construct('signin');
        $this->setServiceLocator($serviceLocator);
        $this->setAttribute('method', 'post');
        $this->setOptions(['layout' => 'fluid']);

        $filter = $this->getInputFilter();

        //$groupBasic = new DisplayGroup('groupBasic');
        //$this->add($groupBasic);

        $fullName = new Text('fullName');
        $fullName->setLabel('Tên đầy đủ:');
        $this->add($fullName);
        //$groupBasic->addElement($username);
        $filter->add(array(
            'name' => 'fullName',
            'required' => true,
            'filters'   => array(
                array('name' => 'StringTrim'),
            ),
            'validators' => array(
                array(
                    'name'    => 'NotEmpty',
                    'options' => array(
                        'messages' => array(
                            'isEmpty' => 'Bạn chưa nhập tên'
                        )
                    )
                ),
            ),
        ));

        $cityId = new Select('cityId');
        $this->loadCities($cityId);
        $filter->add(array(
            'name'  =>  'cityId',
            'required'  =>  false,
            'filters'   =>  array(),
        ));
        $this->add($cityId);


        $districtId = new Select('districtId');
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
                            'isEmpty' => 'Bạn chưa nhập người dùng'
                        )
                    )
                )
            )
        ));
        $this->add($address);

        // code
        $description = new Textarea('description');
        $description->setLabel('Mô tả bản thân:');
        $description->setAttributes([
            'class' => 'form-control basicEditor ',
            'style' => 'min-height: 300px;'
        ]);
        $this->add($description);
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
                            'isEmpty' => 'Bạn chưa nhập mô tả'
                        )
                    )
                )
            )
        ));

        $this->add(array(
            'name' => 'submit',
            'attributes' => array(
                'type'  => 'submit',
                'value' => 'Lưu',
                'id' => 'btnSignin',
                'class' => 'btn btn btn-primary'
            ),
        ));
        //$groupBasic->addElement($this->get('submit'));

    }
    
}