@echo off
echo Starting DermaSense AI Development Server...
echo Please wait a moment while the server starts up.
echo.

:: Open the browser automatically
start http://localhost:5173

:: Start the Vite server
npm run dev

pause
