<?php
/*
	svc getfast
	Prep list of words for use on client.
*/
function getfast() {
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

	// does this user have rights to view dict records?

	// compose sql
	$sql = 'select d.id, d.t, d.tl';
	$sql .= ' from mai.mean m, mai.dict d';
	$sql .= ' where m.did = d.id and m.n = 1 order by d.t asc';

	$name = 'list-fast';
	$params = array();
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
                return $a;
	}

        $numrows = pg_num_rows($result);
        for ($i=0; $i<$numrows; $i++) {
                $row = pg_fetch_array($result, $i, PGSQL_ASSOC);
                $dict = array();
		$dict['id'] = $row['id'];
		$dict['t'] = $row['t'];
		$dict['tl'] = $row['tl'];
                $dicts[] = $dict;
        }

	// success
	$a['status'] = 'ok';
	$a['list'] = $dicts;
	return $a;
}
?>
