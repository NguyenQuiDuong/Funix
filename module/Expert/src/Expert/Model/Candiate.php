<?php
/**
 * Created by PhpStorm.
 * User: Ace
 * Date: 17-Dec-15
 * Time: 2:57 AM
 */
namespace Expert\Model;

use Home\Model\Base;

class Candiate extends Base
{

    /**
     * @var int
     */
    protected $id;

    /**
     * @var String
     */
    protected $fullName;

    /**
     * @var String
     */
    protected $email;

    /**
     * @var String
     */
    protected $skype;

    /**
     * @var String
     */
    protected $mobile;

    /**
     * @var String
     */
    protected $social;

    /**
     * @var int
     */
    protected $isTeaching;

    /**
     * @var String
     */
    protected $description;

    /**
     * @var String
     */
    protected $periodOnline;

    /**
     * @var String
     */
    protected $address;

    /**
     * @var int
     */
    protected $cityId;

    /**
     * @var int
     */
    protected $districtId;

    /**
     * @return int
     */
    public function getDistrictId()
    {
        return $this->districtId;
    }

    /**
     * @param int $districtId
     */
    public function setDistrictId($districtId)
    {
        $this->districtId = $districtId;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return String
     */
    public function getFullName()
    {
        return $this->fullName;
    }

    /**
     * @param String $fullName
     */
    public function setFullName($fullName)
    {
        $this->fullName = $fullName;
    }

    /**
     * @return String
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param String $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * @return String
     */
    public function getSkype()
    {
        return $this->skype;
    }

    /**
     * @param String $skype
     */
    public function setSkype($skype)
    {
        $this->skype = $skype;
    }

    /**
     * @return String
     */
    public function getMobile()
    {
        return $this->mobile;
    }

    /**
     * @param String $mobile
     */
    public function setMobile($mobile)
    {
        $this->mobile = $mobile;
    }

    /**
     * @return String
     */
    public function getSocial()
    {
        return $this->social;
    }

    /**
     * @param String $social
     */
    public function setSocial($social)
    {
        $this->social = $social;
    }

    /**
     * @return int
     */
    public function getIsTeaching()
    {
        return $this->isTeaching;
    }

    /**
     * @param int $isTeaching
     */
    public function setIsTeaching($isTeaching)
    {
        $this->isTeaching = $isTeaching;
    }

    /**
     * @return String
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param String $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return String
     */
    public function getPeriodOnline()
    {
        return $this->periodOnline;
    }

    /**
     * @param String $periodOnline
     */
    public function setPeriodOnline($periodOnline)
    {
        $this->periodOnline = $periodOnline;
    }

    /**
     * @return String
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * @param String $address
     */
    public function setAddress($address)
    {
        $this->address = $address;
    }

    /**
     * @return int
     */
    public function getCityId()
    {
        return $this->cityId;
    }

    /**
     * @param int $cityId
     */
    public function setCityId($cityId)
    {
        $this->cityId = $cityId;
    }


    public function toFormValues()
    {
        $data = array(
            'id' => $this->getId(),
            'fullName' => $this->getFullName(),
            'email' => $this->getEmail(),
            'skype' => $this->getSkype(),
            'mobile' => $this->getMobile(),
            'social' => $this->getSocial(),
            'isTeaching' => $this->getIsTeaching(),
            'periodOnline' => $this->getPeriodOnline(),
            'cityId' => $this->getCityId(),
            'districtId' => $this->getDistrictId(),
            'description' => $this->getDescription(),

        );
        return $data;
    }
}