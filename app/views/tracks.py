#!/usr/bin/python3
""" Handles the retrieval of the user's top tracks.
"""
from flask import render_template, session, request, redirect, url_for, jsonify
from app.views import app_views
from app.run import sp