<?php
/**

 */

namespace System\Navigation\Service;

use Zend\Navigation\Service\DefaultNavigationFactory;

class SystemFactory extends DefaultNavigationFactory
{
    protected function getName()
    {
        return 'system';
    }
}