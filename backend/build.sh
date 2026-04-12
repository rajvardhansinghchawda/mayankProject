#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Collecting static files for production..."
python manage.py collectstatic --no-input

echo "Running database migrations..."
python manage.py migrate
