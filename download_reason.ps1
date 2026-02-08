$img = @{ Url = "https://images.unsplash.com/photo-1516726817505-f5ed8259db18?auto=format&fit=crop&w=600&q=80"; Out = "assets\reason.png" } # Happy person/Love

Write-Host "Downloading $($img.Out)..."
try {
    Invoke-WebRequest -Uri $img.Url -OutFile $img.Out -UseBasicParsing
    Write-Host "Download complete."
}
catch {
    Write-Error "Failed to download $($img.Out): $_"
}
