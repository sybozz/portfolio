pipeline {
  agent any

  stages {
    stage('Run only for PRs merged from develop -> main') {
      when {
        allOf {
          branch 'main'
          expression {
            def commitMessage = sh(script: "git log -1 --pretty=%B", returnStdout: true).trim()
            return commitMessage.contains("Merge pull request") && commitMessage.contains("from develop")
          }
        }
      }
      steps {
        echo "Detected a PR merge from develop to main. Proceeding..."
      }
    }

    // Add other stages here (Docker build, deploy, etc.)
  }
}