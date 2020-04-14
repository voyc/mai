<?php
/*
	svc getdict
	Read and return dict/mean records for requested lookup.
*/
function getdict() {
	$a = array(
		'status' => 'system-error'
	);

	// raw inputs
	$taint_si = isset($_POST['si']) ? $_POST['si'] : 0;
	$taint_lk = isset($_POST['lk']) ? $_POST['lk'] : 0;

	// validate inputs
	$si = validateToken($taint_si);
	$lk = validateLookup($taint_lk);

	// validate parameter set
	if (!$si){
		Log::write(LOG_WARNING, 'attempt with invalid parameter set');
		return $a;
	}
	//$numParm = $i + $e $t	
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
	$cw = composeWhere($lk);
	$whereclause = $cw[0];	
	$bindvariables = $cw[1];

	$sql = 'select d.id, m.n, d.t, m.e';
	$sql .= ' from mai.mean m, mai.dict d';
	$sql .= ' where m.did = d.id'; 
	$sql .= " and $whereclause;";
	// example lk: เรียน,six,blue/4,ขา/3,245,477/3
	// result: and ((d.t='เรียน') or (m.e='six') or (m.e='blue' and m.n=4) or (d.t='ขา' and m.n=3) or (d.id=245) or (d.id=477 and m.n=3));

	// read dict/mean for query
	$name = 'query-dict';
	$params = $bindvariables;
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
                return $a;
	}

        // build array of output dict rows
        $dicts = array();
        $numrows = pg_num_rows($result);
        for ($i=0; $i<$numrows; $i++) {
                $row = pg_fetch_array($result, $i, PGSQL_ASSOC);
                $dict = array();
		$dict['id'] = $row['id'];
		$dict['n'] = $row['n'];
		$dict['t'] = $row['t'];
		$dict['e'] = $row['e'];
                $dicts[] = $dict;
        }

	// success
	$a['status'] = 'ok';
	$a['list'] = $dict;
	return $a;
}

function validateLookup($taint) {
	$clean = $taint;
	//input may be an array or a single item
	//each item may be a thai word, an english word, an id
	//and each item may be appended with /n where n is the numdef
	return $clean;
}

function isEnglish($s) {
	return (!preg_match('/[^A-Za-z0-9]/', $s));
}

function isId($s) {
	return (!preg_match('/[^0-9]\//', $s));
}

function whatType($s) {
	$r = false;
	if (isEnglish($s)) {
		$r = 'm.e';
	}
	else if (isId($s)) {
		$r = 'd.i';
	}
	else {
		$r = 'd.t';
	}
	return $r;
}

function composeWhere($s) {
	$w = '';
	$a = explode(',',$s);
	$b = 1;
	$bind = array();
	foreach ($a as $v) {
		if ($w) {
			$w .= ' or ';
		}
		$a2 = explode('/',$v);
		$v = $a2[0];
		$f = whatType($v);
		$w .= "($f = \$$b";
		$b++;
		$bind[] = $v;	
		if (count($a2) > 1) {
			$w .= "and m.n = \$$b";
			$b++;
			$bind[] = $a2[1];
		}
		$w .= ')';
	}
	return [$w, $bind];
}	

?>
