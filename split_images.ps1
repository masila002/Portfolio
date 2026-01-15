
Add-Type -AssemblyName System.Drawing

function Split-Image {
    param (
        [string]$imagePath,
        [string]$prefix,
        [string]$outputDir
    )

    try {
        $img = [System.Drawing.Image]::FromFile($imagePath)
        $width = $img.Width
        $height = $img.Height
        $midX = [int]($width / 2)
        $midY = [int]($height / 2)

        # Define areas: x, y, width, height
        $areas = @(
            @{x=0; y=0; w=$midX; h=$midY},       # Top-Left
            @{x=$midX; y=0; w=$midX; h=$midY},   # Top-Right
            @{x=0; y=$midY; w=$midX; h=$midY},   # Bottom-Left
            @{x=$midX; y=$midY; w=$midX; h=$midY} # Bottom-Right
        )
        
        $indices = 1..4

        for ($i = 0; $i -lt 4; $i++) {
            $area = $areas[$i]
            $rect = New-Object System.Drawing.Rectangle $area.x, $area.y, $area.w, $area.h
            $crop = New-Object System.Drawing.Bitmap $area.w, $area.h
            $graphics = [System.Drawing.Graphics]::FromImage($crop)
            $graphics.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $area.w, $area.h), $rect, [System.Drawing.GraphicsUnit]::Pixel)
            $graphics.Dispose()
            
            $savePath = Join-Path $outputDir "$($prefix)_$($indices[$i]).png"
            $crop.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)
            $crop.Dispose()
            Write-Host "Saved $savePath"
        }
        $img.Dispose()
    }
    catch {
        Write-Error "Error processing $imagePath : $_"
    }
}

$baseDir = "c:\Users\Francis\Desktop\Projects\My Portfolio\images"
Split-Image -imagePath (Join-Path $baseDir "collage_tech.png") -prefix "tech" -outputDir $baseDir
Split-Image -imagePath (Join-Path $baseDir "collage_web.png") -prefix "web" -outputDir $baseDir
