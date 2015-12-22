<?php
/**
 * Created by PhpStorm.
 * User: Ace
 * Date: 21-Dec-15
 * Time: 3:59 PM
 */

namespace Admin\Form\Report;


use Home\Form\FormBase;
use Home\Form\ReportFilterBase;
use User\Model\User;
use Zend\Form\Element\Select;
use Zend\Form\Element\Text;

class ReportFilter extends ReportFilterBase
{
    /**
     * @param null|string $name
     */
    public function __construct($serviceLocator)
    {
        parent::__construct($serviceLocator);
        $filter = $this->getInputFilter();

        $username = new Text('username');
        $username->setAttributes([
            'placeholder' => 'Tên nhân viên',
        ]);
        $filter->add(array(
            'name' => 'username',
            'required' => false,
            'filters'   => array(
                array('name' => 'StringTrim')
            ),
        ));

        $this->add($username);

        $role = new Select('role');
        $role->setValueOptions([
            ''                      =>  '- Nhóm -',
            User::ROLE_MENTOR       =>  'Mentor',
            User::ROLE_CALLCENTER   =>  'Callcenter'
        ]);

        $filter->add(array(
            'name' => 'role',
            'required' => false,
            'filters'   => array(
                array('name' => 'StringTrim')
            ),
        ));

        $this->add($role);

        $this->add(array(
            'name' => 'submit',
            'options' => array(
            ),
            'attributes' => array(
                'type'  => 'submit',
                'value' => 'Lọc',
                'id' => 'btnFilterCrmContact',
                'class' => 'btn btn-primary'
            ),
        ));
    }

}