<?php
/**

 */

namespace User\Navigation\Service;

use Zend\Navigation\Service\DefaultNavigationFactory;

class UserFactory extends DefaultNavigationFactory
{
    protected function getName()
    {
        return 'user';
    }
}