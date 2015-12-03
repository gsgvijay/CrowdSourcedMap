''' This file provides methods that is used to compute the
distance between a given (latitude, longitude) pairs.
'''
import math

def get_distance(lat1, long1, lat2, long2):
	degree_to_radian = math.pi / 180.0

	phi_1 = (90 - lat1) * degree_to_radian
	phi_2 = (90 - lat2) * degree_to_radian

	theta_1 = long1 * degree_to_radian
	theta_2 = long2 * degree_to_radian

	cos = (math.sin(phi_1)*math.sin(phi_2)*math.cos(theta_1 - theta_2) +  math.cos(phi_1)*math.cos(phi_2))
	arc = math.acos(cos)
	arc *= 3959 # radians of Earth in miles
	return arc
