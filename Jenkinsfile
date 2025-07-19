pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = "sybozz/vite-react-app"
        DATE_TAG = "${env.BUILD_NUMBER}-${new Date().format('dd-MM-HHmm')}"
        DOCKER_COMPOSE_PATH = "/var/www/app/docker-compose.yaml"
    }

    triggers {
        GenericTrigger(
            genericVariables: [
                [key: 'action', value: '$.action'],
                [key: 'base', value: '$.pull_request.base.ref'],
                [key: 'head', value: '$.pull_request.head.ref'],
                [key: 'merged', value: '$.pull_request.merged']
            ],
            token: 'merge-to-main',
            regexpFilterText: '$action $base $head $merged',
            regexpFilterExpression: '^closed main develop true$'
        )
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/sybozz/portfolio.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE_NAME}:${DATE_TAG} ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    script {
                        sh """
                            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                            docker push ${DOCKER_IMAGE_NAME}:${DATE_TAG}
                            docker logout
                        """
                    }
                }
            }
        }

        stage('Update docker-compose and Restart') {
            steps {
                sh """
                    sed -i 's|image: ${DOCKER_IMAGE_NAME}:.*|image: ${DOCKER_IMAGE_NAME}:${env.DATE_TAG}|' ${DOCKER_COMPOSE_PATH}
                    docker-compose -f ${DOCKER_COMPOSE_PATH} pull
                    docker-compose -f ${DOCKER_COMPOSE_PATH} up -d
                """
            }
        }
    }
}