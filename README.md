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
├── Dockerfile
├── .dockerignore
├── Jenkinsfile
├── k8s-deployment.yaml
├── k8s-service.yaml
├── k8s-ingress.yaml
├── package.json
├── userdata.sh
└── vite.config.js
```


## Installation and Running Locally

1. Clone the repo:

  ```bash
  git clone https://github.com/sybozz/portfolio.git
  cd portfolio
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
  docker build -t vite-react-app .
  ```

Run the container:
  ```bash
  docker run -d -p 9097:80 vite-react-app
  ```

Open in browser:
  ```bash
  http://localhost:9097
  ```

## Build and Push Docker Image
1.	Build the app locally:
```bash
npm run build
```
2.	Build Docker image:
```bash
docker build -t sybozz/vite-react-app .
```
3.	Log in to Docker Hub:
```bash
docker login
```
4.	Push image:
```bash
docker push sybozz/vite-react-app
```


## Deploy on EC2 using Docker Compose
1.	SSH into your EC2 instance:
```bash
ssh ec2-user@your-ec2-ip
```
2.	Create app directory:
```bash
sudo mkdir -p /var/www/app
```
3.	Copy docker-compose.yml into /var/www/app, then:
```bash
cd /var/www/app
```
4.	Pull and run the container:
```bash
docker-compose up -d
```
5.	Access your app in browser:
```bash
http://your-ec2-ip:9097
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
  docker build -t vite-react-app .
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
  minikube service vite-react-app-service
  ```
7.	Minikube will display and open a URL like:
  ```bash
  http://192.168.49.2:32734
  ```

Open this in your browser to view the app.


## AWS Development

### Step 1: Launch an EC2 Instance
- Create an AWS EC2 instance using Ubuntu (recommanded).

### Step 2: Prepare EC2 User Data Script
Create a file named `userdata.sh` and use the contents of the file to automate Jenkins and Docker setup during EC2 initialization.


`userdata.sh` will do the following operations: 
1.	Installs Jenkins
2.	Installs Docker
3.	Adds jenkins user to the docker group
4.	Restarts Jenkins and Docker services
5.	Ensures Jenkins can run Docker commands


### Step 3: App Deployment Folder
-	On the same Jenkins EC2 server, create a directory:
```bash
mkdir -p /var/www/app
```

### Step 4: Docker Compose Deployment
- 	Place the `docker-compose.yaml` file inside `/var/www/app`

-	Run the application with:

```bash
docker-compose -f /var/www/app/docker-compose.yaml up -d
```

- Access the application at:
```bash
http://<EC2_PUBLIC_IP>:9097
```


## Jenkins Pipeline Development

### Pipeline File Name: `Jenkinsfile`
### Pipeline Name: `base-pipeline`

This Jenkins pipeline will:
- Trigger when a pull request from `develop` to `main` is **merged and closed**
- Pull the latest code from GitHub
- Build a Docker image with a dynamic tag:
  ```
  pipeline_build_number-day-month-hour-minute
  ```
- Push the Docker image to Docker Hub using Jenkins credentials
- Logout from Docker Hub
- Clean Jenkins workspace
- Update the image tag in `/var/www/app/docker-compose.yaml` using Linux shell commands
- Restart the container using `docker-compose` so the new image is applied
- On success, send a Google Chat notification using Google Chat Webhook in Jenkins.

## Author
[Sharif Ahmed](https://github.com/sybozz)