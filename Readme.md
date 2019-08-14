# Logginator

This is a demo app to be used with `us-east-1` images of `nr-fluentd-template` and `nr-fluentd-template` (fluent bit coming soon).

The aim is to set up fluentd or logstash to monitor the realistic log files generated by this app.

### Standing up a prebuilt EC2 image
1. Go to EC2 on Amazon, and select AMI from the left sidebar
2. Ensure you’re in the N.Virginia region
3. Select Public Images from the dropdown
4. Search for  `nr-fluentd-template` or `nr-logstash-template` . These images will come pre-bundled with this app, and a log forwarder installed.
5. Click Launch
6. Select `t2.xlarge` 
7. Ensure Auto-Assign Public IP is Enabled
8. Set storage to 100GiB
9. Add the tags `Name`: `fluentd-box` (or Logstash, as appropriate)
10. Select or create a Security Group that allows SSH access (if you’re creating a new security group, give it a name like “ssh access”)
11. Hit Launch, and /choose existing/ or /create new/ keypair. e.g. `nr-laptop.pem`

### SSH In
1. From the EC2 overview page, grab the public IP address of your fluentd-box instance
2. `ssh -i ~/Downloads/nr-laptop.pem ubuntu@1.1.1.1`
3. You have `sudo` access

### Controlling the noisy app
* Starting 
```
cd /home/ubuntu/logginator
pm2 start ./ecosystem.config.js
```
* Stopping
```
pm2 kill
```
* Troubleshooting
```
pm2 logs
```

### Important notes
* You can run the app without pm2 via node noiseMaker.js
* The boxes do not have logrotate configured, and will run out of space very quickly
* The app tries its hardest to generate 1GB of log data per fixture log file
	* look in `./fixtures` to see sample files. *Try adding a new log file!*
	* The app outputs to `./destination`


### Details of the log manager

##### Fluentd
* Important note - the default `td-agent.conf` comes pre-configured for an account with Treasure Data. Remove that from the config file.
* Config file: `sudo vim /etc/td-agent/td-agent.conf`
* Bins: `/usr/sbin`
* Start / stop / status : `sudo systemctl start td-agent` 
* Logs: `tail -f /var/log/td-agent/*`


##### Logstash
* Sample file: `cat /etc/logstash/logstash.sample.conf`
* Config file: `sudo vim /etc/logstash/conf.d/my-awesome-conf.conf`
* Destination: `/usr/share/logstash`
* Bins: `/usr/share/logstash/bin`
* Start / stop / status : `sudo systemctl start logstash` 
* Logs: `tail -f /var/log/logstash/*`

