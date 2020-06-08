#!/bin/bash

echo "Arret des containers"
# Liste des containers en cours
LISTIDS=$(docker ps -aqf "name=users_mgmt")
# Si la liste n'est pas vide ...
if [ ! -z $LISTIDS ] 
then
	# ... on arrete les containers
	docker container stop $(docker ps -aqf "name=users_mgmt")
fi

echo "Suppression des containers"
# Suppression du container si il existe
LISTIDS=$(docker ps -aqf "name=users_mgmt")
if [ ! -z $LISTIDS ] 
then
	docker container rm $(docker ps -aqf "name=users_mgmt")
fi

echo "Suppression de l'image"
# Suppression de l'image
LISTIDS=$(docker images -q epsi/users_mgmt)
if [ ! -z $LISTIDS ] 
then
	docker rmi $(docker images -q epsi/users_mgmt)
fi


echo "Création de l'image"
# Créer l'image Docker
docker build -t epsi/users_mgmt .


echo "Démarrage du container"
docker run -p 4201:80 --detach --restart always --name users_mgmt epsi/users_mgmt
