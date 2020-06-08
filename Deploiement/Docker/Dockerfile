FROM nginx:alpine

COPY target/dist/users-management /usr/share/nginx/html
COPY target/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
