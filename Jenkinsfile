pipeline {
	agent any
	stages {
		stage('Checkout SCM') {
			steps {
				git '/home/Documents/GitHub/JenkinsDependencyCheckTest'
			}
		}

        stage('OWASP Dependency-Check Vulnerabilities') {
            steps {
                dependencyCheck additionalArguments: ''' 
                            -o './'
                            -s './'
                            -f 'ALL' 
                            --prettyPrint''', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
                
                dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            }
        }

        stage('Integration Testing') {
            steps {
                script {
                    try {
						sh 'npm install'
                        sh 'npm test'
                    } catch (Exception e) {
                        error("Integration tests failed: ${e.message}")
                    }
                }
            }
        }

		stage('UI Testing') {
            steps {
                script {
                    try {
						sh 'npm install'
                        sh 'npm test'
                    } catch (Exception e) {
                        error("UI tests failed: ${e.message}")
                    }
                }
            }
        }

	}
}