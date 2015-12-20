<?php
/**
 * Home\Controller
 *

 */

namespace Home\Controller;

use Home\Controller\ControllerBase;
use Home\Model\Media;
use Zend\View\Model\JsonModel;
use Home\Model\DateBase;
use Home\Service\Uri;
use Home\Model\Format;

class MediaController extends ControllerBase{

	public function indexAction(){
	}

	public function downloadAction(){
		$type = $this->getRequest()->getQuery('type');
		$f = $this->getRequest()->getQuery('f');
		if(!$type || !$f){
			return $this->page404();
		}
		$file = '';
		$fileName = '';
		switch ($type){
			case Media::TYPE_CRM_LEAD_TEMPLATE_EXCEL:
				$file = BASE_PATH . '/public/media/leads/'.$f;
				$fileName = $f;
				break;
		    case Media::TYPE_HRM_TEST_TEMPLATE_EXCEL:
		        $file = BASE_PATH . '/public/media/test/'.$f;
		        $fileName = $f;
		        break;

		}
		if ($file && !file_exists($file)) {
			die("File not found.");
		}
		$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));

		switch ($ext) {
			case "pdf": $ctype = "application/pdf";
			break;
			case "exe": $ctype = "application/octet-stream";
			break;
			case "zip": $ctype = "application/zip";
			break;
			case "doc":
			case "docx": $ctype = "application/msword";
			break;
			case "xls": $ctype = "application/vnd.ms-excel";
			break;
			case "xlsx": $ctype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
			break;
			case "ppt":
			case "pptx": $ctype = "application/vnd.ms-powerpoint";
			break;
			case "gif": $ctype = "image/gif";
			break;
			case "png": $ctype = "image/png";
			break;
			case "jpe":
			case "jpeg":
			case "jpg": $ctype = "image/jpg";

			break;
			default: $ctype = "application/force-download";
		}

		header("Pragma: public");
		header("Expires: 0");
		header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
		header("Cache-Control: private", false);
		header("Content-Type: $ctype");
		//echo $file;die;
		header("Content-Disposition: attachment; filename=\"" .$fileName . "\";");
		header("Content-Transfer-Encoding: binary");
		header("Content-Length: " . filesize($file));

		readfile("$file") or die("File not found!");
		exit();
	}


    public function rrmdir($dir)
    {
        if (is_dir($dir)) {
            $objects = scandir($dir);
            foreach ($objects as $object) {
                if ($object != "." && $object != "..") {
                    if (filetype($dir . "/" . $object) == "dir")
                        $this->rrmdir($dir . "/" . $object);
                    else
                        unlink($dir . "/" . $object);
                }
            }
            reset($objects);
            rmdir($dir);
        }
    }

}