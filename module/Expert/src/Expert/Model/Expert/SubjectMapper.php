<?php

namespace Expert\Model\Expert;

use Expert\Model\ExpertMapper;
use Home\Model\BaseMapper;
use User\Model\User;
use User\Model\UserMapper;
use Zend\Db\Adapter\Adapter;
class SubjectMapper extends BaseMapper
{

    CONST TABLE_NAME = 'expert_subjects';

    /**
     *
     * @author DuongNQ
     * @return array null
     * @param \Expert\Model\Expert\Subject $exp
     */
    public function save($exp)
    {
        $data = array(
            'expertId'    =>  $exp->getExpertId(),
            'subjectId' => $exp->getSubjectId(),
            'createdById'=>$exp->getCreatedById(),
            'createdDateTime' => $exp->getCreatedDateTime(),

        );
        /* @var $dbAdapter \Zend\Db\Adapter\Adapter */
        $dbAdapter = $this->getServiceLocator()->get('dbAdapter');

        /* @var $dbSql \Zend\Db\Sql\Sql */
        $dbSql = $this->getServiceLocator()->get('dbSql');
        if (!$exp->getId()) {
            $insert = $this->getDbSql()->insert(self::TABLE_NAME);
            $insert->values($data);
            $query = $dbSql->buildSqlString($insert);

            /* @var $results \Zend\Db\Adapter\Driver\Pdo\Result */
            $results = $dbAdapter->query($query, $dbAdapter::QUERY_MODE_EXECUTE);
            $exp->setId($results->getGeneratedValue());
        } else {
            $update = $this->getDbSql()->update(self::TABLE_NAME);
            $update->set($data);
            $update->where(['id' => (int)$exp->getId()]);
            $query = $dbSql->buildSqlString($update);
            $results = $dbAdapter->query($query, $dbAdapter::QUERY_MODE_EXECUTE);
        }
        return $results;
    }

    /**
     *
     * @author DuongNQ
     * @param \Expert\Model\Expert $exp
     */
    public function get($exp){
        if(!$exp->getId()){
            return null;
        }
        $select = $this->getDbSql()->select(array('e' => self::TABLE_NAME));
        $select->where(['id' => $exp->getId()]);
        $select->limit(1);
        $query = $this->getDbSql()->buildSqlString($select);
        $dbAdapter = $this->getDbAdapter();
        $results = $dbAdapter->query($query, $dbAdapter::QUERY_MODE_EXECUTE);
        if($results->count()){
            $exp->exchangeArray((array) $results->current());
            return $exp;
        }
        return null;
    }



    /**
     * @author DuongNQ
     * @param \Expert\Model\Expert\Subject $expertsub
     */
    public function search($expertsub, $options)
    {
        $select = $this->getDbSql()->select(array(
            'es' => self::TABLE_NAME
        ));

        if($expertsub->getSubjectId()){
            $select->where(['es.subjectId'=>$expertsub->getSubjectId()]);
        }
        if($expertsub->getOption('subjectIds')){
            $select->where(['es.subjectId'=>$expertsub->getOption('subjectIds')]);
        }
        $select->order([
            'es.id' => 'DESC'
        ]);
        $select->group('es.expertId');
//        vdump($this->getDbSql()->buildSqlString($select));die;
        $paginator = $this->preparePaginator($select, $options, new Subject());
        $userIds = array();
        $users =  array();
        /** @var \Expert\Model\Expert\Subject $es */
        foreach($paginator as $es){
            $userIds[] = $es->getExpertId();
        }
        $subjects = $this->fetchAllSubject($expertsub->addOption('expertIds',$userIds));
        if($userIds){
            $select = $this->getDbSql()->select(['u'=>UserMapper::TABLE_NAME]);
            $select->where(['u.id'=>$userIds]);
            $query = $this->getDbSql()->buildSqlString($select);
            $result = $this->getDbAdapter()->query($query,Adapter::QUERY_MODE_EXECUTE);
            if(count($result)){
                $resultArray = $result->toArray();
                foreach($resultArray as $u){
                    $user = new User();
                    $users[$u['id']] = $user->exchangeArray($u);
                }
            }
        }

        /** @var \Expert\Model\Expert\Subject $expertsub */
        foreach($paginator->getCurrentModels() as $expertsub){
            $userId = $expertsub->getExpertId();
            $expertsub->addOption('subject',isset($subjects[$userId])?$subjects[$userId]:null);
            $expertsub->addOption('user',isset($users[$userId])?$users[$userId]:null);
        }


        return $paginator;
    }

    /**
     * @author DuongNQ
     * @param \Expert\Model\Expert\Subject $exp
     * todo lay tat ca mon hoc ma mentor care
     */
    public function fetchAllSubject($exp){
        $select = $this->getDbSql()->select([
            'es'    =>  self::TABLE_NAME
        ]);
        $select->join(['s'=>\Subject\Model\SubjectMapper::TABLE_NAME],'s.id=es.subjectId','name');
        if($exp->getExpertId()){
            $select->where(['es.expertId' => $exp->getExpertId()]);
        }
        if($exp->getOption('expertIds')){
            $select->where(['es.expertId' => $exp->getOption('expertIds')]);
        }
        $query = $this->getDbSql()->buildSqlString($select);
        $rows = $this->getDbAdapter()->query($query,Adapter::QUERY_MODE_EXECUTE);
        $rows = $rows->toArray();
        $result = [];
        if(count($rows)){
            foreach($rows as $r){
                $result[$r['expertId']][$r['subjectId']] = $r['name'];
            }
        }
//        vdump($result);die;
        return $result;
    }


    /**
     * @author DuongNQ
     * @param \\Model\Expert\Subject $exp
     */
//    public function featchAll($exp)
//    {
//        $select = $this->getDbSql()->select(array(
//            'es' => self::TABLE_NAME
//        ));
//        $select->columns(['subjectId']);
//        $select->join(['u'=>UserMapper::TABLE_NAME],'u.id=es.expertId');
//        $select->join(['s'=>\Subject\Model\SubjectMapper::TABLE_NAME],'s.id=es.subjectId',['subjectName'=>'name']);
//        $select->order([
//            'u.id' => 'DESC'
//        ]);
//        if($exp->getOption('subjectIds')){
//            $select->where(['subjectId'=>$exp->getOption('subjectIds')]);
//        }else{
//            $select->where(['subjectId'=>$exp->getSubjectId()]);
//        }
//        $query = $this->getDbSql()->buildSqlString($select);
//        $rows = $this->getDbAdapter()->query($query,Adapter::QUERY_MODE_EXECUTE);
//        $rows = $rows->toArray();
//        if(count($rows)){
//            foreach($rows as $row){
//                $user = new User();
//                $user->exchangeArray($row);
//            }
//        }
//
//    }
}