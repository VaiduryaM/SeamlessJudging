echo "changing directory to frontend"
cd frontend

echo "Running npm run build and copying files"
npm run build && cp -rf build/* ../../

echo "changing directory to backend"
cd ../backend

echo "stopping server"
pm2 stop  server.js

echo "starting server"
pm2 start server.js
