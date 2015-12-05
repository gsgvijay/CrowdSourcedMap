''' A class to handle all the database operations
'''
import pymongo
from datetime import datetime, timedelta
from bson import objectid

class Database():
	client = None
	
	def __init__(self):
		# Create a database and other such boiler-plate stuff
		print "Initializing db..."
		self.client = pymongo.MongoClient("localhost", 27017)
		self.circles = ['close', 'friends', 'family', 'others']
		print "Success"
	

	def get_salted_password(self, user):
		print "Retreiving the user's salted (hashed) password from the db..."
		if user not in self.client.database_names():
			print "User: " + user + " not found in the database"
			return False
		# Access the database for the user to get the salted/hashed password
		database = self.client[user]
		meta_collection = database['metadata']
		salted_password = (meta_collection.find_one({'name': user}))['password']
		print "Success"
		return salted_password
	

	def register(self, user, password, mail):
		# Create table(s) for the user and store his/her password
		print "Registering new user..."
		if user in self.client.database_names():
			print "User name already exists"
			return False
		database = self.client[user]
		meta_collection = database['metadata']
		meta_doc = {'name': user, 'password': password, 'mail': mail, 'votes': 0}
		meta_collection.insert_one(meta_doc)
		print "Success"
		return True
	

	def get_events(self, user, ne_lat, ne_lng, sw_lat, sw_lng):
		# Get all visible events for the user within his/her range specified by the max distance
		lat_lng_type = [];
		database = self.client[user]
		for circle in self.circles:
			if database[circle].count() > 0:
				docs = database[circle].find()
				for doc in docs:
					lat = int(doc['latitude'])
					lng = int(doc['longitude'])
					etype = doc['type']
					if lat>=sw_lat and lat<=ne_lat and lng>=sw_lng and lng<=ne_lng:
						lat_lng_type.append([lat, lng, etype])

		database = self.client['public']
		collection = database['all']
		if collection.count() > 0:
			docs = collection.find()
			for doc in docs:
				lat = int(doc['latitude'])
				lng = int(doc['longitude'])
				etype = doc['type']
				if lat>= sw_lat and lat<=ne_lat and lng>=sw_lng and lng<=ne_lng:
					lat_lng_type.append([lat, lng, etype])

		return lat_lng_type


	def post_event(self, user, name, visibility, etype, latitude, longitude, duration):
		# Create a new event for the user with the specified arguments
		print "Creating new event for the user"
		database = self.client[user]
		user_events = database['events']
		print duration
		event_doc = {'name':name,'visibility':visibility,'type':etype,'latitude':latitude,'longitude':longitude,'expireAfterSeconds':int(duration)}
		print event_doc
		user_events.insert_one(event_doc)
		user_event_object_id = str((user_events.find_one(event_doc))['_id'])
		print user_event_object_id

		print "Success"
		return user_event_object_id


	def cancel_event(self, user, event_id):
		# Cancel the required event
		print "Cancelling an event for the user"
		database = self.client[user]
		user_events = database['events']
		user_events.delete_one({'_id': objectid.ObjectId(event_id)})
		
		database = self.client['all_events']
		events_collection = database['events']
		events_collection.delete_one({'user_event_id': objectid.ObjectId(event_id)})
		print "Success"


	def add_to_circles(self, current_user, other_user, relationship_type=None):
		# Add a user to the current user's circles
		print "Adding another user to the current user's circles"
		if current_user not in self.client.database_names() or other_user not in self.client.database_names():
			print "Either or both users are not found in the database"
			return False

		database = self.client[current_user]

		if relationship_type in self.circles:
			coll_name = relationship_type
		else:
			coll_name = 'others'

		collection = database[coll_name]
		collection.insert_one({'name': other_user})

		print "Succes"
		return True


	def post_to_circles(self, current_user, event_id, visibility, latitude, longitude, etype, duration):
		doc = {'user':current_user, 'event_id':event_id, 'latitude':latitude, 'longitude':longitude, 'type':etype, 'expireAfterSeconds': int(duration)*3600}
		if visibility is 'public':
			database = self.client['public']
			collection = database['all']
		else:
			database = self.client[current_user]
			collection = database[visibility]
		collection.insert_one(doc);
		return True
