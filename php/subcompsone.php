<?php
/*
	subcompsone, svc subroutine
	Assemble components of one story.
*/
function getCompsForOneStory($conn, $words) {
	// start with words array
	$comps = json_decode($words, true);

	// initialize the source array
        foreach ($comps as $key => $w) {
		$t = $w['t'];
		$n = count($w['loc']);
		$source[$t] = $n;
	}

	// prepare the sql
	$name = 'querydictcp';
	$sql = "select cp from mai.dict where (g='m' or g='x') and t = any ($1);";
	$stmt = @pg_prepare($conn, $name, $sql);
	if (!$stmt) {
		Log::write(LOG_ERR, $name.' prepare failed');
		return false;
	}

	// combine multiple levels of components into the components-array
	$components = array();
	$dest = readComponents($conn, $name, $source);	
	$runaway = 10;
	while ($dest && count($dest) && --$runaway > 0) {
		$components = mergeArrays($components, $dest);
		$source = $dest;
		$dest = readComponents($conn, $name, $source);
		if ($dest === false) {
			return false;
		}
	}

	// read dict for all comps
	$str = composeArrayLiteral($components);
	$name = 'querydictbyt';
	$sql = "select id,t,tl,lvl from mai.dict where t = any ($1);";
	$params = array($str);
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
		Log::write(LOG_ERR, $name.' failed');
		return $a;
	}
	$numrows = pg_num_rows($result);

	// build a word object for each component
	for ($i=0; $i<$numrows; $i++) {
		$row = pg_fetch_array($result, $i, PGSQL_ASSOC);
		$id = $row['id'];
		$t  = $row['t'];
		$tl = $row['tl'];
		$lvl= $row['lvl'];
		$comp = $components[$t];
		$comps[] = array(
			'id'=>$id,
			't'=>$t,
			'tl'=>$tl,
			'comp'=>$comp,
		);
	}
	return $comps;
}

function composeArrayLiteral($a) {
	// compose sql array literal from input array
	$at = array();
	foreach ($a as $t => $n) {
		$k = str_replace('"','\"',$t); // escape double-quote
		$at[] = '"'.$k.'"';
	}
	$sat = join(',',$at);
	$arrayliteral = "{" . $sat . "}";
	return $arrayliteral;
}

function readComponents($conn, $name, $source) {
	// compose sql array literal from input array
	$arrayliteral = composeArrayLiteral($source);

	// execute the prepared statement
	$params = array($arrayliteral);
	$result = @pg_execute($conn, $name, $params);
	if (!$result) {
		Log::write(LOG_ERR, $name.' execute failed '.$arrayliteral);
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

function usecount($word) {
	// how many times is a word used in the story
	$usedasword = count($word['loc']);
	$usedascomp = word['comp'];
	$simple = $word['comp'] + count($word['loc']);
	$complex = 1 + (((count($word['loc']) - 1) * .5) + ($word['comp'] * .5));
	return $simple;
}

/*
	if words is null, read it from the story
	option to rewrite the story
	comps must be recalculated everytime the dict changes
	locs and comps must be recalculated everytime the story changes
	
	calibrate level of each word in dict
	usecount of each word in each story
	total usecount of each word in all stories
	interpolate to 1-100 scale
*/
?>
