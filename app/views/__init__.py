#!/usr/bin/python3
""" Blueprint for the main page of the application.
"""
from flask import Blueprint

app_views = Blueprint('app_views', __name__, url_prefix='/')