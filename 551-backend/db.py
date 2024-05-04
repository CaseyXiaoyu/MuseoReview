from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

# Configuration for MongoDB connections to multiple databases
DB_URIS = [
    "mongodb://localhost:27017/museum_db_0",
    "mongodb://localhost:27017/museum_db_1",
    "mongodb://localhost:27017/museum_db_2",
]
db_clients = [MongoClient(uri) for uri in DB_URIS]

# Use one of the databases to store the mappings
# Assuming db_clients[0] is used for simplicity
mapping_db = db_clients[0].get_default_database()

def hash_museum_name(museum_name):
    """Hash function to determine the database index based on the museum name."""
    ascii_sum = sum(ord(char) for char in museum_name)
    return ascii_sum % 3

def get_db(index):
    """Selects the database based on the index."""
    return db_clients[index].get_default_database()

def setup_database():
    # Create a unique compound index for museum name and location on each database's museums collection
    for client in db_clients:
        db = client.get_default_database()
        db.museums.create_index([("MuseumName", 1), ("Location", 1)], unique=True)

# Call setup_database to create indexes when initializing application
setup_database()


##DATA MANAGER OPERATION


def add_museum(museum_data):
    """
    Adds a new museum if there isn't one with the same name and location in the database.
    Includes error handling for duplicates and other insertion errors.
    """
    db_index = hash_museum_name(museum_data['MuseumName'])
    db = get_db(db_index)

    # Check for an existing museum with the same name and location
    existing_museum = db.museums.find_one({
        'MuseumName': museum_data['MuseumName'],
        'Location': museum_data['Location']
    })

    if existing_museum:
        return "A museum with the same name and location already exists."

    try:
        # Insert the museum into the designated collection
        result = db.museums.insert_one(museum_data)
        # Also update the mappings collection
        mapping_db.mappings.insert_one({
            'item_id': result.inserted_id,
            'db_index': db_index,
            'item_type': 'museum',
            'MuseumName': museum_data['MuseumName']
        })
        return f"Museum added successfully with ID {result.inserted_id}"
    except Exception as e:
        # Handle general unexpected errors
        return f"An error occurred: {str(e)}"
    

def add_museums_batch(museums_data):
    """
    Adds a batch of museums to the database.
    Returns a list of results, indicating success or failure for each museum.
    """
    results = []
    for museum_data in museums_data:
        db_index = hash_museum_name(museum_data['MuseumName'])
        db = get_db(db_index)
        
        # Check for an existing museum with the same name and location
        existing_museum = db.museums.find_one({
            'MuseumName': museum_data['MuseumName'],
            'Location': museum_data['Location']
        })
        
        if existing_museum:
            # If the museum already exists, skip and add a failure result
            results.append({'status': 'error', 'reason': 'Duplicate museum'})
            continue
        
        try:
            # Insert the museum into the designated collection
            result = db.museums.insert_one(museum_data)
            
            # Insert a mapping document for the new museum
            mapping_db.mappings.insert_one({
                'item_id': result.inserted_id,
                'db_index': db_index,
                'item_type': 'museum',
                'MuseumName': museum_data['MuseumName']
            })
            
            # Add a success result
            results.append({'status': 'success', 'museum_id': str(result.inserted_id)})
        except Exception as e:
            # If there was an error during insertion, add a failure result
            results.append({'status': 'error', 'reason': str(e)})
            
    return results


def update_museum(museum_id, museum_data):
    """
    Updates museum information in the database based on museum ID.
    Ensures that the update does not create duplicates based on MuseumName and Location.
    Updates the name in mappings if changed.
    """
    # Find the original museum and its mapping
    mapping = mapping_db.mappings.find_one({'item_id': ObjectId(museum_id), 'item_type': 'museum'})
    if mapping:
        db = get_db(mapping['db_index'])
        existing_museum = db.museums.find_one({'_id': ObjectId(museum_id)})

        # Check if updating MuseumName and Location would cause a duplicate
        if 'MuseumName' in museum_data or 'Location' in museum_data:
            new_name = museum_data.get('MuseumName', existing_museum['MuseumName'])
            new_location = museum_data.get('Location', existing_museum['Location'])
            
            # Look for an existing museum with the same new name and location (but not this one)
            duplicate = db.museums.find_one({
                'MuseumName': new_name,
                'Location': new_location,
                '_id': {'$ne': ObjectId(museum_id)}
            })
            if duplicate:
                return False  # Reject update to prevent duplicates

        # Proceed with update if no duplicates found
        result = db.museums.update_one(
            {'_id': ObjectId(museum_id)},
            {'$set': museum_data}
        )
        
        # Update mappings collection if the museum name has changed
        if 'MuseumName' in museum_data:
            mapping_db.mappings.update_one(
                {'item_id': ObjectId(museum_id)},
                {'$set': {'MuseumName': museum_data['MuseumName']}}
            )
        
        return result.matched_count > 0
    return False



