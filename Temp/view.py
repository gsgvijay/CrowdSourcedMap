from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
	return 'Hello World!'

@app.route('/login/<username>/<password>')
def login(username, password):
	return username + ":" + password

@app.route('/get/more')
def get_more():
	return 'You get what you paid for!'

if __name__ == '__main__':
	app.run()
