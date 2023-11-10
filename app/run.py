#!/usr/bin/python3
""" This module contains the flask application that handles User Authentication
and redirection to the login and main page.
"""
import spotipy
import time
from spotipy.oauth2 import SpotifyOAuth
from flask_cors import CORS
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
 # Initialize Flask app
app = Flask(__name__)

# Flask app configurations
app.config['UPLOAD_FOLDER'] = 'static'
app.config['SESSION_COOKIE_NAME'] = 'spotify-login-session'
app.secret_key = 'osfjmweofmfwvsncm@#^*$'
TOKEN_INFO = 'token_info'

# configure CORS to allow requests from all origins
CORS(app)

# Spotify API credentials
CLIENT_ID = '27c78243b6244d80ba874629179222a4'
CLIENT_SECRET = '2b1ed529568b431fac006ce480003b7f'

# Spotify API scopes
SCOPE = 'user-read-currently-playing user-read-playback-state user-modify-playback-state user-top-read playlist-modify-private playlist-modify-public playlist-read-private playlist-read-collaborative playlist-read-private'
# remember to add more scopes here if you need to access more user information

# Session to differentiate between users

# global variable 'top' to store the user's top artists, tracks or genres
top = None 

@app.route('/')
def login_page():
    """ Renders the login page when the user visits the application
    for the first time.
    """
    return render_template('login_page.html')

@app.route('/about.html')
def about():
    return render_template('about.html')

@app.route('/privacy.html')
def privacy():
    return render_template('privacy.html')

@app.route('/policy.html')
def policy():
    return render_template('policy.html')

@app.route('/login')
def login():
    """ Redirects the user to the Spotify login page when the login
    button is clicked.
    """
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)


@app.route('/redirect')
def redirect_page():
    """ After the user grants access to the application, the Spotify API 
    will redirect the user to this page.
    """
    session.clear()
    code = request.args.get('code')
    sp_oauth = create_spotify_oauth()
    token_info = sp_oauth.get_access_token(code)
    session[TOKEN_INFO] = token_info
    
    return redirect(url_for('main'))


@app.route('/main_page')
def main():
    """ After the access token as being generated in the redirect URI
    the user will be redirected to the main page of the application.
    """
    try:
        token_info = get_token()
    except:
        return redirect(url_for('login'))
    sp = spotipy.Spotify(auth=token_info['access_token'])
    user = sp.current_user()
    name = user['display_name']
    if name is None:
        name = 'traveller'
    elif len(name.split()) > 1:
        name = name.split()[-1]
        name = name[0].upper() + name[1:]
    return render_template('main_page.html', user=name)

# a route /top to receive a post request with a body containing a json object with the following structure: {time_range: 'short_term' | 'medium_term' | 'long_term', limit: number, type: 'artists' | 'tracks'| 'genres' | 'stats'} with this information, the server will make a request to the spotify api and return the top artists, tracks, genres or stats of the user
@app.route('/top', methods=['POST'])
def user_top():
    global top
    # get the token checking if it is expired
    try:
        token_info = get_token()
    except:
        return redirect(url_for('login'))
    sp = spotipy.Spotify(auth=token_info['access_token'])
    data = request.get_json()
    time_range = data['range']
    limit = data['limit']
    type = data['type']
    if type == 'Artists':
        top = sp.current_user_top_artists(time_range=time_range, limit=limit)
        # for each artist, get the artist's top track and add it to the artist object as a new property called 'top_track'
        for artist in top['items']:
            artist['top_track'] = sp.artist_top_tracks(artist['id'])['tracks'][0]
    elif type == 'Tracks':
        top = sp.current_user_top_tracks(time_range=time_range, limit=limit)
        # for each track, get the artist of the tracks'image and add it to the track object as a new property called 'artist_image'
        for track in top['items']:
            track['artist_image'] = sp.artist(track['album']['artists'][0]['id'])['images'][0]['url']
    elif type == 'Genres':
        top = sp.current_user_top_artists(time_range=time_range, limit=50)
        genres = []
        for artist in top['items']:
            genres.extend(artist['genres'])
        # count the number of times each genre appears and sort them by frequency in descending order
        top = sorted({genre: genres.count(genre) for genre in genres}.items(), key=lambda x: x[1], reverse=True)
        # return only the top 10 genres
        top = top[:10]
    return jsonify(top)

# a route /save_playlist to receive a POST request with body containing a json of the form {range: 'text'} that will create a playlist with the user's top tracks contained in the top variable
@app.route('/save_as_playlist', methods=['POST'])
def save_playlist():
    global top
    try:
        token_info = get_token()
    except:
        return redirect(url_for('login'))
    sp = spotipy.Spotify(auth=token_info['access_token'])
    # create a new playlist, let the name of the playlist be of the format 'Nostalgiwrap - {current date}  + Description'
    range = request.get_json()['range']
    playlist = sp.user_playlist_create(sp.me()['id'], 'Nostalgiwrap - ' + time.strftime('%d/%m/%Y'), public=False, description=f"{range} Playlist created by Nostalgiwrap on {time.strftime('%d/%m/%Y')}, Enjoy!")
    # add the top tracks to the playlist
    sp.user_playlist_add_tracks(sp.me()['id'], playlist['id'], [track['id'] for track in top['items']])
    # if the playlist was created successfully, return the playlist success message
    if playlist:
        return jsonify({'message': 'Playlist created successfully!'}), 200

# a route /create_recommendation_playlist to receive a GET request that will create a playlist with the user's top genres in the top variable
@app.route('/create_recommendation_playlist', methods=['GET'])
def create_recommendation_playlist():
    global top
    try:
        token_info = get_token()
    except:
        return redirect(url_for('login'))
    sp = spotipy.Spotify(auth=token_info['access_token'])
    # create a new playlist, let the name of the playlist be of the format 'Nostalgiwrap - {current date}  + Description'
    playlist = sp.user_playlist_create(sp.me()['id'], 'Nostalgiwrap - ' + time.strftime('%d/%m/%Y'), public=False, description=f"Recommendation Playlist created by Nostalgiwrap on {time.strftime('%d/%m/%Y')}, Enjoy!")
    # get the top genres
    genres = [genre[0] for genre in top]
    # get the top tracks of each genre
    tracks = []
    for genre in genres:
        tracks.extend(sp.recommendations(seed_genres=[genre], limit=10)['tracks'])
    # add the top tracks to the playlist
    sp.user_playlist_add_tracks(sp.me()['id'], playlist['id'], [track['id'] for track in tracks])
    # if the playlist was created successfully, return the playlist success message
    if playlist:
        return jsonify({'message': 'Playlist created successfully!'}), 200


def get_token():
    """ Returns the user's access token from the session cookie if it exists.
    Otherwise, redirects the user to the login page.
    """
    token_info = session.get(TOKEN_INFO, None)
    if not token_info:
        return redirect(url_for('login'))
    now = int(time.time())
    is_expired = token_info['expires_at'] - now < 60
    if (is_expired):
        sp_oauth = create_spotify_oauth()
        token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
    return token_info


def create_spotify_oauth():
    return SpotifyOAuth(
        client_id = CLIENT_ID,
        client_secret = CLIENT_SECRET,
        redirect_uri = url_for('redirect_page', _external=True),
        scope = SCOPE)


if __name__ == '__main__':
    app.run(debug=True)