docker build -f "Dockerfile.prod" --tag evilhero/autonsi_esd_fe .
docker push evilhero/autonsi_esd_fe
docker image prune -f