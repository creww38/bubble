@echo off
title BUBBLE - Setup
cd backend
call npm install
call npx prisma generate
cd ../frontend
call npm install
cd ..
echo Setup complete!

