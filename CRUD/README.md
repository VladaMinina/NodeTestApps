# 🚀 Welcome to your new awesome project!

This project has been created using **webpack-cli**, you can now run


npm run start:prod
npm run start:dev
npm test
npm run start:multi

How Works CLUSTER ?????
Initial Request:
When a request comes to http://localhost:3322, it hits the load balancer running in the primary process.

Load Balancer:
The load balancer determines which worker to send the request to (this logic needs adjustment, as previously mentioned).
It creates an internal HTTP request to the selected worker’s port.

Worker Processes:
The request is received by the appropriate worker (e.g., http://localhost:3323).
Each worker processes the request using the router and sends back the response.

Response Flow:
The response from the worker is piped back through the load balancer to the original requester.