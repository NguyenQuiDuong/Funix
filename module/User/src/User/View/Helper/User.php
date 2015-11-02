<?php
/**
 * User\View\Helper\User
 *

 */

namespace User\View\Helper;

use Zend\View\Helper\AbstractHelper;

class User extends AbstractHelper {

	/**
	 * @var \User\Service\User
	 */
	protected $serviceUser;

    /**
     * @return \User\Service\User
     */
    public function getServiceUser() {
		return $this->serviceUser;
	}

    /**
     * @param \User\Service\User $serviceUser
     */
    public function setServiceUser($serviceUser)
    {
        $this->serviceUser = $serviceUser;
    }

	public function __invoke() {
		return $this->getServiceUser();
	}
}