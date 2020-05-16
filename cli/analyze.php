<?php
require_once(dirname(__FILE__).'/../../config.php');
require_once(dirname(__FILE__).'/../php/account/lib/log.php');
require_once(dirname(__FILE__).'/../php/account/lib/db.php');
Log::open('cli/analyze');
analyze();
Log::close("0");

/*
Cli PHP analyze

Build table of dict
Word, count float

Read each story
For each word in story, 1 + (loc.length * .5)
For each component, .5
Sort table by count
Find max count
Make formula for level from count
Update dict, set level.
Update story, set max level, avg level.

Add avglvl.maxlvl to summary.

*/

function analyze() {
	// get database connection
	$conn = getConnection();
	if (!$conn) {
		echo "no connection\n";
		return;
	}
	
	// read dict
	$name = 'query-dict';
	$sql = "select id from mai.dict";
	$params = array();
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
                echo "select failed\n";
		return;
	}

        // build array of dict words
	$adict = array();
        $numrows = pg_num_rows($result);
        for ($i=0; $i<$numrows; $i++) {
                $row = pg_fetch_array($result, $i, PGSQL_ASSOC);
		$id = $row['id'];
		$adict[$id] = array('cnt'=>0, 'lvl'=>0);
	}

	echo $adict[23]['lvl'];
	echo "\n";
}
?>