def delete_museum(museum_id):
    """Deletes a museum and its corresponding mapping and all associated reviews."""
    mapping = mapping_db.mappings.find_one_and_delete({'item_id': ObjectId(museum_id), 'item_type': 'museum'})
    if mapping:
        db = get_db(mapping['db_index'])
        # Delete all reviews associated with the museum
        reviews_deletion_result = db.reviews.delete_many({'MuseumID': ObjectId(museum_id)})
        # Delete the museum
        museum_deletion_result = db.museums.delete_one({'_id': ObjectId(museum_id)})
        
        # Optionally, you could log or return the number of reviews deleted
        print(f"Deleted {reviews_deletion_result.deleted_count} reviews associated with the museum.")

        # Check if the museum was successfully deleted
        if museum_deletion_result.deleted_count > 0:
            return True
        else:
            return False
    return False

def get_all_museums():
    """Retrieves all museum information from all connected databases."""
    all_museums = []
    for client in db_clients:
        db = client.get_default_database()  # Access the default database for each MongoClient
        museums = list(db.museums.find())   # Retrieve all museum documents
        all_museums.extend(museums)         # Add the results to the list
    return all_museums



## USER OPERATION
#### user add reviews
def add_review(museum_id, review_data):
    # Find the mapping for the given museum
    mapping = mapping_db.mappings.find_one({'item_id': ObjectId(museum_id), 'item_type': 'museum'})
    
    if not mapping:
        return None  # If the mapping isn't found, the museum doesn't exist in our database
    
    # Get the correct database where this museum's reviews are stored
    db = get_db(mapping['db_index'])
    
    # Find the museum document
    museum = db.museums.find_one({'_id': ObjectId(museum_id)})
    
    if museum:
        # Prepare the review document to be inserted
        review_data['MuseumID'] = ObjectId(museum_id)
        review_data['timestamp'] = datetime.now()
        
        # Insert the new review
        result = db.reviews.insert_one(review_data)
        
        # Recalculate the museum's average rating
        # Fetch all reviews again in case there are new ones since the last fetch
        reviews = db.reviews.find({"MuseumID": ObjectId(museum_id)})
        
        # Calculate the total sum of all ratings
        total_rating = sum(review.get('rating', 0) for review in reviews if isinstance(review.get('rating'), (int, float)))
        
        # Calculate the new average rating
        review_count = db.reviews.count_documents({"MuseumID": ObjectId(museum_id)})
        new_rating = total_rating / review_count if review_count else 0

        # Update the museum document with the new average rating and review count
        db.museums.update_one(
            {'_id': ObjectId(museum_id)},
            {'$set': {'Rating': new_rating, 'ReviewCount': review_count}}
        )
        
        # Return the ID of the new review
        return str(result.inserted_id)
    else:
        return None  # If the museum document isn't found
    


def add_reviews_batch(reviews_data):
    """
    Adds a batch of reviews to the database.
    Assumes that reviews_data is a list of dictionaries with each dictionary containing
    museum_id and the review_data.
    """
    results = []
    for review in reviews_data:
        museum_id = review.get('museum_id')
        review_data = review.get('review_data')

        if not museum_id or not review_data:
            results.append({'status': 'error', 'reason': 'Missing museum ID or review data'})
            continue

        # Add individual review using existing function
        result = add_review(museum_id, review_data)
        if result:
            results.append({'status': 'success', 'review_id': result})
        else:
            results.append({'status': 'error', 'reason': 'Review insertion failed'})
    
    return results




