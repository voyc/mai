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

	// read story
	$name = 'query-story';
	$sql = "select words from mai.story where id = $1";
	$params = array($id);
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result || !pg_num_rows($result)) {
                echo "select story failed\n";
		return;
	}
	$row = pg_fetch_array($result, 0, PGSQL_ASSOC);
	$words = $row['words'];
	$comps = getCompsForOneStory($conn, $words);

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
