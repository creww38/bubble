@echo off
title BUBBLE - Dev Server
start "Backend" cmd /k "cd backend ^&^& npm run start:dev"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "cd frontend ^&^& npm run dev"
echo Servers started! Frontend: http://localhost:3000 Backend: http://localhost:3001
pause
