import configparser
import psycopg2
import json

def sortFreq(key):
	return freqtbl[key]
# open db
config = configparser.ConfigParser()
config.read('../../config.ini')
conn = psycopg2.connect(f"dbname={config['db']['name']} user={config['db']['user']} password={config['db']['password']} port={config['db']['port']}") 

# build freq table
freqtbl = {}
cur = conn.cursor()
id = 1
#cur.execute("SELECT words from mai.story where id = %s", (id,))
cur.execute("SELECT words from mai.story")
rows = cur.fetchall()
for row in rows:
	words = json.loads(row[0])
	for word in words:
		t = word['t']
		for loc in word['loc']:
			n = loc['n']
			if t in freqtbl:
				freqtbl[t] += 1
			else:
				freqtbl[t] = 1
			#print(f"{t} : {n} : {freqtbl[t]}")
		#print(f'{word}')
		#print('')
cur.close()

# print freq table
sorted = sorted(freqtbl, key=sortFreq, reverse=False)
for key in sorted:
	print(f'{key} : {freqtbl[key]}')
print(f'total words: {len(freqtbl)}')

conn.close()
