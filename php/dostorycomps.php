<?php
/*
	svc dostorycomponents
	Assemble components of each story.
*/
function dostorycomponents() {
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
	if (!$si){
		Log::write(LOG_WARNING, 'attempt with invalid parameter set');
		return $a;
	}

	// get database connection
	$conn = getConnection();
	if (!$conn) {
		return $a;
	}

	$comps = array();
	if ($id) {
		$comps = doOneStory($id);
	}
	else {
		doAllStories();
	}
	// success
	$a['status'] = 'ok';
	return $a;
}
function validateId($taint) {
	$clean = intval($taint);
	return $clean;
}
function doOneStory($conn,$id) {
}
function doAllStories($conn,$id) {
}
?>
