''' A class to handle all the database operations
'''
import pymongo
from datetime import datetime, timedelta
from bson import objectid

class Database():
	client = None
	
	def __init__(self):
		# Create a database and other such boiler-plate stuff
		self.client = pymongo.MongoClient("localhost", 27017)
	

	def get_salted_password(self, user):
		# Access the database for the user to get the salted/hashed password
		database = self.client[user]
		meta_collection = database['metadata']
		salted_password = (meta_collection.find_one('name': user))['password']
		return salted_password
	

	def register(self, user, password, mail):
		# Create table(s) for the user and store his/her password
		if user in self.client.database_names():
			return False
		database = self.client[user]
		meta_collection = database['metadata']
		meta_doc = {'name': user, 'password': password, 'mail': mail, 'votes': 0}
		meta_collection.insert_one(meta_doc)
		return True
	

	def get_events(self, user, latitude, longitude, max_distance):
		# Get all visible events for the user within his/her range specified by the max distance
		pass
	

	def post_event(self, user, name, visibility, etype, nature, latitude, longitude, duration):
		# Create a new event for the user with the specified arguments
		database = self.client[user]
		user_events = database['events']
		event_doc = {'name': name,
			'visibility': visibility,
			'type': etype,
			'nature': nature,
			'latitude': latitude,
			'longitude': longitude,
			'expireAt': datetime.utcnow() + timedelta(hours = duration)
			}
		user_events.insert_one(event_doc)
		user_event_object_id = (user_event.find_one(event_doc))['_id']

		database = self.client['all_events']
		events_collection = database['events']
		event_doc = {'user_event_id': user_event_object_id,
			'user': user,
			'visibility': visbility
			}
		events_collection.insert_one(event_doc)

		return user_event_object_id
	

	def cancel_event(self, user, event_id):
		# Cancel the required event
		database = self.client[user]
		user_events = database['events']
		user_events.delete_one({'_id': objectid.ObjectId(event_id)})
		
		database = self.client['all_events']
		events_collection = database['events']
		events_collection.delete_one({'user_event_id': objectid.ObjectId(event_id)})


	def add_to_circles(self, current_user, other_user, relationship_type=None):
		# Add a user to the current user's circles
		if current_user not in self.client.database_names() or other_user not in self.client.database_names():
			return False

		database = self.client[current_user]
		
		if relationship_type == 'close_friends':
			coll_name = 'close'
		elif relationship_type == 'friends':
			coll_name = 'friends'
		elif relationship_type == 'acquaintance':
			coll_name = 'acquaintance'
		elif relationship_type == 'family':
			coll_name = 'family'
		else:
			coll_name = 'others'

		collection = database[coll_name]
		coll.insert_one({'name': other_user})

		return True
