# Lab week 9 - Application logging
This lab guides you to make use of the Elastic Stack in an Express application with a logging framework.

## Setup the Elastic Stack VM

- Import the .OVA file from the NAS (https://nas.ti.howest.be) in the folder /TI-StudentShare/TI-S3-WebTechnology/22-23
- Login using shh with the username/password `user/user`
- Browse to `http://IP_OF_ELASTIC_VM:5601` there should be a loginscreen of Kibana
  - If the response in the browser is 'Kibana server not ready', stop the elasticsearch, logstash, kibana service and start again. 
  - `sudo systemctl stop [servicename]`
    - If stopping the service doesn't work
    - `ps -aux | grep [servicename]`
    - `sudo kill -9 [pid]`
  - `sudo systemctl start [servicename]`
- Login with `elastic/LuEoQBhfMep1ArKATVCe`
- View the dummydata in the discovery
  - *Note: the requests are from oct 1 set the time filter correct*
- Create a new dashboard based on the HTTP request methods
  
## Setup application VM
- Create a blank VM with Debian 11
  - Install nodejs `sudo apt install nodejs`
  - Install npm `sudo apt install npm`
  - Install express framework `npm install express --save`

## Create an application with logging
- Install winston or pico as logging framework
    - Install Morgan logging framework `npm install morgan`
    - Install pino logging framework `npm install pino express-pino-logger`

- Create a simple Express application
  - *Note: test in browser*
- Write logs to file
  - *Control log format in filesystem*

`see .zip file for application`

## Send logs to the elastic stack
### Install Filebeat

Execute the following commands in the application VM to install Filebeat (Filebeat will send the logs to the Elastic Stack)
- `sudo apt install gnupg`
- `wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -`
- `sudo apt-get install apt-transport-https`
- `echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-8.x.list`
- `sudo apt-get update`
- `sudo apt install filebeat`


### Configure Filebeat
Edit the filebeat yml file to connect Filebeat to the Elastic Stack

`sudo vim /etc/filebeat/filebeat.yml`

**Comment out the next section**
```
#output.elasticsearch:
  # Array of hosts to connect to.
  #hosts: ["localhost:9200"]
```
**Enable the next section**
```
output.logstash:
  # The Logstash hosts
  hosts: ["IP_OF_ELASTIC_VM :5044"]  
```

### Enable Filebeat Apache module
There are many prebuilt filebeat configurations available, Apache is also supported. Express default logs are the same as Apache logs.

`sudo filebeat modules enable apache`

Enable the built-in apache module.


Change both false to true in /etc/filebeat/modules.d/apache.yml
```
# Module: apache
# Docs: https://www.elastic.co/guide/en/beats/filebeat/8.5/filebeat-module-apache.html

- module: apache
  # Access logs
  access:
    enabled: true

    # Set custom paths for the log files. If left empty,
    # Filebeat will choose the paths depending on your OS.
    var.paths: ["/home/user/morganLogging/log/[ac]*.log", "/home/user/pinoLogging/*.log"]

  # Error logs
  error:
    enabled: true

    # Set custom paths for the log files. If left empty,
    # Filebeat will choose the paths depending on your OS.
    var.paths: ["/home/user/morganLogging/log/error.log"]
```

Enable filebeat service at boot time and start the service.

- `sudo systemctl enable filebeat`
- `sudo systemctl start filebeat`
- `sudo systemctl status filebeat`

Go to the Kibana environment [HTTP://IP_OF_ELASTICVM:5601], click on discover and create a new dataview based on the Filebeat index.

Create a new dashboard based on the data in the discover view (200, 404, url, ...)