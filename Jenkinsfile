pipeline {
    agent any

    environment {
        APP_NAME = "MyPortfolioApp"
        REPO_URL = 'https://github.com/sybozz/portfolio.git'
        GIT_BRANCH = 'main'
        DOCKER_IMAGE_NAME = 'sybozz/vite-react-app'
        DEPLOY_PATH = '/var/www/app'
        DOCKER_COMPOSE_FILE = "${DEPLOY_PATH}/docker-compose.yaml"
        DATE_TAG = "${env.BUILD_NUMBER}-${new Date().format('dd-MM-HHmm')}"
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
                cleanWs()
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: "${GIT_BRANCH}", url: "${REPO_URL}"
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

        stage('Update Docker Compose and Restart') {
            steps {
                script {
                    // Update image tag in the remote docker-compose.yaml
                    sh """
                        sed -i 's|image: ${DOCKER_IMAGE_NAME}:.*|image: ${DOCKER_IMAGE_NAME}:${DATE_TAG}|' ${DOCKER_COMPOSE_FILE}
                        docker-compose -f ${DOCKER_COMPOSE_FILE} pull
                        docker-compose -f ${DOCKER_COMPOSE_FILE} down --remove-orphans --volumes
                        docker-compose -f ${DOCKER_COMPOSE_FILE} up -d
                    """
                }
            }
        }
        
        stage('Send Google Chat Notification') {
            when {
                expression { currentBuild.currentResult == 'SUCCESS' }
            }
            steps {
                withCredentials([string(credentialsId: 'google-chat-webhook', variable: 'WEBHOOK_URL')]) {
                    script {
                        def msg = """
                        {
                          "text": "${APP_NAME} has been updated.\\nImage: ${DOCKER_IMAGE_NAME}:${DATE_TAG}"
                        }
                        """
                        sh """
                            curl -X POST -H 'Content-Type: application/json' \
                                 -d '${msg}' \
                                 "$WEBHOOK_URL"
                        """
                    }
                }
            }
        }
    }
}