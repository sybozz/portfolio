pipeline {
    agent any

    environment {
        DOCKER_IMAGE_NAME = 'sybozz/vite-react-app'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        COMPOSE_PATH = '/var/www/app'
        DATE_TAG = ''
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
        stage('Clean Workspace') {
            steps {
                cleanWs() // Remove previous build files
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/sybozz/portfolio.git'
            }
        }

        stage('Set Image Tag') {
            steps {
                script {
                    env.DATE_TAG = "${env.BUILD_NUMBER}-" + new Date().format('dd-MM-HHmm')
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE_NAME}:${DATE_TAG} ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: DOCKER_CREDENTIALS_ID,
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${DOCKER_IMAGE_NAME}:${DATE_TAG}
                        docker logout
                    """
                }
            }
        }

        stage('Update Docker Compose') {
            steps {
                sh """
                    sed -i 's|image: ${DOCKER_IMAGE_NAME}:.*|image: ${DOCKER_IMAGE_NAME}:${DATE_TAG}|' ${COMPOSE_PATH}/docker-compose.yaml
                """
            }
        }

        stage('Restart Application') {
            steps {
                sh """
                    cd ${COMPOSE_PATH}
                    docker-compose down
                    docker-compose up -d
                """
            }
        }
    }
}