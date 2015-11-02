<?php


namespace Address\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class CityController extends AbstractActionController
{
	public function loadAction()
	{
		$sl = $this->getServiceLocator();

		$city = new \Address\Model\City();
		/*@var $districtMapper \Cart\Model\DistrictMapper */
		$cityMapper = $sl->get('Address\Model\CityMapper');

		return new JsonModel(
			$city->toSelectBoxArray($cityMapper->fetchAll())
		);
	}
}