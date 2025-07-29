from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_mail import Mail, Message
import os
import io
from datetime import datetime

app = Flask(__name__)
CORS(app)


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "instance", "db.sqlite3")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Ethereal test SMTP config
app.config["MAIL_SERVER"] = "smtp.ethereal.email"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "luther55@ethereal.email"
app.config["MAIL_PASSWORD"] = "7XBs598cNYQSedZN5P"
app.config["MAIL_DEFAULT_SENDER"] = ("PhishSim", "no-reply@phishsim.com")

mail = Mail(app)
db = SQLAlchemy(app)

# Models
class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    target_email = db.Column(db.String(200), nullable=False)
    template_id = db.Column(db.Integer, db.ForeignKey("template.id"))
    opened = db.Column(db.Integer, default=0)
    opened_at = db.Column(db.String, nullable=True)  # Add this line
    clicked = db.Column(db.Integer, default=0)


class Template(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    body = db.Column(db.Text, nullable=False)

@app.route("/api/templates", methods=["GET", "POST"])
def templates():
    if request.method == "POST":
        data = request.get_json()
        new_template = Template(title=data["title"], body=data["body"])
        db.session.add(new_template)
        db.session.commit()
        return jsonify({"message": "Template added"}), 201

    templates = Template.query.all()
    return jsonify([{ "id": t.id, "title": t.title, "body": t.body } for t in templates])

@app.route("/api/campaigns", methods=["GET", "POST"])
def campaigns():
    if request.method == "POST":
        data = request.get_json()
        new_campaign = Campaign(
            name=data["name"],
            target_email=data["target_email"],
            template_id=data["template_id"]
        )
        db.session.add(new_campaign)
        db.session.commit()
        return jsonify({"message": "Campaign created", "id": new_campaign.id}), 201

    campaigns = Campaign.query.all()
    result = []
    for c in campaigns:
        template = Template.query.get(c.template_id)
        result.append({  # ✅ Moved inside the loop
            "id": c.id,
            "name": c.name,
            "target_email": c.target_email,
            "template_title": template.title if template else "N/A",
            "opened": c.opened,
            "opened_at": c.opened_at,  # Now included properly
            "clicked": c.clicked
        })
 
    return jsonify(result)

@app.route("/api/send-email", methods=["POST"])
def send_email():
    data = request.get_json()
    to = data.get("to")
    subject = data.get("subject")
    body = data.get("body")
    campaign_id = data.get("campaign_id")

    if not to or not subject or not body or not campaign_id:
        return jsonify({"error": "Missing fields"}), 


    tracking_img = f'<img src="http://localhost:5000/api/open/{campaign_id}" width="1" height="1" style="display:none"/>'
    full_body = body + tracking_img
    print("\n📧 Preparing to send email:")
    print(f"To: {data.get('to')}")
    print(f"Campaign ID: {data.get('campaign_id')}")
    print(f"Tracking pixel: http://localhost:5000/api/open/{campaign_id}")
    try:
        msg = Message(subject=subject, recipients=[to], html=full_body)
        mail.send(msg)
        return jsonify({"status": "Email sent"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/open/<int:campaign_id>")
def track_open(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    campaign.opened += 1  # ✅ Increment the open count
    campaign.opened_at = datetime.now().isoformat()
    db.session.commit()
    print(f"\n👀 Open tracking triggered for campaign {campaign_id}")
    pixel = b"\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff!" \
            b"\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
    return send_file(io.BytesIO(pixel), mimetype="image/gif")

@app.route("/api/campaign-stats")
def get_campaign_stats():
    campaigns = Campaign.query.all()
    stats = {}

    for c in campaigns:
        template = Template.query.get(c.template_id)
        title = template.title if template else "Unknown"

        if title not in stats:
            stats[title] = {
                "opens": 0,
                "clicks": 0,
                "timestamps": []
            }

        if c.opened:
            stats[title]["opens"] += 1
            if c.opened_at:
                stats[title]["timestamps"].append(c.opened_at)

        if c.clicked:
            stats[title]["clicks"] += 1

    return jsonify(stats)


@app.route("/api/click/<int:campaign_id>")
def track_click(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    campaign.clicked += 1
    db.session.commit()
    return "<h2>You just clicked a phishing simulation link!</h2><p>This was part of a security training exercise.</p>"

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)