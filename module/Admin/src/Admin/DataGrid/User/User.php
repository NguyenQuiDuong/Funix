<?php

namespace Admin\DataGrid\User;

use ZendX\DataGrid\DataGrid;
use ZendX\DataGrid\Row;
use Home\Form;
class User extends DataGrid
{
    public function init()
    {
        $this->addHeader([
            'attributes' => array( ),
            'options' => array(),
            'columns' => array(
                array(
                    'name' => 'id',
                    'content' => 'ID'
                ),
                array(
                    'name' => 'fullName',
                    'content' => 'Họ tên'
                ),
                array(
                    'name' => 'email',
                    'content' => 'Email'
                ),
                array(
                    'name' => 'facebook',
                    'content' => 'Link Facebook'
                ),
                array(
                    'name' => 'createdDateTime',
                    'content' => 'Ngày đăng kí'
                ),
                 array(
                    'name' => 'role',
                    'content' => 'Quyền'
                ),
                  array(
                    'name' => 'status',
                    'content' => 'Trạng thái'
                ),
                 array(
                    'name' => 'setrole',
                    'content' => 'Set Role'
                ),
                

            )

        ]);

        if (! is_array($this->getDataSource()) && ! $this->getDataSource() instanceof \Zend\Paginator\Paginator) {
            return;
        }

        if ($this->getDataSource() > 0) {
            /** @var  $item \User\Model\User */
            foreach ($this->getDataSource() as $item) {

                $row = new Row();
                $this->addRow($row);

                // Add $item to row
                $row->addColumn(array(
                    'name' => 'id',
                    'content' => $item->getId(),
                    'attributes' => []
                ));

                // name
                $row->addColumn(array(
                    'name' => 'name',
                    'content' => $item->getFullName(),
                    'attributes' => [
                    ]
                ));

                $row->addColumn(array(
                    'name' => 'email',
                    'content' => $item->getEmail(),
                    'attributes' => [
                    ]
                ));
                 $row->addColumn(array(
                    'name' => 'facebook',
                    'content' => $item->getFacebook(),
                    'attributes' => [
                    ]
                ));


                $row->addColumn(array(
                    'name' => 'createdDateTime',
                    'content' => $item->getCreatedDateTime(),
                    'attributes' => [
                        'style' => 'position: relative'
                    ]
                ));
                //role
                $role="";
                switch($item->getRole()){
                    case \User\Model\User::ROLE_MEMBER:
                        $role = '<span class="label label-success">'.$item->getRoleDisplayName().'</span>';
                        break;
                    case \User\Model\User::ROLE_MENTOR:
                        $role = '<span class="label label-info">'.$item->getRoleDisplayName().'</span>';
                        break;
                    case \User\Model\User::ROLE_CALLCENTER:
                        $role = '<span class="label label-warning">'.$item->getRoleDisplayName().'</span>';
                        break;
                    case \User\Model\User::ROLE_ADMIN:
                        $role = '<span class="label label-danger">'.$item->getRoleDisplayName().'</span>';
                        break;
                    case \User\Model\User::ROLE_SUPERADMIN:
                        $role = '<span class="label label-danger">'.$item->getRoleDisplayName().'</span>';
                        break;
                }
                $row->addColumn(array(
                    'name' => 'role',
                    'content' => $role,
                    'attributes' => ['style' => 'width:40px;']
                ));
                 // Status
                if($item->getActive()==1){
                    $status = '<input type="checkbox" name="my-checkbox" id="switch-change'.$item->getId().'" onchange="changeActive('.$item->getId().');" checked>';
                }else{
                    $status = '<input type="checkbox" name="my-checkbox" id="switch-change'.$item->getId().'" onchange="changeActive('.$item->getId().');" >';
                }
                $row->addColumn(array(
                    'name' => 'status',
                    'content' => $status,
                    'attributes' => ['style' => 'width:30px;']
                ));
                
                 if($item->getRole()==200||$item->getRole()==5){
                    $setrole = '<button class="btn btn-info" id="change-role-'.$item->getId().'" data-email="'.$item->getEmail().'" data-facebook="'.$item->getFacebook().'" data-role="'.$item->getRole().'" onclick="setMentor('.$item->getId().');" >Thay đổi quyền user</button>';
                }else{
                    $setrole = '';
                }
                $row->addColumn(array(
                    'name' => 'setrole',
                    'content' => $setrole,
                    'attributes' => ['style' => 'width:30px;']
                ));

            }
        }
    }
}

?>