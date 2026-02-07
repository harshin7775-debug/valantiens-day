$images = @(
    @{ Url = "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=600&q=80"; Out = "assets\moment1.png" }, # Couple/Sunset
    @{ Url = "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80"; Out = "assets\moment2.png" }, # Coffee
    @{ Url = "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80"; Out = "assets\moment3.png" }, # Love/Heart
    @{ Url = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80"; Out = "assets\moment4.png" }, # Nature/Flowers
    @{ Url = "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=600&q=80"; Out = "assets\moment5.png" }, # Sunset/Hands
    @{ Url = "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80"; Out = "assets\moment6.png" }  # Friends/Couple
)

Write-Host "Starting download of 6 unique images..."
foreach ($img in $images) {
    Write-Host "Downloading $($img.Out)..."
    try {
        Invoke-WebRequest -Uri $img.Url -OutFile $img.Out -UseBasicParsing
    }
    catch {
        Write-Error "Failed to download $($img.Out): $_"
    }
}
Write-Host "Download complete."
