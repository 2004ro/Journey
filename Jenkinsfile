pipeline {
    agent any

    tools {
        maven 'Maven3'
    }

    environment {
        DOCKER_CREDENTIALS = credentials('dockerhubcredentials')
        DOCKER_USERNAME    = "${DOCKER_CREDENTIALS_USR}"
        IMAGE_FRONTEND     = "${DOCKER_CREDENTIALS_USR}/travel-frontend"
        IMAGE_BACKEND      = "${DOCKER_CREDENTIALS_USR}/travel-backend"
        TAG                = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Login') {
            steps {
                sh 'echo "$DOCKER_CREDENTIALS_PSW" | docker login -u "$DOCKER_CREDENTIALS_USR" --password-stdin'
            }
        }

        stage('Docker Build & Push Backend') {
            steps {
                dir('backend') {
                    sh "docker build -t ${IMAGE_BACKEND}:${TAG} ."
                    sh "docker tag ${IMAGE_BACKEND}:${TAG} ${IMAGE_BACKEND}:latest"
                    sh "docker push ${IMAGE_BACKEND}:${TAG}"
                    sh "docker push ${IMAGE_BACKEND}:latest"
                }
            }
        }

        stage('Docker Build & Push Frontend') {
            steps {
                dir('frontend') {
                    sh "docker build -t ${IMAGE_FRONTEND}:${TAG} ."
                    sh "docker tag ${IMAGE_FRONTEND}:${TAG} ${IMAGE_FRONTEND}:latest"
                    sh "docker push ${IMAGE_FRONTEND}:${TAG}"
                    sh "docker push ${IMAGE_FRONTEND}:latest"
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker-compose down --remove-orphans || true'
                sh 'docker-compose up -d --pull always'
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }

        success {
            echo "✅ Build #${env.BUILD_NUMBER} deployed successfully!"
        }

        failure {
            echo "❌ Build #${env.BUILD_NUMBER} failed. Check logs above."
        }
    }
}