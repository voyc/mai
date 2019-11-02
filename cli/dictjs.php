<?php
require_once(dirname(__FILE__).'/../../config.php');
require_once(dirname(__FILE__).'/../php/account/lib/log.php');
require_once(dirname(__FILE__).'/../php/account/lib/db.php');
Log::open('dictjs');
readdict();
Log::close("0");

function readdict() {
	// get database connection
	$conn = getConnection();
	if (!$conn) {
		echo "no connection\n";
		return;
	}
	
	// begin the output
	echo "voyc.dict = [\n";

	// read dict
	$name = 'query-dict';
	$sql = "select * from mai.thaidict";
	$params = array();
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
                echo "select failed\n";
		return;
	}

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
		$tm = $row['tonemark'];
		$tn = $row['tone'];
		$tl = $row['translit'];
		$ru = $row['rules'];
		$ns = $row['numsyllables'];
		$sn = $row['syllablendx'];
		$cp = $row['components'];
		$ps = $row['parse'];

		$d = str_replace( "'", "\\'", $d);
		if ($tm == ' ') {
			$tm = '';
		}
		if ($p == ' ') {
			$p = '';
		}
		if ($r == ' ') {
			$r = '';
		}
		if ($m == ' ') {
			$m = '';
		}
		if ($a == ' ') {
			$a = '';
		}
		if ($ps != 'm') {
			$a = '';
		}

		// output one row
		echo "{id:$id,g:'$g',t:'$t',s:$s,l:$l,n:$n,p:'$p',e:'$e',d:'$d',u:'$u',r:'$r',m:'$m',a:'$a',ns:$ns,";
		echo "lc:'$lc',fc:'$fc',vp:'$vp',tm:'$tm',tn:'$tn',tl:'$tl',ru:'$ru',sn:'$sn',cp:'$cp',ps:'$ps'},\n";
        }
	echo "];\n";
}
?>
