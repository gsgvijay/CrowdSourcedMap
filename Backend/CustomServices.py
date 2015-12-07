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
		return "0"
	return hashed_pass


@app.route('/register/<user>/<password>')
def register(user, password):
	status = database.register(user, password)
	if status is False:
		return "0"
	else:
		return "1"


@app.route('/get_events/<user>/<ne_lat>/<ne_lng>/<sw_lat>/<sw_lng>')
def get_events(user, ne_lat, ne_lng, sw_lat, sw_lng):
	events = database.get_events(user, float(ne_lat), float(ne_lng), float(sw_lat), float(sw_lng))
	return events


@app.route('/post_event/<user>/<name>/<visibility>/<etype>/<latitude>/<longitude>/<duration>')
def post_event(user, name, visibility, etype, latitude, longitude, duration):
	print "Creating event: " + name
	event_id = database.post_event(user, name, visibility, etype, latitude, longitude, duration)
	return str(event_id)


# The Cancel event has not yet been implemented
'''@app.route('/cancel_event/<user>/<event_id>', methods=['POST'])'''
def cancel_event(user, event_id):
	database.cancel_event(user, event_id)


@app.route('/add_circle/<user>/<other_user>/<relationship_type>')
def add_circle(user, other_user, relationship_type):
	if database.is_existent(other_user):
		database.add_to_circles(user, other_user, relationship_type)
		return "1"
	else:
		return "0"


@app.route('/get_ratings/<user>')
def get_ratings(user):
	print "Getting the rating for the user"
	ratings = database.get_ratings(user)
	return str(ratings)


if __name__ == '__main__':
	app.run()

