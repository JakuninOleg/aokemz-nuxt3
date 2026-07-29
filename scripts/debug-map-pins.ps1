Add-Type -AssemblyName System.Drawing

$mapPath = 'C:\Users\olegk\code\aokemz-nuxt3\public\media\map-eurasia-supply.png'
$outPath = 'C:\Users\olegk\code\aokemz-nuxt3\public\media\map-debug-pins.png'

$pins = @(
  @{ name='Kovdor'; x=26.5; y=16.6 },
  @{ name='Apatit'; x=28.5; y=16.5 },
  @{ name='Stoylensky'; x=31.1; y=42.4 },
  @{ name='Mikhailovsky'; x=29.6; y=40.8 },
  @{ name='SibAntracit'; x=59.7; y=37.4 },
  @{ name='Kuzbass'; x=61.3; y=36.0 },
  @{ name='SDS'; x=62.5; y=37.8 },
  @{ name='KZ'; x=53.2; y=44.8 },
  @{ name='UZ'; x=50.8; y=58.3 },
  @{ name='India'; x=55.8; y=78.4 }
)

$bmp = [System.Drawing.Bitmap]::FromFile($mapPath)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = 'AntiAlias'
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(230, 47, 120, 205))
$pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White, 2)
$font = New-Object System.Drawing.Font ('Arial', 9)
$textBrush = [System.Drawing.Brushes]::DarkRed

foreach ($p in $pins) {
  $px = [int]($p.x / 100 * $bmp.Width)
  $py = [int]($p.y / 100 * $bmp.Height)
  $g.FillEllipse($brush, ($px - 7), ($py - 7), 14, 14)
  $g.DrawEllipse($pen, ($px - 7), ($py - 7), 14, 14)
  $g.DrawString($p.name, $font, $textBrush, ($px + 10), ($py - 8))
}

$g.Dispose()
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "Saved $outPath"
