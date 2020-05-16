<?php
require_once(dirname(__FILE__).'/../../config.php');
require_once(dirname(__FILE__).'/../php/account/lib/log.php');
require_once(dirname(__FILE__).'/../php/account/lib/db.php');

Log::open('cli/components');
components();
Log::close("0");

/*
update story set components = array of word/count
To get components, loop thru words repeatedly.
Look up the word
Push each component to an array
Make a new array
Loop thru previous array
Array of arrays
Array[0] id, word, loc.length
Select cp, lvl
Array[1] id, word, count
Select cp, lvl
Array[2] id, word, count
Select cp, lvl
Make arrays until count 0
Combine all arrays


server-side components handling
needs to be done whenever dictionary is changed
maybe. but also, whenever a dictionary word is added, the user also adds the components.
should components be saved by id or th?
	maybe it is wrong to have two unique keys to the dict table?
assembleComponentsDict = function() {
assembleComponentsStory = function() {
*/

function components() {
	// get database connection
	$conn = getConnection();
	if (!$conn) {
		echo "no connection\n";
		return;
	}
echo 1;	
	// read story
	$name = 'query-story';
	$sql = "select words from mai.story";
	$params = array();
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
                echo "select story failed\n";
		return;
	}
echo 2;
	// assemble components for each story
        $numrows = pg_num_rows($result);
        for ($i=0; $i<$numrows; $i++) {
                $row = pg_fetch_array($result, $i, PGSQL_ASSOC);
		$words = $row['words'];
		$components = assembleComponents($words);
	}
echo 3;
	// update story

	print_r($components[3]);
	echo $numrows . " stories complete\n";
}

// assemble Components for one story
function assembleComponents($words) {
	$awork = array();
	$n = 0;
	$awork[$n] = array();
	$awork[$n][] = 

	$ids = '(';
	$a = json_decode($words);
        foreach ($a as $w) {
		$id = $w['id'];
		$t = $w['t'];
		$n = count($w['loc']);
		$ids[] = $id;
	}
	$sids = implode(',', $ids);
	return $components
}

function readComponents($sids) {
	// read dict
	$name = 'query-dict';
	$sql = "select cp from mai.dict where id in (".$sids.");)";
	$params = array();
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
                echo "select cp failed\n";
		return;
	}

        // build array of cp
	$components = array();
        $numrows = pg_num_rows($result);
        for ($i=0; $i<$numrows; $i++) {
                $row = pg_fetch_array($result, $i, PGSQL_ASSOC);
		$cp = $row['cp'];
		$acp = explode(',', $cp);
		$components = mergeArrays($components, $acp);
	}
	return $components;
}

function mergeArrays($c,$a) {
	$big = $c;
	foreach ($a as $w) {
		if (in_array($w, $big) {
			$big[$w]++;
		}
		else {
			$big[$w] = 1;
		}
	}
	return $big;
}

?>
