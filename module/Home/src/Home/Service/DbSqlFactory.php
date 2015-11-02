<?php
/**

 */

namespace Home\Service;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class DbSqlFactory implements FactoryInterface
{
	/**
	 * @author VanCK
	 * @param ServiceLocatorInterface $serviceLocator
	 * @return \Zend\Db\Sql\Sql
	 */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
		$dbAdapter = $serviceLocator->get('Zend\Db\Adapter\Adapter');
		$dbSql = new \Zend\Db\Sql\Sql($dbAdapter);
		return $dbSql;
    }
}
