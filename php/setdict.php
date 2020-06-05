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

	// convert input to associative array
	$aup = json_decode($up,TRUE);

	// insert or update the dict record
	$did = 0;
	if ($aup['trx'] == 'i') { // insert
		// verify the word is not already present
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
	}
	else if ($aup['trx'] == 'u') { // update
		// update the dict record
		$name = 'update-dict';
		$sql  = "update mai.dict set t=$2,tl=$3,tlm=$4,cp=$5,cpm=$6,g=$7,ru=$8 where id = $1";
		$params = array($aup['id'],$aup['t'],$aup['tl'],$aup['tlm'],$aup['cp'],$aup['cpm'],$aup['g'],$aup['ru']);
		$result = execSql($conn, $name, $sql, $params, true);
		if (!$result) {
			return $a;
		}
	}
	else {
		// note: do not delete a word or meaning if it is used in a story
		Log::write(LOG_WARNING, "invalid trx");	
		return $a;
	}
	
	// insert or update the mean records
	$updname = 'update-mean';
	$updsql  = "update mai.mean set p=$2,e=$3,d=$4 where id = $1";

	$insname = 'insert-mean';
	$inssql  = "insert into mai.mean (id,did,n,p,e,d) values ($1,$2,$3,$4,$5,$6)";

	foreach($aup['mean'] as $m) {
		if ($m['trx'] == 'i') { // insert
			$mid = getNextMeanId($conn);
			if ($mid < 0) {
				return $a;
			}
			$params = array($mid,$did,$m['n'],$m['p'],$m['e'],$m['d']);
			$result = execSql($conn, $insname, $inssql, $params, true);
		}
		else if ($m['trx'] == 'u') { // update
			$params = array($m['mid'],$m['p'],$m['e'],$m['d']);
			$result = execSql($conn, $updname, $updsql, $params, true);
		}
		if (!$result) {
			return $a;
		}
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
