import subprocess
import time

# List to keep track of processes
processes = []

# Function to start a new process
def start_process(command):
    return subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# Start multiple processes
for _ in range(5):  # Change this number to create more instances
    process = start_process(["python3", "-c", "import time; time.sleep(10)"])  # Replace with your command
    processes.append(process)

print("ASDASDASD")

# Monitor the processes
try:
    while processes:
        for process in processes:
            # Check if the process has terminated
            if process.poll() is not None:
                # Process has finished or crashed
                return_code = process.returncode
                if return_code != 0:
                    print(f"Process {process.pid} crashed with exit code {return_code}")
                else:
                    print(f"Process {process.pid} completed successfully")
                # Remove the process from the list after it finishes
                processes.remove(process)

        # Add a sleep to avoid busy-waiting
        time.sleep(1)

except KeyboardInterrupt:
    print("Monitoring interrupted. Terminating all processes...")
    for process in processes:
        process.terminate()

# Optional: Wait for all processes to terminate if needed
for process in processes:
    process.wait()
