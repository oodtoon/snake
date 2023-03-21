from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///snake.db'
with app.app_context():
    db = SQLAlchemy(app)


class HighScore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Integer, ForeignKey("user.id"))
    score = db.Column(db.Integer)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<User %r, %r>' % self.id, self.user_name


@app.route('/submit', methods=['POST', 'GET'])
def submit_page():
    if request.method == 'POST':
        user_name = request.form['username']
        new_user = User(user_name=user_name)

        try:
            db.session.add(new_user)
            db.session.commit()
            return redirect('/')
        except:
            return "There was an issue adding your score"
    else:
        return render_template('submit.html')


# when a user goes to a page via url its a get method always
@app.route('/', methods=['POST', 'GET'])
def home_page():
    if request.method == 'POST':
        score_achieved = request.form['score']
        new_score = HighScore(score=score_achieved, user=1)

        try:
            db.session.add(new_score)
            db.session.commit()
            return redirect('/leaderboard')
        except:
            return "There was an issue adding your score"
    else:
        return render_template('snake.html')


@app.route('/leaderboard')
def leaderboard_page():
    all_high_scores = HighScore.query.order_by(HighScore.score).desc.all()
    return render_template('leaderboard.html', scores=all_high_scores)


if __name__ == "__main__":
    app.run(debug=True)
