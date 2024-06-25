import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from "@playwright/test/reporter";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

class GraphReporter implements Reporter {
  isServerRunning = false;
  server: http.Server | null = null;
  io: Server | null = null;
  durations: Durations = {
    js: {},
    wasm: {},
    webgpu: {},
  };
  onBegin(config: FullConfig, suite: Suite) {
    // console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase, result: TestResult) {
    if (isHeavyMathCalculationPage(test)) {
      if (!this.isServerRunning) {
        this.isServerRunning = true;
        this.server = http.createServer();
        this.server.on("request", (req, res) => {
          // if get request
          if (req.method === "GET") {
            if (req.url === "/") {
              res.writeHead(200, { "Content-Type": "text/html" });
              const __dirname = path.dirname(fileURLToPath(import.meta.url));
              const filePath = path.join(__dirname, "../public/benchmark.html");
              const readStream = fs.createReadStream(filePath);
              readStream.pipe(res);
            } else if (req.url === "/durations") {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(this.durations));
            }
          }
        });
        this.io = new Server(this.server);
        this.server.listen(5000, () => {
          console.log("Server running at http://localhost:5000/");
        });
      }
    }
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // console.log(`Finished test ${test.title}: ${result.status}`);
    if (isHeavyMathCalculationPage(test)) {
      // before closing the server, save the durations to a js file that expose the durations object to the window object
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const filePath = path.join(__dirname, "../public/durations.js");
      fs.writeFileSync(filePath, `window.durations = ${JSON.stringify(this.durations)}`);
      console.log("durations.json file is created. closing the server.");
      // close the server
      this.server?.close();
      this.isServerRunning = false;
    }
  }

  onEnd(result: FullResult) {
    // console.log(`Finished the run: ${result.status}`);
  }

  onStdOut(chunk: string | Buffer, test: TestCase, result: TestResult): void {
    if (isHeavyMathCalculationPage(test)) {
      let str = chunk.toString();
      if (isStrTheDurations(str)) {
        this.durations = JSON.parse(str);
        // use websocket to send the durations to the client
        this.io?.emit("durations", this.durations);
      }
    }
  }
}

export default GraphReporter;

function isHeavyMathCalculationPage(test?: TestCase): boolean {
  return !!test && !!test.title && test.title.includes("heavyMathCalculation");
}

function isStrTheDurations(str: string): boolean {
  return str.includes("js") && str.includes("wasm") && str.includes("webgpu");
}
