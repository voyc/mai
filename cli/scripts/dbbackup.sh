# 
#  table thaidict is static
#  tables vocab and profile are dynamically updated by users
#
#  -Fp format plain-text SQL script file
#  -b  include blobs
#  -O  do NOT output commands to alter ownership of objects.  User running the command will have ownership of all the objects.
#  --column-inserts  dump data as insert statements with explicit column names
#
pg_dump -Fp -b -O --column-inserts -U voyccom_jhagstrand -n mai -f /home/voyccom/db_backup/mai-backup.`date +%Y%m%d`.`date +%H%M%S`.sql voyccom_mai
