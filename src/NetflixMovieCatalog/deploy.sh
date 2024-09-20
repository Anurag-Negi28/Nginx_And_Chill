#!/bin/bash

# TODO your deploy script implementation...

# Change to the app directory
if [ ! -d "~/app" ]; then
  mkdir -p ~/app
else
  echo "Directory ~/app already exists."
fi

cd ~/app || exit

# Pull the latest changes from the repo (optional, depends on your workflow)
# git pull origin main

# Create a Python virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi

# Activate the virtual environment
source myenv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run migrations if any (for example, if you're using Flask-Migrate)
# flask db upgrade

# Restart the Flask app service using systemd
sudo systemctl daemon-reload  # Reload systemd to detect changes in the service file (if any)
sudo systemctl start uwsgi-flask.service  # Replace 'my_app.service' with your actual service name

# Optionally, check the status of the service to ensure it's running
sudo systemctl status uwsgi-flask.service

echo "Deployment completed, and the service has been restarted!"