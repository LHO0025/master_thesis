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

app = Flask(__name__)
app = Flask(__name__, static_folder="assets", template_folder="templates")
CORS(app)

start_port = 7980
subprocesses = []
SOURCE_AUDIO_URL = "http://localhost:7980/mp3/0x2aa1"
ERROR_MESSAGE_GENERIC = "Something went wrong"

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

@app.route('/cache_mp3/<port>/<sid>/<int:offset>')
def stream_cached_audio(port, sid, offset):
    def generate_audio_stream():
        with requests.get("http://localhost:" + port + "/cache_mp3/"+ sid + "/" + str(offset), stream=True) as r:
            r.raise_for_status() 
            for chunk in r.iter_content(chunk_size=1024):
                if chunk:
                    yield chunk

    return Response(stream_with_context(generate_audio_stream()), content_type="audio/mpeg")



@app.route('/cache_dls_data', methods = ['POST'])
def stream_cached_dls_data():
    data = json.loads(request.data)
    
    sid = data.get("sid")
    port = data.get("port")
    time = data.get("time")

    print("SID", sid)
    print("port", port)
    print("time", time)

    try:
        response = requests.get('http://localhost:' + str(port) + "/cached_dls_data/" + str(sid) + "/" + str(time))
        return jsonify(response.json())

    except (requests.RequestException, ValueError) as e:
        print(f"Error fetching data: {e}")
        return ERROR_MESSAGE_GENERIC, 500
    

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
def user(port, channel):
    try:
        requests.post('http://localhost:' + port + "/channel", data=channel)
    except:
          print(f"Retune failed")
          return 500
    return 200

@app.route('/buffer_size/<port>/<sid>')
def get_buffer_size(port, sid):
    try:
        url = f'http://localhost:{port}/buffer_size/{sid}'
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

    # Check if RTL_TCP ports are provided and validate their length
    if rtl_tcp_ips and len(rtl_tcp_ips) != len(channels):
        print("Error: The number of RTL_TCP ports must match the number of channels.", file=sys.stderr)
        sys.exit(1)

    print("Channels specified:", channels)
    print(rtl_tcp_ips)

    _port = start_port
    if rtl_tcp_ips != None:
        for channel, ip in zip(channels, rtl_tcp_ips):
            print("rtl_tcp," + ip)
            process = subprocess.Popen(["./welle-cli", "-F", "rtl_tcp," + ip, "-c", channel, "-Dw", str(_port)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            _port += 1
            subprocesses.append(process)

            threading.Thread(target=read_output, args=(process, "stdout"), daemon=True).start()
            threading.Thread(target=read_output, args=(process, "stderr"), daemon=True).start()


    threading.Thread(target=app.run, daemon=True).start()

    for process in subprocesses:
        process.wait()

    # app.run()