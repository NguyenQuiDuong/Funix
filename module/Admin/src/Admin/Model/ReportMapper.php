<?php
/**
 * Created by PhpStorm.
 * User: Ace
 * Date: 20-Dec-15
 * Time: 6:51 PM
 */

namespace Admin\Model;


use Home\Model\BaseMapper;
use Home\Model\DateBase;
use User\Model\User;
use User\Model\UserMapper;
use Zend\Db\Adapter\Adapter;
use Zend\Db\Sql\Predicate\Expression;
use Zend\Db\Sql\Predicate\Like;
use Zend\Db\Sql\Predicate\Operator;
use Zend\Db\Sql\Predicate\Predicate;
use Zend\Db\Sql\Predicate\PredicateSet;

class ReportMapper extends BaseMapper
{
    Const TABLE_NAME = 'chat_activities';

    /**
     * @param $option
     */
    public function reportemployee($option){
        $select = $this->getDbSql()->select(['ca'=>self::TABLE_NAME]);
        $select->columns([
            'callcenter',
            'mentor',
            'count'=>new Expression('COUNT(ca.id)'),
            'rating' => new Expression('AVG(ca.rating)'),
            'createdDate',
            'createdDateTime',
            'endedDate',
            'endedDateTime',
            'time' => new Expression('Sum(TIMESTAMPDIFF(MINUTE,`createdDateTime`,`endedDateTime`))')
        ]);
        $select->where([
            'endedDate IS NOT NULL',
            'endedDateTime IS NOT NULL',
        ]);
        if($option['fromDate']){
            $select->where([
                'ca.endedDate >= ?' => $option['fromDate'],
            ]);
        }
        if($option['toDate']){
            $select->where([
                'ca.endedDate <= ?' => $option['toDate'],
            ]);
        }
        if($option['username']){
            $predicateSet = new PredicateSet();
            $predicateSet->addPredicate(new Like('ca.callcenter', '%'.$option['username'].'%'), $predicateSet::OP_OR);
            $predicateSet->addPredicate(new Like('ca.mentor', '%'.$option['username'].'%'), $predicateSet::OP_OR);
            $select->where($predicateSet);
//
//            $select->where([
//                'ca.callcenter LIKE ?' => '%'.$option['username'].'%',
//                'ca.mentor LIKE ?' => '%'.$option['username'].'%'
//            ],Predicate::OP_AND);
        }
        if($option['role'] == User::ROLE_MENTOR){
            $select->where([
                'ca.mentor IS NOT NULL',
                'ca.callcenter IS NULL'
            ]);
        }
        if($option['role'] == User::ROLE_CALLCENTER){
            $select->where([
                'ca.callcenter IS NOT NULL',
                'ca.mentor IS NULL',
            ]);
        }
        $select->group(['endedDate','callcenter','mentor']);
        if(isset($option['sort']) && $option['sort']){
            $sort = $option['sort'];
            $select->order([$sort['sort'].' '.$sort['dir']]);
        }else{
            $select->order(['endedDate DESC']);
        }
        $query = $this->getDbSql()->buildSqlString($select);
        $rows = $this->getDbAdapter()->query($query,Adapter::QUERY_MODE_EXECUTE);
        $result = [];
        $data = [];
        $usernames = [];
        $users = [];
        if(count($rows)){
            foreach($rows as $row){
                if($row['callcenter'] != null){
                    $usernames[] = $row['callcenter'];
                }
                if($row['mentor'] != null){
                    $usernames[] = $row['mentor'];
                }
                $data[] = $row;
            }
            $select1 = $this->getDbSql()->select(['u'=>UserMapper::TABLE_NAME]);
            $select1->where([
                'u.username' => $usernames
            ]);
            $query1 = $this->getDbSql()->buildSqlString($select1);
            $rows1 = $this->getDbAdapter()->query($query1,Adapter::QUERY_MODE_EXECUTE);
            if(count($rows1)){
                foreach($rows1 as $r){
                    $u = new User();
                    $u->exchangeArray((array)$r);
                    $users[$u->getUsername()] = $u;

                }
            }
            $checkDate = '';
            foreach($data as $row){
                $timediff = '';
                if($row['endedDate'] != $checkDate){
                    $checkDate = $row['endedDate'];
                    $createdDatetime = new \DateTime($row['createdDateTime']);
                    $endDatetime = new \DateTime($row['endedDateTime']);
                    $timediff = date_diff($createdDatetime,$endDatetime)->format('%i');
                }else{
                    $createdDatetime = new \DateTime($row['createdDateTime']);
                    $endDatetime = new \DateTime($row['endedDateTime']);
                    $timediff += date_diff($createdDatetime,$endDatetime)->format('%i');
                }
                $result[$row['endedDate']][] = [
                    'rating' => $row['rating'],
                    'count' => $row['count'],
                    'user' => $row['callcenter']?$users[$row['callcenter']]:$users[$row['mentor']],
                    'time' => $row['time'],
                ];
            }
        }
        return $result;
    }

