import os
import smtplib
from email.message import EmailMessage
from flask import Flask, request, jsonify
from flask_cors import CORS # For handling Cross-Origin Resource Sharing
from dotenv import load_dotenv # To load environment variables from .env file

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app) # This will allow requests from your frontend (running on a different port typically)

# --- Configuration ---
# Get credentials from environment variables
SENDER_EMAIL = os.environ.get("SENDER_EMAIL")
SENDER_PASSWORD = os.environ.get("SENDER_PASSWORD")
EBOOK_FILENAME = "MoneyTalks.pdf" # The name of your ebook file

if not SENDER_EMAIL or not SENDER_PASSWORD:
    print("ERROR: SENDER_EMAIL or SENDER_PASSWORD environment variables not set.")
    print("Please set them in a .env file or directly in your environment.")
    # You might want to exit or raise an exception here in a real app
    # For this example, we'll let it proceed and potentially fail later if not set.

@app.route('/send-ebook', methods=['POST'])
def send_ebook():
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        return jsonify({"status": "error", "message": "Server email configuration missing."}), 500

    data = request.json
    if not data or 'email' not in data:
        return jsonify({"status": "error", "message": "Email is required."}), 400

    user_email = data['email']

    if not user_email: # Basic validation
        return jsonify({"status": "error", "message": "Recipient email cannot be empty."}), 400

    msg = EmailMessage()
    msg['Subject'] = "Your Copy of Money Talk's 📘"
    msg['From'] = SENDER_EMAIL
    msg['To'] = user_email
    msg.set_content("Thanks for your interest! Here's your ebook attached.")

    try:
        with open(EBOOK_FILENAME, "rb") as f:
            file_data = f.read()
            file_name = EBOOK_FILENAME
            msg.add_attachment(file_data, maintype='application', subtype='pdf', filename=file_name)
    except FileNotFoundError:
        print(f"ERROR: Ebook file '{EBOOK_FILENAME}' not found in the current directory.")
        return jsonify({"status": "error", "message": f"Ebook file '{EBOOK_FILENAME}' not found on server."}), 500
    except Exception as e:
        print(f"ERROR: Could not read or attach ebook file: {e}")
        return jsonify({"status": "error", "message": "Error processing ebook file."}), 500

    try:
        # SMTP Setup (Gmail example)
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(SENDER_EMAIL, SENDER_PASSWORD)
            smtp.send_message(msg)
        print(f"Ebook sent successfully to {user_email}")
        return jsonify({"status": "sent", "message": f"Ebook sent to {user_email}!"})
    except smtplib.SMTPAuthenticationError:
        print("ERROR: SMTP Authentication failed. Check your SENDER_EMAIL and SENDER_PASSWORD.")
        return jsonify({"status": "error", "message": "Email server authentication failed. Check server configuration."}), 500
    except smtplib.SMTPConnectError:
        print("ERROR: Could not connect to SMTP server. Check server address and port.")
        return jsonify({"status": "error", "message": "Could not connect to email server."}), 500
    except Exception as e:
        print(f"ERROR: An unexpected error occurred while sending email: {e}")
        return jsonify({"status": "error", "message": f"Failed to send email: {str(e)}"}), 500

if __name__ == '__main__':
    # Make sure the ebook file exists before starting the server
    if not os.path.exists(EBOOK_FILENAME):
        print(f"CRITICAL ERROR: Ebook file '{EBOOK_FILENAME}' not found.")
        print("Please make sure the PDF is in the same directory as app.py.")
    else:
        print(f"Found ebook: {EBOOK_FILENAME}")

    # Check for environment variables (can be done here or at the top)
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        print("WARNING: SENDER_EMAIL or SENDER_PASSWORD not set. Email sending will fail.")
        print("Ensure you have a .env file with these values or have them set in your environment.")
    else:
        print(f"Sender email configured: {SENDER_EMAIL}")

    app.run(debug=True) # debug=True is helpful for development