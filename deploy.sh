npm run build

rsync -avzr \
--progress \
--delete \
./build/* root@124.70.147.241:/root/www/blog
