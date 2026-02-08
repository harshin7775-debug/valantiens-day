$images = @(
    @{ Url = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80"; Out = "assets\love1.png" }, # Smile
    @{ Url = "https://images.unsplash.com/photo-1524638431109-93d95c968f03?auto=format&fit=crop&w=400&q=80"; Out = "assets\love2.png" }, # Laughing
    @{ Url = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"; Out = "assets\love3.png" }  # Portrait
)

foreach ($img in $images) {
    Write-Host "Downloading $($img.Out)..."
    try {
        Invoke-WebRequest -Uri $img.Url -OutFile $img.Out -UseBasicParsing
    }
    catch {
        Write-Error "Failed to download $($img.Out): $_"
    }
}
