<?php
/*
	svc setvocab
	Save vocab for logged-in user.
*/
function setvocab() {
	$a = array(
		'status' => 'system-error'
	);

        // raw inputs
        $taint_si = isset($_POST['si']) ? $_POST['si'] : 0;
        $taint_language = isset($_POST['language']) ? $_POST['language'] : '';
        $taint_list  = isset($_POST['list'] ) ? $_POST['list']  : '';

        // validate inputs
        $si = validateToken($taint_si);
        $language = validateLanguage($taint_language);
        $list = validateList($taint_list );

        // validate parameter set
        if (!$si){
                Log::write(LOG_WARNING, 'attempt with invalid parameter set');
                return $a;
        }
        if (!$language && !$list) {
                Log::write(LOG_WARNING, 'no inputs');
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

	//loop through list
	$alist = json_decode($list);
	for ($i=0; $i<count($alist); $i++) {
		$m = $alist[$i];
		$word = $m->w;
		$recency = $m->r;
		$mastery = $m->m;
		$state = $m->s;
		$type = $m->t;
        	Log::write(LOG_INFO, 'write: ' . $word);
	
		// attempt to read vocab record
		$language = 'th';
		$vocabid = 0;
		$name = 'query-vocab';
		$sql = "select id from mai.vocab where userid = $1 and word = $2 and language = $3 and type = $4";
		$params = array($userid, $word, $language, $type);
		$result = execSql($conn, $name, $sql, $params, false);
		if ($result) {
			$row = pg_fetch_array($result, 0, PGSQL_ASSOC);
			$vocabid = $row['id'];
		}

		// insert or update vocab
		$a['status'] = 'ok';
		if ($vocabid) {
			$name = 'update-vocab';
			$sql = "update mai.vocab set state=$2, mastery=$3, recency=$4 where id = $1";
			$params = array($vocabid, $state, $mastery, $recency);
			$result = execSql($conn, $name, $sql, $params, true);
			if (!$result) {
				Log::write(LOG_WARNING, "$name failed");
				$a['status'] = 'failed';
			}
		}
		else {
			$name = 'insert-vocab';
			$sql = "insert into mai.vocab (userid, word, language, type, state, mastery, recency) values ($1,$2,$3,$4,$5,$6,$7)";
			$params = array($userid, $word, $language, $type, $state, $mastery, $recency);
			$result = execSql($conn, $name, $sql, $params, true);
			if (!$result) {
				Log::write(LOG_WARNING, "$name failed");
				$a['status'] = 'failed';
			}
		}
	}

	// success
	return $a;
}

function validateLanguage($taint) {
        $clean = false;
        if ($taint == 'th') {
                $clean = $taint;
        }
        return $clean;
}

function validateList($taint) {
        $clean = false;
        $clean = $taint;
        return $clean;
}
?>
