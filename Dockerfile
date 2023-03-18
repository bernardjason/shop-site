FROM python:3.9

RUN apt-get update \
&& apt-get install -y 
RUN apt-get install -y apache2
RUN apt-get install -y libapache2-mod-wsgi-py3
RUN apt-get install -y vim
RUN mkdir -p /shop
WORKDIR /shop
ADD backend/requirements.txt .
RUN pip3 install -r requirements.txt
ADD backend/shopapp backend/
RUN sed -i "s/SECRET_KEY =.*/SECRET_KEY =  '$(cat /dev/urandom | tr -dc '[:alpha:]' | fold -w ${1:-50} | head -1)'/" backend/shopapp/settings.py
ADD build build/
#  make sure we have latest template from react for Django to render
RUN cp build/index.html backend/shop/templates/index.html
ADD 000-default.conf .
ADD ports.conf .
RUN cp 000-default.conf /etc/apache2/sites-available
RUN cp ports.conf /etc/apache2
RUN a2enmod rewrite
RUN chown www-data ./backend/db
RUN chgrp www-data ./backend/db
RUN chown www-data ./backend/db/db.sqlite3
EXPOSE 8080
CMD ["apachectl", "-D", "FOREGROUND"]
