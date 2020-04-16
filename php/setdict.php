<?php
/*
	svc setdict
	Insert, update, or delete a dict record and it's means.


	copied from setvocab.php
	in-progress


*/
function setdict() {
	$a = array(
		'status' => 'system-error'
	);

        // raw inputs
        $taint_si = isset($_POST['si']) ? $_POST['si'] : 0;
        $taint_up = isset($_POST['up']) ? $_POST['up'] : '';

        // validate inputs
        $si = validateToken($taint_si);
        $up = validateUp($taint_up);

        // validate parameter set
        if (!$si || !$up){
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

	// get input data
	$oup = json_decode($up);

	// convert objects to array
	$aup = (array) $oup;
	for ($i = 0; $i < count($aup['mean']); $i++) {
		$aup['mean'][$i] = (array)$aup['mean'][$i];
	}
/*
Array
(
    [t] => รอ
    [tlm] => a
    [tl] => 
    [cpm] => a
    [cp] => o
    [g] => o
    [ru] => cciov
    [trx] => i
    [mean] => Array
        (
            [0] => Array
                (
                    [n] => 0
                    [p] => prep
                    [e] => o
                    [d] => j
                    [s] => 0
                    [l] => 500
                    [trx] => i
                )

        )

)
*/

/*
if insert
	err if pre-existing dict
	err if mean.n not sequential beginning with 1
	insert all
if update
	err if not pre-existing dict
	update dict	
	loop thru mean's, for each
		read by mid/n
		trx code must be i,u,d
		if i
			err if pre-existing
			insert mean rec
		if u
			err if not pre-existing
			update mean rec
		if d
			cannot delete unless use-count is zero
			delete mean rec
alter table mai.mean add column u integer;
if delete
	can delete only if use-counts are zero
	err if no pre-existing
	delete dict
	delete all means by did
if noaction
	skip, update means only
*/

	if ($aup['trx'] == 'i') {
		// attempt to read dict record by word
		$did = 0;
		$name = 'query-dict';
		$sql = "select id from mai.dict where t = $1";
		$params = array($aup['t']);
		$result = execSql($conn, $name, $sql, $params, false);
		if ($result && pg_num_rows($result) > 0) {
			$row = pg_fetch_array($result, 0, PGSQL_ASSOC);
			$did = $row['id'];
		}
		if ($did > 0) {
			Log::write(LOG_WARNING, "attempt to insert pre-existing dict ".$aup['t']);
			return $a;
		}
	
		// get the next dict id
		$name = 'get-next-dict-id';
		$sql = "select nextval('mai.dict_id_seq')";
		$params = array();
		$result = execSql($conn, $name, $sql, $params, true);
		if (!$result) {
			return $a;
		}
		$row = pg_fetch_array($result, 0, PGSQL_ASSOC);
		$did = $row['nextval'];
	
		// write the dict record
		$name = 'insert-dict';
		$sql  = "insert into mai.dict (id,t,tl,tlm,cp,cpm,g,ru) values ($1,$2,$3,$4,$5,$6,$7,$8)";
		$params = array($did,$aup['t'],$aup['tl'],$aup['tlm'],$aup['cp'],$aup['cpm'],$aup['g'],$aup['ru']);
		$result = execSql($conn, $name, $sql, $params, true);
		if (!$result) {
			return $a;
		}
	
		// write the mean records
		$name = 'insert-mean';
		$sql  = "insert into mai.mean (id,did,n,p,e,d,s,l) values ($1,$2,$3,$4,$5,$6,$7,$8)";
	
		foreach($aup['mean'] as $m) {
			$mid = getNextMeanId($conn);
			if ($mid < 0) {
				return $a;
			}
			$params = array($mid,$did,$m['n'],$m['p'],$m['e'],$m['d'],$m['s'],$m['l']);
			$result = execSql($conn, $name, $sql, $params, true);
			if (!$result) {
				return $a;
			}
		}
	}
	else if ($aup['trx'] == 'u') {
	}
	else if ($aup['trx'] == 'd') {
	}
	else {
		Log::write(LOG_WARNING, "invalid trx");	
		return $a;
	}

	// success
	$a['status'] = 'ok';
	return $a;
}

function validateUp($taint) {
        $clean = false;
        $clean = $taint;
        return $clean;
}

function getNextMeanId($conn) {
	$name = 'get-next-mean-id';
	$sql = "select nextval('mai.mean_id_seq')";
	$params = array();
	$result = execSql($conn, $name, $sql, $params, true);
	if (!$result || pg_num_rows($result) <= 0) {
		return -1;
	}
	$row = pg_fetch_array($result, 0, PGSQL_ASSOC);
	$mid = $row['nextval'];
	return $mid;
}
?>
