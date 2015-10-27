<?php

namespace Home\Form\Search;

use Home\Form\FormBase;
use Zend\Form\Element\Text;
use ZendX\Form\Element\DisplayGroup;

class Search extends FormBase
{

    public function __construct($serviceLocator, $options = null)
    {
        parent::__construct('AccountIndex');
        $this->setServiceLocator($serviceLocator);
        $this->setAttribute('method', 'post');

        $filter = $this->getInputFilter();

        $group = new DisplayGroup('Search');
        $group->setLabel('Tìm kiếm trợ giúp');
        $this->add($group);


        // search
        $search = new Text('search');
        $search->setLabel('Tôi cần giúp về: ');
        $search->setAttributes([
            'maxlength' => 255
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