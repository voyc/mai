<?php
/*
	svc dostorycomponents
	Assemble components of each story.
*/
function dostorycomponents() {
	$a = array(
		'status' => 'system-error'
	);
x
	// get database connection
	$conn = getConnection();
	if (!$conn) {
		return $a;
	}

	// compose sql
	$sql = 'select id, t, tl from mai.dict d order by t asc';

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
		$dict['t'] = $row['t'];
		$dict['tl'] = $row['tl'];
		$dict['id'] = $row['id'];
                $dicts[] = $dict;
        }

	// success
	$a['status'] = 'ok';
	$a['list'] = $dicts;
	return $a;
}
?>
