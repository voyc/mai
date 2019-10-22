<?php
require_once(dirname(__FILE__).'/../../config.php');
require_once('account/lib/db.php');
require_once('account/lib/log.php');

writeHeader();
Log::open('dictjs');
readdict();
Log::close();
/*
	svc getdict
	Read and return dict as js array.
*/
function readdict() {
	$a = array(
		'status' => 'system-error'
	);

	// get database connection
	$conn = getConnection();
	if (!$conn) {
		return $a;
	}

	// read dict
	$name = 'query-dict';
	$sql = "select * from mai.dict";
	$params = array($userid);
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
                return $a;
	}

	// begin the output
	echo $callback.'({data:[';
	
        // build array of dict words
        $numrows = pg_num_rows($result);
        for ($i=0; $i<$numrows; $i++) {
                $row = pg_fetch_array($result, $i, PGSQL_ASSOC);
		$id = $row['id'];
		$g = $row['type'];
		$t = $row['thai'];
		$s = $row['source'];
		$l = $row['level'];
		$n = $row['numdef'];
		$p = $row['pos'];
		$e = $row['eng'];
		$d = $row['details'];
		$u = $row['unicode'];
		$r = $row['reference'];
		$m = $row['class'];
		$a = $row['subclass'];
		$lc = $row['leadingconsonant'];
		$fc = $row['finalconsonant'];
		$vp = $row['vowelpattern'];
		$tn = $row['tone'];
		$ra = $row['rules'];
		$ns = $row['numsyllables'];
		$cp = $row['components'];

		// output one row
		echo "{id:$id,g:'$g',t:'$t',s:$s,l:$l,n:$n,p:'$p'},\n";

        }

	// end the output
	echo "]});";
}
?>

/*
		// put a comma between records
		if ($outcount > 0) {
			echo ",";
		}

		// begin the placemark
		echo $id.":{b:$b,e:$e,h:\"$h\",c:$c,f:$f,gn:$gn,gs:$gs,ge:$ge,gw:$gw,mlh:$mlh,mll:$mll,tlh:$tlh,tll:$tll,mt:$mt,tt:$tt,dt:$dt,tu:\"$tu\",mag:$mag,p:[";


		// finish the placemark
		echo "]}\n";
		$outcount++;
	}
	// finish the output
	$executionTime = microtime(true) - $executionTime;
	$sbounds = "{q:'".$bounds['q']."',qm:'".$bounds['qm']."',begin:".$bounds['begin'].",end:".$bounds['end'].",n:".$bounds['n'].",s:".$bounds['s'].",w:".$bounds['w'].",e:".$bounds['e'].",cid:".$bounds['cid']."}";
	echo "},rf:$rf,count:$outcount,bounds:$sbounds,executionTime:$executionTime});";
	return;
*/
