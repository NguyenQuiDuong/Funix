<?php
/**
 * @author 		KIenNN

 */
namespace Authorize\View\Strategy;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class UnauthorizedStrategyFactory implements FactoryInterface{
	/**
	 * @param ServiceLocatorInterface $sl
	 * @return \Authorize\Service\Authorize
	 */
	public function createService(ServiceLocatorInterface $sl)
	{
		return new \Authorize\View\Strategy\UnauthorizedStrategy();
	}
}