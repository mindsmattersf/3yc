from flask import Blueprint, render_template, jsonify

from .scrape import scrape_drive

app = Blueprint('main', __name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/lessons.json', methods=['GET'])
def get_lessons():
    print('fetching from drive')
    return jsonify(scrape_drive())
