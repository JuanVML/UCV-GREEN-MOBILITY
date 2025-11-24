$path = 'c:\Users\Juanv\Desktop\UCV-GREEN-MOBILITY\package-lock.json'
(Get-Content -Path $path) | Where-Object { -not ($_ -match '^\s*(<{7}|={7}|>{7})') } | Set-Content -Path $path
Write-Output "REMOVED_MARKERS"