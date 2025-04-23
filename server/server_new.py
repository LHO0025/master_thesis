from flask import Flask, request, Response, render_template, stream_with_context
import subprocess
from subprocess import run, CalledProcessError
import json 
from flask import jsonify
import requests
import argparse
import uuid
from flask_cors import CORS
import sys
import threading
import uuid
import jwt
import datetime
from functools import wraps
from Auth import Auth
from itertools import zip_longest

app = Flask(__name__)
app = Flask(__name__, static_folder="assets", template_folder="templates")

CORS(app)

start_port = 7980
subprocesses = []
SOURCE_AUDIO_URL = "http://localhost:7980/mp3/0x2aa1"
ERROR_MESSAGE_GENERIC = "Something went wrong"
SECRET_KEY = "my_secret"

users = {
    "user1": "secret",
    "user2": "mypassword"
}
auth = Auth(secret=SECRET_KEY, users=users)

CHANNELS = [
    "10A", "10B", "10C", "10D",
    "11A", "11B", "11C", "11D",
    "12A", "12B", "12C", "12D",
    "13A", "13B", "13C", "13D", "13E", "13F"
]

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"message": "Token is missing!"}), 401

        try:
            auth.validate_token(token)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Expired token"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except:
            return jsonify({"error": ERROR_MESSAGE_GENERIC}), 500

        return f(*args, **kwargs)
    
    return decorated_function

@app.route('/buffered_mp3')
def stream_cached_audio():

    port = request.args.get('port')
    sid = request.args.get('sid')
    offsetMs = request.args.get('offsetMs')

    def generate_audio_stream():
        with requests.get(f'http://localhost:{port}/buffered_mp3?sid={sid}&offsetMs={offsetMs}', stream=True) as r:
            r.raise_for_status() 
            for chunk in r.iter_content(chunk_size=1024):
                if chunk:
                    yield chunk

    return Response(stream_with_context(generate_audio_stream()), content_type="audio/mpeg")

@app.route('/retune', methods = ['POST'])
@token_required
def retune():
    try:
        port = request.args.get("port")
        channel = request.args.get("channel")

        if channel not in CHANNELS:
            return jsonify({"error": "Invalid channel"}), 500

        requests.post(f'http://localhost:{port}/channel', data=channel)
        return jsonify({"message": "Channel successfully updated"}), 200
    except Exception as e:
        print("Error: ", e)
        return jsonify({"error": ERROR_MESSAGE_GENERIC}), 500


@app.route('/buffered_dls', methods = ['GET'])
def buffered_dls():    
    port = request.args.get('port')
    sid = request.args.get('sid')
    time = request.args.get('time')

    try:
        response = requests.get(f'http://localhost:{port}/buffered_dls?sid={sid}&time={time}')
        return jsonify(response.json())

    except (requests.RequestException, ValueError) as e:
        return ERROR_MESSAGE_GENERIC, 500
    
@app.route('/buffered_slide', methods = ['GET'])
def buffered_slide():    
    port = request.args.get('port')
    sid = request.args.get('sid')
    time = request.args.get('time')
    
    try:
        response = requests.get(f'http://localhost:{port}/buffered_slide?sid={sid}&time={time}')
        return Response(response.content, content_type=response.headers['Content-Type'])

    except (requests.RequestException, ValueError) as e:
        return ERROR_MESSAGE_GENERIC, 500

@app.route("/login", methods=["POST"])
def login():
    data = json.loads(request.data)

    username = data.get("userName")
    password = data.get("password")

    if auth.validate_credentials(username, password):
        token = auth.generate_token(username)
        return jsonify({"token": token})

    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/stream')
def stream_audio():
    def generate_audio_stream():
        with requests.get(SOURCE_AUDIO_URL, stream=True) as r:
            r.raise_for_status() 
            for chunk in r.iter_content(chunk_size=1024):
                if chunk:
                    yield chunk

    return Response(stream_with_context(generate_audio_stream()), content_type="audio/mpeg")


@app.route('/info')
def get_info():
    jsons = []
    for i, process in enumerate(subprocesses):
        try:
            port = str(start_port + i)
            response = requests.get('http://localhost:' + port + "/mux.json")
            data = response.json()
            data['port'] = port

            response = requests.get('http://localhost:' + port + "/channel")
            data['tunedChannel'] = response.text
            jsons.append(data)

        except (requests.RequestException, ValueError) as e:
            print(f"Error fetching data: {e}")
            return ERROR_MESSAGE_GENERIC, 500

    return jsonify({"devices": jsons})


@app.route('/retune/<port>/<channel>', methods = ['POST'])
@token_required
def user(port, channel):
    try:
        requests.post('http://localhost:' + port + "/channel", data=channel)
    except:
          print(f"Retune failed")
          return 500
    return 200

@app.route('/playback_time')
def get_buffer_size():
    try:
        port = request.args.get('port')
        sid = request.args.get('sid')

        url = f'http://localhost:{port}/playback_time/{sid}'
        response = requests.get(url, timeout=5)  # Set a timeout
        response.raise_for_status()  # Raise an exception for HTTP errors
        return jsonify(response.json())  # Ensure JSON response
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500  # Return error response
    
def read_output(process, stream_name):
    for line in iter(process.stdout.readline if stream_name == "stdout" else process.stderr.readline, b''):
        print(f"[{stream_name}] {line.decode().strip()}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="Process channels and optionally RTL_TCP ports"
    )

    # Required argument: channels
    parser.add_argument(
        '-c', '--channels',
        nargs='+',
        required=True,
        metavar='CHANNEL',
        help="Specify a list of channels (e.g., channel1 channel2 ...)"
    )
    
    # Optional argument: RTL_TCP ports
    parser.add_argument(
        '-rtl_tcp',
        nargs='+',
        metavar='PORT',
        type=str,
        help="Optionally specify a list of RTL_TCP IPs matching the number of channels"
    )
    
    args = parser.parse_args()

    channels = args.channels
    rtl_tcp_ips = args.rtl_tcp




    port = start_port
    rtl_tcp_port = 1250
    device_index = 0
    for channel, ip in zip_longest(channels, rtl_tcp_ips, fillvalue=None):
        if ip is None:
            subprocess.Popen(["./rtl_tcp", "-d", str(device_index), "-p", str(rtl_tcp_port)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            ip = "localhost:" + str(rtl_tcp_port - 1)
            rtl_tcp_port += 1
            device_index += 1

        process = subprocess.Popen(["./welle-cli", "-F", "rtl_tcp," + ip, "-c", channel, "-Dw", str(port), "-b", "600"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        port += 1

        subprocesses.append(process)
        threading.Thread(target=read_output, args=(process, "stdout"), daemon=True).start()
        threading.Thread(target=read_output, args=(process, "stderr"), daemon=True).start()

    threading.Thread(target=app.run, daemon=True).start()

    for process in subprocesses:
        process.wait()

    app.run()
    
    # if rtl_tcp_ips != None:
    #     for channel, ip in zip(channels, rtl_tcp_ips):
    #         print("rtl_tcp," + ip)
            # process = subprocess.Popen(["./welle-cli", "-F", "rtl_tcp," + ip, "-c", channel, "-Dw", str(_port), "-b", "600"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            # _port += 1
            # subprocesses.append(process)

            # threading.Thread(target=read_output, args=(process, "stdout"), daemon=True).start()
            # threading.Thread(target=read_output, args=(process, "stderr"), daemon=True).start()


    # threading.Thread(target=app.run, daemon=True).start()

    # for process in subprocesses:
    #     process.wait()

    # app.run()