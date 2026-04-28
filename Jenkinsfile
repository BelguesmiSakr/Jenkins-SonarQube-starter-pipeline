pipeline {
    agent any

    tools {
        nodejs 'NodeJS 20'
    }

    // ── Parameters allow manual rollback by specifying a previous tag ─────────
    parameters {
        string(name: 'IMAGE_TAG', defaultValue: "v${BUILD_NUMBER}", description: 'Docker image tag (e.g. v5 for rollback)')
    }

    environment {
        DOCKERHUB_USER     = 'belguesmisakr'   
        BACKEND_IMAGE      = "${DOCKERHUB_USER}/cicd-backend"
        FRONTEND_IMAGE     = "${DOCKERHUB_USER}/cicd-frontend"
        SONAR_HOST_URL     = 'http://34.241.59.9:9000'
        VM2_HOST           = 'ubuntu@108.131.4.9'
        COMPOSE_FILE_PATH  = '/home/ubuntu/app'
    }

    stages {

        // ── Stage 1: Checkout ─────────────────────────────────────────────────
        stage('Checkout') {
            steps {
                checkout scm
                echo "Building tag: ${params.IMAGE_TAG}"
            }
        }

        // ── Stage 2: Install Dependencies ─────────────────────────────────────
        stage('Install Dependencies') {
            parallel {
                stage('Backend deps') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend deps') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        // ── Stage 3: Run Tests ────────────────────────────────────────────────
        stage('Run Tests') {
            parallel {
                stage('Backend tests') {
                    steps {
                        dir('backend') {
                            sh 'npm test -- --forceExit'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true, testResults: 'backend/junit.xml'
                        }
                    }
                }
                stage('Frontend tests') {
                    steps {
                        dir('frontend') {
                            sh 'CI=true npm test'
                        }
                    }
                }
            }
        }

        // ── Stage 4: SonarQube Analysis (sequential to avoid OOM on t3.small) ──
        stage('SonarQube Analysis - Backend') {
            steps {
                dir('backend') {
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${tool 'SonarQube Scanner'}/bin/sonar-scanner \
                              -Dsonar.projectKey=cicd-backend \
                              -Dsonar.sources=src \
                              -Dsonar.tests=tests \
                              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                              -Dsonar.scanner.javaOpts=-Xmx256m
                        """
                    }
                }
            }
        }

        stage('SonarQube Analysis - Frontend') {
            steps {
                dir('frontend') {
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${tool 'SonarQube Scanner'}/bin/sonar-scanner \
                              -Dsonar.projectKey=cicd-frontend \
                              -Dsonar.sources=src \
                              -Dsonar.exclusions=**/*.test.js \
                              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                              -Dsonar.scanner.javaOpts=-Xmx256m
                        """
                    }
                }
            }
        }

        // ── Stage 5: Quality Gate ─────────────────────────────────────────────
        stage('Quality Gate') {
            steps {
                // Waits up to 5 minutes for SonarQube webhook callback
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // ── Stage 6: Build Docker Images ──────────────────────────────────────
        stage('Build Docker Images') {
            parallel {
                stage('Build backend image') {
                    steps {
                        dir('backend') {
                            sh "docker build -t ${BACKEND_IMAGE}:${params.IMAGE_TAG} -t ${BACKEND_IMAGE}:latest ."
                        }
                    }
                }
                stage('Build frontend image') {
                    steps {
                        dir('frontend') {
                            sh "docker build -t ${FRONTEND_IMAGE}:${params.IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest ."
                        }
                    }
                }
            }
        }

        // ── Stage 7: Push to DockerHub ────────────────────────────────────────
        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'
                    sh "docker push ${BACKEND_IMAGE}:${params.IMAGE_TAG}"
                    sh "docker push ${BACKEND_IMAGE}:latest"
                    sh "docker push ${FRONTEND_IMAGE}:${params.IMAGE_TAG}"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                }
            }
        }

        // ── Stage 8: Deploy to VM2 via SSH ────────────────────────────────────
        stage('Deploy to Staging') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'vm2-ssh-key',
                    keyFileVariable: 'SSH_KEY'
                )]) {
                    sh """
                        # Copy docker-compose.yml to VM2
                        scp -i \$SSH_KEY -o StrictHostKeyChecking=no \
                            docker-compose.yml ${VM2_HOST}:${COMPOSE_FILE_PATH}/docker-compose.yml
                    """
                }
            }
        }

        // ── Stage 9: Run docker-compose on VM2 ───────────────────────────────
        stage('Run docker-compose') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'vm2-ssh-key',
                    keyFileVariable: 'SSH_KEY'
                )]) {
                    sh """
                        ssh -i \$SSH_KEY -o StrictHostKeyChecking=no ${VM2_HOST} \
                          "cd ${COMPOSE_FILE_PATH} && \
                           DOCKERHUB_USER=${DOCKERHUB_USER} IMAGE_TAG=${params.IMAGE_TAG} \
                           docker compose pull && \
                           DOCKERHUB_USER=${DOCKERHUB_USER} IMAGE_TAG=${params.IMAGE_TAG} \
                           docker compose up -d --remove-orphans"
                    """
                }
            }
        }

        // ── Stage 10: Verify Deployment ───────────────────────────────────────
        stage('Verify Deployment') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'vm2-ssh-key',
                    keyFileVariable: 'SSH_KEY'
                )]) {
                    sh """
                        ssh -i \$SSH_KEY -o StrictHostKeyChecking=no ${VM2_HOST} \
                          "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
                    """
                }
            }
        }
    }

    // ── Post Actions ──────────────────────────────────────────────────────────
    post {
        success {
            echo "Pipeline PASSED — image tag: ${params.IMAGE_TAG}"
            echo "Frontend: http://${VM2_HOST.split('@')[1]}"
            echo "Backend:  http://${VM2_HOST.split('@')[1]}:3000/health"
        }
        failure {
            echo "Pipeline FAILED — check logs above"
        }
        always {
            // Clean up local Docker images to save disk space
            sh "docker rmi ${BACKEND_IMAGE}:${params.IMAGE_TAG} || true"
            sh "docker rmi ${FRONTEND_IMAGE}:${params.IMAGE_TAG} || true"
        }
    }
}
