from flask import Flask
from flask.ext.cors import CORS
from Database import Database


database = Database()
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/', methods=['GET'])
def main_page():
	return 'Hello World!'

@app.route('/login/<user>', methods=['GET'])
def login(user):
	hashed_pass = database.get_salted_password(user)
	if hashed_pass is False:
		return "NA"
	return hashed_pass


@app.route('/register/<user>/<password>', methods=['POST'])
def register(user, password):
	database.register(user, password)


@app.route('/get_events/<user>/<latitude>/<longitude>')
def get_events(latitude, longitude, max_dist = 5):
	events = database.get_events(user, latitude, longitude, max_dist)
	return events


@app.route('/post_event/<user>/<name>/<visibility>/<etype>/<latitude>/<longitude>/<duration>')
def post_event(user, name, visibility, etype, latitude, longitude, duration):
	print "Creating event: " + name
	event_id = database.post_event(user, name, visibility, etype, latitude, longitude, duration)
	return str(event_id)


@app.route('/cancel_event/<user>/<event_id>', methods=['POST'])
def cancel_event(user, event_id):
	database.cancel_event(user, event_id)


if __name__ == '__main__':
	app.run()

