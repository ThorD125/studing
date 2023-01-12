# Web security

#### AFTER CHANGES RESTART APACHE

## Server setup (Apache)

> sudo apt install apache2

ports can be adjusted in /var/apache/ports.conf and also adjust it for the enabled site

## Logging

### status

- journalctl -xe
- systemctl status apache2

### log files

- /var/log/apache2/error.log
- /var/log/apache2/access.log

## activate sites

create a new conf, adjust and use command `a2ensite`

to disable again use `a2dissite`

## security headers

> `a2enmod headers`  
> Set ` Header set X-XSS-Protection "1; mode=block" ` in the virtual host

## block directory listing

> In the virtual host file: add the `Options -Indexes` parameter in the location directive of the correct folder.

## Https

> mkdir /etc/ssl/localcerts

> `openssl req -new -x509 -days 365 -nodes -out 
/etc/ssl/localcerts/[YOUR_NAME_FOR_KEY].pem -keyout 
/etc/ssl/localcerts/[YOUR_NAME_FOR_KEY].key`

> chmod 700

> a2enmod

> copy default-ssl.conf and modify 

> a2ensite

## security

- remove apache version
  > ServerSignature Off in Apache2.conf

## ansible

### ansible template:

``` yml
---
- name: Write a message using Ansible
  hosts: labsansible.websecurity
  tasks:
  - name: Print message
    debug:
     msg: Hello World
```

`ansible-playbook file.yml -u [username] -K`

## Authentication

### basic
man page: \
man 1 htpasswd 

Create a .htpasswd file with htpasswd(1): \
htpasswd -c /etc/apache2/.htpasswd user 

For other users, leave out the -c: \
htpasswd /etc/apache2/.htpasswd other_user 

Output is the username with hashed passwords: \
cat /etc/apache2/.htpasswd 

Add the following block in your Virtual host file and fill in a folder location instead of basicsecure:
```
<Location /basicsecure/>
   AuthType Basic
   Authname "Restricted content"
   AuthUserFile /etc/apache2/.htpasswd
   Require valid-user
 </Location>
```

### digest

> a2enmod auth_digest 

> a2enmod authn_file 

> LoadModule auth_digest_module modules/mod_auth_digest.so 

>LoadModule authn_file_module modules/mod_authn_file.so

Set location in virtualhost:
```
AuthType Digest
AuthName "Protected Space"
AuthDigestDomain /private/ /and/another http://still.one.more/
AuthUserFile /path/to/file/htpasswd
Require valid-user
```

### oAuth
Load the Google Platform Library
You must include the Google Platform Library on your
web pages that integrate Google Sign-In:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

Specify the client ID you created for your app in the Google
Developers Console with the google-signin-client_id meta element:
```html
<div id="g_id_onload"
data-client_id="CLIENTID.apps.googleusercontent.com"
data-callback="handleCredentialResponse">
</div>
```
To create a Google Sign-In button that uses the default settings, add a
div element with the class g-signin2 to your sign-in page:
```html
<div class="g_id_signin" data-type="standard"></div>
```

example of how to use user info after login:
```js
function decodeJwt(token) {
let base64Url = token.split('.')[1]
let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
return JSON.parse(jsonPayload)
}
window.handleCredentialResponse = (response) => {
const responsePayload = decodeJwt(response.credential);
console.log("ID: " + responsePayload.sub);
console.log('Full Name: ' + responsePayload.name);
console.log('Given Name: ' + responsePayload.given_name);
console.log('Family Name: ' + responsePayload.family_name);
console.log("Image URL: " + responsePayload.picture);
console.log("Email: " + responsePayload.email);
```

### oAuth in Apache

virtual host file conf:

```
LoadModule auth_openidc_module modules/mod_auth_openidc.so
OIDCProviderMetadataURL <issuer>/.well-known/openid-configuration
OIDCClientID <client_id>
OIDCClientSecret <client_secret>
# OIDCRedirectURI is a vanity URL that must point to a path protected by this module but must NOT point to any content
OIDCRedirectURI https://<hostname>/secure/redirect_uri
OIDCCryptoPassphrase <password>
<Location /secure>
   AuthType openid-connect
   Require valid-user
</Location>
```

## WAF

### Modsecurity

`sudo apt install libapache2-mod-security2 `

The default configuration file is /etc/modsecurity/modsecurity.conf-
recommended.    

Copy and rename the file to modsecurity.conf. Edit the configuration
and change SecRuleEngine DetectionOnly to On.

### Limit requests

```
<directory />
<LimitExcept GET POST HEAD>
deny from all
</LimitExcept>
</directory>
```

## Server setup (NGINX)

install using:
`apt-get install nginx`

check service:
`systemctl status nginx`

managing nginx service:

```
ngnix -s stop 
ngnix -s quit 
ngnix -s start 
ngnix -s reload 
 
OR use systemctrl 
 
sudo systemctl stop nginx 
sudo systemctl start nginx 
sudo systemctl restart nginx 
sudo systemctl reload nginx 
``` 

### Creating a site
server blocks are stored in `/var/www/html`

add another environment by creating a new folder to add another serverblock

in order for Nginx to serve the content needs a new config

create a new conf in `/etc/nginx/sites-available/new_site` 

in the config add the following:

```
server { 
        listen 80; 
        listen [::]:80; 
 
        root /var/www/your_domain/html; 
        index index.html index.htm index.nginx-debian.html; 
 
        server_name your_domain www.your_domain; 
 
        location / { 
                try_files $uri $uri/ =404; 
        } 
} 
```
if you want multiple locations on a adress
```
server { 
    location / { 
        root /data/www; 
    } 
 
    location /images/ { 
        root /data; 
    } 
} 
```

### enable a site

create a symbolic link:

`
sudo ln -s /etc/nginx/sites-available/your_site /etc/nginx/sites-enabled/ 
`

### commands and files

test config:

```
sudo nginx -t 
```

content folder:

```
/var/www/html 
```

server config:

```
/etc/ngnix/ 
```

per site server block (won't be used unless linked in /sites-enabled):

```
/etc/ngnix/sites-available/ 
```

enabled per site server block:

```
/etc/ngnix/sites-enabled 
```

Potentially repeatable configuration segments are good candidates for refactoring into 
snippets:

```
/etc/ngnix/snippets   
```

server logs:

```
/var/log/nginx/access.log  
```

error logs:

```
/var/log/nginx/error.log 
```

### load balancing

```
http { 
  upstream myproject { 
    server 127.0.0.1:8000 weight=3; 
    server 127.0.0.1:8001; 
    server 127.0.0.1:8002; 
    server 127.0.0.1:8003; 
  } 
 
  server { 
    listen 80; 
    server_name www.domain.com; 
    location / { 
      proxy_pass http://myproject; 
    } 
  } 
}
```

### proxy server
define a new server block:

```
server { 
    listen 8080; 
    root /data/up1; 
 
    location / { 
    } 
} 
```

update original server block with understanding directive:

```
   location / { 
        proxy_pass http://localhost:8080; 
    } 
```

### HTTPS

in server block add the following and set it correctly:

```
server { 
    listen              443 ssl; 
    server_name         www.example.com; 
    ssl_certificate     www.example.com.crt; 
    ssl_certificate_key www.example.com.key; 
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2; 
    ssl_ciphers         HIGH:!aNULL:!MD5; 
    ... 
} 
```

Nginx cant directly access the certificates, so a snippet must be made:

```
ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt; 
ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key; 
```

in the sites-enabled conf change the directive ssl certificate:

```
include snippets/self-signed.conf; 
```