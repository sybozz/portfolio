# Personal Portfolio Demo

This is a simple React + Vite demo project created as part of an exam submission.
It displays a welcome page with the developer’s name and demonstrates a basic setup for a modern frontend application.


## Project Features
-	Built with React 18
-	Powered by Vite for fast development and builds
-	Dockerized for container deployment
-	Kubernetes-ready using Minikube


## Project Structure
```
my-portfolio-demo/
├── public/
├── src/
├── dist/
├── Dockerfile
├── .dockerignore
├── k8s-deployment.yaml
├── k8s-service.yaml
├── k8s-ingress.yaml
├── package.json
└── vite.config.js
```


## Installation and Running Locally

1. Clone the repo:

  ```bash
  git clone https://github.com/your-username/your-repo.git
  cd your-repo
  ```

2.	Install dependencies:
  ```bash
  npm install
  ```
3.	Run the development server:
  ```bash
  npm run dev
  ```
4.	Open in browser:
  ```bash
  http://localhost:5173
  ```


## Docker Instructions

Build the Docker image:
  ```bash
  docker build -t vite-react-demo .
  ```

Run the container:
  ```bash
  docker run -d -p 3678:80 vite-react-demo
  ```

Open in browser:
  ```bash
  http://localhost:3678
  ```


## Kubernetes with Minikube
1.	Start Minikube:
  ```bash
  minikube start
  ```
2.	Use Minikube’s Docker daemon:
  ```bash
  eval $(minikube docker-env)
  ```
3.	Build the Docker image inside Minikube:
  ```bash
  docker build -t vite-react-demo .
  ```
4.	Set imagePullPolicy to Never in the deployment YAML:
  ```bash
  imagePullPolicy: Never
  ```
5.	Apply Kubernetes configurations:
  ```bash
  kubectl apply -f k8s-deployment.yaml
  kubectl apply -f k8s-service.yaml
  kubectl apply -f k8s-ingress.yaml
  ```
6.	Expose the app using Minikube’s service helper:
  ```bash
  minikube service vite-react-demo-service
  ```
7.	Minikube will display and open a URL like:
  ```bash
  http://192.168.49.2:32734
  ```

Open this in your browser to view the app.

1016

1033
