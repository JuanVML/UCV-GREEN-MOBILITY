$path = 'c:\Users\Juanv\Desktop\UCV-GREEN-MOBILITY\package-lock.json'
$s = Get-Content -Path $path -Raw
$pattern = '(?ms)^<<<<<<< HEAD\r?\n(.*?)\r?\n=======\r?\n(.*?)\r?\n^>>>>>>>.*?$'
$s2 = [regex]::Replace($s, $pattern, '$1')
Set-Content -Path $path -Value $s2
Write-Output "DONE"