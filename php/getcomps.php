<?php
/*
	svc getcomps
	Assemble and return components for one story.
*/
require_once('subcompsone.php');

function getcomps() {
	$a = array(
		'status' => 'system-error'
	);

	// raw inputs
	$taint_si = isset($_POST['si']) ? $_POST['si'] : 0;
	$taint_id = isset($_POST['id']) ? $_POST['id'] : '';
        $taint_words = isset($_POST['words']) ? $_POST['words'] : '';

	// validate inputs
	$si = validateToken($taint_si);
	$id = validateId($taint_id);
        $words = validateArray($taint_words);

	// validate parameter set; must include story id or words
	//if (!$si || !($id || $words)) {
	if (!$si || !$words) {
		Log::write(LOG_WARNING, 'attempt with invalid parameter set');
		return $a;
	}

	// get database connection
	$conn = getConnection();
	if (!$conn) {
		return $a;
	}
/*
	// read words from story if not input
	if (!$words) {
		$name = 'query-story';
		$sql = "select words from mai.story where id = $1";
		$params = array($id);
		$result = execSql($conn, $name, $sql, $params, false);
		if (!$result || !pg_num_rows($result)) {
			Log::write(LOG_ERROR, $name.' failed');
			return $a;
		}
		$row = pg_fetch_array($result, 0, PGSQL_ASSOC);
		$words = $row['words'];
	}
*/
	$comps = getCompsForOneStory($conn, $words);
	if (!$comps) {
		return $a;
	}

	// success
	$a['status'] = 'ok';
	$a['words'] = $comps;
	return $a;
}

function validateId($taint) {
	$clean = intval($taint);
	return $clean;
}
function validateArray($taint) {
	$clean = false;
	$clean = $taint;
	return $clean;
}
?>
