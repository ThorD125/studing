## copy keys from host to vm
ssh-copy-id user@vm_ip_address

## last lines of file
tail /var/log/apache2/access.log
tail -n 20 /var/log/apache2/access.log
tail -f /var/log/apache2/access.log
tail /var/log/nginx/access.log

## most usefull security headers
https://securityheaders.com/

### apache
Header Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';"
Header X-Content-Type-Options "nosniff"
Header X-Frame-Options "SAMEORIGIN"
Header X-XSS-Protection "1; mode=block"

### nginx

add_header Strict-Transport-Security "max-age=31536000; includeSubDomains"
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self';"
add_header X-Content-Type-Options "nosniff"
add_header X-Frame-Options "SAMEORIGIN"
add_header X-XSS-Protection "1; mode=block"


## check

### apache
sudo systemctl status apache2
sudo journalctl -u apache2
sudo journalctl -u apache2 -f
sudo apachectl configtest
tail /var/log/apache2/access.log
tail /var/log/apache2/error.log
tail -f /var/log/apache2/error.log
curl -I http://localhost/

### nginx
sudo systemctl status nginx
sudo journalctl -u nginx
sudo nginx -t
tail /var/log/nginx/error.log
tail -f /var/log/nginx/error.log
curl -I http://localhost/

### general
sudo journalctl -xe
sudo journalctl -xe | grep -i error
sudo journalctl -xe | grep -i warning
sudo journalctl -xe | grep -i fail
sudo journalctl -xe | grep -i denied
sudo journalctl -xe -u apache2


## modsecurity

sudo nano /etc/apache2/mods-enabled/security2.conf
IncludeOptional /etc/modsecurity/*.conf

add SecRuleEngine On
in virtual host files

create .conf file
/etc/modsecurity
 and add the rules
SecRule REQUEST_FILENAME “FILENAME.php" "id:'400001',chain,deny,log,msg:’LOGMESSAGE'"
SecRule REQUEST_METHOD “HTTPMETHOD" chain
SecRule REQUEST_BODY "@rx (?i:(REGEX ARRAY|WITH|FILTERED|WORDS))



## arman cheats

### filebeat

sudo apt install gnupg -y
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
sudo apt-get install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-8.x.list
sudo apt-get update -y
sudo apt install filebeat -y
sudo nano /etc/filebeat/filebeat.yml

> elk commenten
en dit erin zette
`
    output.logstash:
        hosts: ["elk:5044"]
`

sudo filebeat modules enable apache

`
false > true zette
`

sudo nano /etc/filebeat/filebeat.yml
sudo nano /etc/filebeat/modules.d/apache.yml
sudo systemctl enable filebeat
sudo systemctl start filebeat
sudo systemctl status filebeat

### google auth

<script src="https://accounts.google.com/gsi/client" async defer></script>


<div id="g_id_onload"
data-client_id="546079847280-boiq4h19f5jt62hdqfegar0l7ln109v5.apps.googleusercontent.com"data-callback="handleCredentialResponse">
</div>

<div class="g_id_signin" data-type="standard"></div>
