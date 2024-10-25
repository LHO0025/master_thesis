from flask import Flask, Response
import subprocess
from subprocess import run, CalledProcessError
import json 
from flask import jsonify
import requests

class Device:
    def __init__(self, index, port, channel):
        self.index = index
        self.port = port
        self.channel = channel

app = Flask(__name__)


number_of_devices = 1
multiplexes = []

@app.route('/info')
def info():
    jsons = []
    for i in range(number_of_devices):
        url = f'http://localhost:{str(welle_io_starting_port + i)}/mux.json'
        response = requests.get(url)
        jsons.append(response.json())
    return jsonify({
        "numberOfDevices": number_of_devices,
        "devices": jsons 
    })



channels = ["10D"]
rtl_tcp_starting_port = 1250
welle_io_starting_port = 7980



is_running = True 
# TODO podivat se jestli neexistuje nejake lepsi reseni monitoringu zdravi procesu
# TODO pohandlovat ukonceni procesu nejak lip
if __name__ == '__main__': 
    for index, channel in enumerate(channels):
        multiplexes.append(Device(index, welle_io_starting_port + index, channel))


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





