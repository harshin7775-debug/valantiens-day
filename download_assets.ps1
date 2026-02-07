$images = @(
    @{ Url = "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=400&q=80"; Out = "assets\moment1.png" },
    @{ Url = "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80"; Out = "assets\moment2.png" },
    @{ Url = "https://images.unsplash.com/photo-1621252179027-94459d27d3ee?auto=format&fit=crop&w=400&q=80"; Out = "assets\moment3.png" },
    @{ Url = "https://images.unsplash.com/photo-1490750967868-58cb75063ed4?auto=format&fit=crop&w=400&q=80"; Out = "assets\moment4.png" },
    @{ Url = "https://images.unsplash.com/photo-1519681393798-3828fb009c68?auto=format&fit=crop&w=400&q=80"; Out = "assets\moment5.png" },
    @{ Url = "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=400&q=80"; Out = "assets\moment6.png" }
)

foreach ($img in $images) {
    Write-Host "Downloading $($img.Out)..."
    try {
        Invoke-WebRequest -Uri $img.Url -OutFile $img.Out -UseBasicParsing
    } catch {
        Write-Error "Failed to download $($img.Out): $_"
    }
}
