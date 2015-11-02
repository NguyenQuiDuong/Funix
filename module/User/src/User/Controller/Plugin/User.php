<?php
/**
 * @author 		VanCK

 */
namespace User\Controller\Plugin;

use Zend\Mvc\Controller\Plugin\AbstractPlugin;

class User extends AbstractPlugin
{
    /**
     * @var \User\Service\User
     */
    protected $serviceUser;

    /**
     * @param \User\Service\User $serviceUser
     */
    public function setServiceUser($serviceUser)
    {
        $this->serviceUser = $serviceUser;
    }

    /**
     * @return \User\Service\User
     */
    public function getServiceUser()
    {
        return $this->serviceUser;
    }

	public function __invoke() {
		return $this->getServiceUser();
	}
}