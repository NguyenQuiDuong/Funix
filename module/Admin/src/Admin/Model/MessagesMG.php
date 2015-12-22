<?php
/**
 * Created by PhpStorm.
 * User: Ace
 * Date: 20-Dec-15
 * Time: 6:14 AM
 */
namespace Admin\Model;
use Doctrine\ODM\MongoDB\Mapping\Annotations as ODM;
use Home\Model\Base;

/** @ODM\Document(collection="messages") */
class MessagesMG extends Base
{
    /** @ODM\Id */
    private $id;

    /** @ODM\Field(type="string") */
    private $sender;

    /** @ODM\Field(type="string") */
    private $receiver;

    /** @ODM\Field(type="string") */
    private $msg;

    /** @ODM\Field(type="date") */
    private $created;

    /** @ODM\Field(type="string") */
    private $imgPath;

    /**
     * @return the $id
     */

    public function getId()
    {
        return $this->id;
    }

    /**
     * @return the $sender
     */
    public function getSender()
    {
        return $this->sender;
    }

    /**
     * @return the $receiver
     */
    public function getReceiver()
    {
        return $this->receiver;
    }

    /**
     * @return the $msg
     */
    public function getMsg()
    {
        return $this->msg;
    }

    /**
     * @return the $created
     */
    public function getCreated()
    {
        return $this->created;
    }

    /**
     * @return the $imgPath
     */
    public function getImgPath()
    {
        return $this->imgPath;
    }

    /**
     * @param field_type $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @param field_type $sender
     */
    public function setSender($sender)
    {
        $this->sender = $sender;
    }

    /**
     * @param field_type $receiver
     */
    public function setReceiver($receiver)
    {
        $this->receiver = $receiver;
    }

    /**
     * @param field_type $msg
     */
    public function setMsg($msg)
    {
        $this->msg = $msg;
    }

    /**
     * @param field_type $created
     */
    public function setCreated($created)
    {
        $this->created = $created;
    }

    /**
     * @param field_type $imgPath
     */
    public function setImgPath($imgPath)
    {
        $this->imgPath = $imgPath;
    }

}