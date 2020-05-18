<?php
/*
	subcompsone, svc subroutine
	Assemble components of one story.
*/
function getCompsForOneStory($conn, $words) {
	// convert input string to array
	$source = array();
	$a = json_decode($words);
        foreach ($a as $key => $w) {
		$t = $w->t;
		$n = count($w->loc);
		$source[$t] = $n;
	}

	// prepare the sql
	$name = 'querydictcp';
	$sql = "select cp from mai.dict where (g='m' or g='x') and t = any ($1);";
	$stmt = @pg_prepare($conn, $name, $sql);
	if (!$stmt) {
		Log::write(LOG_ERROR, $name.' prepare failed');
		return false;
	}

	// combine multiple levels of components into the components-array
	$components = array();
	$dest = readComponents($conn, $name, $source);	
	$runaway = 10;
	while (count($dest) && --$runaway > 0) {
		$components = mergeArrays($components, $dest);
		$source = $dest;
		$dest = readComponents($conn, $name, $source);
		if ($dest === false) {
			return false;
		}
	}
	return $components;
}

function readComponents($conn, $name, $source) {
	// compose sql array literal from input array
	$at = array();
	foreach ($source as $t => $n) {
		$at[] = '"'.$t.'"';
	}
	$sat = join(',',$at);
	$arrayliteral = "{" . $sat . "}";

	// execute the prepared statement
	$params = array($arrayliteral);
	$result = @pg_execute($conn, $name, $params);
	if (!$result) {
		Log::write(LOG_ERROR, $name.' execute failed');
		return false;
	}
	$numrows = pg_num_rows($result);

        // build array of cp
	$a = array();
        for ($i=0; $i<$numrows; $i++) {
                $row = pg_fetch_array($result, $i, PGSQL_ASSOC);
		$cp = $row['cp'];
		if (!strlen($cp)) {
			continue;
		}
		$acp = csvToArray($cp);
		$a = mergeArrays($a, $acp);
	}
	return $a;
}

function csvToArray($csv) {
	$a = array();
	$ax = explode(',', $csv);
	foreach ($ax as $x) {
		$a[$x] = 1;
	}
	return $a;	
}

function mergeArrays($c,$a) {
	$ra = $c;
	$runaway = 1000;
	foreach ($a as $w => $n) {
		if ($runaway-- <= 0) {
			break;
		}
		if (array_key_exists($w, $ra)) {
			$ra[$w]++;
		}
		else {
			$ra[$w] = $n;
		}
	}
	return $ra;
}
?>
