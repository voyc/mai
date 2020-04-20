<?php
/*
	svc getalpha
	Return entire alphabet table to the client.
*/
function getalpha() {
	$a = array(
		'status' => 'system-error'
	);

	// no inputs
	$conn = getConnection();
	if (!$conn) {
		return $a;
	}

	// compose sql
	$sql = 'select * from mai.alphabet order by t;';

	$name = 'list-alpha';
	$params = array();
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
                return $a;
	}

	$alphs = array();
        $numrows = pg_num_rows($result);
        for ($i=0; $i<$numrows; $i++) {
                $row = pg_fetch_array($result, $i, PGSQL_ASSOC);
                $alph = array();
		$alph['id'] = $row['id'];
		$alph['t'] = $row['t'];
		$alph['e'] = $row['e'];
		$alph['u'] = $row['u'];
		$alph['r'] = $row['r'];
		$alph['m'] = $row['m'];
		$alph['a'] = trim($row['a']);
                $alphs[] = $alph;
        }

	// success
	$a['status'] = 'ok';
	$a['list'] = $alphs;
	return $a;
}
?>
