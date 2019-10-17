<?php
/*
	svc getvocab
	Read and return vocab for logged-in user.
*/
function getvocab() {
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

	// read vocab for logged-in user
	$word = '';
	$type = '';
	$state = '';
	$mastery = '';
	$recency = 0;
	$name = 'query-vocab';
	$sql = "select word, type, state, mastery, recency from mai.vocab where userid = $1";
	$params = array($userid);
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
                return $a;
	}

        // build array of vocab words
        $vocabs = array();
        $numrows = pg_num_rows($result);
        for ($i=0; $i<$numrows; $i++) {
                $row = pg_fetch_array($result, $i, PGSQL_ASSOC);
                $vocab = array();
                $vote[] = intval(substr($row['votes'], 0, 7));
		$row = pg_fetch_array($result, 0, PGSQL_ASSOC);
		$vocab['w'] = $row['word'];
		$vocab['t'] = $row['type'];
		$vocab['s'] = $row['state'];
		$vocab['m'] = $row['mastery'];
		$vocab['r'] = $row['recency'];
                $vocabs[] = $vocab;
        }


	// success
	$a['status'] = 'ok';
	$a['list'] = $vocabs;
	return $a;
}
?>
