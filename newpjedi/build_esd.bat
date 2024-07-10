docker build -f "Dockerfile.prod" --tag evilhero/esd_fe .
docker push evilhero/esd_fe
docker image prune -f