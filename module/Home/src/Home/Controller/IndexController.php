<?php
/**
 * Home\Controller
 *
 */

namespace Home\Controller;


use Home\Form\Search\Search;

class IndexController extends ControllerBase
{
    public function indexAction()
    {
        $form = new Search($this->getServiceLocator());
        /** @var $subjectMapper \Subject\Model\SubjectMapper */
        $subjectMapper = $this->getServiceLocator()->get('Subject/Model/SubjectMapper');
        $subjects = $subjectMapper->featchAll('category');
        $this->layout()->setVariables(['subjectCategories' => $subjects]);
        $this->getViewModel()->setVariables(['form'   =>  $form]);
    	return $this->getViewModel();
    }

    public function addAction()
    {

    }

    public function editAction()
    {

    }

    public function deleteAction()
    {

    }

    public function introAction()
    {

    }

    public function searchAction()
    {
        return $this->getViewModel();
    }
}