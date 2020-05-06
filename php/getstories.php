<?php
/*
	svc getstories
	Read and return story for logged-in user.
*/
function getstories() {
	$a = array(
		'status' => 'system-error'
	);

	// get database connection
	$conn = getConnection();
	if (!$conn) {
		return $a;
	}

	// read story
	$name = 'query-story';
	$sql = "select id,authorid,title,language from mai.story";
	$params = array();
	$result = execSql($conn, $name, $sql, $params, false);
	if (!$result) {
                return $a;
	}

        // build array of stories
        $stories = array();
        $numrows = pg_num_rows($result);
        for ($i=0; $i<$numrows; $i++) {
                $row = pg_fetch_array($result, $i, PGSQL_ASSOC);
                $story = array();
		$story['id'] = $row['id'];
		$story['aid'] = $row['authorid'];
		$story['title'] = $row['title'];
		$story['lang'] = $row['language'];
                $stories[] = $story;
        }

	// success
	$a['status'] = 'ok';
	$a['list'] = $stories;
	return $a;
}
?>
