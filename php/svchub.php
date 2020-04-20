<?php
/**
	user authentication svc entry point
**/
require_once(dirname(__FILE__).'/../../config.php');
require_once('account/lib/str.php');
require_once('account/lib/db.php');
require_once('account/lib/validate.php');
require_once('account/lib/crypto.php');
require_once('account/lib/cors.php');
require_once('account/lib/log.php');

writeHeader();

$supported_svcs = array(
	'getprofile',
	'setprofile',
	'setvocab',
	'getvocab',
	'setdict',
	'getdict',
	'search',
	'getfast',
	'getalpha'
);

function validateSvc($taint) {
	global $supported_svcs;
	$clean = in_array($taint, $supported_svcs) ? $taint : 0;
	return $clean;
}

function svchub() {
	// get the svc name
	$taint_svc = isset($_POST['svc']) ? $_POST['svc'] : 0;

	//ini_set('display_errors', 1);  // not secure
	error_reporting(E_ALL);
	ini_set('log_errors', 'on');
	ini_set('error_log', Config::$log_logfile);

	// validate the svc name
	$svc = validateSvc($taint_svc);
	if (!$svc) {
		Log::open("unsupported svc: $svc.$taint_svc");
		return;
	}

	$includefile = $svc . '.php';

	Log::open($svc);
	require_once($includefile);
	$a = $svc();
	echo json_encode($a);
	Log::close($a['status']);
	return;
}
?>
