<?php
/*
	svc setstory
	Save story for logged-in user.
*/
function setstory() {
	$a = array(
		'status' => 'system-error'
	);

        // raw inputs
        $taint_si = isset($_POST['si']) ? $_POST['si'] : 0;
        $taint_id = isset($_POST['id']) ? $_POST['id'] : '';
        $taint_language = isset($_POST['language']) ? $_POST['language'] : '';
        $taint_title = isset($_POST['title']) ? $_POST['title'] : '';
        $taint_original = isset($_POST['original']) ? $_POST['original'] : '';
        $taint_words = isset($_POST['words']) ? $_POST['words'] : '';

        // validate inputs
        $si = validateToken($taint_si);
        $id = validateId($taint_id);
        $language = validateLanguage($taint_language);
        $title = validateThaiText($taint_title);
        $original = validateThaiText($taint_original);
        $words = validateArray($taint_words);

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
	$authorid = $row['id'];

	if ($id) {
		$name = 'update-story';
		$sql = "update mai.story set title=$2, original=$3, words=$4 where id = $1";
		$params = array( $id, $title, $original, $words);
		$result = execSql($conn, $name, $sql, $params, true);
		if (!$result) {
			Log::write(LOG_WARNING, "$name failed");
			$a['status'] = 'failed';
		}
	}
	else {
		$name = 'insert-story';
		$sql = "insert into mai.story (authorid, language, title, original, words) values ($1,$2,$3,$4)";
		$params = array($authorid, $language, $title, $original, $words);
		$result = execSql($conn, $name, $sql, $params, true);
		if (!$result) {
			Log::write(LOG_WARNING, "$name failed");
			$a['status'] = 'failed';
		}
	}

	// success
	$a['status'] = 'ok';
	return $a;
}

function validateLanguage($taint) {
        $clean = false;
        if ($taint == 'th') {
                $clean = $taint;
        }
        return $clean;
}

function validateThaiText($taint) {
	$clean = false;
	$clean = $taint;
	return $clean;
}

function validateId($taint) {
	$clean = false;
	if (is_numeric($taint)) {
		$clean = $taint;
	}
	return $clean;
}

function validateArray($taint) {
	$clean = false;
	$clean = $taint;
	return $clean;
}
?>
