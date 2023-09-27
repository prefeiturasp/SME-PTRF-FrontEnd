pipeline {
    environment {
      branchname =  env.BRANCH_NAME.toLowerCase()
      kubeconfig = getKubeconf(env.branchname)
      registryCredential = 'jenkins_registry'
      namespace = "${env.branchname == 'develop' ? 'sme-ptrf-dev' : env.branchname == 'homolog' ? 'sme-ptrf-hom' : env.branchname == 'homolog-r2' ? 'sme-ptrf-hom2' : env.branchname == 'testejenkins2' ? 'testejenkins' : 'sme-ptrf' }"
    }

    agent {
      node { label 'AGENT-NODES' }
    }

    options {
      buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '5'))
      disableConcurrentBuilds()
      skipDefaultCheckout()
    }

    stages {

        stage('CheckOut') {
            steps { checkout scm }
        }



        stage('AnaliseCodigo') {
	      when { branch 'testejenkins2' }
          steps {
              withSonarQubeEnv('sonarqube-local'){
                sh 'echo "[ INFO ] Iniciando analise Sonar..." && sonar-scanner \
                -Dsonar.projectKey=SME-PTRF-FrontEnd \
                -Dsonar.sources=.'
            }
          }
        }



        stage('Build') {
          when { anyOf { branch 'master_'; branch 'main_'; branch "_story/*"; branch 'development_'; branch 'develop_'; branch 'release_'; branch 'homolog_'; branch 'homolog-r2_'; branch 'testejenkins2';  } }
          steps {
            script {
              imagename1 = "registry.sme.prefeitura.sp.gov.br/${env.branchname}/ptrf-frontend"
              //imagename2 = "registry.sme.prefeitura.sp.gov.br/${env.branchname}/sme-outra"
              dockerImage1 = docker.build(imagename1, "-f Dockerfile .")
              //dockerImage2 = docker.build(imagename2, "-f Dockerfile_outro .")
              docker.withRegistry( 'https://registry.sme.prefeitura.sp.gov.br', registryCredential ) {
              dockerImage1.push()
              //dockerImage2.push()
              }
              sh "docker rmi $imagename1"
              //sh "docker rmi $imagename2"
            }
          }
        }

        stage('Deploy'){
            when { anyOf { branch 'master_'; branch 'main_'; branch "_story/*"; branch 'development_'; branch 'develop_'; branch 'release_'; branch 'homolog_'; branch 'homolog-r2_'; branch 'testejenkins2';  } }
            steps {
                script{
                    if ( env.branchname == 'main' ||  env.branchname == 'master' || env.branchname == 'homolog' || env.branchname == 'release' ) {
                        sendTelegram("🤩 [Deploy ${env.branchname}] Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nMe aprove! \nLog: \n${env.BUILD_URL}")
                        timeout(time: 24, unit: "HOURS") {
                            input message: 'Deseja realizar o deploy?', ok: 'SIM', submitter: 'alessandro_fernandes, kelwy_oliveira, anderson_morais, luis_zimmermann, rodolpho_azeredo, ollyver_ottoboni, rayane_santos, lucas_rocha'
                        }
                    }
                      withCredentials([file(credentialsId: "${kubeconfig}", variable: 'config')]){
		        sh('if [ -f '+"$home"+'/.kube/config ]; then rm -f '+"$home"+'/.kube/config; fi')
                        sh('cp $config '+"$home"+'/.kube/config')
			sh "kubectl rollout restart deployment/ptrf-frontend -n ${namespace}"
                        sh('if [ -f '+"$home"+'/.kube/config ]; then rm -f '+"$home"+'/.kube/config; fi')
                      }
                }
            }
        }

        stage('Ambientes'){
          when { anyOf {  branch 'master'; branch 'main' } }
          steps {
            withCredentials([file(credentialsId: "${kubeconfig}", variable: 'config')]){
              sh('cp $config '+"$home"+'/.kube/config')
              sh 'kubectl rollout restart deployment/treinamento-frontend -n sigescola-treinamento'
              sh 'kubectl rollout restart deployment/treinamento-frontend -n sigescola-treinamento2'
              sh('if [ -f '+"$home"+'/.kube/config ]; then rm -f '+"$home"+'/.kube/config; fi')
            }
          }
        }

    }

  post {
    success { sendTelegram("🚀 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Success \nLog: \n${env.BUILD_URL}console") }
    unstable { sendTelegram("💣 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Unstable \nLog: \n${env.BUILD_URL}console") }
    failure { sendTelegram("💥 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Failure \nLog: \n${env.BUILD_URL}console") }
    aborted { sendTelegram ("😥 Job Name: ${JOB_NAME} \nBuild: ${BUILD_DISPLAY_NAME} \nStatus: Aborted \nLog: \n${env.BUILD_URL}console") }
  }
}
def sendTelegram(message) {
    def encodedMessage = URLEncoder.encode(message, "UTF-8")
    withCredentials([string(credentialsId: 'telegramToken', variable: 'TOKEN'),
    string(credentialsId: 'telegramChatId', variable: 'CHAT_ID')]) {
        response = httpRequest (consoleLogResponseBody: true,
                contentType: 'APPLICATION_JSON',
                httpMode: 'GET',
                url: 'https://api.telegram.org/bot'+"$TOKEN"+'/sendMessage?text='+encodedMessage+'&chat_id='+"$CHAT_ID"+'&disable_web_page_preview=true',
                validResponseCodes: '200')
        return response
    }
}
def getKubeconf(branchName) {
    if("main".equals(branchName)) { return "config_prd_"; }
    else if ("master".equals(branchName)) { return "config_prd_"; }
    else if ("homolog".equals(branchName)) { return "config_release_"; }
    else if ("homolog-r2".equals(branchName)) { return "config_release_"; }
    else if ("release".equals(branchName)) { return "config_release_"; }
    else if ("development".equals(branchName)) { return "config_release_"; }
    else if ("develop".equals(branchName)) { return "config_release_"; }
}
