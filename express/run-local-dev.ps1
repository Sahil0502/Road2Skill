# PowerShell script to run local development with MongoDB without authentication

Write-Host "Starting MongoDB without authentication for local development..." -ForegroundColor Green

# Stop MongoDB service
Write-Host "Stopping MongoDB service..." -ForegroundColor Yellow
Stop-Service -Name "MongoDB" -Force -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 2

# Start MongoDB without authentication
Write-Host "Starting MongoDB without authentication..." -ForegroundColor Yellow
$mongoPath = "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"  # Adjust path if needed
Start-Process -FilePath $mongoPath -ArgumentList "--dbpath", "C:\data\db", "--noauth", "--port", "27017" -WindowStyle Minimized

# Wait for MongoDB to start
Write-Host "Waiting for MongoDB to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Set environment variables for local development
$env:MONGODB_URI = "mongodb://localhost:27017/roadmapapp"
$env:NODE_ENV = "development"
$env:SKIP_SEEDING = "false"

Write-Host "Starting the application..." -ForegroundColor Green
node src/index.mjs
