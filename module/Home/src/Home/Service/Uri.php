<?php

namespace Home\Service;

use Home\Model\DateBase;

class Uri
{
	const MULTIMEDIA_SERVER = "http://mentor.funix.edu.vn";

    /**
     * @param Object $obj
     * @return string
     */
    public static function getSavePath($obj, $options = null)
    {
        switch ($obj) {
            case $obj instanceof \User\Model\User:
                if (!$obj->getCreatedDateTime()){
                    return MEDIA_PATH.'/users/default/'.$obj->getId().'/';
                }
                $datePath = DateBase::toFormat($obj->getCreatedDateTime(), 'Ymd');
                return MEDIA_PATH.'/user/'.$datePath.'/'.$obj->getId().'/';
            default: MEDIA_PATH.'/temp/';
        }
        return '';
    }

    /**
     * @param Object $obj
     * @param string|null $thumbnail
     * @return string
     */
    public static function getViewPath($obj, $thumbnail = null)
    {
        switch ($obj) {
           	case $obj instanceof \User\Model\User:
           	    if (!$obj->getCreatedDateTime()){
           	        return '/media/users/default/'.$obj->getId().'/';
           	    }
           	    $datePath = DateBase::toFormat($obj->getCreatedDateTime(), 'Ymd');
           		return '/media/user/'.$datePath.'/'.$obj->getId().'/'.$obj->getAvatar();
           		break;
        }
        return '';
    }


    /**
     * @param $str
     * @return mixed
     * make link from string
     */
    public static function makeLinks($str) {
    	$reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
    	$urls = array();
    	$urlsToReplace = array();
    	if(preg_match_all($reg_exUrl, $str, $urls)) {
    		$numOfMatches = count($urls[0]);
    		$numOfUrlsToReplace = 0;
    		for($i=0; $i<$numOfMatches; $i++) {
    			$alreadyAdded = false;
    			$numOfUrlsToReplace = count($urlsToReplace);
    			for($j=0; $j<$numOfUrlsToReplace; $j++) {
    				if($urlsToReplace[$j] == $urls[0][$i]) {
    					$alreadyAdded = true;
    				}
    			}
    			if(!$alreadyAdded) {
    				array_push($urlsToReplace, $urls[0][$i]);
    			}
    		}
    		$numOfUrlsToReplace = count($urlsToReplace);
    		for($i=0; $i<$numOfUrlsToReplace; $i++) {
    			$str = str_replace($urlsToReplace[$i], "<a href=\"".$urlsToReplace[$i]."\" target='_blank' >".$urlsToReplace[$i]."</a> ", $str);
    		}
    		return $str;
    	} else {
    		return $str;
    	}
    }

    public static function buildAutoHttp($uri, $params = null) {
    	// $locale = Zend_Registry::get('locale');

        if(in_array(getenv('APPLICATION_ENV'), ['development', 'localhost'])){
            $result = 'http://'. $_SERVER['HTTP_HOST'] . $uri;
        } else {
            $result = 'https://'. $_SERVER['HTTP_HOST'] . $uri;
        }

    	// append params to uri
    	if(is_array($params)) {
    		foreach ($params as $param => $value) {
    			if(strpos($result, '?')) {
    				$result .= "&$param=$value";
    			} else {
    				$result .= "?$param=$value";
    			}
    		}
    	}
    	return $result;
    }

    /**
     * @param string $link
     * @param array $options
     */
    public static function autoLink($uri, $options = null)
    {
    	if(!is_array($options)) {
    		$options = [];
    	}
    	$curl = curl_init(self::buildAutoHttp($uri, $options));
    	if(getenv('APPLICATION_ENV') != 'production') {
    		//@curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    	} else {
    		@curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    	}

    	curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 1);
    	curl_setopt($curl, CURLOPT_TIMEOUT, 1);
    	curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    	curl_exec($curl);
    	curl_close($curl);
    }

    public static function build($uri, $params = null){
        $request = \Zend\Uri\UriFactory::factory($uri);
        if($params && is_array($params)){
            foreach ($request->getQueryAsArray() as $param=>$value){
                if(!isset($params[$param])){
                    $params[$param] = $value;
                }
            }
        }
        $request->setQuery($params);
        return $request->toString();


    }
}