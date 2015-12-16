<?php
/**
 * Created by PhpStorm.
 * User: Ace
 * Date: 17-Dec-15
 * Time: 2:57 AM
 */
namespace Expert\Model;

use Home\Model\Base;

class CandiateMentor extends Base
{

    /**
     * @var int
     */
    protected $id;
    /**
     * @var int
     */
    protected $candiateMentorId;

    /**
     * @var int
     */
    protected $subjectId;

    /**
     * @var Date
     */
    protected $createdDate;
    /**
     * @var Datetime
     */
    protected $createdDateTime;

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
     * @return int
     */
    public function getCandiateMentorId()
    {
        return $this->candiateMentorId;
    }

    /**
     * @param int $candiateMentorId
     */
    public function setCandiateMentorId($candiateMentorId)
    {
        $this->candiateMentorId = $candiateMentorId;
    }

    /**
     * @return int
     */
    public function getSubjectId()
    {
        return $this->subjectId;
    }

    /**
     * @param int $id
     */
    public function setSubjectId($subjectId)
    {
        $this->$subjectId = $subjectId;
    }

    /**
     * @return Date
     */
    public function getCreatedDate()
    {
        return $this->createdDate;
    }

    /**
     * @param Date $createdDate
     */
    public function setCreatedDate($createdDate)
    {
        $this->createdDate = $createdDate;
    }

    /**
     * @return Datetime
     */
    public function getCreatedDateTime()
    {
        return $this->createdDateTime;
    }

    /**
     * @param Datetime $createdDateTime
     */
    public function setCreatedDateTime($createdDateTime)
    {
        $this->createdDateTime = $createdDateTime;
    }

    public function toFormValues(){
        $data = array(
            'id' => $this->getId(),
            'candiateMentorId' => $this->getCandiateMentorId(),
            'subjectId' => $this->getSubjectId(),

        );
        return $data;

    }
}