    /**
     * @param $mess \Admin\Model\MessagesMG
     */
    public function reportdetail($mess){
        $dm = $this->getServiceLocator()->get('doctrine.documentmanager.odm_default');
        $select = $this->getDbSql()->select(['ca' => self::TABLE_NAME]);

        $predicateSet = new PredicateSet();
        $predicateSet->addPredicate(new Operator('ca.callcenter', Operator::OPERATOR_EQUAL_TO,$mess->getSender()), $predicateSet::OP_OR);
        $predicateSet->addPredicate(new Operator('ca.mentor', Operator::OPERATOR_EQUAL_TO,$mess->getSender()), $predicateSet::OP_OR);
        $select->where($predicateSet);

        $select->where(['ca.endedDate' => DateBase::toCommonDate($mess->getCreated())]);

        $query = $this->getDbSql()->buildSqlString($select);
        $rows = $this->getDbAdapter()->query($query,Adapter::QUERY_MODE_EXECUTE);
        $result = [];
        $time = '';
        foreach($rows as $r){
            $result[DateBase::toDisplayDateTime($r['createdDateTime']).' - '.DateBase::toDisplayDateTime($r['endedDateTime'])] =[
                'rating' => $r['rating'],
                'comment' => $r['note'],
            ];
            $createdDatetime = new \DateTime($r['createdDateTime']);
            $endDatetime = new \DateTime($r['endedDateTime']);
            $timediff = date_diff($createdDatetime,$endDatetime);
            $result[DateBase::toDisplayDateTime($r['createdDateTime']).' - '.DateBase::toDisplayDateTime($r['endedDateTime'])]['time'] += $timediff->format('%i');
            $qb = $dm->createQueryBuilder('Admin\Model\MessagesMG');

            $qb->field('receiver')->equals($r['room']);
            $qb->field('created')->range($createdDatetime,$endDatetime);
            $querymg = $qb->getQuery();
            $resultmg = $querymg->execute();
            $i=0;
            /** @var \Admin\Model\MessagesMG $m */
            foreach($resultmg as $m){
                $i++;
                $result[DateBase::toDisplayDateTime($r['createdDateTime']).' - '.DateBase::toDisplayDateTime($r['endedDateTime'])]['messages'][]=[
                        'sender' => $m->getSender(),
                        'room'  => $m->getReceiver(),
                        'msg' => $m->getMsg(),
                        'imgPath' => $m->getImgPath(),
                        'created' => $m->getCreated()->format(DateBase::DISPLAY_DATETIME_FORMAT),
                ];
//                vdump($i.'. Sender: '.$m->getSender().'|| Receiver: '.$m->getReceiver().' || Msg: '.$m->getMsg().' || Created: '.$m->getCreated()->format(DateBase::DISPLAY_DATETIME_FORMAT));
            }
        }
        return $result;

//        if($mess->getSender()){
//            $qb->field('sender')->equals($mess->getSender());
//        }
    }

}