psql -U voyccom_jhagstrand -d voyccom_mai -c "select id,thai,numdef,pos,eng,details from mai.thaidict where id in (300,301,302,436,425,1229,287)"
psql -U voyccom_jhagstrand -d voyccom_mai -c "update mai.thaidict set eng='[polite male]' where id in (287)"
psql -U voyccom_jhagstrand -d voyccom_mai -c "update mai.thaidict set eng='[polite female]' where id in (300,301)"
psql -U voyccom_jhagstrand -d voyccom_mai -c "update mai.thaidict set eng='[soft]' where id in (302)"
