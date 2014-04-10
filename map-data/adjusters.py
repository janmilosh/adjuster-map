#!/usr/bin/env python3

'''Gets the city, state, and number of adjusters from Mariposa portal;
   obtains latitude and longitude for each city in the data set; and
   writes the values to a csv file that is used in the coverage map
   on mariposaltd.com'''

from urllib2 import urlopen
from json import load, dumps
import time
from datetime import datetime

# Get the Mariposa data in JSON format (city, state, and number of adjusters)
def get_data():
    url = 'https://personnel.mariposaltd.com/api/map/cities'

    response = urlopen(url)
    json_obj = load(response)
    return json_obj

# Write raw adjuster data to a file called adjuster-data.json
def print_raw_data(data):
    f = open('adjuster-data.json', 'w')
    f.write(dumps(data, indent=4))
    f.close()

# Convert JSON data to a list and sort by number of adjusters (high to low)
# Weeds out non-us cities by comparing state values, gets latitude and longitude
# Prints the data to a csv file called cities.csv
def convert_json_and_sort(data):
    city_list = []
    states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 
          'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
          'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
          'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
          'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
    
    # Create the city list array and get the geodata
    for index, location in enumerate(data):
        if location['state'] in states:
            city = location['city'].title().decode('string_escape')
            state = location['state']
            number = location['number']

            # We need to put in pauses because Google's geolocator throttles us
            if index % 100 == 0 and index != 0:
                time.sleep(60)

            # Get latitude and longitude from Google geolocation api
            geolocation = get_geodata(city.replace(' ', '+'), state)
            latitude = geolocation[0]
            longitude = geolocation[1]

            # Create the complete list describing a location
            city_list.append([city, state, number, latitude, longitude])

            # Print the results to the console, including the time
            access_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(access_time + ', ' + str(index) + ', ' + city + ', ' + state + ', ' + str(number) + ', ' + str(latitude) + ', ' + str(longitude))

    # Reverse sort the list by number of adjusters    
    city_list.sort(key=lambda x: x[2], reverse=True)

    # Print to the csv file
    f = open('cities.csv', 'w')
    f.write('city,state,num,lat,lon\n')
    for item in city_list:
        f.write(item[0] + ',' + item[1] + ',' + str(item[2]) + ',' + str(item[3]) + ',' + str(item[4]) + '\n')
    f.close()
        
# Get geodata and return list containing latitude and longitude
def get_geodata(city, state):
    url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + ',+' + state + '&sensor=false&key=AIzaSyDe1fq7oib8shkDokkXzJ8H1txRTLjR8k8'
    response = urlopen(url)
    json_obj = load(response)
    latitude = json_obj['results'][0]['geometry']['location']['lat']
    longitude = json_obj['results'][0]['geometry']['location']['lng']
    location = [latitude, longitude]
    return location

# The main function that makes it all happen
def main():
    raw_data = get_data()
    print_raw_data(raw_data)
    convert_json_and_sort(raw_data)
    
if __name__ == '__main__':
    main()