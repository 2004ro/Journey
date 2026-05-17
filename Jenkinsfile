pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        IMAGE_FRONTEND = 'yourdockerhub/travel-frontend'
        IMAGE_BACKEND = 'yourdockerhub/travel-backend'
        TAG = "${env.BUILD_ID}"
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
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build & Push Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t $IMAGE_FRONTEND:$TAG .'
                    sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push $IMAGE_FRONTEND:$TAG'
                    sh 'docker push $IMAGE_FRONTEND:latest'
                }
            }
        }

        stage('Docker Build & Push Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t $IMAGE_BACKEND:$TAG .'
                    sh 'docker push $IMAGE_BACKEND:$TAG'
                    sh 'docker push $IMAGE_BACKEND:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
        }
    }
}
