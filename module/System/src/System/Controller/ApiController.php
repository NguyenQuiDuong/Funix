<?php
/**

 */

namespace System\Controller;

use Home\Controller\ControllerBase;
use Home\Model\DateBase;
use Home\Filter\HTMLPurifier;
use Zend\Db\Sql\Predicate\NotIn;


class ApiController extends ControllerBase
{
    public function getuserAction(){
        $token = $this->params()->fromQuery('token');
        // fix cung token cai da
        if($token != md5('kS9Vu6vqhnBayN2fPxGHgMDF')){
            return $this->getJsonModel()->setVariables([
               'code'   =>  403,
                'messages'  =>  'Bạn không có quyền truy cập',
            ]);
        }
        /** @var \Subject\Model\SubjectMapper $subjectMapper */
        $subjectMapper = $this->getServiceLocator()->get('Subject\Model\SubjectMapper');
        $users = $subjectMapper->fetchAllUser();
        return $this->getJsonModel()->setVariables([
            'code'  =>  1,
            'messages'  =>  $users,
        ]);

    }

}