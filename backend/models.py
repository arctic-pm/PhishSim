from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    subject = db.Column(db.String(255))

    def to_dict(self):
        return {"id": self.id, "name": self.name, "subject": self.subject}

class Template(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120))
    subject = db.Column(db.String(255))
    body = db.Column(db.Text)

    def to_dict(self):
        return {"id": self.id, "title": self.title, "subject": self.subject, "body": self.body}

