pipeline {
    agent any

    environment {
        DOCKER_REPO = 'felpsxill/malware-app'
        FRONTEND_DIR = 'Frontend'
        BACKEND_DIR = 'Backend'
        FRONTBACK_DIR = 'FrontBack'
        MYSQL_DIR = 'Mysql'
        K8S_DIR = 'k8s'
    }

    stages {
        stage('Initialize Pipeline') {
            steps {
                script {
                    sh 'git clone https://github.com/xill75/malware-app.git'
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: '6b0d0883-8a06-4db0-b0ea-a0248eae5876', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh """
                            echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin
                        """
                    }
                }
            }
        }

        stage('Build and Push Frontend') {
            steps {
                dir(FRONTEND_DIR) {
                    script {
                        sh "docker build --no-cache -t ${DOCKER_REPO}:frontend-latest -f Dockerfile ."
                        sh "docker push ${DOCKER_REPO}:frontend-latest"
                    }
                }
            }
        }

        stage('Build and Push Backend') {
            steps {
                dir(BACKEND_DIR) {
                    script {
                        sh "docker build --no-cache -t ${DOCKER_REPO}:backend-latest -f Dockerfile ."
                        sh "docker push ${DOCKER_REPO}:backend-latest"
                    }
                }
            }
        }

        stage('Build and Push Frontend and Backend') {
            steps {
                dir(FRONTBACK_DIR) {
                    script {
                        sh "docker build --no-cache -t ${DOCKER_REPO}:frontend-backend-latest -f Dockerfile ."
                        sh "docker push ${DOCKER_REPO}:frontend-backend-latest"
                    }
                }
            }
        }

        stage('Build and Push MySQL Image') {
            steps {
                dir(MYSQL_DIR) {
                    script {
                        sh "docker build --no-cache -t ${DOCKER_REPO}:mysql-latest -f Dockerfile ."
                        sh "docker push ${DOCKER_REPO}:mysql-latest"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withCredentials([file(credentialsId: '7e2b1354-0f09-450c-9117-01d55771317b', variable: 'KUBECONFIG')]) {
                        sh "microk8s kubectl apply -f ${K8S_DIR}/mysql-pv.yaml"
                        sh "microk8s kubectl apply -f ${K8S_DIR}/deployment-mdb.yaml"
                        sh "microk8s kubectl apply -f ${K8S_DIR}/deployment-front-back.yaml"
                        sh "microk8s kubectl apply -f ${K8S_DIR}/deployment-be.yaml"
                        sh "microk8s kubectl apply -f ${K8S_DIR}/service-be.yaml"
                        sh "microk8s kubectl apply -f ${K8S_DIR}/deployment-fe.yaml"
                        sh "microk8s kubectl apply -f ${K8S_DIR}/service-fe.yaml"
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            cleanWs()
        }
    }
}
