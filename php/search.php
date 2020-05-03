<?php
/*
	svc search
	Read and return dict/mean records for requested lookup.
*/
require_once('getdict.php');
function search() {
	$a = array(
		'status' => 'system-error'
	);

	// raw inputs
	$taint_lk = isset($_POST['lk']) ? $_POST['lk'] : 0;

	// validate inputs
	$lk = validateLookup($taint_lk);

	// validate parameter set
	if (!$lk){
		Log::write(LOG_WARNING, 'attempt with invalid parameter set');
		return $a;
	}

	// get database connection
	$conn = getConnection();
	if (!$conn) {
		return $a;
	}

	// compose sql
	$cw = composeWhere($lk);
	$whereclause = $cw[0];	
	$bindvariables = $cw[1];

	$sql = 'select d.id,d.g,d.t,d.tl,d.tlm,d.cp,d.cpm,d.ru,m.id as mid,m.n,m.e,m.d,m.p,m.s,m.l';
	$sql .= ' from mai.mean m, mai.dict d';
	$sql .= ' where m.did = d.id'; 
	$sql .= " and $whereclause";
	$sql .= " order by d.id, m.n;";

	// read dict/mean for query
	$name = 'query-dict';
	$params = $bindvariables;
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
                return $a;
	}

        // build array of output flat rows
        $flats = array();
        $ids = '';
	$previd = 0;
        $numrows = pg_num_rows($result);
        for ($i=0; $i<$numrows; $i++) {
                $row = pg_fetch_array($result, $i, PGSQL_ASSOC);
 	
		$id = $row['id'];
                $dict = array();
		$dict['id'] = $id;
		$dict['g'] = $row['g'];
		$dict['t'] = $row['t'];
		$dict['tl'] = $row['tl'];
		$dict['tlm'] = $row['tlm'];
		$dict['cp'] = $row['cp'];
		$dict['cpm'] = $row['cpm'];
		$dict['ru'] = $row['ru'];

		$mean = array();
		$mean['mid'] = $row['mid'];
		$mean['n'] = $row['n'];
		$mean['e'] = $row['e'];
		$mean['d'] = $row['d'];
		$mean['p'] = $row['p'];
		$mean['s'] = $row['s'];
		$mean['l'] = $row['l'];

                $flat = array();
		$flat['id'] = $id;
		$flat['t'] = $row['t'];
		$flat['n'] = intval($row['n']);
		$flat['dict'] = $dict;
		$flat['mean'] = $mean;

		$flats[] = $flat;

		if ($ids) $ids .= ',';
		$ids .= $id;
        }

	$dict = getdictsub($ids);

	// success
	$a['status'] = 'ok';
	$a['flat'] = $flats;
	$a['dict'] = $dict['list'];
	return $a;
}

function isEnglish($s) {
	return (!preg_match('/[^A-Za-z]/', $s));
}
function isId($s) {
	return (!preg_match('/[^0-9]/', $s));
}
function whatType($s) {
	$r = false;
	if (isEnglish($s)) {
		$r = 'e';
	}
	else if (isId($s)) {
		$r = 'i';
	}
	else {
		$r = 't';
	}
	return $r;
}

function composeWhere($lk) {
	$s = '';
	$a = array();

	switch (whatType($lk)) {
		case 'e':
			$s = "(m.e like $1 or m.d like $1)";
			$a[] = "%$lk%";
			break;
		case 't':
			$s = "d.t like $1";
			$a[] = "%$lk%";
			break;
		case 'i':
			$s = "d.id = $1";
			$a[] = $lk;
			break;
	}
	return [$s,$a];
}

?>
