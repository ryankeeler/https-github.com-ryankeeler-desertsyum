# ProposifyTesting

# To setup remote runner on github to run the project, follow the below steps

# Go to your github repository -> Settings -> Actions -> Runners -> New self hosted runners
# Open your C drive on file explorer and open powershell
# Follow the steps you see on the github page one by one (do not change any default settings)


# You may also copy paste the below steps one by one on the powershell
# 1. mkdir actions-runner; cd actions-runner
# 2. Invoke-WebRequest -Uri https://github.com/actions/runner/releases/download/v2.321.0/actions-runner-win-x64-2.321.0.zip -OutFile actions-runner-win-x64-2.321.0.zip
# 3. if((Get-FileHash -Path actions-runner-win-x64-2.321.0.zip -Algorithm SHA256).Hash.ToUpper() -ne '88d754da46f4053aec9007d172020c1b75ab2e2049c08aef759b643316580bbc'.ToUpper()){ throw 'Computed checksum did not match' }
# 4. Add-Type -AssemblyName System.IO.Compression.FileSystem ; [System.IO.Compression.ZipFile]::ExtractToDirectory("$PWD/actions-runner-win-x64-2.321.0.zip", "$PWD")
# 5. Get the configuration link from your github link from [Settings -> Actions -> Runners -> New self hosted runners-> Configure]
# 6. Press enter for all the default settings
# 7. ./run.cmd
# 8. Go to Actions -> Click on Proposify Automation test -> workflow -> run workflow
