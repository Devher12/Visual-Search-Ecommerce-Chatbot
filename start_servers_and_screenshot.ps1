# PowerShell script to start servers and take screenshots
# This script starts both backend and frontend, then provides instructions for screenshots

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Application Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Change to project root
$projectRoot = "C:\Users\Administrator\OneDrive\Desktop\work\ai (python)\Final_Project"
Set-Location $projectRoot

# Check if screenshots directory exists
$screenshotsDir = Join-Path $projectRoot "screenshots"
if (-not (Test-Path $screenshotsDir)) {
    New-Item -ItemType Directory -Path $screenshotsDir | Out-Null
    Write-Host "Created screenshots directory" -ForegroundColor Green
}

# Start Backend Server
Write-Host "`n[1/2] Starting Flask backend server..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:projectRoot
    Set-Location backend
    python app.py
}

# Wait a bit for backend to start
Start-Sleep -Seconds 8

# Check if backend is running
$backendRunning = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($backendRunning) {
    Write-Host "✓ Backend server is running on http://localhost:5000" -ForegroundColor Green
} else {
    Write-Host "✗ Backend server may not be running. Check for errors." -ForegroundColor Red
}

# Start Frontend Server
Write-Host "`n[2/2] Starting React frontend server..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:projectRoot
    Set-Location frontend
    npm start
}

# Wait for frontend to start (it takes longer)
Write-Host "Waiting for frontend to compile and start (this may take 30-60 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Check if frontend is running
$frontendRunning = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($frontendRunning) {
    Write-Host "✓ Frontend server is running on http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "⚠ Frontend may still be compiling. Check http://localhost:3000 in browser." -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Servers Started" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "`nTo take screenshots:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "2. Navigate through the application" -ForegroundColor White
Write-Host "3. Take screenshots and save them to: $screenshotsDir" -ForegroundColor White
Write-Host "`nPress Ctrl+C to stop the servers when done." -ForegroundColor Yellow

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 5
    }
} finally {
    Write-Host "`nStopping servers..." -ForegroundColor Yellow
    Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Write-Host "Servers stopped." -ForegroundColor Green
}

