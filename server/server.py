from flask import Flask, Response
import subprocess
from subprocess import run, CalledProcessError
import json 
from flask import jsonify
import requests
import argparse
import uuid
from flask_cors import CORS

class Device:
    def __init__(self, index, port):
        self.id = uuid.uuid4()
        self.index = index
        self.port = port
        self.channel = "10B"

app = Flask(__name__)
CORS(app)

devices = []

ERROR_MESSAGE_GENERIC = "Something went wrong"

@app.route('/info')
def info():
    jsons = []
    for i in range(len(devices)):
        try:
            url = f'http://localhost:{str(welle_io_starting_port + i)}/mux.json'
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            data = response.json()

            url = f'http://localhost:{str(welle_io_starting_port + i)}/channel'
            response = requests.get(url, timeout=5)
            response.raise_for_status()


            data["tunedChannel"] = response.text
            data["port"] = welle_io_starting_port + i
            data["deviceId"] = devices[i].id
            jsons.append(data)
        except (requests.RequestException, ValueError) as e:
            print(f"Error fetching data from {url}: {e}")
            return ERROR_MESSAGE_GENERIC, 500

    return jsonify({"devices": jsons})



rtl_tcp_starting_port = 1250
welle_io_starting_port = 7979


is_running = True 
# TODO podivat se jestli neexistuje nejake lepsi reseni monitoringu zdravi procesu
# TODO pohandlovat ukonceni procesu nejak lip
if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description="A script that accepts the number of devices to use."
    )

    parser.add_argument(
        '-d', '--device_count',  # Support both short and long flags
        type=int,
        default=1,              # Default value if not provided
        help="Number of devices to use (default: 1)"
    )

    args = parser.parse_args()
    device_count = args.device_count

    for index in range(0, device_count):
        devices.append(Device(index, welle_io_starting_port + index))



    # TODO zapnout procesy
    app.run()

    # rtl_tcp_processes = []
    # welle_io_processes = []

    # for index, channel in enumerate(channels):
    #     # multiplexes.append(Multiplex(welle_io_starting_port + index, channel))
    #     rtl_tcp_processes.append(subprocess.Popen(["rtl_tcp", "-d", str(index), "-p", str(rtl_tcp_starting_port + index)], stdout=subprocess.PIPE, stderr=subprocess.PIPE))




    # while is_running:
    #     for i, process in enumerate(rtl_tcp_processes):
    #         if process.poll() is not None: 
    #             print(f"Process {i} has terminated.")
    #             is_running = False

    #     for i, process in enumerate(welle_io_processes):
    #         if process.poll() is not None: 
    #             print(f"Process {i} has terminated.")
    #             is_running = False


    # for process in rtl_tcp_processes:
    #     process.terminate()
    #     process.wait()  

    # for process in welle_io_processes:
    #     process.terminate()
    #     process.wait()  