def delete_review(review_id):
    # Try to find and delete the review in the expected database
    for client in db_clients:
        db = client.get_default_database()
        review = db.reviews.find_one_and_delete({'_id': ObjectId(review_id)})
        if review:
            museum_id = review['MuseumID']
            museum = db.museums.find_one({'_id': museum_id})
            if museum:
                # Recalculate the museum's average rating after deleting the review
                reviews = db.reviews.find({"MuseumID": museum_id})
                review_list = list(reviews)  # Convert cursor to list
                total_rating = sum(review.get('rating', 0) for review in review_list if isinstance(review.get('rating'), (int, float)))
                
                review_count = len(review_list)
                new_rating = total_rating / review_count if review_count > 0 else 0

                # Update the museum document with the new average rating and review count
                db.museums.update_one({'_id': museum_id}, {'$set': {'Rating': new_rating, 'ReviewCount': review_count}})
                
                return True  # Review found and deleted
    return False  # Review not found in any database

#Search function
def search_museums(query):
    """Searches for museums across all databases using a case-insensitive regex search on the MuseumName and includes the average rating and review count."""
    # Construct a case-insensitive regex pattern for the search query
    regex_pattern = {'$regex': f'.*{query}.*', '$options': 'i'}
    
    # Find mappings that match the search query
    matching_mappings = list(mapping_db.mappings.find({
        'item_type': 'museum',
        'MuseumName': regex_pattern
    }))

    if not matching_mappings:
        return {"error": "Museum not found"}

    search_results = []
    for mapping in matching_mappings:
        # Retrieve detailed museum data from the specific database
        db = get_db(mapping['db_index'])
        museum = db.museums.find_one({'_id': mapping['item_id']})
        if museum:
            # Retrieve all reviews for the museum
            reviews = list(db.reviews.find({"MuseumID": museum['_id']}))
            total_rating = sum(review.get('rating', 0) for review in reviews if 'rating' in review)
            average_rating = total_rating / len(reviews) if reviews else 0
            review_count = len(reviews)
            
            # Include average rating and review count in the museum data
            museum['average_rating'] = average_rating
            museum['review_count'] = review_count
            search_results.append(museum)

    if not search_results:
        return {"error": "Museum details not found"}

    return search_results



#Other functions to achevie goals
#make museum info and coressponding reviews be shown together
def get_museum_details_and_reviews(museum_id):
    """Fetches museum details and associated reviews from the correct database, including the average rating."""
    # Attempt to find the museum's mapping information to determine the correct database
    mapping = mapping_db.mappings.find_one({'item_id': ObjectId(museum_id), 'item_type': 'museum'})

    if not mapping:
        return {"error": "Museum not found"}  # Return an error if no mapping is found for the museum

    # Use the db_index from the mapping to select the correct database
    museum_db = get_db(mapping['db_index'])

    # Fetch museum details from the selected database
    museum_details = museum_db.museums.find_one({"_id": ObjectId(museum_id)})
    
    if not museum_details:
        return {"error": "Museum details not found"}  # Additional check if museum details are missing

    # Fetch all reviews for the museum
    reviews = list(museum_db.reviews.find({"MuseumID": ObjectId(museum_id)}))

    # If there are reviews, calculate the average rating and include it in the museum details
    if reviews:
        total_rating = sum(review.get('rating', 0) for review in reviews if 'rating' in review)
        average_rating = total_rating / len(reviews) if reviews else 0
        museum_details['Rating'] = average_rating  # This matches the 'Rating' field used in add_review
        museum_details['ReviewCount'] = len(reviews)  # This matches the 'ReviewCount' field used in add_review
    else:
        museum_details['Rating'] = 0  # If there are no reviews, set average rating to 0
        museum_details['ReviewCount'] = 0  # If there are no reviews, set review count to 0

    # Include reviews in the museum details
    museum_details['reviews'] = reviews

    return museum_details


def fetch_museum_by_id(museum_id):
    """Fetches a museum across all databases using the museum ID."""
    try:
        # Try to convert the museum ID to an ObjectId
        obj_id = ObjectId(museum_id)
    except:
        return {"error": "Invalid museum ID format"}

    # Find mappings that match the museum ID
    mapping = mapping_db.mappings.find_one({
        'item_type': 'museum',
        'item_id': obj_id
    })

    if not mapping:  # If no mapping is found
        return {"error": "Museum does not exist"}

    # Retrieve detailed museum data from the specific database
    db = get_db(mapping['db_index'])
    museum = db.museums.find_one({'_id': obj_id})

    if not museum:  # If no museum details are found
        return {"error": "Museum details not found"}

    return museum
