param(
  [switch]$ElevatedService
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$ServicePython = "D:\nail-tryon-seg-venv\Scripts\python.exe"
if (-not (Test-Path -LiteralPath $ServicePython)) {
  $ServicePython = "python"
}

function Test-HttpUrl {
  param([string]$Url)
  try {
    Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 2 | Out-Null
    return $true
  } catch {
    return $false
  }
}

function Get-PhotoTryonHealth {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:8765/api/photo-tryon/health" -TimeoutSec 8
    return $response.Content | ConvertFrom-Json
  } catch {
    return $null
  }
}

function Wait-ForPhotoTryonHealth {
  param([int]$Seconds = 12)
  for ($i = 0; $i -lt $Seconds; $i++) {
    $health = Get-PhotoTryonHealth
    if ($health) {
      return $health
    }
    Start-Sleep -Seconds 1
  }
  return $null
}

function Stop-PortProcess {
  param([int]$Port)
  $listeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  foreach ($listener in $listeners) {
    try {
      Stop-Process -Id $listener.OwningProcess -Force -ErrorAction Stop
    } catch {
      Write-Warning "Unable to stop process $($listener.OwningProcess) on port ${Port}: $($_.Exception.Message)"
    }
  }
}

function Stop-ProjectAutomationBrowsers {
  $profileNeedles = @(
    (Join-Path $Root "runs\browser-profiles"),
    "chatgpt-profile"
  )
  $processes = @()
  foreach ($name in @("chrome.exe", "msedge.exe")) {
    try {
      $processes += Get-CimInstance Win32_Process -Filter "name='$name'" -ErrorAction Stop
    } catch {
      Write-Warning "Unable to inspect ${name}: $($_.Exception.Message)"
    }
  }
  $targets = $processes | Where-Object {
    $cmd = $_.CommandLine
    if (-not $cmd) { return $false }
    foreach ($needle in $profileNeedles) {
      if ($cmd -like "*$needle*") { return $true }
    }
    return $false
  } | Select-Object -ExpandProperty ProcessId -Unique
  foreach ($pidToStop in $targets) {
    try {
      Stop-Process -Id $pidToStop -Force -ErrorAction Stop
      Write-Host "Stopped project automation browser process $pidToStop"
    } catch {
      Write-Warning "Unable to stop automation browser process ${pidToStop}: $($_.Exception.Message)"
    }
  }
}

function Start-FrontendServer {
  if (-not (Test-HttpUrl "http://127.0.0.1:4173/")) {
    Start-Process `
      -FilePath "python" `
      -ArgumentList @("-m", "http.server", "4173", "--bind", "127.0.0.1") `
      -WorkingDirectory $Root `
      -WindowStyle Hidden
  }
}

function Start-PhotoTryonService {
  Start-Process `
    -FilePath $ServicePython `
    -ArgumentList @("-m", "uvicorn", "photo_tryon_service.server:app", "--host", "127.0.0.1", "--port", "8765") `
    -WorkingDirectory $Root `
    -WindowStyle Hidden
}

function Restart-PhotoTryonService {
  Stop-ProjectAutomationBrowsers
  Stop-PortProcess -Port 8765
  Start-Sleep -Milliseconds 500
  Start-PhotoTryonService
}

function Start-ElevatedPhotoTryonService {
  Write-Host "Playwright driver is not ready. Requesting administrator permission for the photo generation service..."
  Stop-ProjectAutomationBrowsers
  Stop-PortProcess -Port 8765
  $args = @(
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-File", "`"$PSCommandPath`"",
    "-ElevatedService"
  )
  Start-Process -FilePath "powershell" -ArgumentList $args -Verb RunAs -Wait
}

if ($ElevatedService) {
  Stop-ProjectAutomationBrowsers
  Stop-PortProcess -Port 8765
  Start-Sleep -Milliseconds 500
  Start-PhotoTryonService
  $health = Wait-ForPhotoTryonHealth -Seconds 15
  if ($health -and $health.playwrightDriverReady) {
    Write-Host "Elevated photo try-on service is ready."
  } elseif ($health) {
    Write-Warning "Elevated service started, but Playwright driver is still not ready: $($health.playwrightDriverError)"
  } else {
    Write-Warning "Elevated service did not become reachable on http://127.0.0.1:8765/"
  }
  exit
}

Start-FrontendServer

$health = Get-PhotoTryonHealth
if (-not $health) {
  Start-PhotoTryonService
  $health = Wait-ForPhotoTryonHealth -Seconds 12
}

if ($health -and -not $health.playwrightDriverReady) {
  Start-ElevatedPhotoTryonService
  $health = Wait-ForPhotoTryonHealth -Seconds 15
}

$webReady = Test-HttpUrl "http://127.0.0.1:4173/"
$serviceHealth = Get-PhotoTryonHealth
$serviceReady = $null -ne $serviceHealth

$webStatus = if ($webReady) { "ready" } else { "not listening" }
$serviceStatus = if ($serviceReady) { "ready" } else { "not listening" }

Write-Host "Frontend:  http://127.0.0.1:4173/  $webStatus"
Write-Host "Service:   http://127.0.0.1:8765/api/photo-tryon/health  $serviceStatus"

if ($serviceReady) {
  Write-Host ($serviceHealth | ConvertTo-Json -Depth 6 -Compress)
  if (-not $serviceHealth.playwrightDriverReady) {
    Write-Warning "Playwright driver is not ready. Recommended action: $($serviceHealth.recommendedAction). Error: $($serviceHealth.playwrightDriverError)"
  }
}
