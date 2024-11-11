pipeline {
    agent any

    environment {
        DOCKER_REPO = 'felpsxill/malware-app'
        FRONTBACK_DIR = 'FrontBack'
        MYSQL_DIR = 'Mysql'
        K8S_DIR = 'k8s'
    }

    stages {
        stage('Initialize Pipeline') {
            steps {
                script {
                    checkout scm
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
                        sh "microk8s kubectl apply -f ${K8S_DIR}/mysql-storage.yaml"
                        sh "microk8s kubectl apply -f ${K8S_DIR}/stateful-mdb.yaml"
                        sh "microk8s kubectl apply -f ${K8S_DIR}/service-db.yaml"
                        sh "microk8s kubectl apply -f ${K8S_DIR}/deployment-front-back.yaml"
                        sh "microk8s kubectl apply -f ${K8S_DIR}/service-front-back.yaml"
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
