import os
import sys

sys.path.insert(0, os.path.dirname(__file__))


def application(environ, start_response):
	ev = f'{environ}'
	start_response('200 OK', [('Content-Type', 'text/html')])
	#fname = environ['REQUEST_URI']
	message = '<img src="http://mai.voyc.com/i/plot.png">'
	version = 'Python %s\n' % sys.version.split()[0]
	response = '\n'.join([message, version, ev])
	return [response.encode()]
