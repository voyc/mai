<?php
/*
	svc getcomponents
	Assemble and return components for one story.
*/
require_once('subcompsone.php');

function getcomponents() {
	$a = array(
		'status' => 'system-error'
	);

	// raw inputs
	$taint_si = isset($_POST['si']) ? $_POST['si'] : 0;
	$taint_id = isset($_POST['id']) ? $_POST['id'] : '';

	// validate inputs
	$si = validateToken($taint_si);
	$id = validateId($taint_id);

	// validate parameter set
	if (!$si || !$id) {
		Log::write(LOG_WARNING, 'attempt with invalid parameter set');
		return $a;
	}

	// get database connection
	$conn = getConnection();
	if (!$conn) {
		return $a;
	}

	$comps = getCompsForOneStory($conn, $id);

	// success
	$a['status'] = 'ok';
	$a['components'] = $comps;
	return $a;
}

function validateId($taint) {
	$clean = intval($taint);
	return $clean;
}
?>
