<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/Subject for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Subject\Controller;

use Subject\Model\Subject;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;

class SubjectController extends AbstractActionController
{
    public function indexAction()
    {
        die;
        return array();
    }
    public function suggestAction(){
        $q = $this->getRequest()->getPost('q');
        $subject = new Subject();
        $subject->setName($q);
        $jsonModel = New JsonModel();
        if(!$q){
            $jsonModel->setVariables([
                'code' => 1,
                'data' => []
            ]);
            return $jsonModel;
        }
        /** @var \Subject\Model\SubjectMapper $subjectMapper */
        $subjectMapper = $this->getServiceLocator()->get('Subject\Model\SubjectMapper');
        $jsonModel->setVariables([
            'code' => 1,
            'data' => $subjectMapper->suggest($subject)
        ]);
        return $jsonModel;
    }


    public function suggestcategoryAction(){
        $q = $this->getRequest()->getPost('q');
        $category = new Subject\Category();
        $category->setName($q);
        $jsonModel = New JsonModel();
        if(!$q){
            $jsonModel->setVariables([
                'code' => 1,
                'data' => []
            ]);
            return $jsonModel;
        }
        /** @var \Subject\Model\Subject\CategoryMapper $categoryMapper */
        $categoryMapper = $this->getServiceLocator()->get('Subject\Model\Subject\CategoryMapper');
        $jsonModel->setVariables([
            'code' => 1,
            'data' => $categoryMapper->suggest($category)
        ]);
        return $jsonModel;
    }

    /**
     * todo lay ra môn học dùng cho tags ở search
     */
    public function fetchallAction(){
        /** @var \Subject\Model\SubjectMapper $subjectMapper */
        $subjectMapper = $this->getServiceLocator()->get('Subject\Model\SubjectMapper');
        $jsonModel = New JsonModel();
        $jsonModel->setVariables($subjectMapper->suggest(null));
        return $jsonModel;
    }

    /**
     * @author DuongNQ
     * $return \zend\View\Model\JsonModel
     */
    public function loadsubjectAction(){
        if ($this->getRequest()->isPost()) {
            if ($this->getRequest()->getPost()->toArray()['subjectId'] != ''){
                $subjectIds = explode(',', $this->getRequest()->getPost()->toArray()['subjectId']);
            }
            /** @var \Subject\Model\SubjectMapper $subjectMapper */
            $subjectMapper = $this->getServiceLocator()->get('\Subject\Model\SubjectMapper');
            $subjectNames=[];
            if(count($subjectIds)>0){
                foreach ($subjectIds as $subjectId){
                    $subject = new Subject();
                    $subject->setId($subjectId);
                    $subject = $subjectMapper->get($subject);
                    $subjectNames[$subjectId] = $subject->getName();
                }
            }
            return new JsonModel(
                $subjectNames
            );
        }else return null;
    }
}
