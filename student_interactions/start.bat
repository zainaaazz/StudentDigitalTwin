@echo off
echo Starting SDT Interaction Simulator...
echo.

echo Step 1: Building and starting services...
docker-compose up --build -d

echo.
echo Step 2: Waiting for services to be ready...
timeout /t 10 /nobreak > nul

echo.
echo Step 3: Seeding database...
docker-compose exec backend npm run db:seed

echo.
echo ================================
echo 🎉 Setup Complete!
echo ================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:3001/api
echo Health Check: http://localhost:3001/health
echo.
echo Press any key to view logs...
pause > nul
docker-compose logs -f