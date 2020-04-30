<?php
/*
	svc getstory
	Read and return story for logged-in user.
*/
function getstory() {
	$a = array(
		'status' => 'system-error'
	);

	// raw inputs
	$taint_si = isset($_POST['si']) ? $_POST['si'] : 0;
        $taint_id = isset($_POST['id']) ? $_POST['id'] : '';
        $taint_title = isset($_POST['title']) ? $_POST['title'] : '';

	// validate inputs
	$si = validateToken($taint_si);
	$id = validateId($taint_id);
	//$title = validateThaiText($taint_title);

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

	// get logged-in user
	$result = getUserByToken($conn, $si);
	if (!$result) {
		return $a;
	}
	$row = pg_fetch_array($result, 0, PGSQL_ASSOC);
	$userid = $row['id'];

	// read story
	$name = 'query-story';
	$sql = "select id, authorid, language, title, original, words from mai.story where id = $1";
	$params = array($id);
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result || !pg_num_rows($result)) {
                return $a;
	}

        // build array of output
	$row = pg_fetch_array($result, 0, PGSQL_ASSOC);
	$story = array();
	$story['id'] = $row['id'];
	$story['authorid'] = $row['authorid'];
	$story['language'] = $row['language'];
	$story['title'] = $row['title'];
	$story['original'] = $row['original'];
	$story['words'] = $row['words'];

	// success
	$a['status'] = 'ok';
	$a['story'] = $story;
	return $a;
}

function validateId($taint) {
	$clean = intval($taint);
	return $clean;
}
?>
