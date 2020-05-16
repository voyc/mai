<?php
/*
	subcompsone, svc subroutine
	Assemble components of one story.
*/
function getCompsForOneStory($conn, $id) {
	$comps = array();

	$comps[] = 'word';
	$comps[] = 'syll';
	$comps[] = 'up';

	return $comps;
}
?>
