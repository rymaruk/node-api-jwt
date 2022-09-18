import cluster from "node:cluster";
import { cpus } from "node:os";
import process from "node:process";

const numReqs = { value: 0 };

// Message handler for the worker
function msgHandler(value) {
  if (value.cmd && value.cmd === "testNotifyRequestToTheWorker") {
    numReqs.value += 1;
  }
}

// Size of CPUs
const numCPUs = cpus().length;

export default function clusterRun(app) {
  if (cluster.isPrimary) {
    for (let i = 0; i < numCPUs; i++) {
      // Spawn a new worker process
      cluster.fork();
    }

    for (const id in cluster.workers) {
      cluster.workers[id].on("message", msgHandler);
    }

  } else {
    app.listen(5000, () => {
      // Notify primary about the request
      setTimeout(() => {
        if (typeof process.send === "function") {
        //   process.send({ cmd: `testNotifyRequestToTheWorker` });
        }
      }, 1000);
    });

    console.log(`Worker ${process.pid} started`);
  }
}
