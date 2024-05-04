from flask import Flask, request, jsonify
import db  
from db import add_museums_batch
from db import add_reviews_batch
from db import get_museum_details_and_reviews
from db import search_museums
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Endpoint for database managers to add museum information
@app.route('/museum', methods=['POST'])
def add_museum():
    museum_data = request.json
    museum_id = db.add_museum(museum_data)
    if museum_id:
        return jsonify({'message': 'Museum added successfully', 'museum_id': str(museum_id)}), 201
    else:
        return jsonify({'error': 'Failed to add museum'}), 400
    
@app.route('/museums/batch', methods=['POST'])
def add_museums_batch_route():
    museums_data = request.get_json()  # Expecting a list of museum data dictionaries
    if not isinstance(museums_data, list):
        return jsonify({'error': 'Input data should be a list of museum data'}), 400

    # Call the batch insertion function
    results = add_museums_batch(museums_data)
    return jsonify(results), 201



# Endpoint for database managers to update museum information
@app.route('/museum/<museum_id>', methods=['PUT'])
def handle_update_museum(museum_id):
    update_data = request.json
    if db.update_museum(museum_id, update_data):
        return jsonify({'message': 'Museum updated successfully'}), 200
    else:
        return jsonify({'error': 'Failed to update museum'}), 400

# Endpoint for database managers to delete museum information
@app.route('/museum/<museum_id>', methods=['DELETE'])
def delete_museum(museum_id):
    if db.delete_museum(museum_id):
        return jsonify({'message': 'Museum deleted successfully'}), 200
    else:
        return jsonify({'error': 'Failed to delete museum'}), 400
    

# Endpoint for retrieving all museum information
@app.route('/museums', methods=['GET'])
def get_all_museums_route():
    museums = db.get_all_museums()  # Call the function that fetches all museums

    # Format the results for JSON serialization
    formatted_museums = [
        {
            'id': str(museum['_id']),
            'MuseumName': museum['MuseumName'],
            'Description': museum.get('Description', ''),
            'Location': museum.get('Location', ''),
            'Fee': museum.get('Fee', ''),
            'LengthOfVisit': museum.get('LengthOfVisit', ''),
            'PhoneNum': museum.get('PhoneNum', '')
        } for museum in museums
    ]

    return jsonify(formatted_museums)

# Endpoint for users to add a review
@app.route('/review', methods=['POST'])
def add_review_route():
    review_data = request.json
    museum_id = review_data['MuseumID']
    review_id = db.add_review(museum_id, review_data)
    if review_id:
        return jsonify({'message': 'Review added successfully', 'review_id': str(review_id)}), 201
    else:
        return jsonify({'error': 'Failed to add review'}), 400
    
@app.route('/reviews/batch', methods=['POST'])
def add_reviews_batch_route():
    reviews_data = request.get_json()  # Expecting a list of reviews data dictionaries
    if not isinstance(reviews_data, list):
        return jsonify({'error': 'Input data should be a list of review data'}), 400

    # Call the batch insertion function
    results = add_reviews_batch(reviews_data)
    return jsonify(results), 201



# Endpoint for users to delete a review
@app.route('/review/<review_id>', methods=['DELETE'])
def delete_review_route(review_id):
    if db.delete_review(review_id):
        return jsonify({'message': 'Review deleted successfully'}), 200
    else:
        return jsonify({'error': 'Failed to delete review'}), 400
    


#Endpoint for search
@app.route('/search', methods=['GET'])
def search_museums_route():
    query = request.args.get('query', '')
    if not query:
        return jsonify({'error': 'Please provide a search query'}), 400

    search_results = search_museums(query)

    if isinstance(search_results, dict) and "error" in search_results:
        return jsonify(search_results), 404

    # Format the search results for JSON serialization
    formatted_results = [
        {
            'id': str(museum['_id']), 
            'MuseumName': museum['MuseumName'],
            'Description': museum.get('Description', ''),
            'Location': museum.get('Location', ''),
            'Fee': museum.get('Fee', ''),
            'LengthOfVisit': museum.get('LengthOfVisit', ''),
            'PhoneNum': museum.get('PhoneNum', ''),
            'AverageRating': museum.get('average_rating', 'Not Rated'),
            'ReviewCount': museum.get('review_count', 0)  # Include the review count
        } for museum in search_results
    ]

    return jsonify(formatted_results)


#make museum info and corresponding result to be shown together

@app.route('/museum/<museum_id>/details', methods=['GET'])
def museum_details_and_reviews_route(museum_id):
    museum_data = get_museum_details_and_reviews(museum_id)
    
    # Check for an error in the response
    if isinstance(museum_data, dict) and "error" in museum_data:
        return jsonify(museum_data), 404
    
    # Manually convert ObjectId instances to strings for JSON serialization
    museum_data['_id'] = str(museum_data['_id'])
    museum_data['reviews'] = [
        {
            '_id': str(review['_id']),
            'MuseumID': str(review['MuseumID']),
            'comment': review.get('review', ''),
            'rating': review.get('rating', 0),
            'timestamp': review.get('timestamp', '').isoformat() if review.get('timestamp') else ''
        } for review in museum_data.get('reviews', [])
    ]

    # Add average rating and review count to the response
    museum_data['average_rating'] = museum_data.get('Rating', 0)
    museum_data['review_count'] = museum_data.get('ReviewCount', 0)
    
    return jsonify(museum_data)


@app.route('/fetch-museum/<museum_id>', methods=['GET'])
def fetch_museum(museum_id):
    museum_data = db.fetch_museum_by_id(museum_id)

    # Handle potential errors
    if "error" in museum_data:
        return jsonify(museum_data), 404

    # Format the result for JSON response
    formatted_result = {
        'id': str(museum_data['_id']),
        'MuseumName': museum_data['MuseumName'],
        'Description': museum_data.get('Description', ''),
        'Location': museum_data.get('Location', ''),
        'Fee': museum_data.get('Fee', ''),
        'LengthOfVisit': museum_data.get('LengthOfVisit', ''),
        'PhoneNum': museum_data.get('PhoneNum', '')
    }
    
    return jsonify(formatted_result)



if __name__ == '__main__':
    app.run(debug=True)

