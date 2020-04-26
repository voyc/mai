<?php
/*
	svc getstories
	Read and return story for logged-in user.
*/
function getstories() {
	$a = array(
		'status' => 'system-error'
	);

	// raw inputs
	$taint_si = isset($_POST['si']) ? $_POST['si'] : 0;

	// validate inputs
	$si = validateToken($taint_si);

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

	// read story for logged-in user
	$name = 'query-story';
	$sql = "select id,authorid,title,language from mai.story";
	$params = array();
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
                return $a;
	}

        // build array of stories
        $stories = array();
        $numrows = pg_num_rows($result);
        for ($i=0; $i<$numrows; $i++) {
                $row = pg_fetch_array($result, $i, PGSQL_ASSOC);
                $story = array();
		$story['id'] = $row['id'];
		$story['aid'] = $row['authorid'];
		$story['title'] = $row['title'];
		$story['lang'] = $row['language'];
                $stories[] = $story;
        }


	// success
	$a['status'] = 'ok';
	$a['list'] = $stories;
	return $a;
}
?>
