npm run build

rsync -av --progress \
./build/* \
root@124.70.147.241:/root/www/blog
