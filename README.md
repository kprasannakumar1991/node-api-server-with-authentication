## to enable mongo to store data (one time step)
mkdir -p data/db
sudo chown -R $USER data/db

## to start mongodb server (data directory is inside the source directory itself)
mongod --dbpath=data/db


## to start the node server
node run dev

## passport
using JwtStrategy and LocalStrategy
