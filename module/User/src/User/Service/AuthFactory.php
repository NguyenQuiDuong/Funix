<?php
/**
 * @author 		VanCK

 */
namespace User\Service;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class AuthFactory implements FactoryInterface
{
    /**
     * @param ServiceLocatorInterface $sl
     * @return \Zend\Authentication\AuthenticationService
     */
    public function createService(ServiceLocatorInterface $sl)
    {
        return new \Zend\Authentication\AuthenticationService(
            new \Zend\Authentication\Storage\Session(),
            new \Zend\Authentication\Adapter\DbTable($sl->get('Zend\Db\Adapter\Adapter'))
        );
    }
}