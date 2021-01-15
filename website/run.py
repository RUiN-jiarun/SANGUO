from flask import Flask
from flask import render_template, redirect, url_for

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/relation')
def relation():
    return render_template('relation.html')

@app.route('/storyline')
def storyline():
    return render_template('storyline.html')

@app.route('/map')
def map():
    return render_template('map.html')




if __name__=='__main__':
    app.run()
    # app.run(host='0.0.0.0', port=8080)