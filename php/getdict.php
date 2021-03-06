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
	if (!$lk){
		Log::write(LOG_WARNING, 'attempt with invalid parameter set');
		return $a;
	}

	$a = getdictsub($lk);

	return $a;
}

function getdictsub($ids) {
	// get database connection
	$conn = getConnection();
	if (!$conn) {
		return false;
	}

	// compose sql
	$bindvariables = array();

	$sql = 'select d.id,d.g,d.t,d.tl,d.tlm,d.cp,d.cpm,d.ru,m.id as mid,m.n,m.e,m.d,m.p,m.s,m.l';
	$sql .= ' from mai.mean m, mai.dict d';
	$sql .= ' where m.did = d.id'; 
	$sql .= " and d.id in ($ids)";
	$sql .= ' order by d.id, m.n;';

	// read dict/mean for query
	$name = 'query-join';
	$params = $bindvariables;
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
                return false;
	}

        // build array of output dict rows
        $dicts = array();
	$previd = 0;
        $numrows = pg_num_rows($result);
        for ($i=0; $i<$numrows; $i++) {
                $row = pg_fetch_array($result, $i, PGSQL_ASSOC);
 	
		$id = $row['id'];
		if ($id != $previd) {
			if ($previd > 0) {
                		$dicts[] = $dict;
			}
			$previd = $id;
                	$dict = array();
			$dict['id'] = $id;
			$dict['g'] = $row['g'];
			$dict['t'] = $row['t'];
			$dict['tl'] = $row['tl'];
			$dict['tlm'] = $row['tlm'];
			$dict['cp'] = $row['cp'];
			$dict['cpm'] = $row['cpm'];
			$dict['ru'] = $row['ru'];
			$dict['mean'] = array();
		}

		$mean = array();
		$mean['mid'] = $row['mid'];
		$mean['n'] = $row['n'];
		$mean['e'] = $row['e'];
		$mean['d'] = $row['d'];
		$mean['p'] = $row['p'];
		$mean['s'] = $row['s'];
		$mean['l'] = $row['l'];
		$dict['mean'][] = $mean;
        }

	// last one
	if ($previd > 0) {
		$dicts[] = $dict;
	}

	// success
	$a['status'] = 'ok';
	$a['list'] = $dicts;
	return $a;
}

//input $lk is a csv string of ids
function validateLookup($taint) {
	$clean = $taint;
	return $clean;
}
//function composeWhere($lk) {
//	return 'd.id in ('.$lk.')';
//}	
?>
