#!/usr/bin/python3
""" This module contains the flask application that handles User Authentication
and redirection to the login and main page.
"""
import spotipy
import time
from spotipy.oauth2 import SpotifyOAuth

from flask import Flask, render_template, request, redirect, url_for, session, jsonify
 # Initialize Flask app
app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = 'static'

# Flask app configurations
app.config['SESSION_COOKIE_NAME'] = 'spotify-login-session'
app.secret_key = 'osfjmweofmfwvsncm@#^*$'
TOKEN_INFO = 'token_info'

# Spotify API credentials
CLIENT_ID = '27c78243b6244d80ba874629179222a4'
CLIENT_SECRET = '2b1ed529568b431fac006ce480003b7f'

# Spotify API scopes
SCOPE = 'user-read-currently-playing user-read-playback-state user-modify-playback-state user-top-read'
# remember to add more scopes here if you need to access more user information

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

@app.route('/top')
def top():
    try:
        token_info = get_token()
    except:
        return redirect(url_for('login'))
    sp = spotipy.Spotify(auth=token_info['access_token'])
    type = request.headers.get('type')
    time_range = request.headers.get('time_range')
    limit = request.headers.get('limit')
    if type == 'artists':
        top_artists = sp.current_user_top_artists(limit=limit, time_range=time_range)
        return jsonify(top_artists)
    elif type == 'tracks':
        top_tracks = sp.current_user_top_tracks(limit=limit, time_range=time_range)
        return jsonify(top_tracks)
    elif type == 'genres':
        top_artists = sp.current_user_top_artists(limit=limit, time_range=time_range)
        genres = []
        for artist in top_artists['items']:
            genres.extend(artist['genres'])
        return jsonify(genres)
    else:
        return jsonify({'error': 'invalid type'})

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